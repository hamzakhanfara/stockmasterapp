

import { useAuth } from '@clerk/clerk-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export class ApiClient {
  constructor(token, getTokenFn) {
    this.token = token || null;
    this.getTokenFn = getTokenFn;
  }

  setToken(token) {
    this.token = token;
  }

  async ensureFreshToken() {
    if (this.getTokenFn) {
      try {
        const freshToken = await this.getTokenFn({ skipCache: true });
        if (freshToken) {
          this.token = freshToken;
        }
      } catch (err) {
        console.warn('[ApiClient] Failed to refresh token:', err);
      }
    }
  }

  async request(method, path, body, isRetry = false) {
    // Refresh token before each request to ensure it's valid
    if (!isRetry) {
      await this.ensureFreshToken();
    }

    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    // If 401 and not already retrying, refresh token and retry once
    if (response.status === 401 && !isRetry) {
      console.log('[ApiClient] 401 detected, refreshing token and retrying...');
      await this.ensureFreshToken();
      return this.request(method, path, body, true);
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  }

  async getCurrentUser() {
    return this.request('GET', '/me');
  }

  async updateUserRole(role) {
    return this.request('PUT', '/users/role', { role });
  }

  async listUsers() {
    return this.request('GET', '/users');
  }

  async createVendor(name, userId, description, extra = {}) {
    return this.request('POST', '/v1/vendors', { name, userId, description, ...extra });
  }

  async listVendors() {
    return this.request('GET', '/v1/vendors');
  }

  async getVendor(id) {
    return this.request('GET', `/v1/vendors/${id}`);
  }

  async updateVendor(id, data) {
    // data may include name, description, category, contactName, contactNumber, contactEmail
    return this.request('PUT', `/v1/vendors/${id}`, data);
  }

  async deleteVendor(id) {
    return this.request('DELETE', `/v1/vendors/${id}`);
  }

  async getVendorStats(id) {
    return this.request('GET', `/v1/vendors/${id}/stats`);
  }

  async createShelf(name, vendorId, status) {
    return this.request('POST', '/v1/shelves', { name, vendorId, status });
  }

  async listShelves() {
    return this.request('GET', '/v1/shelves');
  }

  async getShelf(id) {
    return this.request('GET', `/v1/shelves/${id}`);
  }

  async updateShelf(id, data) {
    return this.request('PUT', `/v1/shelves/${id}`, data);
  }

  async deleteShelf(id) {
    return this.request('DELETE', `/v1/shelves/${id}`);
  }

  async createProduct(data) {
    return this.request('POST', '/v1/products', data);
  }

  async listProducts(params) {
    const query = new URLSearchParams();
    if (params?.vendorId) query.append('vendorId', params.vendorId);
    if (params?.shelfId) query.append('shelfId', params.shelfId);
    if (params?.lowStockOnly) query.append('lowStockOnly', 'true');
    
    const queryStr = query.toString();
    return this.request('GET', `/v1/products${queryStr ? '?' + queryStr : ''}`);
  }

  async getProduct(id) {
    return this.request('GET', `/v1/products/${id}`);
  }

  async updateProduct(id, data) {
    console.log('[ApiClient.updateProduct] id:', id, 'data:', data);
    return this.request('PUT', `/v1/products/${id}`, data);
  }

  async deleteProduct(id) {
    return this.request('DELETE', `/v1/products/${id}`);
  }

  async updateProductStock(id, delta) {
    return this.request('PATCH', `/v1/products/${id}/stock`, { delta });
  }

  async listOrders(params) {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    const qs = query.toString();
    return this.request('GET', `/v1/orders${qs ? '?' + qs : ''}`);
  }

  async listDraftOrders() {
    return this.request('GET', '/v1/orders/draft');
  }

  async getOrder(id) {
    return this.request('GET', `/v1/orders/${id}`);
  }

  async getOrderStats() {
    return this.request('GET', '/v1/orders/stats');
  }

  async createOrder(data) {
    return this.request('POST', '/v1/orders', data);
  }

  async createOrderDraft(data) {
    return this.request('POST', '/v1/orders/draft', data);
  }

  async updateOrder(id, data) {
    return this.request('PUT', `/v1/orders/${id}`, data);
  }

  async deleteOrder(id) {
    return this.request('DELETE', `/v1/orders/${id}`);
  }

  async downloadOrderPdf(id) {
    await this.ensureFreshToken();
    
    const headers = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    const response = await fetch(`${API_BASE_URL}/v1/orders/${id}/pdf`, {
      method: 'GET',
      headers,
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'PDF download failed');
    }
    return response.blob();
  }
}

export const useApiClient = () => {
  const { getToken } = useAuth();

  return async () => {
    const token = await getToken();
    return new ApiClient(token || '', getToken);
  };
};
