import { getCookie } from './getCookie.js';

export async function fetchDeleteAlternatives(alternativeGroup) {
    try {
        const title = getCookie('form');
        const response = await fetch(`/deleteAlternative/${title}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ alternativeGroup }),
        });

        if (!response.ok) {
            console.log(response);
        } else {
            console.log(response);
        }
    } catch (error) {
        console.error('Error Deleting Alternative:', error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }
}

export async function fetchDeleteQuestion(body,questionId) {
    try {
        const title = getCookie('form');
        const response = await fetch(`/form/${title}/question`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ body,questionId }),
        });

        if (!response.ok) {
            console.error('Error:', response.statusText);
        } 
    } catch (error) {
        console.error('Error Deleting Question:', error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }
}

export async function fetchFormUpdate(params) {
    try {
        const response = await fetch('/forms/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao fazer fetch:', error);
        throw new Error('Erro ao fazer fetch');
    }
}
