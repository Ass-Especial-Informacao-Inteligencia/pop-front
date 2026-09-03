import { themeToggle } from '../js/temas.js';
import { logout } from '../js/api.js';
import { fillUpModalsInfo } from '../js/userInfo.js';
import { loadingScreen } from '../js/loadingScreen.js';

// gerencia temas da página
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
