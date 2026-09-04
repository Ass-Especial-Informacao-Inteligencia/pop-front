

import { api } from '../../js/api.js'; // cliente API centralizado

export async function fetchResponsesForForm(title) {
    const url = `/dashboard/${title}/responses`;
    const timeout = 10 * 60 * 1000;

    // Busca respostas do formulário com timeout de 10 minutos
    const fetchWithTimeout = (url, options, timeout) => {
        return Promise.race([
            api.get(url),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Request timed out')), timeout)
            )
        ]);
    };

    try {
        const response = await fetchWithTimeout(url, {}, timeout);

        if (!response.ok) {
            throw new Error('Failed to fetch form responses');
        }

        const form = await response.json();
        return form;
    } catch (error) {
        if (error.message === 'Request timed out') {
            console.error('A requisição demorou muito para responder.');
        } else {
            console.error('Error fetching form responses:', error);
        }
        throw error;
    }
}


export async function fetchResponsesForFormGraphics(title) {
    
    const url = `/dashboard/${encodeURIComponent(title)}/graphics`;
    const timeout = 10*60*1000;

    // Busca dados gráficos com timeout de 10 minutos
    const fetchWithTimeout = (url, options, timeout) => {
        return Promise.race([
            api.get(url),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Request timed out')), timeout)
            )
        ]);
    };

    try {
        const response = await fetchWithTimeout(url, {}, timeout);

        if (!response.ok) {
            throw new Error('Failed to fetch deactivated forms');
        }

        const form = await response.json();
        return form;
    } catch (error) {
        if (error.message === 'Request timed out') {
            console.error('A requisição demorou muito para responder.');
        } else {
            console.error('Error fetching deactivated forms:', error);
        }
        throw error;
    }
}
