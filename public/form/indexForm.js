import { themeToggle } from '../js/temas.js';
import { addQuestion, fetchFormQuestions } from './js/manterFormulario.js';
import { captureAndSendQuestions } from './js/sendQuestions.js';
import { getUserData, logout, getCookie } from '../js/api.js';
import { deleteAlternatives } from './js/deleteAlternatives.js';
import { deleteQuestion } from './js/deleteQuestion.js';
import { fillUpModalsInfo } from '../js/userInfo.js';
import { changeTitleAndDescription } from './js/changeTitleAndDescription.js';
import { getQuestions, HandlerRecycleEvents } from './js/recycleQuestions.js';
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

export const questionsRecycle = user.role === 'admin' ? await getQuestions(): []; // questões para copiar de outros formulários

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
    if (questionsRecycle.length >= 1) {
        await HandlerRecycleEvents();
    } else {
        const btnRecycleQuestions = document.getElementById('btnRecycleQuestionForm');
        btnRecycleQuestions.style.display = 'none';
    }
}

const logoutAnchor = document.getElementById('logout-conta');
logoutAnchor.addEventListener('click', logout);

// Enter não deve dar submit acidental (ex.: dentro de inputs do formulário),
// mas precisa continuar ativando botões/links focados — em alguns browsers o
// click do Enter em <button>/<a> é a default action do keypress.
document.addEventListener('keypress', function(event) {
    if (event.key !== 'Enter') return;
    const alvo = event.target;
    if (alvo instanceof Element && alvo.closest('button, a, [role="button"]')) return;
    event.preventDefault();
});

// Tabulação: dentro de #questions-container só repousa no enunciado
// (.question-body) e nos inputs de texto das alternativas (.alternative-input).
// Select de tipo, custom select, radios e botões (↑↓/Remover/X/Adicionar
// Alternativa) são pulados. Fora do container o comportamento é o padrão do
// navegador. Modal aberto => ignora (foco fica com o trap do Bootstrap).
document.addEventListener('keydown', function(event) {
    if (event.key !== 'Tab') return;
    if (document.querySelector('.modal.show')) return;

    const ativo = document.activeElement;
    if (!(ativo instanceof Element) || ativo === document.body) return;

    // Focáveis visíveis e habilitados, na ordem do DOM.
    const todos = [...document.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex]'
    )].filter(el =>
        !el.disabled &&
        el.tabIndex >= 0 &&
        el.getClientRects().length > 0 &&
        !el.closest('#sr-live')
    );

    const permitido = el =>
        !el.closest('#questions-container') ||
        el.matches('.question-body, .alternative-input');

    const inicio = todos.indexOf(ativo);
    if (inicio === -1) return;

    const passo = event.shiftKey ? -1 : 1;
    let destino = null;
    for (let i = inicio + passo; i >= 0 && i < todos.length; i += passo) {
        if (permitido(todos[i])) { destino = todos[i]; break; }
    }

    // Alvo já era o próximo natural (nada pulado) => deixa o padrão do navegador.
    if (!destino || destino === todos[inicio + passo]) return;
    event.preventDefault();
    destino.focus();
});

loadingScreen();

(function () {
    window.onpageshow = function (event) {
        if (event.persisted) {
            window.location.href = '/home';
        }
    };
})();
