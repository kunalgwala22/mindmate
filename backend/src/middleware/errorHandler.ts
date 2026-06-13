import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('💥 Unhandled Application Error:', err);

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(status).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' && status === 500
      ? 'An unexpected error occurred. Please try again later.'
      : message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
