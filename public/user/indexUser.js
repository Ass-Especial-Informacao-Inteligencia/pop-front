import { updateUserNav } from './js/modificaNavBar.js';
import { fillUpModalsInfo } from '../js/userInfo.js';
import { setupFormRedirect } from './js/formRedirect.js';
import { displayForms, initOrdenacao } from './js/getFormularios.js';
import { getUserData, logout } from '../js/api.js';
import { themeToggle } from '../js/temas.js';
import { loadingScreen } from '../js/loadingScreen.js';
import { renderLoadingScreen } from '../js/components/loadingScreen.js';
import { renderThemeToggle } from '../js/components/themeToggle.js';
import { renderFooter } from '../js/components/footer.js';
import { renderProfileModal } from '../js/components/profileModal.js';
import { renderNavbar } from '../js/components/navbar.js';
import { renderCookieBanner, iniciarCookieBanner } from '../js/components/cookieBanner.js';
import { ativarFocusLoop } from '../js/focusLoop.js';

// Guarda de auth na própria tela: sem sessão válida (mesmo após refresh-token) → login. Antes: acesso direto sem sessão crashava o module e deixava a página semi-vazia.
let user;
try {
    user = await getUserData();
} catch {
    window.location.replace('/sign/index.html');
    throw new Error('Sessão inválida — redirecionando para o login');
}

// Injeta navbar
document.getElementById('navbarPlaceholder').innerHTML = renderNavbar({
    role: user.role,
    activeTab: 'home',
    logoPath: './src/',
    showSearch: true,
    searchPlaceholder: 'Pesquisar Formulário'
});

// Injeta componentes compartilhados
document.getElementById('sharedComponents').innerHTML =
    renderThemeToggle() + renderFooter('./') + renderLoadingScreen() + renderCookieBanner();
iniciarCookieBanner();
document.getElementById('perfilModalPlaceholder').innerHTML = renderProfileModal({ isAdmin: false });

// Faz logout
const logoutAnchor = document.getElementById('logout-conta');
logoutAnchor.addEventListener('click', logout);

// Mudança de tema light|dark
themeToggle();
updateUserNav(user);
initOrdenacao();
// Loop de Tab: select de ordenação → cards (busca em × fica dentro da grade) → volta pra ordenação. Navbar/busca ficam fora (alcançáveis na entrada e com F6); card de erro com retry também entra por estar no #cardContainer.
ativarFocusLoop(['#sortBar', '#cardContainer']);
displayForms(user, () => setupFormRedirect(user));

fillUpModalsInfo();

loadingScreen();

