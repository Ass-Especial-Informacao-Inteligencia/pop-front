import { fillUpModalsInfo } from '../js/userInfo.js';
import { themeToggle } from '../js/temas.js';
import { logout, getCookie } from '../js/api.js';
import { fetchResponsesForFormGraphics } from './js/fetchAnswersForForm.js';
import { MainEditGraphicsAndTables } from './js/handlerDashboardActions.js';
import { mostrarMensagem } from './js/geraNotificacao.js';
import { loadingScreen } from '../js/loadingScreen.js';
import { renderLoadingScreen } from '../js/components/loadingScreen.js';
import { renderThemeToggle } from '../js/components/themeToggle.js';
import { renderFooter } from '../js/components/footer.js';
import { renderProfileModal } from '../js/components/profileModal.js';
import { renderNavbar } from '../js/components/navbar.js';

// Injeta navbar
document.getElementById('navbarPlaceholder').innerHTML = renderNavbar({
    role: 'admin',
    activeTab: 'home',
    logoPath: './src/',
    showSearch: false,
    searchPlaceholder: ''
});

// Injeta componentes compartilhados
document.getElementById('sharedComponents').innerHTML =
    renderThemeToggle() + renderFooter('./') + renderLoadingScreen();
document.getElementById('perfilModalPlaceholder').innerHTML = renderProfileModal({ isAdmin: true });

// Faz logout
const logoutAnchor = document.getElementById('logout-conta');
logoutAnchor.addEventListener('click', logout);


function hasValidFormData(formData) {
  if (!formData || typeof formData !== 'object') return false;
  if (!formData.Answers || !formData.Questions) return false;
  return (
    Object.keys(formData).length >= 1 &&
    Object.keys(formData.Answers).length >= 1 &&
    (Array.isArray(formData.Questions) ? formData.Questions.length >= 1 : Object.keys(formData.Questions).length >= 1)
  );
}

const tituloFormulario = document.querySelector('.tituloFormulario');
tituloFormulario.innerText = getCookie('form');

// adiciona info no modal de alterar perfil
fillUpModalsInfo();

// gerencia temas da página
themeToggle();

// pega as respostas baseado no formulário para análise de dados
export const formData = await fetchResponsesForFormGraphics(getCookie('form'));

hasValidFormData(formData) ? MainEditGraphicsAndTables() : mostrarMensagem("Nenhuma Resposta Cadastrada!", "danger", 10); // criação de manipulação de gráficos e tabelas

loadingScreen(); // desativa a loading screen
