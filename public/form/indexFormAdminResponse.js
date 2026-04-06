import { themeToggle } from './js/temas.js';
import { logout } from './js/logout.js';
import { fillUpModalsInfo } from './js/modals.js';
import { loadingScreen } from './js/loadingScreen.js';

// gerencia temas da pagina
themeToggle();

fillUpModalsInfo();

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
