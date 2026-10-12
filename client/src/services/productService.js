import api from './api';

export const productService = {
  // Get products with query filters
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Get product by ID
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get brands
  getBrands: async (category = '') => {
    const response = await api.get('/products/meta/brands', {
      params: category ? { category } : {}
    });
    return response.data;
  },

  // Search suggestions
  getSearchSuggestions: async (query) => {
    const response = await api.get('/products/search/suggestions', {
      params: { q: query }
    });
    return response.data;
  },

  // Compare products by IDs
  compareProducts: async (ids, budget = null) => {
    const params = { ids: Array.isArray(ids) ? ids.join(',') : ids };
    if (budget) params.budget = budget;
    const response = await api.get('/compare', { params });
    return response.data;
  },

  // Smart Recommendations
  getRecommendations: async ({ category, budget, features }) => {
    const response = await api.get('/recommend', {
      params: { category, budget, features }
    });
    return response.data;
  }
};

export default productService;
