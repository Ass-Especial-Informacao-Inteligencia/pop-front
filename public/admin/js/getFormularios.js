import {
    fetchActiveForms,
    fetchDeactivatedForms,
    fetchFormsAgendados,
    fetchFormsFinalizados,
} from './fetchForms.js';
import {
    createCardDesactiveLayout,
    createCardLayout,
} from './geraCardsForm.js';
import { getUserData } from '../../js/api.js';

export async function displayForms() {
    const containerId = 'cardContainer';
    renderSkeleton(containerId);
    try {
        const user = await getUserData();
        const forms = await fetchActiveForms();
        createCardLayout(containerId, forms, user, 'active');
        reaplicarBusca();
    } catch (error) {
        console.error('Error displaying forms:', error);
        renderLoadError(containerId, displayForms);
    }
}

export async function displayFormsDesativados() {
    const containerId = 'cardDesativadosContainer';
    renderSkeleton(containerId);
    try {
        const forms = await fetchDeactivatedForms();
        createCardDesactiveLayout(forms, 'disabled');
        reaplicarBusca();
    } catch (error) {
        console.error('Error displaying forms:', error);
        renderLoadError(containerId, displayFormsDesativados);
    }
}

export async function displayFormsAgendados() {
    const containerId = 'cardAgendadosContainer';
    renderSkeleton(containerId);
    try {
        const user = await getUserData();
        const forms = await fetchFormsAgendados();
        createCardLayout(containerId, forms, user, 'scheduled');
        reaplicarBusca();
    } catch (error) {
        console.error('Error displaying forms:', error);
        renderLoadError(containerId, displayFormsAgendados);
    }
}

export async function displayFormsFinalizados() {
    const containerId = 'cardFinalizadosContainer';
    renderSkeleton(containerId);
    try {
        const user = await getUserData();
        const forms = await fetchFormsFinalizados();
        createCardLayout(containerId, forms, user, 'finished');
        reaplicarBusca();
    } catch (error) {
        console.error('Error displaying forms:', error);
        renderLoadError(containerId, displayFormsFinalizados);
    }
}

// Retry re-renderiza os cards por baixo de uma busca ativa — dispara o input pra re-ligar o filtro
function reaplicarBusca() {
    document.getElementById('searchInput')?.dispatchEvent(new Event('input', { bubbles: true }));
}

// Esqueleto de loading no grid (some quando os cards reais renderizam)
function renderSkeleton(containerId) {
    const container = document.getElementById(containerId);
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

// Erro de fetch: card de erro no grid + retry (refaz só o fetch desta aba)
function renderLoadError(containerId, onRetry) {
    const container = document.getElementById(containerId);
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
