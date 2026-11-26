import { escapeHtml } from '../../../js/escapeHtml.js';
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
        ...listaUsuarios.filter((usuario) => usuario.id !== user.id),
    ];

    listaOrdenada.forEach((usuario) => {
        const name = usuario.name || '';
        const novaLinha = document.createElement('tr');
        novaLinha.dataset.userid = `${usuario.id}`;
        novaLinha.innerHTML = `
            <td data-name="${escapeHtml(name)}">
                ${usuario.id === user.id
                    ? 'Você'
                    : escapeHtml(name.charAt(0).toUpperCase() + name.slice(1))}
            </td>
            <td data-cpf="${escapeHtml(usuario.cpf)}">${escapeHtml(usuario.cpf.replace(
                /(\d{3})(\d{3})(\d{3})(\d{2})/,
                '$1.$2.$3-$4'
            ))}</td>
            <td data-role="${escapeHtml(usuario.role)}">
                ${usuario.role === 'admin' ? 'Administrador' : 'Entrevistador'}
            </td>
            <td data-email="${escapeHtml(usuario.email)}">${escapeHtml(usuario.email)}</td>
            <td>
                <div class="btn-group" role="group" aria-label="Botões de Ação">
                    <button type="button" class="btn btn-primary btn-sm edit-user" data-toggle="modal" data-target="#editarUsuarioModal" aria-label="Editar ${escapeHtml(name)}">
                        <i class="fas fa-edit" aria-hidden="true"></i>
                    </button>
                    ${usuario.deleted_at ? `
                    <button type="button" class="btn btn-success btn-sm restore-user" id="restore-user-${usuario.id}" aria-label="Restaurar ${escapeHtml(name)}">
                        <i class="fas fa-undo" aria-hidden="true"></i>
                    </button>
                    ` : `
                    <button type="button" class="btn btn-danger btn-sm delete-user" data-toggle="modal" data-target="#excluirUsuarioModal" aria-label="Excluir ${escapeHtml(name)}">
                        <i class="fas fa-user-slash fa-sm" aria-hidden="true"></i>
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

