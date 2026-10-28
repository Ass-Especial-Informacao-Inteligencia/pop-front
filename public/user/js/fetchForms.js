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

// Forms que o usuário já respondeu (base do selo "Respondido" e do filtro de status)
export async function fetchAnsweredForms() {
    try {
        const response = await api.get('/forms/answered');
        if (!response.ok) {
            throw new Error('Failed to fetch answered forms');
        }
        const forms = await response.json();
        return forms;
    } catch (error) {
        console.error('Error fetching answered forms:', error);
        throw error;
    }
}
