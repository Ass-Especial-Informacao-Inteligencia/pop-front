import { api } from '../../js/api.js'; // cliente API centralizado

export async function fetchActiveForms() {
    try {
        const response = await api.get('/forms/active');
        if (!response.ok) {
            throw new Error('Failed to fetch forms');
        }
        const forms = await response.json();
        return forms;
    } catch (error) {
        console.error('Error fetching forms:', error);
        throw error;
    }
}
