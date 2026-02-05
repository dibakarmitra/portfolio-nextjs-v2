import { NextResponse } from 'next/server';

export interface ApiSuccessResponse<T = any> {
    success: true;
    // statusCode: number;
    // statusMessage: string;
    message?: string;
    data: T;
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        timestamp?: string;
    };
}

export interface ApiErrorResponse {
    success: false;
    // statusCode: number;
    // statusMessage: string;
    error: {
        message: string;
        code?: string;
        details?: any;
    };
    timestamp: string;
}

export type StandardApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

export function apiSuccess<T>(
    data: T,
    message?: string,
    statusCode: number = 200,
    meta?: ApiSuccessResponse['meta']
): NextResponse<ApiSuccessResponse<T>> {
    return NextResponse.json(
        {
            success: true,
            // statusCode,
            // statusMessage: getStatusMessage(statusCode),
            message,
            data,
            meta: {
                ...meta,
                timestamp: new Date().toISOString(),
            },
        },
        { status: statusCode }
    );
}

export function apiError(
    message: string,
    statusCode: number = 500,
    code?: string,
    details?: any
): NextResponse<ApiErrorResponse> {
    return NextResponse.json(
        {
            success: false,
            // statusCode,
            // statusMessage: getStatusMessage(statusCode),
            error: {
                message,
                code: code || getErrorCode(statusCode),
                details,
            },
            timestamp: new Date().toISOString(),
        },
        { status: statusCode }
    );
}

const statusMessages: Record<number, string> = {
    // success
    200: 'OK',
    201: 'Created',
    204: 'No Content',

    // redirection
    301: 'Moved Permanently',
    302: 'Found',
    303: 'See Other',
    304: 'Not Modified',
    307: 'Temporary Redirect',

    // client errors
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    406: 'Not Acceptable',
    412: 'Precondition Failed',
    415: 'Unsupported Media Type',
    422: 'Unprocessable Entity',
    429: 'Too Many Requests',

    // server errors
    500: 'Internal Server Error',
    501: 'Not Implemented',
    503: 'Service Unavailable',
};

function getStatusMessage(statusCode: number): string {
    return statusMessages[statusCode] || 'Unknown Status';
}

function getErrorCode(statusCode: number): string {
    const codes: Record<number, string> = {
        400: 'BAD_REQUEST',
        401: 'UNAUTHORIZED',
        403: 'FORBIDDEN',
        404: 'NOT_FOUND',
        405: 'METHOD_NOT_ALLOWED',
        406: 'NOT_ACCEPTABLE',
        409: 'CONFLICT',
        412: 'PRECONDITION_FAILED',
        415: 'UNSUPPORTED_MEDIA_TYPE',
        422: 'VALIDATION_ERROR',
        429: 'RATE_LIMIT_EXCEEDED',
        500: 'INTERNAL_SERVER_ERROR',
        501: 'NOT_IMPLEMENTED',
        503: 'SERVICE_UNAVAILABLE',
    };
    return codes[statusCode] || 'UNKNOWN_ERROR';
}

export function apiPaginated<T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
    message?: string
): NextResponse<ApiSuccessResponse<T[]>> {
    return apiSuccess(data, message, 200, {
        page,
        limit,
        total,
        timestamp: new Date().toISOString(),
    });
}

export function apiCreated<T>(data: T, message?: string): NextResponse<ApiSuccessResponse<T>> {
    return apiSuccess(data, message, 201);
}

export function apiNoContent(): NextResponse {
    return new NextResponse(null, {
        status: 204,
        statusText: getStatusMessage(204),
    });
}

export function apiValidationError(errors: Record<string, string>): NextResponse<ApiErrorResponse> {
    return apiError('Validation failed', 422, 'VALIDATION_ERROR', errors);
}

export function apiNotFound(resource: string): NextResponse<ApiErrorResponse> {
    return apiError(`${resource} not found`, 404, 'NOT_FOUND');
}

export function apiUnauthorized(
    message: string = 'Authentication required'
): NextResponse<ApiErrorResponse> {
    return apiError(message, 401, 'UNAUTHORIZED');
}

export function apiRateLimitExceeded(): NextResponse<ApiErrorResponse> {
    return apiError('Too many requests. Please try again later.', 429, 'RATE_LIMIT_EXCEEDED');
}
