import { loadingScreen } from './js/loadingScreen.js';
import { logout } from '../js/api.js';
import { addUsersForList } from './js/manterUser/geraTrUsuarios.js';
import {
    limparFiltrosListUser,
    orderPerNameUsers,
    orderPerRoleUsers,
} from './js/manterUser/ordenarUsuarios.js';
import { pesquisarNaListaUsuarios } from './js/manterUser/searchInListUsers.js';
import { submit } from './js/manterUser/submit.js';
import { validaFormUser } from './js/manterUser/validaFormNewUser.js';
import { fillUpModalsInfo } from './js/modals.js';
import { themeToggle } from '../js/temas.js';

// Faz logout
const logoutAnchor = document.getElementById('logout-conta');
logoutAnchor.addEventListener('click', logout);

// Mudança de tema light|dark
themeToggle();

fillUpModalsInfo();

// listando todos os usuários
addUsersForList();

// validação de formulário front-end
validaFormUser();

// listar usuários funções
orderPerNameUsers();
orderPerRoleUsers();
limparFiltrosListUser();

// barra de pesquisa para usuários
pesquisarNaListaUsuarios();

submit();

loadingScreen();
