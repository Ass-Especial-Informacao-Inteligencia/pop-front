import { themeToggle } from '../js/temas.js';
import { addQuestion, fetchFormQuestions } from './js/manterFormulario.js';
import { captureAndSendQuestions } from './js/sendQuestions.js';
import { getUserData, logout, getCookie } from '../js/api.js';
import { deleteAlternatives } from './js/deleteAlternatives.js';
import { deleteQuestion } from './js/deleteQuestion.js';
import { fillUpModalsInfo } from '../js/userInfo.js';
import { changeTitleAndDescription } from './js/changeTitleAndDescription.js';
import { getQuestions, HandlerRecicleEvents } from './js/recicleQuestions.js';
import { loadingScreen } from '../js/loadingScreen.js';
import { renderLoadingScreen } from '../js/components/loadingScreen.js';
import { renderThemeToggle } from '../js/components/themeToggle.js';
import { renderFooter } from '../js/components/footer.js';
import { renderProfileModal } from '../js/components/profileModal.js';
import { renderNavbar } from '../js/components/navbar.js';

const user = await getUserData();
const isAdmin = user.role === 'admin';

// Injeta navbar
document.getElementById('navbarPlaceholder').innerHTML = renderNavbar({
    role: user.role,
    activeTab: 'home',
    logoPath: '../src/',
    showSearch: false,
    searchPlaceholder: ''
});

// Injeta componentes compartilhados
document.getElementById('sharedComponents').innerHTML =
    renderThemeToggle() + renderFooter('../') + renderLoadingScreen();
document.getElementById('perfilModalPlaceholder').innerHTML =
    renderProfileModal({ isAdmin });

// gerencia temas da página
themeToggle();

fillUpModalsInfo();

export const questionsRecicle = user.role === 'admin' ? await getQuestions(): []; // questões para copiar de outros formulários

if (user.role === 'admin') {
    const addButton = document.querySelector('.addQuestion');
    const formName = getCookie('form');
    addButton.addEventListener('click', function () {
        addQuestion();
    });

    await fetchFormQuestions(formName);

    document
        .querySelector('.btn.btn-success.mr-2')
        .addEventListener('click', async (ev) => {
            ev.preventDefault();
            await captureAndSendQuestions();
        });

    deleteAlternatives();
    await deleteQuestion();
    changeTitleAndDescription();
    if (questionsRecicle.length >= 1) {
        await HandlerRecicleEvents();
    } else {
        const btnRecycleQuestions = document.getElementById('btnRecicleQuestionForm');
        btnRecycleQuestions.style.display = 'none';
    }
}

const logoutAnchor = document.getElementById('logout-conta');
logoutAnchor.addEventListener('click', logout);

document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
});

loadingScreen();

(function () {
    window.onpageshow = function (event) {
        if (event.persisted) {
            window.location.href = '/home';
        }
    };
})();
