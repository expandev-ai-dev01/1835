import { z } from 'zod';

export interface Purchase {
  purchaseId: string;
  productName: string;
  quantity: number;
  price: number;
  purchaseDate: string;
  totalItemPrice: number;
  createdAt: string;
  updatedAt: string;
}

export const purchaseSchema = z.object({
  productName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  quantity: z.number().positive('Quantity must be greater than 0'),
  price: z.number().positive('Price must be greater than 0'),
  purchaseDate: z.date().max(new Date(), 'Date cannot be in the future'),
});

export type PurchaseFormData = z.infer<typeof purchaseSchema>;

export interface CreatePurchaseDto extends PurchaseFormData {}
export interface UpdatePurchaseDto extends PurchaseFormData {}

export interface PurchaseListResponse {
  data: Purchase[];
  total: number;
  page: number;
  pageSize: number;
}
