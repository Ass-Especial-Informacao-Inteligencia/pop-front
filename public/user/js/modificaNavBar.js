import { getUserData } from '../../js/api.js';

export async function updateUserNav() {
    const user = await getUserData();

    const isAdmin = user.role === 'admin';

    if (isAdmin) {
        // Criar o botão de novo formulário para admin
        const jumbotronDiv = document.querySelector('.jumbotron');
        let botaoHTML = `<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#criarFormularioModal">Criar Novo Formulário</button>`;
        jumbotronDiv.innerHTML+=botaoHTML;
    }
}
