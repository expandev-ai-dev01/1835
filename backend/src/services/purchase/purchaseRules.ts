import { getPool } from '@/utils/database';
import {
  PurchaseCreateRequest,
  PurchaseEntity,
  PurchaseListResult,
  PurchaseUpdateRequest,
} from './purchaseTypes';

export async function purchaseCreate(params: PurchaseCreateRequest): Promise<PurchaseEntity> {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('idAccount', params.idAccount)
    .input('productName', params.productName)
    .input('quantity', params.quantity)
    .input('price', params.price)
    .input('purchaseDate', params.purchaseDate)
    .execute('[dbo].[spPurchaseCreate]');

  const idPurchase = result.recordset[0].idPurchase;
  return purchaseGet(idPurchase, params.idAccount);
}

export async function purchaseUpdate(params: PurchaseUpdateRequest): Promise<PurchaseEntity> {
  const pool = await getPool();
  await pool
    .request()
    .input('idPurchase', params.idPurchase)
    .input('idAccount', params.idAccount)
    .input('productName', params.productName)
    .input('quantity', params.quantity)
    .input('price', params.price)
    .input('purchaseDate', params.purchaseDate)
    .execute('[dbo].[spPurchaseUpdate]');

  return purchaseGet(params.idPurchase, params.idAccount);
}

export async function purchaseDelete(idPurchase: string, idAccount: number): Promise<void> {
  const pool = await getPool();
  await pool
    .request()
    .input('idPurchase', idPurchase)
    .input('idAccount', idAccount)
    .execute('[dbo].[spPurchaseDelete]');
}

export async function purchaseGet(idPurchase: string, idAccount: number): Promise<PurchaseEntity> {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('idPurchase', idPurchase)
    .input('idAccount', idAccount)
    .execute('[dbo].[spPurchaseGet]');

  if (!result.recordset[0]) {
    throw { number: 51000, message: 'purchaseNotFound' };
  }

  return result.recordset[0];
}

export async function purchaseList(
  idAccount: number,
  page: number = 1,
  pageSize: number = 20
): Promise<PurchaseListResult> {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('idAccount', idAccount)
    .input('page', page)
    .input('pageSize', pageSize)
    .execute('[dbo].[spPurchaseList]');

  // Result Set 1: Metadata
  // Cast to any to avoid TS7053 error due to @types/mssql mismatch
  const recordsets = result.recordsets as any;
  const metadata = recordsets[0][0];
  // Result Set 2: Data
  const data = recordsets[1];

  return {
    metadata: {
      totalRecords: metadata.totalRecords,
      totalSpentCurrentMonth: metadata.totalSpentCurrentMonth,
    },
    data: data,
  };
}
