import { signUp } from './createNewUser.js';

export function submit() {
    createNewUser();
}

function createNewUser() {
    document
        .querySelector('#btnSalvarNovoUsuario')
        .addEventListener('click', signUp);
}
