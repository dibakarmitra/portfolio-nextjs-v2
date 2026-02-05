import { ApiResponse, ApiError } from '@/types';

interface RequestOptions extends RequestInit {
    timeout?: number;
}

class ApiClient {
    private baseUrl: string;
    private defaultTimeout: number = 30000; // 30 seconds

    constructor(baseUrl: string = '') {
        this.baseUrl = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
    }

    private async request<T = any>(
        endpoint: string,
        options: RequestOptions = {}
    ): Promise<ApiResponse<T>> {
        const url = new URL(endpoint, this.baseUrl).toString();
        const timeout = options.timeout || this.defaultTimeout;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return {
                success: true,
                data,
                status: response.status,
            };
        } catch (error) {
            clearTimeout(timeoutId);

            if (error instanceof Error && error.name === 'AbortError') {
                return {
                    success: false,
                    error: { message: 'Request timeout', code: 'TIMEOUT' },
                    status: 408,
                };
            }

            const message = error instanceof Error ? error.message : 'Unknown error';
            return {
                success: false,
                error: { message, code: 'REQUEST_FAILED' },
                status: 500,
            };
        }
    }

    async get<T = any>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { ...options, method: 'GET' });
    }

    async post<T = any>(
        endpoint: string,
        body?: any,
        options?: RequestOptions
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    async put<T = any>(
        endpoint: string,
        body?: any,
        options?: RequestOptions
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    async patch<T = any>(
        endpoint: string,
        body?: any,
        options?: RequestOptions
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    async delete<T = any>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { ...options, method: 'DELETE' });
    }

    async uploadFile<T = any>(
        endpoint: string,
        file: File,
        additionalData?: Record<string, any>
    ): Promise<ApiResponse<T>> {
        const formData = new FormData();
        formData.append('file', file);

        if (additionalData) {
            Object.entries(additionalData).forEach(([key, value]) => {
                formData.append(key, JSON.stringify(value));
            });
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.defaultTimeout);

        try {
            const response = await fetch(new URL(endpoint, this.baseUrl).toString(), {
                method: 'POST',
                body: formData,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            return { success: true, data, status: response.status };
        } catch (error) {
            clearTimeout(timeoutId);
            const message = error instanceof Error ? error.message : 'Upload failed';
            return { success: false, error: { message, code: 'UPLOAD_FAILED' }, status: 500 };
        }
    }
}

export const apiClient = new ApiClient();
