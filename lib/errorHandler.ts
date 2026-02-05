export class AppError extends Error {
    constructor(
        public code: string,
        message: string,
        public statusCode: number = 500,
        public details?: Record<string, any>
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export class ValidationError extends AppError {
    constructor(message: string, details?: Record<string, any>) {
        super('VALIDATION_ERROR', message, 400, details);
        this.name = 'ValidationError';
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string, id?: string) {
        const message = id ? `${resource} with id ${id} not found` : `${resource} not found`;
        super('NOT_FOUND', message, 404);
        this.name = 'NotFoundError';
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized access') {
        super('UNAUTHORIZED', message, 401);
        this.name = 'UnauthorizedError';
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = 'Access forbidden') {
        super('FORBIDDEN', message, 403);
        this.name = 'ForbiddenError';
    }
}

export interface ErrorResponse {
    success: false;
    error: {
        code: string;
        message: string;
        statusCode: number;
        details?: Record<string, any>;
    };
}

export interface SuccessResponse<T> {
    success: true;
    data: T;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export function formatErrorResponse(error: unknown): ErrorResponse {
    if (error instanceof AppError) {
        return {
            success: false,
            error: {
                code: error.code,
                message: error.message,
                statusCode: error.statusCode,
                details: error.details,
            },
        };
    }

    if (error instanceof Error) {
        return {
            success: false,
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'An unexpected error occurred',
                statusCode: 500,
            },
        };
    }

    return {
        success: false,
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
            statusCode: 500,
        },
    };
}

/**
 * Format success response
 */
export function formatSuccessResponse<T>(data: T): SuccessResponse<T> {
    return {
        success: true,
        data,
    };
}

export function handleAsyncError(fn: (...args: any[]) => Promise<any>) {
    return async (...args: any[]) => {
        try {
            return await fn(...args);
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    };
}

export function validateRequired(
    data: Record<string, any>,
    fields: string[]
): Record<string, string> {
    const errors: Record<string, string> = {};

    for (const field of fields) {
        if (!data[field]) {
            errors[field] = `${field} is required`;
        }
    }

    return errors;
}

export function sanitizeErrorMessage(error: unknown): string {
    if (error instanceof AppError) {
        return error.message;
    }

    if (error instanceof Error) {
        return 'An error occurred processing your request';
    }

    return 'An unexpected error occurred';
}

export function sanitizeUserInput(input: string): string {
    if (!input || typeof input !== 'string') {
        return '';
    }

    return input
        .trim()
        .replace(/[^\w\s\-_.]/g, '') // remove special chars except safe ones
        .replace(/\s+/g, ' ') // normalize whitespace
        .substring(0, 200); // limit length to prevent DoS
}
