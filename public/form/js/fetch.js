import { getCookie, api } from '../../js/api.js'; // cliente API centralizado

export async function fetchDeleteAlternatives(alternativeGroup) {
    try {
        const title = getCookie('form');
        const response = await api.delete(`/deleteAlternative/${title}`, { alternativeGroup });

        if (!response.ok) {
            throw new Error('Erro ao deletar alternativas');
        }
    } catch (error) {
        console.error('Error Deleting Alternative:', error);
        throw error;
    }
}

export async function fetchDeleteQuestion(body, questionId) {
    try {
        const title = getCookie('form');
        const response = await api.delete(`/form/${title}/question`, { body, questionId });

        if (!response.ok) {
            console.error('Error:', response.statusText);
        }
    } catch (error) {
        console.error('Error Deleting Question:', error);
        throw error;
    }
}

export async function fetchFormUpdate(params) {
    try {
        const response = await api.put('/forms/update', params);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao fazer fetch:', error);
        throw new Error('Erro ao fazer fetch');
    }
}
