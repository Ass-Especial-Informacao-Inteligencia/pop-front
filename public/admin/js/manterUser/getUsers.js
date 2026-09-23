import { api } from '../../../js/api.js'; // cliente API centralizado

export async function getUsersFetch() {
    try {
        const response = await api.get('/get/users');

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }
        const users = await response.json();

        return users;
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        throw error;
    }
}
