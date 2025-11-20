import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import {
  purchaseCreate,
  purchaseDelete,
  purchaseGet,
  purchaseList,
  purchaseUpdate,
} from '@/services/purchase';

const securable = 'PURCHASE';

// Validation Schemas
const createSchema = z.object({
  productName: z.string().min(2).max(100),
  quantity: z.number().positive(),
  price: z.number().positive(),
  purchaseDate: z.coerce.date().max(new Date(), { message: 'Date cannot be in the future' }),
});

const updateSchema = createSchema;

const idSchema = z.object({
  id: z.string().uuid(),
});

const listSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().optional().default(20),
});

export async function listHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);
  const [validated, error] = await operation.list(req, listSchema);

  if (!validated) return next(error);

  try {
    const { page, pageSize } = validated.params;
    const result = await purchaseList(validated.credential.idAccount, page, pageSize);
    res.json(successResponse(result));
  } catch (error: any) {
    res.status(StatusGeneralError).json(errorResponse('Internal server error'));
  }
}

export async function createHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'CREATE' }]);
  const [validated, error] = await operation.create(req, createSchema);

  if (!validated) return next(error);

  try {
    const result = await purchaseCreate({
      ...validated.credential,
      ...validated.params,
    });
    res.json(successResponse(result));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      res.status(StatusGeneralError).json(errorResponse('Internal server error'));
    }
  }
}

export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);
  const [validated, error] = await operation.read(req, idSchema);

  if (!validated) return next(error);

  try {
    const result = await purchaseGet(validated.params.id, validated.credential.idAccount);
    res.json(successResponse(result));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(404).json(errorResponse(error.message));
    } else {
      res.status(StatusGeneralError).json(errorResponse('Internal server error'));
    }
  }
}

export async function updateHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'UPDATE' }]);
  const [validated, error] = await operation.update(req, idSchema, updateSchema);

  if (!validated) return next(error);

  try {
    const result = await purchaseUpdate({
      idPurchase: validated.params.id,
      ...validated.credential,
      ...validated.params,
    });
    res.json(successResponse(result));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(404).json(errorResponse(error.message));
    } else {
      res.status(StatusGeneralError).json(errorResponse('Internal server error'));
    }
  }
}

export async function deleteHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'DELETE' }]);
  const [validated, error] = await operation.delete(req, idSchema);

  if (!validated) return next(error);

  try {
    await purchaseDelete(validated.params.id, validated.credential.idAccount);
    res.json(successResponse({ deleted: true }));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(404).json(errorResponse(error.message));
    } else {
      res.status(StatusGeneralError).json(errorResponse('Internal server error'));
    }
  }
}
