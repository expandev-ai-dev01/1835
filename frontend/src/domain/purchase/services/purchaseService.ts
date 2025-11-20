import { authenticatedClient } from '@/core/lib/api';
import type {
  Purchase,
  CreatePurchaseDto,
  UpdatePurchaseDto,
  PurchaseListResponse,
} from '../types';

/**
 * @service purchaseService
 * @summary Service for managing purchase records
 * @domain purchase
 */
export const purchaseService = {
  /**
   * @endpoint GET /api/v1/internal/purchase
   */
  async list(page = 1, pageSize = 100): Promise<PurchaseListResponse> {
    const response = await authenticatedClient.get('/purchase', { params: { page, pageSize } });
    // Assuming the backend returns { data: { data: [], total: 0, ... } } or similar structure
    // Adjusting based on common patterns, if result is directly the array or object
    return response.data.data;
  },

  /**
   * @endpoint GET /api/v1/internal/purchase/:id
   */
  async getById(id: string): Promise<Purchase> {
    const response = await authenticatedClient.get(`/purchase/${id}`);
    return response.data.data;
  },

  /**
   * @endpoint POST /api/v1/internal/purchase
   */
  async create(data: CreatePurchaseDto): Promise<Purchase> {
    const response = await authenticatedClient.post('/purchase', data);
    return response.data.data;
  },

  /**
   * @endpoint PUT /api/v1/internal/purchase/:id
   */
  async update(id: string, data: UpdatePurchaseDto): Promise<Purchase> {
    const response = await authenticatedClient.put(`/purchase/${id}`, data);
    return response.data.data;
  },

  /**
   * @endpoint DELETE /api/v1/internal/purchase/:id
   */
  async delete(id: string): Promise<void> {
    await authenticatedClient.delete(`/purchase/${id}`);
  },
};
