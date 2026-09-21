import {
    clearResults,
    consultarUsersSemAcesso,
} from './accessFormDelegation.js';
import { searchUsers } from './searchUsers.js';

export async function fetchAccessDelegation() {
    const inputField = document.getElementById('search-user-no-allow');
    const resultsList = document.getElementById('usersWithNotAccess');
    const savedList = document.getElementById('usersWithAccess');

    const selectedUsers = []; // Lista de usuários selecionados
    inputField.addEventListener('input', async () => {
        const searchTerm = inputField.value.trim();

        try {
            if (searchTerm === '') {
                clearResults(resultsList); // Limpa as sugestões se o campo de entrada estiver vazio
                return;
            }

            const users = await searchUsers(searchTerm, selectedUsers);
            consultarUsersSemAcesso(
                users,
                selectedUsers,
                resultsList,
                savedList
            );
        } catch (error) {
            console.error('Erro:', error);
        }
    });
}