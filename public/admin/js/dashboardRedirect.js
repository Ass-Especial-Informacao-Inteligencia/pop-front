import { appPath } from '../../js/appPath.js';

export function setupDashboardRedirect() {
    const links = document.querySelectorAll('.chart-btn');
    links.forEach((link) => {
        link.addEventListener('click', () => {
            const route = link.getAttribute('data-form');
            const secure = location.protocol === 'https:' ? '; Secure' : '';
            document.cookie = `form=${encodeURIComponent(route)}; Path=${appPath()}; SameSite=Lax${secure}`;
            window.location.href = appPath('/dashboard');
        });
    });
}

export function setupResponseAdminRedirect() {
    const links = document.querySelectorAll('.response-btn');
    links.forEach((link) => {
        link.addEventListener('click', () => {
            const route = link.getAttribute('data-form');
            window.location.href = appPath(`/adminResponse/${encodeURIComponent(route)}`);
        });
    });
}