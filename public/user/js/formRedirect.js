export function setupFormRedirect(user) {
    const cards = document.querySelectorAll('#cardContainer .card');
    cards.forEach((card) => {
        const btn = card.querySelector('.redirect-btn');
        if (!btn) return;
        card.classList.add('card-clickable');
        card.addEventListener('click', (e) => {
            if (e.target.closest('.redirect-btn')) return; // o botão já trata o próprio clique
            redirectFormPage(btn.getAttribute('data-route'), user.role);
        });
        btn.addEventListener('click', () => {
            redirectFormPage(btn.getAttribute('data-route'), user.role);
        });
    });
}

function redirectFormPage(route, role) {
    location.href = role === 'admin' ? `/edit/${route}` : `/form/${route}`;
}
