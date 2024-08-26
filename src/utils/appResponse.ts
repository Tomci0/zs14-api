export default class AppResponse {
    public success: boolean = true;
    public statusCode: number;
    public message: string;
    public data: any;

    constructor(statusCode: number, message: string, data?: any) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }
}
