import { appPath } from './appPath.js';
import { api } from './api.js'; // cliente API centralizado

async function redirectToHome() {
    const signInPath = appPath('/sign/index.html');
    try {
        const response = await api.get('/userData');

        if (!response.ok) {
            window.location.href = signInPath;
            return;
        }

        const user = await response.json();
        window.location.href =
            appPath(user.role === 'admin' ? '/admin/index.html' : '/user/index.html');
    } catch (error) {
        console.error('Erro ao carregar home:', error);
        window.location.href = signInPath;
    }
}

redirectToHome();
