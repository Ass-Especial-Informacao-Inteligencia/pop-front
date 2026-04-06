import { userData } from './getUserData.js';
const userLogged = await userData;

export function adicionarUsersComAcesso(users) {
    const usersWithAccessList = document.getElementById('usersWithAccess');
    usersWithAccessList.innerHTML = '';

    // Separe os usuários administradores dos outros usuários
    const adminUsers = users.filter((user) => user.role === 'admin');
    const regularUsers = users.filter((user) => user.role !== 'admin');

    // Adicione os usuários administradores primeiro à lista
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

    // Adicione os outros usuários à lista após os usuários administradores
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

    // Filtra os usuários que não estão na lista de selecionados nem na lista de usuários com acesso
    const usersWithoutAccess = users.filter(
        (user) =>
            !selectedUsers.some(
                (selectedUser) => selectedUser.cpf === user.cpf
            ) && !usersWithAccessCPF.includes(user.cpf)
    );

    // Para cada usuário sem acesso, cria um item de lista e adiciona um botão para adicionar
    usersWithoutAccess.forEach((user) => {
        const users = {
            role: user.role === 'admin' ? 'ADMIN' : 'ENTREVISTADOR', // Define o papel do usuário
            name: user.name,           // Nome do usuário
            cpf: user.cpf,             // CPF do usuário
            email: user.email,         // Email do usuário
        };
        const listItem = createUserListItem(users); // Cria um item de lista para o usuário

        // Cria um botão 'Adicionar' para adicionar o usuário à lista de salvos
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
                selectedUsers.push(user); // Adiciona o usuário à lista de selecionados
                const savedListItem = createUserListItem(users); // Cria um item de lista para a lista de salvos
                const removerBotao = createButton(
                    'Remover',
                    ['btn', 'btn-danger', 'remove-user', 'btn-sm'],
                    () => {
                        savedList.removeChild(savedListItem); // Remove o item da lista de salvos
                        const index = selectedUsers.indexOf(users); // Encontra o índice do usuário na lista de selecionados
                        if (index !== -1) selectedUsers.splice(index, 1); // Remove o usuário da lista de selecionados
                        resultsList.appendChild(createUserListItem(user)); // Re-adiciona o usuário à lista de resultados
                    }
                );
                savedListItem.appendChild(removerBotao); // Adiciona o botão 'Remover' ao item da lista de salvos
                savedList.appendChild(savedListItem); // Adiciona o item à lista de salvos
                listItem.remove(); // Remove o item da lista de resultados
                // Lógica do fetch para adicionar acesso ao usuário (não implementada)
            }
        );
        listItem.appendChild(adicionarBotao); // Adiciona o botão 'Adicionar' ao item da lista
        resultsList.appendChild(listItem); // Adiciona o item à lista de resultados
    });

    // Adiciona um listener para o evento 'userRemoved' na lista de salvos
    savedList.addEventListener('userRemoved', (event) => {
        const userRemoved = event.detail; // Obtém o usuário removido do evento
        usersWithoutAccess.forEach((user) => {
            if (
                user.name.includes(userRemoved.name) ||
                user.cpf === userRemoved.cpf ||
                user.email === userRemoved.email
            ) {
                const listItem = createUserListItem(user); // Cria um item de lista para o usuário sem acesso
                const adicionarBotao = createButton(
                    'Adicionar',
                    ['btn', 'btn-success', 'btn-sm'],
                    () => {
                        selectedUsers.push(user); // Adiciona o usuário à lista de selecionados
                        const savedListItem = createUserListItem(user); // Cria um item de lista para a lista de salvos
                        const removerBotao = createButton(
                            'Remover',
                            ['btn', 'btn-danger', 'remove-user', 'btn-sm'],
                            () => {
                                savedList.removeChild(savedListItem); // Remove o item da lista de salvos
                                const index = selectedUsers.indexOf(user); // Encontra o índice do usuário na lista de selecionados
                                if (index !== -1) selectedUsers.splice(index, 1); // Remove o usuário da lista de selecionados
                                resultsList.appendChild(createUserListItem(user)); // Re-adiciona o usuário à lista de resultados
                            }
                        );
                        savedListItem.appendChild(removerBotao); // Adiciona o botão 'Remover' ao item da lista de salvos
                        savedList.appendChild(savedListItem); // Adiciona o item à lista de salvos
                        listItem.remove(); // Remove o item da lista de resultados
                        // Lógica do fetch para adicionar acesso ao usuário (não implementada)
                    }
                );
                listItem.appendChild(adicionarBotao); // Adiciona o botão 'Adicionar' ao item da lista
                resultsList.appendChild(listItem); // Adiciona o item à lista de resultados
            }
        });
    });

    // Adiciona um listener para o evento 'userRemoved' na lista de salvos
    savedList.addEventListener('userRemoved', (event) => {
        const userRemoved = event.detail; // Obtém o usuário removido do evento
        if (!usersWithoutAccess.some((user) => user.cpf === userRemoved.cpf)) {
            const listItem = createUserListItem(userRemoved); // Cria um item de lista para o usuário removido
            const adicionarBotao = createButton(
                'Adicionar',
                ['btn', 'btn-success', 'btn-sm'],
                () => {
                    selectedUsers.push(userRemoved); // Adiciona o usuário à lista de selecionados
                    const savedListItem = createUserListItem(userRemoved); // Cria um item de lista para a lista de salvos
                    const removerBotao = createButton(
                        'Remover',
                        ['btn', 'btn-danger', 'remove-user', 'btn-sm'],
                        () => {
                            savedList.removeChild(savedListItem); // Remove o item da lista de salvos
                            const index = selectedUsers.indexOf(userRemoved); // Encontra o índice do usuário na lista de selecionados
                            if (index !== -1) selectedUsers.splice(index, 1); // Remove o usuário da lista de selecionados
                            resultsList.appendChild(createUserListItem(userRemoved)); // Re-adiciona o usuário à lista de resultados
                        }
                    );
                    savedListItem.appendChild(removerBotao); // Adiciona o botão 'Remover' ao item da lista de salvos
                    savedList.appendChild(savedListItem); // Adiciona o item à lista de salvos
                    listItem.remove(); // Remove o item da lista de resultados
                    // Lógica do fetch para adicionar acesso ao usuário (não implementada)
                }
            );
            listItem.appendChild(adicionarBotao); // Adiciona o botão 'Adicionar' ao item da lista
            resultsList.appendChild(listItem); // Adiciona o item à lista de resultados
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

    // Verifique se classNames é um array
    if (Array.isArray(classNames)) {
        // Adicione cada classe separadamente ao elemento do botão
        classNames.forEach((className) => button.classList.add(className));
    } else {
        // Se for uma única classe, apenas adicione-a
        button.classList.add(classNames);
    }

    return button;
}

export function clearResults(resultsList) {
    resultsList.innerHTML = '';
}
