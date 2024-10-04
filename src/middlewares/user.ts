import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import AuthError from '../utils/authError';

export default function getUser(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token2 = authHeader && authHeader.split(' ')[1];
    const token = req.cookies.jwtToken;

    if (!token && !token2) {
        res.clearCookie('jwtToken');
        next();
        return;
    }

    try {
        const decoded: any = jwt.verify(token || token2, process.env.JWT_SECRET || '');
        req.user = decoded.user;
        next();
    } catch (err) {
        res.clearCookie('jwtToken');
        next();
    }
}
