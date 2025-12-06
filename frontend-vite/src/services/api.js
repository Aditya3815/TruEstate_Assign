import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Network error' };
  }
);

export const salesAPI = {
  /**
   * Get sales with filters
   */
  getSales: async (params) => {
    const queryParams = new URLSearchParams();
    
    // Add search
    if (params.search) {
      queryParams.append('search', params.search);
    }
    
    // Add filters
    if (params.customerRegion?.length) {
      params.customerRegion.forEach(region => {
        queryParams.append('customerRegion', region);
      });
    }
    
    if (params.gender?.length) {
      params.gender.forEach(g => {
        queryParams.append('gender', g);
      });
    }
    
    if (params.ageMin) queryParams.append('ageMin', params.ageMin);
    if (params.ageMax) queryParams.append('ageMax', params.ageMax);
    
    if (params.productCategory?.length) {
      params.productCategory.forEach(cat => {
        queryParams.append('productCategory', cat);
      });
    }
    
    if (params.tags?.length) {
      params.tags.forEach(tag => {
        queryParams.append('tags', tag);
      });
    }
    
    if (params.paymentMethod?.length) {
      params.paymentMethod.forEach(pm => {
        queryParams.append('paymentMethod', pm);
      });
    }
    
    if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params.dateTo) queryParams.append('dateTo', params.dateTo);
    
    // Add sorting
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    
    // Add pagination
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    return api.get(`/sales?${queryParams.toString()}`);
  },
  
  /**
   * Get filter options
   */
  getFilterOptions: async () => {
    return api.get('/sales/filters');
  }
};

export default api;