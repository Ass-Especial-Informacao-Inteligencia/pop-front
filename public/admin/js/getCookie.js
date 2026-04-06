export function getCookie(cookieName) {
    const name = cookieName + '='; // Adiciona o sinal de igual ao nome do cookie
    const decodedCookie = decodeURIComponent(document.cookie); // Decodifica o cookie
    const cookieArray = decodedCookie.split(';'); // Divide o cookie em partes separadas

    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        // Remove espaços em branco no início do cookie
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        // Se encontrarmos o cookie com o nome especificado, retorna o valor do cookie
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }

    // Se o cookie não for encontrado, retorna null
    return null;
}
