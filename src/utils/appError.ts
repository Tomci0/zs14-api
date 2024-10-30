import AppResponse from './appResponse';

export default class AppError extends AppResponse {
    public statusCode: number;

    constructor(message: string, statusCode: number) {
        super(statusCode, message);
        this.success = false;
        this.statusCode = statusCode;
    }
}
