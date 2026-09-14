import { animationConfigBarForm } from './barraDeConfigAnimation.js';
import { btnVerificaDisponibilidade } from './botaoVerificarDisponibilidade.js';
import {
    adicionaDataInModalArquivar,
    changeStatus,
} from './changeFormStatus.js';
import {
    setupDashboardRedirect,
    setupResponseAdminRedirect,
} from './dashboardRedict.js';
import { fetchCreateForm } from './fetchForms.js';
import { setupFormRedirect } from './formRedirect.js';
import {
    displayForms,
    displayFormsAgendados,
    displayFormsDesativados,
    displayFormsFinalizados,
} from './getFormularios.js';
import { fillAccessModal } from './modals.js';

export function createForm() {
    //  Capture o form do modal
    document
        .getElementById('createForm') // Substitua pelo id do form do modal
        .addEventListener('submit', (ev) => {
            ev.preventDefault();

            const formData = {
                title: document.getElementById('title').value.trim(),
                description: document.getElementById('description').value,
                form_type: document.getElementById('editarFuncao').value, 
                opening_date: new Date(
                    document.getElementById('releaseDate').value
                ),
                expiry_date: new Date(
                    document.getElementById('closeDate').value
                ),
            };

            // Substitua 'errorElementId' pelo id do elemento onde deseja exibir o erro
            const errorElement = document.getElementById('titleError');

            // Lida com o fetch
            fetchCreateForm(formData, errorElement)
                .then(() => {
                    openFormCreated();
                    // Se a resposta for bem-sucedida, manipule os dados recebidos
                    $('#criarFormularioModal').modal('hide');
                })
                .then(() =>
                    displayForms()
                        .then(() => displayFormsDesativados())
                        .then(() => displayFormsAgendados())
                        .then(() => displayFormsFinalizados())
                        .then(() => setupFormRedirect())
                        .then(() => changeStatus())
                        .then(() => fillAccessModal())
                        .then(() => animationConfigBarForm())
                        .then(() => btnVerificaDisponibilidade())
                        .then(() => adicionaDataInModalArquivar())
                        .then(() => setupDashboardRedirect())
                        .then(() => setupResponseAdminRedirect())
                )
                .catch((error) => {
                    // Se ocorrer um erro, manipule-o aqui
                    console.error('Erro ao criar formulário:', error.message);
                });
        });
}

function openFormCreated() {
    const title = document.getElementById('title').value.trim();
    document.cookie = `form=${title}; path=/`; // Set a cookie with the form title
    window.location.href = `/edit/${encodeURIComponent(title)}`; // Redirect to edit page for the newly created form
}
