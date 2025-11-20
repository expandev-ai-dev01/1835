import { Request, Response, NextFunction } from 'express';
import { errorResponse, StatusGeneralError } from './crud';

export function errorMiddleware(error: any, req: Request, res: Response, next: NextFunction) {
  console.error('Unhandled Error:', error);

  if (res.headersSent) {
    return next(error);
  }

  // Zod Validation Errors
  if (error.name === 'ZodError') {
    return res.status(400).json(errorResponse('Validation Error', 'VALIDATION_ERROR'));
  }

  // SQL Server Errors
  if (error.number) {
    // Custom business errors (51000+)
    if (error.number >= 51000) {
      return res.status(400).json(errorResponse(error.message, 'BUSINESS_RULE_VIOLATION'));
    }
    // General DB errors
    return res
      .status(StatusGeneralError)
      .json(errorResponse('Database operation failed', 'DB_ERROR'));
  }

  res.status(StatusGeneralError).json(errorResponse('Internal Server Error', 'INTERNAL_ERROR'));
}
