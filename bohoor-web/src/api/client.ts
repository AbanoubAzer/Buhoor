const FALLBACK_URL = 'https://buhoor.vercel.app';
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || FALLBACK_URL;

async function fetchWithRetry(url: string, init: RequestInit, retries = 1): Promise<Response> {
  try {
    return await fetch(url, init);
  } catch (err: any) {
    // If local dev server (e.g. localhost:3333) is unreachable, seamlessly fallback to production API
    if (url.includes('localhost') || url.includes('127.0.0.1')) {
      const fallbackUrl = url.replace(/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?/, FALLBACK_URL);
      try {
        return await fetch(fallbackUrl, init);
      } catch {
        // Continue to retry original or throw
      }
    }
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return fetchWithRetry(url, init, retries - 1);
    }
    throw err;
  }
}

async function request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetchWithRetry(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 429) {
    throw new Error('الرجاء الانتظار قليلاً قبل المحاولة مرة أخرى');
  }

  if (!response.ok) {
    let errorMsg = 'حدث خطأ غير متوقع';
    try {
      const errData = await response.json();
      if (Array.isArray(errData.message)) {
        errorMsg = errData.message.join('، ');
      } else if (errData.message) {
        errorMsg = errData.message;
      }
    } catch {
      // Fallback
    }
    throw new Error(errorMsg);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return response.text() as any;
}

export const api = {
  projects: {
    getAll: async (developerId?: string) => {
      const url = developerId ? `/projects?developerId=${developerId}` : '/projects';
      return request(url, { next: { revalidate: 60 } }); // Cache for 60s
    },
    getOne: async (id: string) => {
      return request(`/projects/${id}`, { next: { revalidate: 60 } });
    },
  },
  developers: {
    getAll: async () => {
      return request('/developers', { next: { revalidate: 60 } });
    },
    getOne: async (id: string) => {
      return request(`/developers/${id}`, { next: { revalidate: 60 } });
    },
  },
  units: {
    getAll: async (params?: Record<string, any>) => {
      let path = '/units';
      if (params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, val]) => {
          if (val !== undefined && val !== null && val !== '') {
            searchParams.append(key, String(val));
          }
        });
        const qs = searchParams.toString();
        if (qs) path += `?${qs}`;
      }
      // Units might change more frequently, let's revalidate every 15s or dynamic
      return request(path, { cache: 'no-store' });
    },
    getOne: async (id: string) => {
      return request(`/units/${id}`, { cache: 'no-store' });
    },
  },
  locations: {
    getAll: async () => {
      return request('/locations', { next: { revalidate: 3600 } });
    },
  },
  unitTypes: {
    getAll: async () => {
      return request('/unit-types', { next: { revalidate: 3600 } });
    },
  },
  heroSlides: {
    getAll: async () => {
      return request('/hero-slides', { next: { revalidate: 60 } });
    },
  },
  aiSearch: {
    match: async (data: { query: string; customerName?: string; customerPhone?: string; userId?: string }) => {
      return request('/ai-search', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    getAllSearches: async () => {
      return request('/ai-search/admin/searches', { cache: 'no-store' });
    },
    getExportUrl: () => {
      return `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3333'}/ai-search/admin/export-excel`;
    },
  },
  leads: {
    create: async (data: {
      name: string;
      phone: string;
      questions?: string;
      readiness?: string;
      sellerType?: string;
      commission?: string;
      language?: string;
      unitId?: string;
      source?: string;
    }) => {
      return request('/leads', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    getAll: async () => {
      return request('/leads', { cache: 'no-store' });
    },
    getExportUrl: () => {
      return `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3333'}/leads/export-excel`;
    },
  },
};

