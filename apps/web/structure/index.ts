export class ResponseStructure<T> {
    status: 'success' | 'error';
    message: string;
    data: T | null;
    statusCode: number;

    constructor(status: 'success' | 'error', message: string, statusCode: number, data: T | null = null) {
        this.status = status;
        this.message = message;
        this.statusCode = statusCode;
        this.data = data;
    }

    static success<T>(data: T, message: string = 'Operation successful', statusCode: number = 200): ResponseStructure<T> {
        return new ResponseStructure<T>('success', message, statusCode, data);
    }

    static error<T>(message: string = 'An error occurred', statusCode: number = 500, data: T | null = null): ResponseStructure<T> {
        return new ResponseStructure<T>('error', message, statusCode, data);
    }
}