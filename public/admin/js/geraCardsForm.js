import { escapeHtml } from '../../js/escapeHtml.js';
import { appPath } from '../../js/appPath.js';

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
            window.open(appPath('/admin/getTodayAnswers.html'), '_blank', 'noopener');
        });
    });
}

// Monta o selo e o detalhamento recebidos na listagem administrativa, sem novas consultas ao abrir o painel.
function renderAdminInterviewBadge(card, container, status) {
    const total = Number(card.interview_count);
    if (!['active', 'finished'].includes(status) || card.interview_count == null
        || !Number.isSafeInteger(total) || total < 0) return '';
    const label = `${total} ${total === 1 ? 'entrevista' : 'entrevistas'}`;

    // Mantém o selo simples quando o backend não fornece o detalhamento por entrevistador.
    if (!Array.isArray(card.interviewer_counts)) {
        return `<p class="badge-respondido"><i class="fas fa-clipboard-list" aria-hidden="true"></i> ${label}</p>`;
    }
    const panelId = escapeHtml(`${container}-interviews-${card.id}`);
    const interviewers = card.interviewer_counts.filter((entry) =>
        Number.isSafeInteger(Number(entry.interview_count)) && Number(entry.interview_count) > 0);
    const rows = interviewers.map((entry) => `<li><span>${escapeHtml(entry.name)}</span><strong>${Number(entry.interview_count)}</strong></li>`).join('');

    // Identificadores históricos compartilhados podem contar para mais de um usuário, mas só uma vez no total geral.
    const overlap = interviewers.reduce((sum, entry) => sum + Number(entry.interview_count), 0) > total;
    return `<div class="admin-interview-summary">
        <button type="button" class="badge-respondido admin-interview-trigger" aria-expanded="false" aria-controls="${panelId}" aria-label="${label} — ver totais por entrevistador">
            <i class="fas fa-clipboard-list" aria-hidden="true"></i> ${label}
        </button>
        <section id="${panelId}" class="admin-interview-panel" aria-label="Entrevistas por entrevistador" tabindex="0" hidden>
            <h6>Entrevistas por entrevistador</h6>
            <p class="admin-interview-period">Todo o período do formulário</p>
            ${rows ? `<ul>${rows}</ul>` : '<p>Nenhuma entrevista registrada.</p>'}
            ${overlap ? '<p class="admin-interview-period">Há entrevistas vinculadas a mais de um usuário no histórico; a soma individual pode superar o total.</p>' : ''}
        </section>
    </div>`;
}

let activeInterviewDetails = null;
let interviewDetailsListenersBound = false;

function bindInterviewDetails(container) {
    // Descarta a referência ao painel anterior quando os cards são recriados por uma atualização da listagem.
    if (activeInterviewDetails && !activeInterviewDetails.element.isConnected) {
        activeInterviewDetails.close();
    }

    container.querySelectorAll('.admin-interview-summary').forEach((summary) => {
        const trigger = summary.querySelector('.admin-interview-trigger');
        const panel = summary.querySelector('.admin-interview-panel');
        const card = summary.closest('.card');
        let wasOpenOnPointerDown = false;
        const close = () => {
            panel.hidden = true;
            trigger.setAttribute('aria-expanded', 'false');
            card.classList.remove('interview-details-open');
            if (activeInterviewDetails?.element === summary) activeInterviewDetails = null;
        };
        const show = () => {
            if (!panel.hidden) return;
            // Só um painel permanece aberto, mantendo a visibilidade e o estado acessível sincronizados.
            activeInterviewDetails?.close();
            panel.hidden = false;
            trigger.setAttribute('aria-expanded', 'true');
            card.classList.add('interview-details-open');
            activeInterviewDetails = { element: summary, trigger, close };
        };

        summary.addEventListener('pointerenter', (event) => {
            if (event.pointerType !== 'touch') show();
        });

        summary.addEventListener('pointerleave', () => {
            // A saída do mouse não fecha o conteúdo enquanto o usuário navega nele pelo teclado.
            if (!summary.contains(document.activeElement)) close();
        });

        summary.addEventListener('focusin', show);
        summary.addEventListener('focusout', (event) => {
            if (!summary.contains(event.relatedTarget)) close();
        });
        // Guarda o estado antes do foco automático do toque para o primeiro clique não fechar o painel recém-aberto.
        trigger.addEventListener('pointerdown', () => { wasOpenOnPointerDown = !panel.hidden; });
        trigger.addEventListener('click', (event) => {
            if (event.detail === 0 || !wasOpenOnPointerDown) show();
            else close();
        });
    });
    // Os eventos globais são registrados uma única vez, mesmo ao carregar outras abas ou recriar os cards.
    if (interviewDetailsListenersBound) return;
    interviewDetailsListenersBound = true;
    document.addEventListener('pointerdown', (event) => {
        if (activeInterviewDetails && !activeInterviewDetails.element.contains(event.target)) {
            activeInterviewDetails.close();
        }
    });
    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape' || !activeInterviewDetails) return;
        const details = activeInterviewDetails;
        if (details.element.contains(document.activeElement)) details.trigger.focus();
        details.close();
    });
}

export function createCardLayout(container, data, user, status = 'active', respondidos = null) {
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
                        ${renderAdminInterviewBadge(card, container, status)}
                        <div class="admin-card-actions">
                            <div class="btn-group" role="group" aria-label="Botões de Ação">
                                <button data-route="${title}" class="redirect-btn btn btn-primary">Visualizar</button>
                                <button class="config-btn btn btn-secondary" title="Configurações Avançadas" aria-label="Configurações Avançadas — ${title}" aria-expanded="false" aria-controls="config-footer-${title.replace(/\s+/g, '-')}"><i class="fas fa-cog" aria-hidden="true"></i></button>
                            </div>
                            <button class="open-new-tab-btn btn btn-secondary" title="Abrir em nova aba" aria-label="Abrir em nova aba — ${title}">
                                <i class="fas fa-external-link-alt" aria-hidden="true"></i>
                            </button>
                        </div>
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
        bindInterviewDetails(cardContainer);
        return;
    }

    data.forEach((card) => {
        const title = escapeHtml(card.title);
        const description = escapeHtml(card.description);
        const expiry = formatarCurta(card.expiry_date);
        // O mapa traz o total de entrevistas; aceita Set de ids para compatibilidade com histórico sem contagem.
        const respondido = respondidos?.has(card.id) === true;
        const totalEntrevistas = Number(respondidos?.get?.(card.id));
        cardContainer.innerHTML += `
            <div class="card grid-item" data-form-id="${card.id}"${respondido ? ' data-respondido="true"' : ''}>
                <div class="card-header" data-status="${status}"></div>
                <div class="card-body" data-status="${card.active === true ? 'active' : 'disable'}">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${description}</p>
                    ${respondido ? `<p class="badge-respondido"><i class="fas fa-check" aria-hidden="true"></i> Respondido${Number.isSafeInteger(totalEntrevistas) && totalEntrevistas > 0 ? ` · ${totalEntrevistas}` : ''}</p>` : ''}
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
