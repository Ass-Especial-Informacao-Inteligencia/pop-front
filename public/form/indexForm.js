import { themeToggle } from './js/temas.js';
import { addQuestion, fetchFormQuestions } from './js/manterFormulario.js';
import { captureAndSendQuestions } from './js/sendQuestions.js';
import { getUserData } from '../js/api.js';
import { logout } from '../js/api.js';
import { deleteAlternatives } from './js/deleteAlternatives.js';
import { deleteQuestion } from './js/deleteQuestion.js';
import { fillUpModalsInfo } from './js/modals.js';
import { changeTittleAndDexcription } from './js/changeTitleAndDescription.js';
import { getCookie } from '../js/api.js';
import { getQuestions, HandlerRecicleEvents } from './js/recicleQuestions.js';
import { loadingScreen } from './js/loadingScreen.js';

// gerencia temas da página
themeToggle();

fillUpModalsInfo();

const user = await getUserData();
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
    changeTittleAndDexcription();
    if (questionsRecicle.length >= 1) {
        await HandlerRecicleEvents();
    } else {
        const btnReclicleQuestions = document.getElementById('btnRecicleQuestionForm');
        btnReclicleQuestions.style.display = 'none';
    }
}

const logoutAnchor = document.getElementById('logout-conta');
logoutAnchor.addEventListener('click', logout);

document.addEventListener('keypress', function(event) {
    if (event.keyCode === 13) {
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
