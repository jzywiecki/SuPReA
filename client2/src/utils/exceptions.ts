export class ApiRequestError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.name = "HttpException";
        this.statusCode = statusCode;
    }
}

export class InvalidCredentialsError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidCredentialsError";
    }
}

export class ConnectionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InternetConnectionError"
    }
}