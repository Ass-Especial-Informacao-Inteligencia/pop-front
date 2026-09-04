import { api } from './api.js'; // cliente API centralizado

async function redirectToHome() {
    try {
        const response = await api.get('/userData');

        if (!response.ok) {
            window.location.href = '/sign/index.html';
            return;
        }

        const user = await response.json();
        window.location.href =
            user.role === 'admin' ? '/admin/index.html' : '/user/index.html';
    } catch (error) {
        console.error('Erro ao carregar home:', error);
        window.location.href = '/sign/index.html';
    }
}

redirectToHome();
