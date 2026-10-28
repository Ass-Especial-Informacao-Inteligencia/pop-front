import { fetchActiveForms, fetchAnsweredForms } from './fetchForms.js';
import { createCardLayout } from './geraCardsForm.js';
import { initCustomSelect } from '../../js/components/customSelect.js';
import { alternarFiltroStatus } from './filtroStatus.js';

// Ordem em que o back devolveu (updated_at DESC) — usada pelo critério "Mais recentes"
let ordemOriginal = [];
// Ids dos forms que o usuário já respondeu; null = o /forms/answered falhou (a home degrada sem selo e sem filtro)
let idsRespondidos = null;

export async function displayForms(user, onRendered) {
    const container = document.getElementById('cardContainer');
    renderSkeleton(container);
    try {
        // Histórico é opcional: só o /forms/active derruba a página; falha no /forms/answered degrada (sem selo, filtro some)
        const [ativos, historico] = await Promise.allSettled([fetchActiveForms(), fetchAnsweredForms()]);
        if (ativos.status === 'rejected') throw ativos.reason;
        idsRespondidos = historico.status === 'fulfilled' ? new Set(historico.value.map((f) => f.id)) : null;
        alternarFiltroStatus(idsRespondidos !== null);
        createCardLayout('cardContainer', ativos.value, user, 'active', idsRespondidos);
        ordemOriginal = Array.from(container.querySelectorAll('.card.grid-item'));
        reaplicarOrdenacao(container);
        reaplicarBuscaEFiltro();
        onRendered?.();
    } catch (error) {
        console.error('Error displaying forms:', error);
        renderLoadError(container, () => displayForms(user, onRendered));
    }
}

export function initOrdenacao() {
    const select = document.getElementById('sortSelect');
    if (!select) return;
    initCustomSelect(select);
    select.addEventListener('change', () => ordenarCards(document.getElementById('cardContainer'), select.value));
}

// Reordena os nós existentes (append move sem recriar — busca, d-none e handlers sobrevivem)
function ordenarCards(container, criterio) {
    const cards = Array.from(container.querySelectorAll('.card.grid-item'));
    if (cards.length === 0) return;

    let ordenados;
    if (criterio === 'az') {
        ordenados = cards.sort((a, b) => tituloCard(a).localeCompare(tituloCard(b), 'pt-BR'));
    } else if (criterio === 'za') {
        ordenados = cards.sort((a, b) => tituloCard(b).localeCompare(tituloCard(a), 'pt-BR'));
    } else {
        const posicao = new Map(ordemOriginal.map((no, i) => [no, i]));
        ordenados = cards.sort((a, b) => (posicao.get(a) ?? 0) - (posicao.get(b) ?? 0));
    }
    container.append(...ordenados);
}

function tituloCard(card) {
    return card.querySelector('.card-title')?.textContent ?? '';
}

// Cards podem re-renderizar (retry) — mantém o critério escolhido, não volta pro padrão
function reaplicarOrdenacao(container) {
    const select = document.getElementById('sortSelect');
    if (select && select.value !== 'recentes') ordenarCards(container, select.value);
}

// Retry re-renderiza os cards por baixo da busca/filtro ativos — reexecuta a regra de visibilidade senão tudo volta à mostra
function reaplicarBuscaEFiltro() {
    const input = document.getElementById('searchInput');
    if (!input) return;
    input.dispatchEvent(new Event('input', { bubbles: true }));
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
