import { getUserData } from './api.js';

let user = null;

try {
    user = await getUserData();
} catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
}

export function fillUpModalsInfo() {
    if (!user) return;
    
    const name = document.getElementById('modal-name');
    const cpf = document.getElementById('modal-cpf');
    const email = document.getElementById('modal-email');

    if (name) name.textContent = user.name;
    if (cpf) cpf.textContent = user.cpf.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        '$1.$2.$3-$4'
    );
    if (email) email.textContent = user.email;
}
