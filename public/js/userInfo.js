import { getUserData } from './api.js';

const user = await getUserData();

export function fillUpModalsInfo() {
    const name = document.getElementById('modal-name');
    const cpf = document.getElementById('modal-cpf');
    const email = document.getElementById('modal-email');

    name.textContent = user.name;
    cpf.textContent = user.cpf.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        '$1.$2.$3-$4'
    );
    email.textContent = user.email;
}
