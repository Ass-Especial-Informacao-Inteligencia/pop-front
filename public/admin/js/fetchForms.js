import { clearError, displayError } from './errorHandler.js';
import { mostrarMensagem } from './geraNotificacao.js';

export async function fetchActiveForms() {
    try {
        const response = await fetch('/forms/active');
        if (!response.ok) {
            throw new Error('Failed to fetch forms');
        }
        const forms = await response.json();
        return forms;
    } catch (error) {
        console.error('Error fetching forms:', error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }
}

export async function fetchCreateForm(formData, errorElement) {
    try {
        const response = await fetch('/forms/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // outros cabeçalhos, se necessário
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            const error = await response.json();
            displayError(error.message, errorElement); // Exibe o erro no elemento fornecido
            throw new Error(error.message);
        } else {
            clearError(errorElement); // Limpa o erro do elemento fornecido
        }

        return response.json();
    } catch (error) {
        console.error('Erro ao criar formulário:', error);
        throw error; // Re-lança o erro para manipulação em outro lugar, se necessário
    }
}

export async function fetchDeactivatedForms() {
    try {
        const response = await fetch('/forms/deactivated', {
            headers: {
                'Content-Type': 'application/json',
            },
        });
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
        const response = await fetch('/forms/agendados');
        if (!response.ok) {
            throw new Error('Failed to fetch forms');
        }
        const forms = await response.json();
        return forms;
    } catch (error) {
        console.error('Error fetching forms:', error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }
}

export async function fetchFormsFinalzados() {
    try {
        const response = await fetch('/forms/finalizados');
        if (!response.ok) {
            throw new Error('Failed to fetch forms');
        }
        const forms = await response.json();
        return forms;
    } catch (error) {
        console.error('Error fetching forms:', error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }
}

export async function getOneForm(title) {
    try {
        const response = await fetch(`/${title}/get`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch deactivated forms');
        }
        const form = await response.json();
        return form;
    } catch (error) {
        console.error('Error fetching deactivated forms:', error);
        throw error;
    }
}

export async function fetchFormUpdate(params) {
    try {
        // console.log(params);
        const response = await fetch('/forms/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify( params ),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao fazer fetch:', error);
        mostrarMensagem("Falha na tentativa de atualizar Formulário.","danger",5);
        throw new Error('Erro ao fazer fetch');
    }
}
