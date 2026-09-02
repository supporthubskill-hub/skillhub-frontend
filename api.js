const API_URL = window.SKILLHUB_API_URL || 'https://skillhub-backend-b5iy.onrender.com';

export async function apiRequest(endpoint, method = 'GET', data = null) {
    const session = JSON.parse(sessionStorage.getItem('skillhubSession') || 'null');
    const headers = { 'Content-Type': 'application/json' };
    if (session?.token) headers.Authorization = `Bearer ${session.token}`;

    const options = { method, headers };
    if (data !== null) options.body = JSON.stringify(data);

    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(result.error || result.message || 'La solicitud no se pudo completar.');
        }
        return result;
    } catch (error) {
        console.error('API request failed:', error.message);
        return { success: false, error: error.message };
    }
}
