import { loadingScreen } from '../js/loadingScreen.js';
import { logout } from '../js/api.js';
import { addUsersForList } from './js/manterUser/geraTrUsuarios.js';
import {
    orderPerNameUsers,
    orderPerRoleUsers,
} from './js/manterUser/ordenarUsuarios.js';
import { pesquisarNaListaUsuarios } from './js/manterUser/searchInListUsers.js';
import { submit } from './js/manterUser/submit.js';
import { validaFormUser } from './js/manterUser/validaFormNewUser.js';
import { fillUpModalsInfo } from './js/modals.js';
import { themeToggle } from '../js/temas.js';
import { renderLoadingScreen } from '../js/components/loadingScreen.js';
import { renderThemeToggle } from '../js/components/themeToggle.js';
import { renderFooter } from '../js/components/footer.js';
import { renderProfileModal } from '../js/components/profileModal.js';
import { renderNavbar } from '../js/components/navbar.js';
import { renderCookieBanner, iniciarCookieBanner } from '../js/components/cookieBanner.js';
import { ativarFocusLoop } from '../js/focusLoop.js';

// Injeta navbar
document.getElementById('navbarPlaceholder').innerHTML = renderNavbar({
    role: 'admin',
    activeTab: 'usuarios',
    logoPath: './src/',
    showSearch: true,
    searchPlaceholder: 'Pesquisar Usuários'
});

// Injeta componentes compartilhados
document.getElementById('sharedComponents').innerHTML =
    renderThemeToggle() + renderFooter('./') + renderLoadingScreen() + renderCookieBanner();
iniciarCookieBanner();
document.getElementById('perfilModalPlaceholder').innerHTML = renderProfileModal({ isAdmin: true });

// Faz logout
const logoutAnchor = document.getElementById('logout-conta');
logoutAnchor.addEventListener('click', logout);

// Mudança de tema light|dark
themeToggle();

// Loop de Tab no conteúdo principal (botão criar + tabela de usuários); linhas dinâmicas entram no loop pois o escopo é relido a cada Tab.
ativarFocusLoop('#conteudo');

fillUpModalsInfo();

// listando todos os usuários
addUsersForList();

// validação de formulário front-end
validaFormUser();

// listar usuários funções
orderPerNameUsers();
orderPerRoleUsers();

// barra de pesquisa para usuários
pesquisarNaListaUsuarios();

submit();

loadingScreen();
