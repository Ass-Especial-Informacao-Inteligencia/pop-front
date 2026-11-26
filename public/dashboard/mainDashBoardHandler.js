import { fillUpModalsInfo } from '../js/userInfo.js';
import { themeToggle } from '../js/temas.js';
import { logout, getCookie } from '../js/api.js';
import { fetchResponsesForFormGraphics } from './js/fetchAnswersForForm.js';
import { showDashboardAnalysis } from './js/handlerDashboardActions.js';
import { GeraEventoDownloads } from './js/downloadChartAndGraphics.js';
import { renderThemeToggle } from '../js/components/themeToggle.js';
import { renderFooter } from '../js/components/footer.js';
import { renderProfileModal } from '../js/components/profileModal.js';
import { renderNavbar } from '../js/components/navbar.js';
import { renderCookieBanner, iniciarCookieBanner } from '../js/components/cookieBanner.js';

document.getElementById('navbarPlaceholder').innerHTML = renderNavbar({ role: 'admin', logoPath: './src/' });
document.getElementById('dashboard-theme').innerHTML = renderThemeToggle();
document.getElementById('sharedComponents').innerHTML = renderFooter('./') + renderCookieBanner();
document.getElementById('perfilModalPlaceholder').innerHTML = renderProfileModal({ isAdmin: true });
iniciarCookieBanner();
themeToggle();
fillUpModalsInfo();
document.getElementById('logout-conta').addEventListener('click', logout);

const title = getCookie('form');
const status = document.getElementById('dashboard-status');
const statusText = document.getElementById('dashboard-status-text');
const retry = document.getElementById('dashboard-retry');
const download = document.getElementById('downloadButton');

function showStatus(text, canRetry = false) {
    statusText.textContent = text;
    status.hidden = false;
    retry.hidden = !canRetry;
}

async function loadDashboard() {
    if (!title) {
        showStatus('Abra um formulário na lista para ver suas respostas.');
        return;
    }
    showStatus('Carregando respostas…');
    try {
        const data = await fetchResponsesForFormGraphics(title);
        if (showDashboardAnalysis(data)) {
            status.hidden = true;
        } else {
            for (const option of document.querySelectorAll('[data-analysis]')) option.disabled = true;
            showStatus(data.Analysis?.limited
                ? 'A análise por gráficos atingiu o limite de respostas. Você pode consultar toda a base no Excel.'
                : 'Este formulário ainda não tem respostas de múltipla escolha ou escolha única para os gráficos.');
        }
        download.disabled = false;
    } catch {
        document.getElementById('dashboard-analysis').hidden = true;
        showStatus('Não foi possível carregar as respostas.', true);
    }
}

document.getElementById('dashboard-form-title').textContent = title || '';
retry.addEventListener('click', loadDashboard);
GeraEventoDownloads();
loadDashboard();
