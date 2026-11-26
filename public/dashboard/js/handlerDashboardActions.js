import { formatNumber, questionDistribution } from './dashboardData.js';
import { setupSingleQuestion } from './graficosTabelaUnica.js';
import { setupCrosstab } from './graficoTabelaCruzada.js';
import { ativarTabTeclado } from '../../admin/js/navtab.js';

export function showDashboardAnalysis(formData) {
    const answers = formData.Answers || {};
    const questions = (formData.Questions || []).filter((question) =>
        Array.isArray(answers[question.id]) && answers[question.id].length);
    if (!questions.length) return false;

    const interviewIds = formData.InterviewIds;
    const selections = questions.reduce((total, question) =>
        total + questionDistribution(question, answers[question.id]).total, 0);
    document.getElementById('dashboard-question-count').textContent = formatNumber(questions.length);
    document.getElementById('dashboard-selection-count').textContent = formatNumber(selections);
    document.getElementById('dashboard-interview-metric').hidden = !interviewIds;
    if (interviewIds) {
        const interviews = new Set(questions.flatMap((question) => interviewIds[question.id] || []));
        document.getElementById('dashboard-interview-count').textContent = formatNumber(interviews.size);
    }

    const limit = document.getElementById('dashboard-limit');
    limit.hidden = !formData.Analysis?.limited;
    if (!limit.hidden) {
        limit.textContent = 'Gráficos e tabelas consideram até ' + formatNumber(formData.Analysis.answerLimit) +
            ' respostas de alternativas. A planilha Excel inclui a base completa.';
    }

    const tabs = [...document.querySelectorAll('#myTab [role="tab"]')];
    const downloads = document.getElementById('selectTableOrGraphicsDownload');
    const available = { single: false, cross: false };
    let active = 'single';

    function syncDownloads() {
        for (const option of downloads.querySelectorAll('[data-analysis]')) {
            const mode = option.dataset.analysis;
            option.hidden = mode !== active;
            option.disabled = mode !== active || !available[mode];
        }
        if (downloads.selectedOptions[0]?.disabled) downloads.value = 'arquivoExcel';
    }

    const setAvailable = (mode) => (visible) => {
        available[mode] = visible;
        syncDownloads();
    };
    document.getElementById('dashboard-analysis').hidden = false;
    const repaint = {
        single: setupSingleQuestion(questions, answers, setAvailable('single')),
        cross: setupCrosstab(questions, answers, interviewIds, setAvailable('cross')),
    };

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', (event) => {
            event.preventDefault();
            active = index === 0 ? 'single' : 'cross';
            for (const candidate of tabs) {
                const isActive = candidate === tab;
                candidate.classList.toggle('active', isActive);
                candidate.setAttribute('aria-selected', String(isActive));
                document.getElementById(candidate.getAttribute('aria-controls')).classList.toggle('active', isActive);
            }
            repaint[active]();
            syncDownloads();
        });
    });
    ativarTabTeclado('#myTab');
    document.getElementById('themeToggle').addEventListener('click', () => repaint[active]());
    syncDownloads();
    return true;
}
