import { getUserData } from '../../../js/api.js';
import { deleteButton, restoreButton, handleEditarClick } from './editUser.js';
import { getUsersFetch } from './getUsers.js';

export async function addUsersForList() {
    const tabela = document.querySelector('.table tbody');

    const user = await getUserData();
    const listaUsuarios = await getUsersFetch();

    tabela.innerHTML = '';

    const listaOrdenada = [
        user,
        ...listaUsuarios.filter((usuario) => usuario.name !== user.name),
    ];

    listaOrdenada.forEach((usuario) => {
        const novaLinha = document.createElement('tr');
        novaLinha.dataset.userid = `${usuario.id}`;
        novaLinha.innerHTML = `
            <td data-name="${usuario.name}">
                ${usuario.name === user.name
                    ? 'Você'
                    : usuario.name.charAt(0).toUpperCase() + usuario.name.slice(1)}
            </td>
            <td data-cpf="${usuario.cpf}">${usuario.cpf.replace(
                /(\d{3})(\d{3})(\d{3})(\d{2})/,
                '$1.$2.$3-$4'
            )}</td>
            <td data-role="${usuario.role}">
                ${usuario.role === 'admin' ? 'Administrador' : 'Entrevistador'}
            </td>
            <td data-email="${usuario.email}">${usuario.email}</td>
            <td>
                <div class="btn-group" role="group" aria-label="Botões de Ação">
                    <button type="button" class="btn btn-primary btn-sm edit-user" data-toggle="modal" data-target="#editarUsuarioModal">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${usuario.deleted_at ? `
                    <button type="button" class="btn btn-success btn-sm restore-user" id="restore-user-${usuario.id}">
                        <i class="fas fa-undo"></i>
                    </button>
                    ` : `
                    <button type="button" class="btn btn-danger btn-sm delete-user" data-toggle="modal" data-target="#excluirUsuarioModal">
                        <i class="fas fa-user-slash fa-sm"></i>
                    </button>
                    `}
                </div>
            </td>
        `;

        tabela.appendChild(novaLinha);

        const botaoEditar = novaLinha.querySelector('.edit-user');
        botaoEditar.addEventListener('click', handleEditarClick);

        const botaoDeletar = novaLinha.querySelector('.delete-user');
        if (botaoDeletar) {
            botaoDeletar.addEventListener('click', deleteButton);
        }

        const botaoRestaurar = novaLinha.querySelector('.restore-user');
        if (botaoRestaurar) {
            botaoRestaurar.addEventListener('click', restoreButton);
        }
    });
}

