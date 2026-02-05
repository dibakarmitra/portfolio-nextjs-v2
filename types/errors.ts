/**
 * Error and Exception Types
 */

export type ErrorCode =
    | 'VALIDATION_ERROR'
    | 'NOT_FOUND'
    | 'UNAUTHORIZED'
    | 'FORBIDDEN'
    | 'CONFLICT'
    | 'INTERNAL_SERVER_ERROR'
    | 'SERVICE_UNAVAILABLE'
    | 'INVALID_REQUEST'
    | 'FILE_TOO_LARGE'
    | 'INVALID_FILE_TYPE'
    | 'UPLOAD_FAILED'
    | 'AI_SERVICE_ERROR'
    | 'DATABASE_ERROR';

export interface ErrorDetail {
    field?: string;
    message: string;
    code?: ErrorCode;
}

export interface AppErrorInfo {
    code: ErrorCode;
    message: string;
    statusCode: number;
    details?: ErrorDetail[] | Record<string, any>;
    timestamp?: string;
    path?: string;
}

export type HttpStatusCode =
    | 400 // Bad Request
    | 401 // Unauthorized
    | 403 // Forbidden
    | 404 // Not Found
    | 409 // Conflict
    | 422 // Unprocessable Entity
    | 429 // Too Many Requests
    | 500 // Internal Server Error
    | 502 // Bad Gateway
    | 503; // Service Unavailable

/**
 * Validation error constraints
 */
export interface ValidationConstraints {
    [key: string]: {
        [key: string]: string;
    };
}
