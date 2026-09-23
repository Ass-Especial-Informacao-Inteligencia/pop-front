import { animationConfigBarForm } from './barraDeConfigAnimation.js';
import { mostrarMensagem } from '../../js/geraNotificacao.js';
import {
    adicionaDataInModalArquivar,
    changeStatus,
} from './changeFormStatus.js';
import { setupDashboardRedirect, setupResponseAdminRedirect } from './dashboardRedirect.js';
import { fetchFormUpdate, getOneForm } from './fetchForms.js';
import { setupFormRedirect } from './formRedirect.js';
import {
    displayForms,
    displayFormsAgendados,
    displayFormsDesativados,
    displayFormsFinalizados,
} from './getFormularios.js';
import { fillAccessModal } from './modals.js';

export async function btnVerificaDisponibilidade() {
    const buttons = document.querySelectorAll('.clock-btn');
    buttons.forEach((button) => {
        button.addEventListener('click', async () => {
            const card =
                button.parentNode.parentNode.parentNode.querySelector(
                    '.card-body'
                );

            // Define titulo do modal
            const title = card.querySelector('.card-title').textContent;
            document.querySelector('#card-title').textContent = title;

            const form = await getOneForm(title); // Captura info do form escifico
            const opening_date_DB = formatarData(form.opening_date);
            const expiry_date_DB = formatarData(form.expiry_date);

            // Define valor dos inputs
            document.querySelector('#start-date').value = opening_date_DB;
            document.querySelector('#end-date').value = expiry_date_DB;

            document
                .querySelector('#save-schedule')
                .addEventListener('click', async () => {
                    const opening_date =
                        document.querySelector('#start-date').value;
                    const expiry_date =
                        document.querySelector('#end-date').value;

                    const params = {
                        title,
                        opening_date,
                        expiry_date,
                    };
                     // Validar se a data de abertura é antes da data de fechamento
                    if (new Date(opening_date) >= new Date(expiry_date)) {
                        mostrarMensagem('A data de abertura deve ser anterior à data de fechamento.', 'warning', 5);
                        return; // Aborta a requisição se a validação falhar
                    }
                    await fetchFormUpdate(params).then(() =>
                        displayForms()
                            .then(() => displayFormsDesativados())
                            .then(() => displayFormsAgendados())
                            .then(() => displayFormsFinalizados())
                            .then(() => setupFormRedirect())
                            .then(() => changeStatus())
                            .then(() => fillAccessModal())
                            .then(() => animationConfigBarForm())
                            .then(() => adicionaDataInModalArquivar())
                            .then(() => setupDashboardRedirect())
                            .then(() => setupResponseAdminRedirect())
                            
                    );
                    window.location.reload();
                });
        });
    });
}

function formatarData(dataAmericana) {
    if (!dataAmericana) {
        return 'Não há data de fechamento para o formulário';
    }

    // Criar um objeto Date a partir da string de data
    const date = new Date(dataAmericana);

   
    date.setTime(date.getTime());

    // Formatadar a data no formato desejado (yyyy-mm-dd hh:mm:ss)
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    const hour = (`0${date.getHours()}`).slice(-2);
    const minute = (`0${date.getMinutes()}`).slice(-2);
    const second = (`0${date.getSeconds()}`).slice(-2);

    const dataFormatada = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

    return dataFormatada;
}