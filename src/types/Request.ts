import { Request } from 'express';

export default interface ExtendRequest extends Request {
    cache: any;
}
