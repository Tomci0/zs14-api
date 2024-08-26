export default class AuthError extends Error {
    statusCode: number;
    message: string;
    isLogged: boolean;
    authError: boolean = true;

    constructor(statusCode: number, message: string, isLogged: boolean) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.isLogged = false;
    }
}
