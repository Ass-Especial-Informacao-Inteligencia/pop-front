// export const userData = fetch('/userData')
//     .then((response) => response.json())
//     .then((user) => {
//         return user;
//     })
//     .catch((err) => console.error({ message: err.message }));

    
const refreshToken = async () => {
    try {
        const response = await fetch('/refresh-token', {
            method: 'POST',
            credentials: 'same-origin', // Importante para enviar os cookies
        });
    
        if (!response.ok) {console.log('deu ruim');
            throw new Error('Erro ao renovar token');
            
        }
        console.log('deu bom');
        const data = await response.json();
        // Retorne os dados do usuário ou faça algo com os novos tokens
        return data;
        } catch (error) {
            console.error('Erro ao renovar token:', error.message);
            throw error; // Rejeita a promessa para que o erro continue propagando
        }
};
const fetchUserData = async () => {
    try {
        const response = await fetch('/userData');
        if (!response.ok) {
            if (response.status === 401) {
                // Erro de autenticação, tentar renovar o token
                await refreshToken();
                // Após renovar o token, refazer a requisição para /userData
                return fetchUserData();
            } else {
                throw new Error('Erro ao buscar dados do usuário');
            }
        }

        const user = await response.json();
        return user;
    } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error.message);
        throw error; // Rejeita a promessa para que o erro continue propagando
    }
};
export const userData = fetchUserData()
    .then((user) => {
       return user;
        // Faça algo com os dados do usuário
    })
    .catch((error) => {
        console.error('Erro ao buscar dados do usuário:', error.message);
        // Tratar o erro de maneira apropriada
    });