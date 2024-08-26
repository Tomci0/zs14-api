import { Request, Response } from 'express';

export default function indexController(req: Request, res: Response) {
    res.json({
        status: 'success',
        message: 'Welcome to the API for ZS14 consultation app',
        author: 'Tomasz Magiera (kontakt@tomcio.space)',
        version: '1.0.0',
    });
}
