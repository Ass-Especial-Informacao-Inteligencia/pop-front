function buildEmptyState() {
    return `
        <div class="card border-primary mb-3 mt-4">
            <div class="card-body text-primary">
                <h5 class="card-title">
                    <i class="fas fa-exclamation-triangle mr-2"></i>
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
            cardContainer.innerHTML += `
                <div class="card grid-item">
                    <div class="card-header" data-status="${status}"></div>
                    <div class="card-body" data-status="${card.active === true ? 'active' : 'disable'}">
                        <h5 class="card-title">${card.title}</h5>
                        <p class="card-text">${card.description}</p>
                        <div class="btn-group" role="group" aria-label="Botões de Ação">
                            <button data-route="${card.title}" class="redirect-btn btn btn-primary">Visualizar</button>
                            <button class="config-btn btn btn-secondary" title="Configurações Avançadas"><i class="fas fa-cog"></i></button>
                        </div>
                        <button class="open-new-tab-btn btn btn-secondary" title="Abrir em nova aba">
                            <i class="fas fa-external-link-alt"></i>
                        </button>
                    </div>
                    <div class="card-footer p-1 d-none">
                        <button class="archive-btn btn btn-danger float-right" data-toggle="modal" data-target="#arquivarFormularioModal" data-form="${card.title}" data-active="${card.active}" title="Arquivar Formulário"><i class="fas fa-archive"></i></button>
                        <div class="float-left btn-group">
                            <button class="permission-btn btn btn-secondary" id="permission-btn" data-toggle="modal" data-form="${card.title}" data-target="#accessModal" title="Gerenciar Acesso"><i class="fas fa-user-plus"></i></button>
                            <button class="clock-btn btn btn-secondary" data-toggle="modal" data-target="#agendarModal" data-form="${card.title}" title="Agendar Disponibilidade" id="agendarDisponibilidadeBtn"><i class="fas fa-clock"></i></button>
                            <button class="chart-btn btn btn-primary" title="Dashboard" data-form="${card.title}"><i class="fas fa-chart-bar"></i></button>
                            <button class="response-btn btn btn-success" title="Cadastrar Resposta" data-form="${card.title}"><i class="fas fa-clipboard-list"></i></button>
                        </div>
                    </div>
                </div>
            `;
        });

        bindOpenAnswersPage();
        return;
    }

    data.forEach((card) => {
        cardContainer.innerHTML += `
            <div class="card grid-item">
                <div class="card-header" data-status="${status}"></div>
                <div class="card-body" data-status="${card.active === true ? 'active' : 'disable'}">
                    <h5 class="card-title">${card.title}</h5>
                    <p class="card-text">${card.description}</p>
                    <button data-route="${card.title}" class="redirect-btn btn btn-primary">Cadastrar Resposta</button>
                </div>
            </div>
        `;
    });
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
        cardContainer.innerHTML += `
            <div class="card grid-item">
                <div class="card-header" data-status="${status}"></div>
                <div class="card-body" data-status="${card.active === true ? 'active' : 'disable'}">
                    <h5 class="card-title">${card.title}</h5>
                    <p class="card-text">${card.description}</p>
                    <div class="btn-group" role="group" aria-label="Botões de Ação">
                        <button data-route="${card.title}" class="redirect-btn btn btn-primary">Visualizar</button>
                        <button class="config-btn btn btn-secondary" title="Configurações Avançadas"><i class="fas fa-cog"></i></button>
                    </div>
                </div>
                <div class="card-footer p-1 d-none">
                    <button class="archive-btn btn btn-danger float-right" data-toggle="modal" data-target="#arquivarFormularioModal" data-form="${card.title}" data-active="${card.active}" title="Arquivar Formulário"><i class="fas fa-archive"></i></button>
                    <div class="float-left btn-group">
                        <button class="permission-btn btn btn-secondary" id="permission-btn" data-toggle="modal" data-form="${card.title}" data-target="#accessModal" title="Gerenciar Acesso"><i class="fas fa-user-plus"></i></button>
                        <button class="clock-btn btn btn-secondary" data-toggle="modal" data-target="#agendarModal" data-form="${card.title}" title="Agendar Disponibilidade" id="agendarDisponibilidadeBtn"><i class="fas fa-clock"></i></button>
                        <button class="chart-btn btn btn-primary" title="Dashboard" data-form="${card.title}"><i class="fas fa-chart-bar"></i></button>
                        <button class="response-btn btn btn-success" title="Cadastrar Resposta" data-form="${card.title}"><i class="fas fa-clipboard-list"></i></button>
                    </div>
                </div>
            </div>
        `;
    });
}
