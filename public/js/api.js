// ── Cookie helper ──
export function getCookie(name) {
    const nameEQ = name + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');

    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
}

// ── CSRF token ──
// O cookie contém "token|hash"; o header X-CSRF-Token espera só o token.
function getCsrfToken() {
    const cookie = getCookie('csrfToken');
    if (!cookie) return null;
    return cookie.split('|')[0];
}

// ── Request wrapper ──
async function request(method, url, body = null, _isRetry = false) {
    const headers = { 'Content-Type': 'application/json' };

    if (['POST', 'PUT', 'DELETE'].includes(method)) {
        const csrf = getCsrfToken();
        if (csrf) headers['X-CSRF-Token'] = csrf;
    }

    const options = {
        method,
        headers,
        credentials: 'same-origin',
    };
    if (body) options.body = JSON.stringify(body);

    let res = await fetch(url, options);

    if (res.status === 401 && !_isRetry && url !== '/refresh-token') {
        const retry = await fetch('/refresh-token', {
            method: 'POST',
            credentials: 'same-origin',
        });
        if (retry.ok) {
            res = await fetch(url, options);
        }
    }

    return res;
}

// ── API pública ──
export const api = {
    get:    (url)       => request('GET', url),
    post:   (url, body) => request('POST', url, body),
    put:    (url, body) => request('PUT', url, body),
    delete: (url, body) => request('DELETE', url, body),
};

// ── Logout centralizado ──
export async function logout() {
    await api.post('/logout');
    window.location.href = '/';
}

// ── getUserData centralizado ──
export async function getUserData() {
    const res = await api.get('/userData');
    if (!res.ok) throw new Error('Erro ao buscar dados do usuário');
    return res.json();
}
