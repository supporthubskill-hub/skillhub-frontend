const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function apiRequest(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' },
        };
        if (data) options.body = JSON.stringify(data);

        const response = await fetch(`${API_URL}${endpoint}`, options);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error de conexión con el servidor:', error);
        return { success: false, message: 'No se pudo conectar con el servidor.' };
    }
}