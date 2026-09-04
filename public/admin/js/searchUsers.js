import { api } from '../../../js/api.js'; // cliente API centralizado

export async function searchUsers(searchTerm, selectedUsers) {
    try {
        const searchData = {
            searchTerm: searchTerm,
            selectedUsers: selectedUsers,
        };

        const response = await api.post('/search/users', searchData);

        if (!response.ok) {
            throw new Error('Erro ao buscar usuários');
        }

        const users = await response.json();
        return users;
    } catch (error) {
        console.error('Erro:', error);
        return [];
    }
}

export async function getUsersWithAccess(title) {
    try {
        const response = await api.get(`/form/usersWithAccess/${title}`);

        if (!response.ok) {
            throw new Error('Erro ao buscar usuários');
        }

        const users = await response.json();
        return users;
    } catch (error) {
        console.error('Erro:', error);
        return [];
    }
}
