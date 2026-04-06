import { userData } from './getUserData.js';
const user = await userData;

export function setupFormRedirect() {
    const links = document.querySelectorAll('.redirect-btn');
    links.forEach((link) => {
        link.addEventListener('click', () => {
            const route = link.getAttribute('data-route');
            redirectFormPage(route);
        });
    });
}

function redirectFormPage(route) {
    location.href = user.role === 'admin' ? `/edit/${route}` : `/form/${route}`;
}
