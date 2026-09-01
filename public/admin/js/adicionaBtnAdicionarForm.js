import { getUserData } from '../../js/api.js';

export async function adicionaBtnAdicionarForm() {
    const user = await getUserData();

    const isAdmin = user.role === 'admin';

    if (isAdmin) {
        const jumbotronDiv = document.querySelector('.home-jumbotron');
        let botaoHTML = `<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#criarFormularioModal">Criar Novo Formulário</button>`;
        jumbotronDiv.innerHTML+=botaoHTML;

    } 
}
