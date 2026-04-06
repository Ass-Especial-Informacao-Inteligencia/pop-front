export function logout(ev) {
    ev.preventDefault();
    fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((response) => {
            if (response.ok) {
                // Logout bem-sucedido, redirecione para a página inicial
                window.location.href = '/'; // Redireciona para a página inicial
            } else {
                // Se o logout falhar, lide com isso adequadamente
                console.error('Logout falhou');
            }
        })
        .catch((error) => {
            console.error('Erro:', error);
        });
}
