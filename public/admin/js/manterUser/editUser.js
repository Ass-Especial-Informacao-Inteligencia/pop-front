import { mostrarMensagem } from '../geraNotificacao.js';
import { getCookie } from '../getCookie.js';
import { addUsersForList } from './geraTrUsuarios.js';

// Função para capturar os valores dos atributos data das células da linha
function capturarValoresLinha(linha) {
    const colunas = linha.querySelectorAll('td');
    const valores = {};
    colunas.forEach((coluna) => {
        Object.keys(coluna.dataset).forEach((key) => {
            valores[key] = coluna.dataset[key];
        });
    });
    return valores;
}

// // Função de manipulador de evento para o clique no botão de edição
export function handleEditarClick() {
    const linha = this.closest('tr'); // Encontra a linha pai do botão clicado
    
    const valores = capturarValoresLinha(linha);
    document.cookie = `editCPF=${valores.cpf}; SameSite=None; Secure`;
    // Preencher os campos do modal com os valores capturados
    document.getElementById('editarCPF').value = valores.cpf;
    document.getElementById('editarNome').value = valores.name;

    document.getElementById('editarEmail').value = valores.email;

    // Mapear a função capturada para a opção exibida no select
    const funcaoSelect = document.getElementById('editarFuncao');
    // Definir a opção exibida no select
    for (let i = 0; i < funcaoSelect.options.length; i++) {
        if (funcaoSelect.options[i].value === valores.role) {
            funcaoSelect.selectedIndex = i;
            break;
        }
    }

    editUser(valores);
}

export function deleteButton() {
    const linha = this.closest('tr'); // Encontra a linha pai do botão clicado
    const valores = capturarValoresLinha(linha);

    const h5Modal = document.querySelector('.nomeUserDeleteModal');
    
    h5Modal.textContent = valores.name;

    deleteUser(valores);
}

function eraseError(errorElement) {
    setTimeout(() => (errorElement.textContent = ''), 1000 * 3);
}

function deleteUser(valores) {
    document
        .querySelector('#confirmarExclusao')
        .addEventListener('click', async () => {
            const cpf = valores.cpf;
            try {
                const response = await fetch('/delete/user', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        // outros cabeçalhos, se necessário
                    },
                    body: JSON.stringify({ cpf }),
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message);
                } else {
                    addUsersForList();
                    mostrarMensagem('Usuário desativado com sucesso.', 'success',5);
                    console.log('Usuario desativado com sucesso');
                }
            } catch (error) {
                console.error('Erro ao desativar usuário:', error);
                throw error; // Re-lança o erro para manipulação em outro lugar, se necessário
            }
        });
}

function editUser() {
    const btnSalvarEdicao = document.querySelector('#btnSalvarEdicao');

    // Remover todos os event listeners do botão #btnSalvarEdicao
    const clonedElement = btnSalvarEdicao.cloneNode(true);
    btnSalvarEdicao.parentNode.replaceChild(clonedElement, btnSalvarEdicao);

    // Adicionar novo event listener
    clonedElement.addEventListener('click', async () => {
        const oldCPF = getCookie('editCPF');
        const name = document.getElementById('editarNome').value;
        const cpf = document.getElementById('editarCPF').value;
        const email = document.getElementById('editarEmail').value;
        const password = document.getElementById('editarSenha').value;
        const role = document.getElementById('editarFuncao').value;

        try {
            const newUserInfo = { cpf, name, email, password, role };
            const response = await fetch('/edit/user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // outros cabeçalhos, se necessário
                },
                body: JSON.stringify({ newUserInfo, oldCPF }),
            });

            if (!response.ok) {
                const message = await response.json();
                const spanCpfMessage = document.getElementById('editModalCpfMessage');
                const spanEmailMessage = document.getElementById('editModalEmailMessage');
                const spanAdminMessage = document.getElementById('editModalAdminMessage');
                if (message.cpfMessage) {
                    spanCpfMessage.textContent = message.cpfMessage;
                    eraseError(spanCpfMessage);
                    return;
                }
                if (message.invalidEmail) {
                    spanEmailMessage.textContent = message.invalidEmail;
                    eraseError(spanEmailMessage);
                    return;
                }
                if (message.adminError) {
                    spanAdminMessage.textContent = message.adminError;
                    eraseError(spanAdminMessage);
                    return;
                }
            }
            document.cookie = `editCPF=${cpf}; SameSite=None; Secure`;
            addUsersForList();
            mostrarMensagem('Usuário editado com sucesso.', 'success', 5);
            console.log('Usuario editado com sucesso');
        } catch (error) {
            console.error('Erro ao criar Usuário:', error);
            throw error; // Re-lança o erro para manipulação em outro lugar, se necessário
        }
    });
}

export function restoreButton(event) {
    const linha = event.target.closest('tr'); // Encontra a linha pai do botão clicado
    const userId = linha.dataset.userid;
    restoreUser(userId);
}


function restoreUser(userId) {
    fetch('/restore/user', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userId }),
    })
    .then(async response => {
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        } else {
            await addUsersForList(); // Atualiza a lista de usuários após a restauração
            mostrarMensagem('Usuário restaurado com sucesso.', 'success', 5);
            console.log('Usuário restaurado com sucesso');
        }
    })
    .catch(error => {
        console.error('Erro ao restaurar usuário:', error);
    });
}
