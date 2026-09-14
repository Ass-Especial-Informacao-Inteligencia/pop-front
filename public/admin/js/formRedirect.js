import { getUserData } from '../../js/api.js';
const user = await getUserData();

export function setupFormRedirect() {
    const links = document.querySelectorAll('.redirect-btn');
    links.forEach((link) => {
        link.addEventListener('click', () => {
            const route = link.getAttribute('data-route');
            setFormCookie(route);
            redirectFormPage(route);
        });
    });
}

function redirectFormPage(route) {
    location.href = user.role === 'admin' ? `/edit/${route}` : `/form/${route}`;
}

function setFormCookie(route) {
    document.cookie = `form=${route}; path=/`;
}
