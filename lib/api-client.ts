const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/';

// helper function to get the token from local storage
function getToken() {
    if (typeof window !== 'undefined') {
        // we will use cookies instead of local storage
        return localStorage.getItem('token');
    }
    return null;
}

interface FetchOptions extends RequestInit {
    headers?: Record<string, string>;
}

// generic function to get the data from the api with the token
export async function apiClient<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const token = getToken();

    // preparing the headers with the token
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers || {}), // if i want to add a special header
    };

    if (options.body instanceof FormData) {
        delete headers['Content-Type'];
    }

    // injecting the token automatically if it exists
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // adjusting the url to make sure there is no duplicate slash
    const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    console.log(`🚀 Requesting: ${url}`);
    console.log(`🔑 Token: ${token ? 'Exists' : 'Missing'}`);
    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });

        // handling errors in a unified way
        if (!response.ok) {
            // handling session timeout (401 Unauthorized)
            if (response.status === 401) {
                // you can redirect to the login page here
                // window.location.href = '/auth/login';
                throw new Error('session timeout, please login again');
            }

            // trying to read the error message from the server
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP Error! status: ${response.status}`);
        }

        // returning the data cleanly
        // if there is no content (204 No Content) return null
        if (response.status === 204) return null as T;

        return response.json();

    } catch (error: any) {
        // here i can connect with Sentry or any error tracking service
        console.error(`API Call Failed [${endpoint}]:`, error);
        throw error;
    }
}