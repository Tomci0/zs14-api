export default interface AppError extends Error {
    statusCode: number;
    status: string;
    message: string;
}
