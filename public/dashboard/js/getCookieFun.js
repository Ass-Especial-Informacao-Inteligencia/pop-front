export function getCookie(name) {
    // Separa os cookies individuais
    const cookies = document.cookie.split(';');

    // Procura pelo cookie com o nome específico
    for (let cookie of cookies) {
        // Remove espaços em branco no início
        cookie = cookie.trim();
        
        // Verifica se este cookie é o que estamos procurando
        if (cookie.startsWith(name + '=')) {
            // Retorna apenas o valor do cookie, removendo o nome do cookie
            return decodeURIComponent(cookie.substring(name.length + 1));
        }
    }

    // Se o cookie não for encontrado, retorna null
    return null;
}
