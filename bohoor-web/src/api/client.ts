const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3333';

async function request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
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
};
