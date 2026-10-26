// Gera os cards de formulário nas abas (ativos/desativados/agendados/finalizados).
// Contrato DOM com outros módulos: .card com data-status, .archive-btn,
// .open-new-tab-btn e .form-redirect — consumidos por querySelector em
// changeFormStatus, formRedirect e dashboardRedirect. Não renomear sem revisar esses arquivos.
function buildEmptyState() {
    return `
        <div class="card border-primary mb-3 mt-4">
            <div class="card-body text-primary">
                <h5 class="card-title">
                    <i class="fas fa-exclamation-triangle mr-2" aria-hidden="true"></i>
                    Nenhum formulário disponível
                </h5>
                <p class="card-text">Infelizmente, não há formulários disponíveis no momento.</p>
            </div>
        </div>
    `;
}

function bindOpenAnswersPage() {
    document.querySelectorAll('.open-new-tab-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            window.open('/admin/getTodayAnswers.html', '_blank');
        });
    });
}

// Escapa HTML antes de interpolar em atributos/texto dos cards (título/descrição vêm do backend).
function escapeHtml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export function createCardLayout(container, data, user, status = 'active') {
    const cardContainer = document.getElementById(container);
    cardContainer.innerHTML = '';

    if (data.length === 0) {
        cardContainer.innerHTML = buildEmptyState();
        return;
    }

    cardContainer.classList.add('grid-container');

    if (user.role === 'admin') {
        data.forEach((card) => {
            const title = escapeHtml(card.title);
            const description = escapeHtml(card.description);
            cardContainer.innerHTML += `
                <div class="card grid-item">
                    <div class="card-header" data-status="${status}"></div>
                    <div class="card-body" data-status="${card.active === true ? 'active' : 'disable'}">
                        <h5 class="card-title">${title}</h5>
                        <p class="card-text">${description}</p>
                        <div class="btn-group" role="group" aria-label="Botões de Ação">
                            <button data-route="${title}" class="redirect-btn btn btn-primary">Visualizar</button>
                            <button class="config-btn btn btn-secondary" title="Configurações Avançadas" aria-label="Configurações Avançadas — ${title}" aria-expanded="false" aria-controls="config-footer-${title.replace(/\s+/g, '-')}"><i class="fas fa-cog" aria-hidden="true"></i></button>
                        </div>
                        <button class="open-new-tab-btn btn btn-secondary" title="Abrir em nova aba" aria-label="Abrir em nova aba — ${title}">
                            <i class="fas fa-external-link-alt" aria-hidden="true"></i>
                        </button>
                    </div>
                    <div class="card-footer p-1 d-none" id="config-footer-${title.replace(/\s+/g, '-')}">
                        ${status !== 'finished' ? `<button class="archive-btn btn btn-danger float-right" data-toggle="modal" data-target="#arquivarFormularioModal" data-form="${title}" data-active="${card.active}" data-state="${status}" title="Arquivar Formulário" aria-label="Arquivar Formulário — ${title}"><i class="fas fa-archive" aria-hidden="true"></i></button>` : ''}
                        <div class="float-left btn-group">
                            <button class="permission-btn btn btn-secondary" data-toggle="modal" data-form="${title}" data-target="#accessModal" title="Gerenciar Acesso" aria-label="Gerenciar Acesso — ${title}"><i class="fas fa-user-plus" aria-hidden="true"></i></button>
                            <button class="clock-btn btn btn-secondary" data-toggle="modal" data-target="#agendarModal" data-form="${title}" title="Agendar Disponibilidade" aria-label="Agendar Disponibilidade — ${title}"><i class="fas fa-clock" aria-hidden="true"></i></button>
                            <button class="chart-btn btn btn-primary" title="Dashboard" data-form="${title}" aria-label="Dashboard — ${title}"><i class="fas fa-chart-bar" aria-hidden="true"></i></button>
                            <button class="response-btn btn btn-success" title="Cadastrar Resposta" data-form="${title}" aria-label="Cadastrar Resposta — ${title}"><i class="fas fa-clipboard-list" aria-hidden="true"></i></button>
                        </div>
                    </div>
                </div>
            `;
        });

        bindOpenAnswersPage();
        return;
    }

    data.forEach((card) => {
        const title = escapeHtml(card.title);
        const description = escapeHtml(card.description);
        const expiry = formatarCurta(card.expiry_date);
        cardContainer.innerHTML += `
            <div class="card grid-item">
                <div class="card-header" data-status="${status}"></div>
                <div class="card-body" data-status="${card.active === true ? 'active' : 'disable'}">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${description}</p>
                    ${expiry ? `<p class="badge-disponibilidade">Disponível até ${expiry}</p>` : ''}
                    <button data-route="${title}" class="redirect-btn btn btn-primary">Cadastrar Resposta</button>
                </div>
            </div>
        `;
    });
}

// DD/MM direto da string ISO (sem Date/timezone — evita off-by-one); null se não houver expiry
function formatarCurta(iso) {
    if (!iso) return null;
    const [ano, mes, dia] = String(iso).split('T')[0].split('-');
    if (!ano || !mes || !dia) return null;
    return `${dia}/${mes}`;
}

export function createCardDesactiveLayout(data, status = 'disabled') {
    const cardContainer = document.getElementById('cardDesativadosContainer');
    cardContainer.innerHTML = '';

    if (data.length === 0) {
        cardContainer.innerHTML = buildEmptyState();
        return;
    }

    cardContainer.classList.add('grid-container');

    data.forEach((card) => {
        const title = escapeHtml(card.title);
        const description = escapeHtml(card.description);
        cardContainer.innerHTML += `
            <div class="card grid-item">
                <div class="card-header" data-status="${status}"></div>
                <div class="card-body" data-status="${card.active === true ? 'active' : 'disable'}">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${description}</p>
                    <div class="btn-group" role="group" aria-label="Botões de Ação">
                        <button data-route="${title}" class="redirect-btn btn btn-primary">Visualizar</button>
                        <button class="config-btn btn btn-secondary" title="Configurações Avançadas" aria-label="Configurações Avançadas — ${title}" aria-expanded="false" aria-controls="config-footer-${title.replace(/\s+/g, '-')}"><i class="fas fa-cog" aria-hidden="true"></i></button>
                    </div>
                </div>
                <div class="card-footer p-1 d-none" id="config-footer-${title.replace(/\s+/g, '-')}">
                    <button class="archive-btn btn btn-danger float-right" data-toggle="modal" data-target="#arquivarFormularioModal" data-form="${title}" data-active="${card.active}" data-state="${status}" title="Arquivar Formulário" aria-label="Arquivar Formulário — ${title}"><i class="fas fa-archive" aria-hidden="true"></i></button>
                    <div class="float-left btn-group">
                        <button class="permission-btn btn btn-secondary" data-toggle="modal" data-form="${title}" data-target="#accessModal" title="Gerenciar Acesso" aria-label="Gerenciar Acesso — ${title}"><i class="fas fa-user-plus" aria-hidden="true"></i></button>
                        <button class="clock-btn btn btn-secondary" data-toggle="modal" data-target="#agendarModal" data-form="${title}" title="Agendar Disponibilidade" aria-label="Agendar Disponibilidade — ${title}"><i class="fas fa-clock" aria-hidden="true"></i></button>
                        <button class="chart-btn btn btn-primary" title="Dashboard" data-form="${title}" aria-label="Dashboard — ${title}"><i class="fas fa-chart-bar" aria-hidden="true"></i></button>
                        <button class="response-btn btn btn-success" title="Cadastrar Resposta" data-form="${title}" aria-label="Cadastrar Resposta — ${title}"><i class="fas fa-clipboard-list" aria-hidden="true"></i></button>
                    </div>
                </div>
            </div>
        `;
    });
}
