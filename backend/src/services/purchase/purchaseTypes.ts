export interface PurchaseEntity {
  idPurchase: string;
  idAccount: number;
  productName: string;
  quantity: number;
  price: number;
  totalItemPrice: number;
  purchaseDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseCreateRequest {
  idAccount: number;
  productName: string;
  quantity: number;
  price: number;
  purchaseDate: Date;
}

export interface PurchaseUpdateRequest extends PurchaseCreateRequest {
  idPurchase: string;
}

export interface PurchaseListMetadata {
  totalRecords: number;
  totalSpentCurrentMonth: number;
}

export interface PurchaseListResult {
  metadata: PurchaseListMetadata;
  data: PurchaseEntity[];
}
