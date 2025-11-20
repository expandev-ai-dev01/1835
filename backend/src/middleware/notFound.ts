import { Request, Response } from 'express';
import { errorResponse } from './crud';

export function notFoundMiddleware(req: Request, res: Response) {
  res
    .status(404)
    .json(errorResponse(`Route not found: ${req.method} ${req.originalUrl}`, 'NOT_FOUND'));
}
