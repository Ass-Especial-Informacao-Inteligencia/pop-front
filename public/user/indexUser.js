import { updateUserNav } from './js/modificaNavBar.js';
import { fillUpModalsInfo } from './js/modals.js';
import { setupFormRedirect } from './js/formRedirect.js';
import { displayForms } from './js/getFormularios.js';
import { userData } from './js/getUserData.js';
import { themeToggle } from './js/themeToggle.js';
import { logout } from './js/logout.js';
import { loadingScreen } from './js/loadingScreen.js';

const user = await userData; // Capturando informações de usuario

// Faz logout
const logoutAnchor = document.getElementById('logout-conta');
logoutAnchor.addEventListener('click', logout);

// Mudança de tema light|dark
themeToggle();
updateUserNav();
displayForms(user).then(() => setupFormRedirect());

fillUpModalsInfo();

loadingScreen();

