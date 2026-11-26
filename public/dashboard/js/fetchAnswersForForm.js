

import { api } from '../../js/api.js'; // cliente API centralizado

export async function fetchResponsesForForm(title) {
    const url = `/dashboard/${encodeURIComponent(title)}/responses`;
    const pageSize = 1000;
    const answers = [];
    let total;

    do {
        const response = await api.get(`${url}?limit=${pageSize}&offset=${answers.length}`);
        if (!response.ok) throw new Error('Erro ao carregar as respostas para exportação.');
        const page = await response.json();
        total ??= Number(response.headers.get('X-Total-Count') ?? page.length);
        if (!page.length && answers.length < total) {
            throw new Error('As respostas mudaram durante a exportação. Tente novamente.');
        }
        answers.push(...page);
    } while (answers.length < total);

    return answers.slice(0, total);
}

export async function fetchResponsesForFormGraphics(title) {
    const response = await api.get('/dashboard/' + encodeURIComponent(title) + '/graphics');
    if (!response.ok) throw new Error('Erro ao carregar os dados do dashboard.');
    return response.json();
}
