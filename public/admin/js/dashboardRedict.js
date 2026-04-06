export function setupDashboardRedirect() {
    const links = document.querySelectorAll('.chart-btn');
    links.forEach((link) => {
        link.addEventListener('click', () => {
            const route = link.getAttribute('data-form');
            window.location.href= `/dashboard`;
            document.cookie = `form=${route};`;
        });
    });
}

export function setupResponseAdminRedirect() {
    const links = document.querySelectorAll('.response-btn');
    links.forEach((link) => {
        link.addEventListener('click', () => {
            const route = link.getAttribute('data-form');
            window.location.href= `/adminResponse/${route}`;
            document.cookie = `form=${route};`;
        });
    });
}