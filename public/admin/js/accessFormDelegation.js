import { getUserData } from '../../js/api.js';
const userLogged = await getUserData();

// Monta as listas do modal de delegação de acesso.
// O POST real para o backend acontece só no botão Salvar (fetchDelegationForm.js).

export function adicionarUsersComAcesso(users) {
    const usersWithAccessList = document.getElementById('usersWithAccess');
    usersWithAccessList.innerHTML = '';

    const adminUsers = users.filter((user) => user.role === 'admin');
    const regularUsers = users.filter((user) => user.role !== 'admin');

    // Admins primeiro; o logado aparece como "EU" e sem botão de remover
    adminUsers.forEach(async (user) => {
        if (user.cpf === userLogged.cpf) {
            const admin = {
                role: 'ADMIN',
                name: 'EU',
                cpf: user.cpf,
                email: user.email.split('@')[0] + '@',
            };
            const listItem = createUserListItem(admin);
            usersWithAccessList.appendChild(listItem);
        } else {
            const admin = {
                role: 'ADMIN',
                name: user.name,
                cpf: user.cpf,
                email: user.email.split('@')[0] + '@',
            };
            const listItem = createUserListItem(admin);
            const removerBotao = createButton(
                'Remover',
                ['btn', 'btn-danger', 'remove-user', 'btn-sm'],
                () => {
                    usersWithAccessList.removeChild(listItem);
                    listItem.dispatchEvent(
                        new CustomEvent('userRemoved', { detail: user })
                    );
                }
            );
            listItem.appendChild(removerBotao);
            usersWithAccessList.appendChild(listItem);
        }
    });

    // Entrevistadores após os admins
    regularUsers.forEach((user) => {
        const users = {
            role: 'ENTREVISTADOR',
            name: user.name,
            cpf: user.cpf,
            email: user.email.split('@')[0] + '@',
        };
        const listItem = createUserListItem(users);
        const removerBotao = createButton(
            'Remover',
            ['btn', 'btn-danger', 'remove-user', 'btn-sm'],
            () => {
                usersWithAccessList.removeChild(listItem);
                listItem.dispatchEvent(
                    new CustomEvent('userRemoved', { detail: user })
                );
            }
        );
        listItem.appendChild(removerBotao);
        usersWithAccessList.appendChild(listItem);
    });
}

export function consultarUsersSemAcesso(
    users,             // Lista de todos os usuários
    selectedUsers,     // Lista de usuários já selecionados
    resultsList,       // Lista de resultados onde serão exibidos usuários sem acesso
    savedList          // Lista onde usuários selecionados são salvos
) {
    clearResults(resultsList); // Limpa a lista de resultados antes de adicionar novos itens

    // Obtém a lista de CPFs dos usuários que já têm acesso a partir da DOM
    const usersWithAccessCPF = Array.from(
        document.querySelectorAll('#usersWithAccess li .CPF')
    ).map((cpfElement) => cpfElement.getAttribute('data-cpf'));

    const usersWithoutAccess = users.filter(
        (user) =>
            !selectedUsers.some(
                (selectedUser) => selectedUser.cpf === user.cpf
            ) && !usersWithAccessCPF.includes(user.cpf)
    );

    usersWithoutAccess.forEach((user) => {
        const users = {
            role: user.role === 'admin' ? 'ADMIN' : 'ENTREVISTADOR',
            name: user.name,
            cpf: user.cpf,
            email: user.email,
        };
        const listItem = createUserListItem(users);

        const adicionarBotao = createButton(
            'Adicionar',
            ['btn', 'btn-success', 'btn-sm'],
            () => {
                const users = {
                    role: user.role === 'admin' ? 'ADMIN' : 'ENTREVISTADOR',
                    name: user.name,
                    cpf: user.cpf,
                    email: user.email.split('@')[0] + '@', // Remove o domínio do email
                };
                selectedUsers.push(user);
                const savedListItem = createUserListItem(users);
                const removerBotao = createButton(
                    'Remover',
                    ['btn', 'btn-danger', 'remove-user', 'btn-sm'],
                    () => {
                        savedList.removeChild(savedListItem);
                        const index = selectedUsers.indexOf(users);
                        if (index !== -1) selectedUsers.splice(index, 1);
                        resultsList.appendChild(createUserListItem(user));
                    }
                );
                savedListItem.appendChild(removerBotao);
                savedList.appendChild(savedListItem);
                listItem.remove();
                // Persistência: fetch em fetchDelegationForm.js (botão Salvar)
            }
        );
        listItem.appendChild(adicionarBotao);
        resultsList.appendChild(listItem);
    });

    // Volta o usuário para a lista de resultados quando removido dos salvos
    savedList.addEventListener('userRemoved', (event) => {
        const userRemoved = event.detail;
        usersWithoutAccess.forEach((user) => {
            if (
                user.name.includes(userRemoved.name) ||
                user.cpf === userRemoved.cpf ||
                user.email === userRemoved.email
            ) {
                const listItem = createUserListItem(user);
                const adicionarBotao = createButton(
                    'Adicionar',
                    ['btn', 'btn-success', 'btn-sm'],
                    () => {
                        selectedUsers.push(user);
                        const savedListItem = createUserListItem(user);
                        const removerBotao = createButton(
                            'Remover',
                            ['btn', 'btn-danger', 'remove-user', 'btn-sm'],
                            () => {
                                savedList.removeChild(savedListItem);
                                const index = selectedUsers.indexOf(user);
                                if (index !== -1) selectedUsers.splice(index, 1);
                                resultsList.appendChild(createUserListItem(user));
                            }
                        );
                        savedListItem.appendChild(removerBotao);
                        savedList.appendChild(savedListItem);
                        listItem.remove();
                    }
                );
                listItem.appendChild(adicionarBotao);
                resultsList.appendChild(listItem);
            }
        });
    });

    // Re-insere nos resultados se o usuário removido não estava em usersWithoutAccess
    savedList.addEventListener('userRemoved', (event) => {
        const userRemoved = event.detail;
        if (!usersWithoutAccess.some((user) => user.cpf === userRemoved.cpf)) {
            const listItem = createUserListItem(userRemoved);
            const adicionarBotao = createButton(
                'Adicionar',
                ['btn', 'btn-success', 'btn-sm'],
                () => {
                    selectedUsers.push(userRemoved);
                    const savedListItem = createUserListItem(userRemoved);
                    const removerBotao = createButton(
                        'Remover',
                        ['btn', 'btn-danger', 'remove-user', 'btn-sm'],
                        () => {
                            savedList.removeChild(savedListItem);
                            const index = selectedUsers.indexOf(userRemoved);
                            if (index !== -1) selectedUsers.splice(index, 1);
                            resultsList.appendChild(createUserListItem(userRemoved));
                        }
                    );
                    savedListItem.appendChild(removerBotao);
                    savedList.appendChild(savedListItem);
                    listItem.remove();
                }
            );
            listItem.appendChild(adicionarBotao);
            resultsList.appendChild(listItem);
        }
    });
}

function createUserListItem(user) {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item', 'd-flex', 'flex-column', 'flex-md-row', 'justify-content-between', 'align-items-start');
    listItem.innerHTML = `
        <span class="role">${user.role}</span>
        <span class="username">${user.name}</span>
        <span class="CPF" data-cpf="${user.cpf}">${user.cpf.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        '$1.$2.$3-$4'
    )}</span>
        <span class="email">${user.email}</span>
    `;
    return listItem;
}

function createButton(text, classNames, onClick) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = text;
    button.addEventListener('click', onClick);
    (Array.isArray(classNames) ? classNames : [classNames]).forEach((c) =>
        button.classList.add(c)
    );
    return button;
}

export function clearResults(resultsList) {
    resultsList.innerHTML = '';
}
