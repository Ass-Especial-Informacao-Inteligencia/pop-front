import { mostrarMensagem } from './geraNotificacao.js';
import { checkEmptyFields } from './checkEmptyFields.js';

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
        const response = await fetch('/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ account, password }),
        });

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
