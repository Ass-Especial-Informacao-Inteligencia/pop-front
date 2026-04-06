import { animationConfigBarForm } from './barraDeConfigAnimation.js';
import { btnVerificaDisponibilidade } from './botaoVerificarDisponibilidade.js';
import { setupDashboardRedirect, setupResponseAdminRedirect } from './dashboardRedict.js';
import { setupFormRedirect } from './formRedirect.js';
import { mostrarMensagem } from './geraNotificacao.js';
import {
    displayForms,
    displayFormsAgendados,
    displayFormsDesativados,
    displayFormsFinalizados,
} from './getFormularios.js';
import { fillAccessModal } from './modals.js';

export function changeStatus(ev) {
    const disableButton = document.querySelector(
        'button#confirmarArquivarFormulario'
    );

    disableButton.addEventListener('click', function (ev) {
        const card = this.parentNode.parentNode.querySelector(
            '.modal-body h5 span'
        );
        // console.log(card);
        if (card) {
            const title = card.innerText;
            const status = card.dataset.active; // ou true ou false
            
            let active = status === 'true' ? false : true;
        
            fetch('/forms/update', {
                method: 'PUT',
                body: JSON.stringify({ title, active }),
                headers: { 'Content-Type': 'application/json' },
            })
                .then((response) => {
                    if (response.ok) {
                        mostrarMensagem("Formulário Arquivado/Desarquivado com Sucesso","success",5);
                        displayForms()
                            .then(() => displayFormsDesativados())
                            .then(() => displayFormsAgendados())
                            .then(() => displayFormsFinalizados())
                            .then(() => setupFormRedirect())
                            // .then(() => changeStatus())
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
            // Define os valores nos elementos do modal
            document.querySelector('.tituloFormArquivarModal').textContent =
                formData;
            document
                .querySelector('.tituloFormArquivarModal')
                .setAttribute('data-active', activeData);
        });
    });
}
