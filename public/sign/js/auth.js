import { mostrarMensagem } from '../../js/geraNotificacao.js';
import { checkEmptyFields } from './checkEmptyFields.js';
import { api } from '../../js/api.js'; // cliente API centralizado

export { signIn };

async function signIn(ev) {
    ev.preventDefault();

    const account = document.querySelector('#sign-in-cpf-email').value;
    const password = document.querySelector('#sign-in-password').value;

    if (checkEmptyFields([account, password])) {
        mostrarMensagem('Por favor, preencha todos os campos.', 'danger', 5);
        return;
    }

    try {
        // Envia credenciais via api centralizada (POST /signin)
        const response = await api.post('/signin', { account, password });

        if (!response.ok) {
            const errorData = await response.json();
            mostrarMensagem(errorData.message || 'Erro ao fazer login.', 'danger', 5);
            return;
        }

        await response.json();
        window.location.href = '/home';
    } catch (error) {
        console.error('Error:', error.message);
        mostrarMensagem('Erro no servidor. Tente novamente mais tarde.', 'danger', 5);
    }
}
