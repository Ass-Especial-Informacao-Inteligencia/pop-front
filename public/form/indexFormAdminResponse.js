import { themeToggle } from '../js/temas.js';
import { logout } from '../js/api.js';
import { fillUpModalsInfo } from '../js/userInfo.js';
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
    logoPath: '../src/',
    showSearch: false,
    searchPlaceholder: ''
});

// Injeta componentes compartilhados
document.getElementById('sharedComponents').innerHTML =
    renderThemeToggle() + renderFooter('../') + renderLoadingScreen();
document.getElementById('perfilModalPlaceholder').innerHTML = renderProfileModal({ isAdmin: true });

// gerencia temas da página
themeToggle();

fillUpModalsInfo();

// Faz logout
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
