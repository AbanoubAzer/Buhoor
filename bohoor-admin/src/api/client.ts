const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333'; // منفذ NestJS الافتراضي

async function request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle unauthorized or expired session
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login?expired=1';
    }
    throw new Error('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى');
  }

  // Handle Rate Limiting (429)
  if (response.status === 429) {
    throw new Error('تم تجاوز الحد المسموح من الطلبات، يرجى الانتظار دقيقة قبل المحاولة');
  }

  // Handle general errors and parse generic JSON DTO messages
  if (!response.ok) {
    let errorMsg = 'حدث خطأ غير متوقع في الخادم';
    try {
      const errData = await response.json();
      if (Array.isArray(errData.message)) {
        errorMsg = errData.message.join('، ');
      } else if (errData.message) {
        errorMsg = errData.message;
      } else if (errData.error) {
        errorMsg = errData.error;
      }
    } catch {
      // Fallback to text if not JSON
    }
    throw new Error(errorMsg);
  }

  // Check content-type to parse JSON vs Text
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
      return request(url);
    },
    getOne: async (id: string) => {
      return request(`/projects/${id}`);
    },
    create: async (data: any) => {
      return request('/projects', { method: 'POST', body: JSON.stringify(data) });
    },
    update: async (id: string, data: any) => {
      return request(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
    },
    remove: async (id: string) => {
      return request(`/projects/${id}`, { method: 'DELETE' });
    },
  },
  developers: {
    create: async (data: any) => {
      return request('/developers', { method: 'POST', body: JSON.stringify(data) });
    },
    update: async (id: string, data: any) => {
      return request(`/developers/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
    },
    getAll: async () => {
      return request('/developers');
    },
    getOne: async (id: string) => {
      return request(`/developers/${id}`);
    },
  },
  stats: {
    getSummary: async () => {
      return request('/stats');
    },
  },
  units: {
    create: async (data: any) => {
      // Data Processing
      if (typeof data.images === 'string' && data.images.trim()) {
        data.images = data.images.split(',').map((img: string) => img.trim());
      } else if (!Array.isArray(data.images)) {
        data.images = [];
      }
      
      if (typeof data.videos === 'string' && data.videos.trim()) {
        data.videos = data.videos.split(',').map((vid: string) => vid.trim());
      } else if (!Array.isArray(data.videos)) {
        data.videos = [];
      }

      const sanitizeNumericValues = (target: Record<string, any>) => {
        const numericKeys = [
          'area', 'bedrooms', 'bathrooms', 'originalContractPrice', 'cashPaidToSeller',
          'remainingInstallments', 'monthlyEquivalentInstallment', 'contractYear', 'deliveryYear',
          'cashDiscountPercentage', 'totalPrice', 'installmentsCount', 'expectedRentalRoi', 'floor', 'displayOrder'
        ];
        numericKeys.forEach(k => {
          if (target[k] !== undefined && target[k] !== null && target[k] !== '') {
            const parsed = Number(target[k]);
            if (!isNaN(parsed)) {
              target[k] = Math.max(0, parsed);
            }
          }
        });
      };

      if (data.isCashOnly) {
        data.remainingInstallments = 0;
        data.monthlyEquivalentInstallment = 0;
      }

      if (!data.projectId) delete data.projectId;
      if (!data.developerId || data.sellerType === 'INDIVIDUAL') {
        delete data.developerId;
        delete data.projectId;
      }

      sanitizeNumericValues(data);
      return request('/units', { method: 'POST', body: JSON.stringify(data) });
    },
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
      return request(path);
    },
    update: async (id: string, data: any) => {
      const payload = { ...data };
      delete payload.id;
      delete payload.createdAt;
      delete payload.deletedAt;
      delete payload.location;
      delete payload.unitType;
      delete payload.developer;
      delete payload.project;

      if (payload.isCashOnly) {
        payload.remainingInstallments = 0;
        payload.monthlyEquivalentInstallment = 0;
      }
      if (!payload.projectId) payload.projectId = null;
      if (!payload.developerId || payload.sellerType === 'INDIVIDUAL') {
        payload.developerId = null;
        payload.projectId = null;
      }

      const sanitizeNumericValues = (target: Record<string, any>) => {
        const numericKeys = [
          'area', 'bedrooms', 'bathrooms', 'originalContractPrice', 'cashPaidToSeller',
          'remainingInstallments', 'monthlyEquivalentInstallment', 'contractYear', 'deliveryYear',
          'cashDiscountPercentage', 'totalPrice', 'installmentsCount', 'expectedRentalRoi', 'floor', 'displayOrder'
        ];
        numericKeys.forEach(k => {
          if (target[k] !== undefined && target[k] !== null && target[k] !== '') {
            const parsed = Number(target[k]);
            if (!isNaN(parsed)) {
              target[k] = Math.max(0, parsed);
            }
          }
        });
      };

      sanitizeNumericValues(payload);
      return request(`/units/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
    },
    approve: async (id: string) => {
      return request(`/units/${id}/approve`, { method: 'PATCH' });
    },
    reject: async (id: string) => {
      return request(`/units/${id}/reject`, { method: 'PATCH' });
    },
    updateStatus: async (id: string, status: string) => {
      return request(`/units/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
    },
    updateOrder: async (id: string, displayOrder: number | null) => {
      return request(`/units/${id}`, { method: 'PATCH', body: JSON.stringify({ displayOrder }) });
    },
    remove: async (id: string) => {
      return request(`/units/${id}`, { method: 'DELETE' });
    },
  },
  locations: {
    create: async (data: any) => {
      return request('/locations', { method: 'POST', body: JSON.stringify(data) });
    },
    getAll: async () => {
      return request('/locations');
    },
    update: async (id: string, data: any) => {
      return request(`/locations/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
    },
    remove: async (id: string) => {
      return request(`/locations/${id}`, { method: 'DELETE' });
    },
  },
  unitTypes: {
    create: async (data: any) => {
      return request('/unit-types', { method: 'POST', body: JSON.stringify(data) });
    },
    getAll: async () => {
      return request('/unit-types');
    },
  },
  admins: {
    create: async (data: any) => {
      return request('/admins', { method: 'POST', body: JSON.stringify(data) });
    },
    getAll: async () => {
      return request('/admins');
    },
    remove: async (id: string) => {
      return request(`/admins/${id}`, { method: 'DELETE' });
    },
  },
  auth: {
    changePassword: async (data: any) => {
      return request('/auth/change-password', { method: 'POST', body: JSON.stringify(data) });
    },
  },
  individuals: {
    getAll: async () => {
      return request('/individuals');
    },
    create: async (data: any) => {
      return request('/individuals', { method: 'POST', body: JSON.stringify(data) });
    },
    remove: async (id: string) => {
      return request(`/individuals/${id}`, { method: 'DELETE' });
    }
  },
  heroSlides: {
    getAll: async () => {
      return request('/hero-slides');
    },
    getOne: async (id: string) => {
      return request(`/hero-slides/${id}`);
    },
    create: async (data: any) => {
      return request('/hero-slides', { method: 'POST', body: JSON.stringify(data) });
    },
    update: async (id: string, data: any) => {
      return request(`/hero-slides/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
    },
    remove: async (id: string) => {
      return request(`/hero-slides/${id}`, { method: 'DELETE' });
    },
  },
  settings: {
    getDefaultSort: async (): Promise<{ defaultSort: string }> => {
      return request('/settings/default-sort');
    },
    updateDefaultSort: async (defaultSort: string): Promise<{ defaultSort: string }> => {
      return request('/settings/default-sort', { method: 'PATCH', body: JSON.stringify({ defaultSort }) });
    },
  },
};
