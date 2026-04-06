export async function getUsersFetch() {
    try {
        const response = await fetch('/get/users');

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        } else {
            // console.log('Usuarios capturados'); // Limpa o erro do elemento fornecido
        }
        const users = response.json();

        return users;
    } catch (error) {
        console.error('Erro ao criar formulário:', error);
        throw error; // Re-lança o erro para manipulação em outro lugar, se necessário
    }
}
