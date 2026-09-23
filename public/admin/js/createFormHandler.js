import { animationConfigBarForm } from './barraDeConfigAnimation.js';
import { btnVerificaDisponibilidade } from './botaoVerificarDisponibilidade.js';
import {
    adicionaDataInModalArquivar,
    changeStatus,
} from './changeFormStatus.js';
import {
    setupDashboardRedirect,
    setupResponseAdminRedirect,
} from './dashboardRedirect.js';
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
    document
        .getElementById('createForm')
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

            const errorElement = document.getElementById('titleError');

            fetchCreateForm(formData, errorElement)
                .then(() => {
                    openFormCreated();
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
                    console.error('Erro ao criar formulário:', error.message);
                });
        });
}

function openFormCreated() {
    const title = document.getElementById('title').value.trim();
    document.cookie = `form=${title}; path=/`; // Set a cookie with the form title
    window.location.href = `/edit/${encodeURIComponent(title)}`; // Redirect to edit page for the newly created form
}
