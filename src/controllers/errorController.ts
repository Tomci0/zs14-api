import AppError from '../types/appError.type';
import { Request, Response, NextFunction } from 'express';

export default function errorHandler(err: AppError, req: Request, res: Response, next: NextFunction) {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
    });
}
