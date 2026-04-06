import { adicionaBtnAdicionarForm } from './js/adicionaBtnAdicionarForm.js';
import { animationConfigBarForm } from './js/barraDeConfigAnimation.js';
import { btnVerificaDisponibilidade } from './js/botaoVerificarDisponibilidade.js';
import { adicionaDataInModalArquivar, changeStatus } from './js/changeFormStatus.js';
import { createForm } from './js/createFormHandler.js';
import { setupDashboardRedirect, setupResponseAdminRedirect } from './js/dashboardRedict.js';
import { fetchAcessDelegation } from './js/fetchAcessDelegationUsers.js';
import { handleSalvarButtonClick } from './js/fetchDelegationForm.js';
import { setupFormRedirect } from './js/formRedirect.js';
import { displayForms, displayFormsAgendados, displayFormsDesativados, displayFormsFinalizados } from './js/getFormularios.js';
import { userData } from './js/getUserData.js';
import { loadingScreen } from './js/loadingScreen.js';
import { logout } from './js/logout.js';
import { fillAccessModal, fillUpModalsInfo, showModalAgendamentoInputs } from './js/modals.js';
import { navtabModificador, updatetabsPerUser } from './js/navtab.js';
import { themeToggle } from './js/themeToggle.js';

const user = await userData; // Capturando informações de usuario

// Faz logout
const logoutAnchor = document.getElementById('logout-conta');
logoutAnchor.addEventListener('click', logout);

// Mudança de tema light|dark
themeToggle();

// muda barra de navegação de acordo com usuario
adicionaBtnAdicionarForm();

// limita o acesso de tabs por usuario
updatetabsPerUser();

// Mostra Forms na tela e depois adiciona função de redirecionamento nos botoes dos cards

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

// responsavel por gerenciar a navegação dentro de tabs
navtabModificador();

// Responsavel pela criação de forms atraves do modal
createForm();

fillUpModalsInfo();

// gerenciar acesso de formulario
fetchAcessDelegation();
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
