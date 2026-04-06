export async function searchUsers(searchTerm, selectedUsers) {
    try {
        const searchData = {
            searchTerm: searchTerm,
            selectedUsers: selectedUsers,
        };

        const response = await fetch('/search/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(searchData),
        });

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
        const response = await fetch(`/form/usersWithAccess/${title}`);

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
