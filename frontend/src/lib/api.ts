export const apiFetch = async (endpoint: string, options?: RequestInit) => {
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!BASE_URL) throw new Error("API base URL is not defined");

    const response = await fetch(`${BASE_URL}${endpoint}`, options);

    if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
    }

    return response;
};
