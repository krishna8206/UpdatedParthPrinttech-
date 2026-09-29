export const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE?.replace(/\/api\/?$/, '') || 'https://updatedparthprinttech.onrender.com').replace(/\/$/, '');
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || `${BACKEND_URL}/api`;
export const FRONTEND_URL = (process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');

export function getAuthToken() {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('parth_admin_token');
    if (token) return token;
    // Set default session token if empty
    const defaultToken = 'admin_session_token_default';
    localStorage.setItem('parth_admin_token', defaultToken);
    return defaultToken;
  }
  return 'admin_session_token_default';
}

export function setAuthToken(token) {
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('parth_admin_token', token);
    } else {
      localStorage.removeItem('parth_admin_token');
    }
  }
}

export async function fetchApi(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    return data;
  } catch (err) {
    if (err.message && err.message.includes('fetch')) {
      throw new Error(`Unable to connect to Backend on ${API_BASE}. Please ensure the backend server is running.`);
    }
    throw err;
  }
}

export async function uploadFile(file, onProgress) {
  const token = getAuthToken();
  const formData = new FormData();
  formData.append('file', file);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE}/upload`);

    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    if (xhr.upload && typeof onProgress === 'function') {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent, event.loaded, event.total);
        }
      };
    }

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && data.success) {
          resolve(data);
        } else {
          reject(new Error(data.message || 'File upload failed'));
        }
      } catch (err) {
        reject(new Error('Invalid server response during upload'));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error during file upload. Please ensure the backend is running.'));
    };

    // No timeout for uploading large videos
    xhr.timeout = 0;

    xhr.send(formData);
  });
}

export const api = {
  // Auth
  login: (credentials) => fetchApi('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  getMe: () => fetchApi('/auth/me'),
  updatePassword: (passwords) => fetchApi('/auth/update-password', { method: 'POST', body: JSON.stringify(passwords) }),

  // Home Page
  getHomeData: () => fetchApi('/home'),
  updateHeroSlides: (slides) => fetchApi('/home/hero-slides', { method: 'PUT', body: JSON.stringify(slides) }),
  updateHeroVideo: (heroVideo) => fetchApi('/home/hero-video', { method: 'PUT', body: JSON.stringify({ heroVideo }) }),
  updateWhoWeAre: (data) => fetchApi('/home/who-we-are', { method: 'PUT', body: JSON.stringify(data) }),
  updateMarkets: (data) => fetchApi('/home/markets', { method: 'PUT', body: JSON.stringify(data) }),
  updateFeaturedProducts: (data) => fetchApi('/home/featured-products', { method: 'PUT', body: JSON.stringify(data) }),
  updateClients: (data) => fetchApi('/home/clients', { method: 'PUT', body: JSON.stringify(data) }),
  updateTestimonials: (data) => fetchApi('/home/testimonials', { method: 'PUT', body: JSON.stringify(data) }),
  updateValues: (data) => fetchApi('/home/values', { method: 'PUT', body: JSON.stringify(data) }),
  
  // Settings
  getSettings: () => fetchApi('/home/settings'),
  updateSettings: (data) => fetchApi('/home/settings', { method: 'PUT', body: JSON.stringify(data) }),

  // Products Catalog (Products Page)
  getProductsHeader: () => fetchApi('/products/header'),
  updateProductsHeader: (data) => fetchApi('/products/header', { method: 'PUT', body: JSON.stringify(data) }),
  getProducts: () => fetchApi('/products'),
  getProductById: (id) => fetchApi(`/products/${id}`),
  createProduct: (data) => fetchApi('/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id, data) => fetchApi(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id) => fetchApi(`/products/${id}`, { method: 'DELETE' }),
  reorderProducts: (products) => fetchApi('/products/reorder', { method: 'PUT', body: JSON.stringify({ products }) }),

  // About Us Page
  getAboutData: () => fetchApi('/about'),
  updateAboutData: (data) => fetchApi('/about', { method: 'PUT', body: JSON.stringify(data) }),
  updateAboutHero: (data) => fetchApi('/about/hero', { method: 'PUT', body: JSON.stringify(data) }),
  updateAboutWhoWeAre: (data) => fetchApi('/about/who-we-are', { method: 'PUT', body: JSON.stringify(data) }),
  updateAboutFounders: (data) => fetchApi('/about/founders', { method: 'PUT', body: JSON.stringify(data) }),
  updateAboutVisionMission: (data) => fetchApi('/about/vision-mission', { method: 'PUT', body: JSON.stringify(data) }),
  updateAboutHistory: (data) => fetchApi('/about/history', { method: 'PUT', body: JSON.stringify(data) }),

  // Markets We Serve (Dedicated Standalone Page)
  getMarketsPageData: () => fetchApi('/markets-page'),
  updateMarketsPageData: (data) => fetchApi('/markets-page', { method: 'PUT', body: JSON.stringify(data) }),
  updateMarketsPageHero: (data) => fetchApi('/markets-page/hero', { method: 'PUT', body: JSON.stringify(data) }),
  updateMarketsPageCategories: (data) => fetchApi('/markets-page/categories', { method: 'PUT', body: JSON.stringify(data) }),
  updateMarketsPageIndustries: (data) => fetchApi('/markets-page/industries', { method: 'PUT', body: JSON.stringify(data) }),
  updateMarketsPageProductUses: (data) => fetchApi('/markets-page/product-uses', { method: 'PUT', body: JSON.stringify(data) }),
  updateMarketsPageFeaturedSolutions: (data) => fetchApi('/markets-page/featured-solutions', { method: 'PUT', body: JSON.stringify(data) }),
  updateMarketsPageWhyChooseUs: (data) => fetchApi('/markets-page/why-choose-us', { method: 'PUT', body: JSON.stringify(data) }),
  updateMarketsPageProcessMetrics: (data) => fetchApi('/markets-page/process-metrics', { method: 'PUT', body: JSON.stringify(data) }),
  updateMarketsPageSeoCta: (data) => fetchApi('/markets-page/seo-cta', { method: 'PUT', body: JSON.stringify(data) }),

  // Career Page & ATS Manager
  getCareerData: () => fetchApi('/career'),
  getCareerAdminData: () => fetchApi('/career/admin'),
  updateCareerHero: (data) => fetchApi('/career/hero', { method: 'PUT', body: JSON.stringify(data) }),
  updateCareerCulture: (data) => fetchApi('/career/culture', { method: 'PUT', body: JSON.stringify(data) }),
  updateCareerProcess: (data) => fetchApi('/career/process', { method: 'PUT', body: JSON.stringify(data) }),
  updateCareerContact: (data) => fetchApi('/career/contact', { method: 'PUT', body: JSON.stringify(data) }),
  updateCareerRoles: (roles) => fetchApi('/career/roles', { method: 'PUT', body: JSON.stringify({ roles }) }),
  createCareerRole: (data) => fetchApi('/career/roles', { method: 'POST', body: JSON.stringify(data) }),
  updateCareerRole: (id, data) => fetchApi(`/career/roles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCareerRole: (id) => fetchApi(`/career/roles/${id}`, { method: 'DELETE' }),
  getCareerApplications: () => fetchApi('/career/applications'),
  updateCareerApplicationStatus: (id, data) => fetchApi(`/career/applications/${id}/status`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCareerApplication: (id) => fetchApi(`/career/applications/${id}`, { method: 'DELETE' }),

  // Contact Page & Inquiries Manager
  getContactData: () => fetchApi('/contact'),
  getContactAdminData: () => fetchApi('/contact/admin'),
  updateContactContent: (data) => fetchApi('/contact/content', { method: 'PUT', body: JSON.stringify(data) }),
  updateInquiryStatus: (id, data) => fetchApi(`/contact/inquiries/${id}/status`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteInquiry: (id) => fetchApi(`/contact/inquiries/${id}`, { method: 'DELETE' }),

  // Health
  checkHealth: () => fetchApi('/health'),
};

