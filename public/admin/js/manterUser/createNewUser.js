import { mostrarMensagem } from '../../../js/geraNotificacao.js';
import { checkEmptyFields } from './checkEmptyFields.js';
import { addUsersForList } from './geraTrUsuarios.js';
import { api } from '../../../../js/api.js'; // cliente API centralizado

export async function signUp() {
    // Retrieving form data
    const cpf = document.querySelector('#criarNovoUsuario #cpf').value;
    const name = document.querySelector('#criarNovoUsuario #nome').value;
    const email = document.querySelector('#criarNovoUsuario #email').value;
    const password = document.querySelector('#criarNovoUsuario #senha').value;
    const role = document.querySelector('#criarNovoUsuario #funcao').value;

    // Creating an array with form field values
    const fields = [cpf, name, email, password, role];

    // Checking if any required fields are empty
    if (checkEmptyFields(fields)) {
        mostrarMensagem('Por favor, preencha todos os campos.', 'warning', 5);
        return;
    }

    try {
        // Constructing form data object
        const formData = { cpf, name, email, password, role };

        // Sending a POST request to /signup endpoint
        const response = await api.post('/signup', formData);

        const spanCpfMessage = document.getElementById('cpfErrorMessage');
        const spanAdminMessage = document.getElementById('message');
        const spanEmailMessage = document.getElementById('emailErrorMessage');

        if (!response.ok) {
            const error = await response.json();
            console.error('Signup error:', error);
            // Handling specific error cases
            if (error.cpfMessage) {
                spanCpfMessage.textContent = error.cpfMessage;
                eraseError(spanCpfMessage);
            }
            
            if (error.userExistsMessage) {
                spanAdminMessage.textContent = error.userExistsMessage;
                eraseError(spanAdminMessage);
            }

            if (error.emailMessage) {
                spanEmailMessage.textContent = error.emailMessage;
                eraseError(spanEmailMessage);
            }
        } else {
            const data = await response.json();
            spanAdminMessage.textContent = data.userCreatedMessage;
            eraseError(spanAdminMessage);
            // If successful, update user list
            addUsersForList();
            mostrarMensagem('Usuário criado com sucesso.', 'success',5);
        }
    } catch (error) {
        console.error('Erro ao criar Usuário:', error);
        throw error; // Re-throw error for handling elsewhere if needed
    }
}

function eraseError(errorElement) {
    setTimeout(() => (errorElement.textContent = ''), 1000 * 3);
}
