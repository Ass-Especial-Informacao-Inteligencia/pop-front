import { updateUserNav } from './js/modificaNavBar.js';
import { fillUpModalsInfo } from '../js/userInfo.js';
import { setupFormRedirect } from './js/formRedirect.js';
import { displayForms } from './js/getFormularios.js';
import { getUserData, logout } from '../js/api.js';
import { themeToggle } from '../js/temas.js';
import { loadingScreen } from '../js/loadingScreen.js';
import { renderLoadingScreen } from '../js/components/loadingScreen.js';
import { renderThemeToggle } from '../js/components/themeToggle.js';
import { renderFooter } from '../js/components/footer.js';
import { renderProfileModal } from '../js/components/profileModal.js';

// Injeta componentes compartilhados
document.getElementById('sharedComponents').innerHTML =
    renderThemeToggle() + renderFooter('./') + renderLoadingScreen();
document.getElementById('perfilModalPlaceholder').innerHTML = renderProfileModal({ isAdmin: false });

const user = await getUserData(); // Capturando informações do usuário

// Faz logout
const logoutAnchor = document.getElementById('logout-conta');
logoutAnchor.addEventListener('click', logout);

// Mudança de tema light|dark
themeToggle();
updateUserNav();
displayForms(user).then(() => setupFormRedirect());

fillUpModalsInfo();

loadingScreen();

