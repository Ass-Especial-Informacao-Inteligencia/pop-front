import { adicionarUsersComAcesso } from './accessFormDelegation.js';
import { mostrarMensagem } from './geraNotificacao.js';
import { getUsersWithAccess } from './searchUsers.js';

// Função para listar os usuários com acesso em formato JSON
export function listarUsuariosComAcesso() {
    const usersWithAccessItems = document.querySelectorAll(
        '#usersWithAccess li'
    );
    const usuariosComAcesso = [];

    // Percorre os elementos HTML que representam os usuários com acesso
    usersWithAccessItems.forEach(function (item) {
        // Extrai as informações relevantes de cada usuário
        const name = item.querySelector('.username').textContent;
        const cpf = item.querySelector('.CPF').getAttribute('data-cpf');
        const email = item.querySelector('.email').textContent;

        // Armazena as informações em um objeto JavaScript
        const usuario = { name, cpf, email };

        // Adiciona o usuário ao array de usuários com acesso
        usuariosComAcesso.push(usuario);
    });

    // Retorna a string JSON
    return usuariosComAcesso;
}

// Função para lidar com o evento de clique no botão "Salvar"
export function handleSalvarButtonClick() {
    const salvarButton = document.querySelector(
        '#accessModal .delegar-usuarios'
    );
    salvarButton.addEventListener('click', async function () {
        // Lista os usuários com acesso em formato JSON
        const selectedUsers = listarUsuariosComAcesso();
        const title =
            salvarButton.parentNode.parentNode.querySelector(
                '.nome-formulario'
            ).textContent;

        const openToAll = document.querySelector(
            '#accessModal #liberarAcessoParaTodos'
        ).checked;

        // Faz um fetch para enviar os dados JSON para o servidor
        try {
            const response = await fetch('/access/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ selectedUsers, title, openToAll }),
            });

            if (!response.ok) {
                mostrarMensagem("Falha na tentativa de Liberar Formulário.","danger");
                throw new Error('Erro ao enviar os dados para o servidor');
            }

            // Atualiza a interface após o envio bem-sucedido
            const data = await response.json();

            // Busca novamente os usuários com acesso após a atualização
            const users = await getUsersWithAccess(title);
            adicionarUsersComAcesso(users);

            mostrarMensagem("Sucesso ao Liberar acesso ao Formulário.","success",5);
            console.log('Dados enviados com sucesso:', data);
        } catch (error) {
            mostrarMensagem("Falha na tentativa de Liberar Formulário.","danger",5);
            console.error('Erro ao delegar acesso:', error.message);
            // Trate o erro de forma apropriada, como mostrar uma mensagem de erro ao usuário
        }
    });
}

export function handleRemoveButtonClick() {
    const removeButtons = document.querySelectorAll('.remove-user');
    const title = document.querySelector('.nome-formulario').textContent;
    removeButtons.forEach((button) => {
        button.addEventListener('click', async function () {
            const cpf = button.parentNode.querySelector('.CPF').dataset.cpf;
            // Faz um fetch para enviar os dados JSON para o servidor
            try {
                const response = await fetch('/delete/access/users', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ cpf, title }),
                });
                if (!response.ok) {
                    throw new Error('Erro ao apagar os dados para o servidor');
                }
                // Trate a resposta do servidor conforme necessário
                const data = await response.json();
                mostrarMensagem("Sucesso ao remover acesso.","success",5);
                console.log(data);
            } catch (error) {
                console.error('Erro:', error.message);
            }
        });
    });
}
