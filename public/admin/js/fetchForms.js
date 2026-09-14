import { clearError, displayError } from './errorHandler.js';
import { mostrarMensagem } from './geraNotificacao.js';
import { api } from '../../../js/api.js'; // cliente API centralizado

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

export async function fetchCreateForm(formData, errorElement) {
    try {
        const response = await api.post('/forms/create', formData);

        if (!response.ok) {
            const error = await response.json();
            displayError(error.message, errorElement);
            throw new Error(error.message);
        } else {
            clearError(errorElement);
        }

        return response.json();
    } catch (error) {
        console.error('Erro ao criar formulário:', error);
        throw error;
    }
}

export async function fetchDeactivatedForms() {
    try {
        const response = await api.get('/forms/deactivated');
        if (!response.ok) {
            throw new Error('Failed to fetch deactivated forms');
        }
        const forms = await response.json();
        return forms;
    } catch (error) {
        console.error('Error fetching deactivated forms:', error);
        throw error;
    }
}

export async function fetchFormsAgendados() {
    try {
        const response = await api.get('/forms/agendados');
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

export async function fetchFormsFinalizados() {
    try {
        const response = await api.get('/forms/finalizados');
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

export async function getOneForm(title) {
    try {
        const response = await api.get(`/${title}/get`);
        if (!response.ok) {
            throw new Error('Failed to fetch form');
        }
        const form = await response.json();
        return form;
    } catch (error) {
        console.error('Error fetching form:', error);
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
        mostrarMensagem("Falha na tentativa de atualizar Formulário.","danger",5);
        throw new Error('Erro ao fazer fetch');
    }
}
