export const isServer = typeof window === 'undefined';
export const API_URL = isServer
    ? (process.env.SERVER_API_URL || 'http://backend:8005')
    : '/api';

export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`

    const isFormData = options.body instanceof FormData;
    const headers: Record<string, string> = {};
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
        ...options,
        headers: {
            ...headers,
            ...options.headers as Record<string, string>,
        },
        credentials: 'include', // Important for HttpOnly cookies
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || 'An unexpected error occurred')
    }

    // Handle empty responses (like 204 No Content)
    if (response.status === 204) {
        return {} as T
    }

    return response.json()
}
