import { animationConfigBarForm } from './barraDeConfigAnimation.js';
import { btnVerificaDisponibilidade } from './botaoVerificarDisponibilidade.js';
import { setupDashboardRedirect, setupResponseAdminRedirect } from './dashboardRedirect.js';
import { setupFormRedirect } from './formRedirect.js';
import { mostrarMensagem } from '../../js/geraNotificacao.js';
import {
    displayForms,
    displayFormsAgendados,
    displayFormsDesativados,
    displayFormsFinalizados,
} from './getFormularios.js';
import { fillAccessModal } from './modals.js';
import { api } from '../../js/api.js'; // cliente API centralizada

export function changeStatus(ev) {
    const confirmButton = document.querySelector(
        'button#confirmarArquivarFormulario'
    );
    // Evita listeners duplicados quando changeStatus é reexecutado após refresh das listas
    if (confirmButton.dataset.bound === '1') return;
    confirmButton.dataset.bound = '1';

    confirmButton.addEventListener('click', function (ev) {
        const card = this.parentNode.parentNode.querySelector(
            '.modal-body h5 span'
        );
        if (card) {
            const title = card.innerText;
            const state = card.dataset.state;

            // Só o estado "disabled" (arquivado) é desarquivado (active=true).
            // Ativo, agendado e finalizado vão para Arquivados (active=false,
            // o backend limpa as datas — no agendado isso cancela o agendamento).
            const active = state === 'disabled';

            // Atualiza status do formulário via api centralizada
            api.put('/forms/update', { title, active })
                .then((response) => {
                    if (response.ok) {
                        mostrarMensagem("Formulário Arquivado/Desarquivado com Sucesso","success",5);
                        // Mostra a aba de destino do formulário
                        const tabId = active ? 'ativos-tab' : 'desativados-tab';
                        document.getElementById(tabId)?.click();
                        displayForms()
                            .then(() => displayFormsDesativados())
                            .then(() => displayFormsAgendados())
                            .then(() => displayFormsFinalizados())
                            .then(() => setupFormRedirect())
                            .then(() => fillAccessModal())
                            .then(() => animationConfigBarForm())
                            .then(() => btnVerificaDisponibilidade())
                            .then(() => adicionaDataInModalArquivar())
                            .then(() => setupDashboardRedirect())
                            .then(() => setupResponseAdminRedirect());

                    } else {
                        mostrarMensagem("Falha ao Arquivar/Desarquivar Formulário.","danger",5);
                        console.error('Falha ao atualizar o status.');
                    }
                })
                .catch((error) => {
                    mostrarMensagem("Falha ao Arquivar/Desarquivar Formulário.","danger",5);
                    console.error('Erro durante a requisição:', error);
                });
        }
    });
}

export function adicionaDataInModalArquivar() {
    // Captura todos os botões de arquivamento
    const archiveButtons = document.querySelectorAll('.archive-btn');

    // Adiciona um listener de evento para cada botão
    archiveButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            // Captura os valores dos atributos data
            const formData = button.getAttribute('data-form');
            const activeData = button.getAttribute('data-active');
            const stateData = button.getAttribute('data-state');
            // Define os valores nos elementos do modal
            document.querySelector('.tituloFormArquivarModal').textContent =
                formData;
            const modalTitle = document.querySelector('.tituloFormArquivarModal');
            modalTitle.setAttribute('data-active', activeData);
            modalTitle.setAttribute('data-state', stateData);

            const msg = document.getElementById('msgConfirmacaoArquivar');
            if (msg) {
                if (stateData === 'disabled') {
                    msg.textContent =
                        'Tem certeza de que deseja desarquivar este formulário? Ele voltará para Ativos.';
                } else if (stateData === 'scheduled') {
                    msg.textContent =
                        'Tem certeza de que deseja arquivar este formulário? O agendamento será cancelado e ele irá para Arquivados.';
                } else {
                    msg.textContent =
                        'Tem certeza de que deseja arquivar este formulário?';
                }
            }
        });
    });
}
