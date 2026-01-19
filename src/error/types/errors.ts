export interface ProblemDetail {
    message: string;
    rejectedValue: string;
    field: string;
}

export class ValidationError extends Error {
    fieldErrors: ProblemDetail[] | undefined;

    constructor(message: string, fieldErrors: ProblemDetail[] | undefined) {
        super(message);
        this.message = message;
        this.fieldErrors = fieldErrors;
    }

}

export class AuthError extends Error {
    title: string | undefined;

    constructor(message: string | undefined, title: string | undefined) {
        super(message);
        this.title = title;
    }
}