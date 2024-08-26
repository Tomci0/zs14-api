import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import AuthError from '../utils/authError';

export default function jwtAuth(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token2 = authHeader && authHeader.split(' ')[1];
    const token = req.cookies.jwtToken;

    if (!token && !token2) {
        throw new AuthError(401, 'User not logged', false);
    }

    try {
        const decoded: any = jwt.verify(token || token2, process.env.JWT_SECRET || '');
        req.user = decoded.user;
        next();
    } catch (err) {
        console.log(err, 'Error');
        res.clearCookie('jwtToken');
        throw new AuthError(401, 'Invalid token', true);
    }
}
