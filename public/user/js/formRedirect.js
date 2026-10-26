export function setupFormRedirect(user) {
    const links = document.querySelectorAll('.redirect-btn');
    links.forEach((link) => {
        link.addEventListener('click', () => {
            const route = link.getAttribute('data-route');
            redirectFormPage(route, user.role);
        });
    });
}

function redirectFormPage(route, role) {
    location.href = role === 'admin' ? `/edit/${route}` : `/form/${route}`;
}
