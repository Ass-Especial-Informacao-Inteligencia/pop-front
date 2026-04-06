import { userData } from './getUserData.js';

export async function updateUserNav() {
    const user = await userData;

    const isAdmin = user.role === 'admin';

    if (isAdmin) {
        // Criar os elementos dos links de Dashboard e Arquivados
        const jumbotronDiv = document.querySelector('.jumbotron');
        let botaoHTML = `<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#criarFormularioModal">Criar Novo Formulário</button>`;
        jumbotronDiv.innerHTML+=botaoHTML;
    }
}
