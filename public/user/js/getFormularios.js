import { fetchActiveForms } from './fetchForms.js';
import { createCardLayout } from './geraCardsForm.js';

export async function displayForms(user, onRendered) {
    const container = document.getElementById('cardContainer');
    renderSkeleton(container);
    try {
        const forms = await fetchActiveForms();
        createCardLayout('cardContainer', forms, user);
        onRendered?.();
    } catch (error) {
        console.error('Error displaying forms:', error);
        renderLoadError(container, () => displayForms(user, onRendered));
    }
}

// Esqueleto de loading no grid (some quando os cards reais renderizam)
function renderSkeleton(container) {
    container.classList.add('grid-container');
    const card = `
        <div class="card grid-item skeleton-card" aria-hidden="true">
            <div class="card-header"></div>
            <div class="card-body">
                <div class="skeleton-body-line w-60"></div>
                <div class="skeleton-body-line"></div>
                <div class="skeleton-body-line w-40"></div>
                <div class="skeleton-btn"></div>
            </div>
        </div>`;
    container.innerHTML = card.repeat(3);
}

// Erro de fetch: card de erro no grid + retry (refaz o fetch e re-liga os cards)
function renderLoadError(container, onRetry) {
    container.innerHTML = `
        <div class="card border-danger mb-3 mt-4">
            <div class="card-body text-danger">
                <h5 class="card-title">
                    <i class="fas fa-exclamation-circle mr-2" aria-hidden="true"></i>
                    Erro ao carregar formulários
                </h5>
                <p class="card-text">Não foi possível buscar os formulários. Verifique sua conexão e tente novamente.</p>
                <button type="button" class="btn btn-primary retry-forms-btn">Tentar novamente</button>
            </div>
        </div>`;
    container.querySelector('.retry-forms-btn').addEventListener('click', onRetry);
}
