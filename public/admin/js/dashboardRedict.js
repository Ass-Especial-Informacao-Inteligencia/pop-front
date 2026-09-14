export function setupDashboardRedirect() {
    const links = document.querySelectorAll('.chart-btn');
    links.forEach((link) => {
        link.addEventListener('click', () => {
            const route = link.getAttribute('data-form');
            document.cookie = `form=${route};`;
            window.location.href = `/dashboard`;
        });
    });
}

export function setupResponseAdminRedirect() {
    const links = document.querySelectorAll('.response-btn');
    links.forEach((link) => {
        link.addEventListener('click', () => {
            const route = link.getAttribute('data-form');
            document.cookie = `form=${route};`;
            window.location.href = `/adminResponse/${route}`;
        });
    });
}