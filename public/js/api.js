import { appPath } from './appPath.js';

export function getCookie(name) {
    const prefix = name + '=';
    const entry = document.cookie.split(';').map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith(prefix));
    if (!entry) return null;
    const value = entry.slice(prefix.length);
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
}

function send(method, url, body) {
    const headers = { 'Content-Type': 'application/json' };
    if (['POST', 'PUT', 'DELETE'].includes(method)) {
        const csrfToken = getCookie('csrfToken')?.split('|')[0];
        if (csrfToken) headers['X-CSRF-Token'] = csrfToken;
    }

    return fetch(appPath(url), {
        method,
        headers,
        credentials: 'same-origin',
        body: body == null ? undefined : JSON.stringify(body),
    });
}

const authEndpoints = new Set(['/signin', '/signup', '/refresh-token']);
let refreshInFlight;
let sessionVersion = 0;

function refreshSession() {
    if (!refreshInFlight) {
        refreshInFlight = send('POST', '/refresh-token')
            .then((response) => {
                if (response.ok) sessionVersion += 1;
                return response.ok;
            })
            .finally(() => { refreshInFlight = undefined; });
    }
    return refreshInFlight;
}

async function request(method, url, body) {
    const sentVersion = sessionVersion;
    const response = await send(method, url, body);
    if (response.status !== 401 || authEndpoints.has(url)) {
        return response;
    }

    if (sentVersion !== sessionVersion || await refreshSession()) {
        return send(method, url, body);
    }
    return response;
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
    window.location.href = appPath();
}

// ── getUserData centralizado ──
// Memoizado por página (MPA recarrega o módulo a cada navegação): a home do user chamava /userData 5× por load — agora é 1 request, sem risco de dado velho. Falha não memoiza, então um retry volta ao normal.
let userDataPromise = null;
export function getUserData() {
    if (!userDataPromise) {
        userDataPromise = api
            .get('/userData')
            .then((res) => {
                if (!res.ok) throw new Error('Erro ao buscar dados do usuário');
                return res.json();
            })
            .catch((error) => {
                userDataPromise = null;
                throw error;
            });
    }
    return userDataPromise;
}
