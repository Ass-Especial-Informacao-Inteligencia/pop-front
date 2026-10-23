import { fillUpModalsInfo } from '../js/userInfo.js';
import { themeToggle } from '../js/temas.js';
import { logout, getCookie } from '../js/api.js';
import { fetchResponsesForFormGraphics } from './js/fetchAnswersForForm.js';
import { MainEditGraphicsAndTables } from './js/handlerDashboardActions.js';
import { mostrarMensagem } from '../js/geraNotificacao.js';
import { loadingScreen } from '../js/loadingScreen.js';
import { renderLoadingScreen } from '../js/components/loadingScreen.js';
import { renderThemeToggle } from '../js/components/themeToggle.js';
import { renderFooter } from '../js/components/footer.js';
import { renderProfileModal } from '../js/components/profileModal.js';
import { renderNavbar } from '../js/components/navbar.js';
import { renderCookieBanner, iniciarCookieBanner } from '../js/components/cookieBanner.js';
import { ativarTabTeclado } from '../admin/js/navtab.js';
import { ativarFocusLoop } from '../js/focusLoop.js';

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
    renderThemeToggle() + renderFooter('./') + renderLoadingScreen() + renderCookieBanner();
iniciarCookieBanner();
document.getElementById('perfilModalPlaceholder').innerHTML = renderProfileModal({ isAdmin: true });

// Abas do dashboard em padrão ARIA (roving tabindex + ←/→/Home/End), reaproveitando o mesmo comportamento da home admin
ativarTabTeclado('#myTab');
ativarTabTeclado('#graphicsTab');

// Loop de Tab espelhando a home admin: barra de abas (parada única, na aba ativa) → conteúdo → download → gráficos/tabelas → × do aviso, se aparecer → volta pra barra. Escopo é o #conteudo inteiro porque o dashboard tem 2 grupos de abas com o select de download intercalado (diferente da home, onde barra+conteúdo bastam). Navbar, footer e themeToggle ficam fora (alcançáveis na entrada, com mouse/F6).
ativarFocusLoop(['#conteudo', '#container-alertas']);

// Tooltips dos ícones de ajuda: inicializa (antes nenhum .tooltip() era chamado, o texto só aparecia no hover nativo) e espelha cada explicação num sr-only — o ícone é aria-hidden, então sem isso o leitor de tela nunca ouve o texto.
document.querySelectorAll('[data-toggle="tooltip"]').forEach((icone) => {
    const texto = icone.getAttribute('title');
    if (texto) {
        const oculto = document.createElement('span');
        oculto.className = 'sr-only';
        oculto.textContent = texto;
        icone.insertAdjacentElement('afterend', oculto);
    }
    window.jQuery(icone).tooltip();
});

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
