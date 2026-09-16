import { adicionaBtnAdicionarForm } from './js/adicionaBtnAdicionarForm.js';
import { animationConfigBarForm } from './js/barraDeConfigAnimation.js';
import { btnVerificaDisponibilidade } from './js/botaoVerificarDisponibilidade.js';
import { adicionaDataInModalArquivar, changeStatus } from './js/changeFormStatus.js';
import { createForm } from './js/createFormHandler.js';
import { setupDashboardRedirect, setupResponseAdminRedirect } from './js/dashboardRedict.js';
import { fetchAccessDelegation } from './js/fetchAccessDelegationUsers.js';
import { handleSalvarButtonClick } from './js/fetchDelegationForm.js';
import { setupFormRedirect } from './js/formRedirect.js';
import { displayForms, displayFormsAgendados, displayFormsDesativados, displayFormsFinalizados } from './js/getFormularios.js';
import { getUserData, logout } from '../js/api.js';
import { loadingScreen } from './js/loadingScreen.js';
import { fillAccessModal, fillUpModalsInfo, showModalAgendamentoInputs } from './js/modals.js';
import { navtabModificador, updatetabsPerUser } from './js/navtab.js';
import { themeToggle } from '../js/temas.js';

const user = await getUserData(); // Capturando informações do usuário

// Faz logout
const logoutAnchor = document.getElementById('logout-conta');
logoutAnchor.addEventListener('click', logout);

// Mudança de tema light|dark
themeToggle();

// muda barra de navegação de acordo com o usuário
adicionaBtnAdicionarForm();

// limita o acesso de tabs por usuário
updatetabsPerUser();

// Mostra forms na tela e depois adiciona função de redirecionamento nos botões dos cards

displayForms()
    .then((req, res, next) =>
        user.role === 'admin' ? displayFormsDesativados() : next
    )
    .then(() => displayFormsAgendados())
    .then(() => displayFormsFinalizados())
    .then(() => setupFormRedirect())
    .then(() => changeStatus())
    .then(() => fillAccessModal())
    .then(() => animationConfigBarForm())
    .then(() => btnVerificaDisponibilidade())
    .then(() => adicionaDataInModalArquivar())
    .then(() => setupDashboardRedirect())
    .then(() => setupResponseAdminRedirect());

// responsável por gerenciar a navegação dentro de tabs
navtabModificador();

// Responsável pela criação de forms através do modal
createForm();

fillUpModalsInfo();

// gerenciar acesso do formulário
fetchAccessDelegation();
handleSalvarButtonClick();

// modal de agendamento funções
showModalAgendamentoInputs();

// fecha loading
loadingScreen();

(function () {
    window.onpageshow = function (event) {
        if (event.persisted) {
            window.location.reload();
        }
    };
})();