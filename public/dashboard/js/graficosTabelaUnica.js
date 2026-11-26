import { formatNumber, formatPercentage, questionDistribution } from './dashboardData.js';
import {
    bindOptionToggle,
    chartLabel,
    chartTextColors,
    createOptionControls,
    horizontalChartOptions,
    optionColor,
    otherColor,
    renderChart,
    renderTable,
    selectedOptions,
    updateOptionToggle,
} from './dashboardView.js';

export function setupSingleQuestion(questions, answers, onAvailability) {
    const select = document.getElementById('selectSingleQuestion');
    const filter = document.getElementById('single-question-filter');
    const picker = document.getElementById('single-question-color-pickers');
    const toggle = document.getElementById('toggleAlternativesBtnSingle');
    const empty = document.getElementById('single-empty');
    const results = document.getElementById('single-results');
    const table = document.getElementById('singleQuestionTable');
    let distribution;
    let colors;
    let defaultColors;

    for (const question of questions) select.add(new Option(question.body, question.id));

    function render() {
        const question = questions.find(({ id }) => String(id) === select.value);
        const chosen = new Set(selectedOptions(filter));
        const rows = distribution.rows.filter(({ label }) => chosen.has(label))
            .sort((first, second) => second.count - first.count);
        const ranked = rows.filter(({ count }) => count > 0);
        const hasResults = ranked.length > 0;
        results.hidden = !hasResults;
        empty.hidden = hasResults;
        empty.textContent = chosen.size ? 'As alternativas selecionadas não têm respostas.' : 'Marque uma alternativa para ver os resultados.';
        updateOptionToggle(toggle, filter);
        onAvailability(hasResults);
        if (!hasResults) return;

        const colorFor = (label) => colors.get(label) || defaultColors.get(label);
        const percent = (count) => formatPercentage(count / distribution.total);
        document.getElementById('single-question-label').textContent = question.body;
        const bars = ranked.slice(0, 8);

        renderChart('singleQuestionChart', {
            type: 'bar',
            data: {
                labels: bars.map(({ label }) => label),
                datasets: [{
                    data: bars.map(({ count }) => 100 * count / distribution.total),
                    backgroundColor: bars.map(({ label }) => colorFor(label)),
                    borderRadius: 3,
                    maxBarThickness: 24,
                }],
            },
            options: horizontalChartOptions({
                percentage: true,
                formatValue: (value) => formatPercentage(value / 100),
            }),
        }, Math.max(162, 55 + bars.length * 24), 'Alternativas mais selecionadas em ' + question.body);

        const slices = ranked.slice(0, 4);
        const remaining = distribution.total - slices.reduce((sum, row) => sum + row.count, 0);
        const labels = slices.map(({ label }) => label);
        const counts = slices.map(({ count }) => count);
        const sliceColors = labels.map(colorFor);
        if (remaining > 0) {
            labels.push('Demais seleções');
            counts.push(remaining);
            sliceColors.push(otherColor);
        }

        const theme = chartTextColors();
        renderChart('singleQuestionPieChart', {
            type: 'doughnut',
            data: { labels, datasets: [{
                data: counts, backgroundColor: sliceColors, borderColor: theme.background, borderWidth: 2,
            }] },
            options: {
                responsive: true, maintainAspectRatio: false, animation: false, cutout: '65%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: theme.text, boxWidth: 8, padding: 8, usePointStyle: true, font: { size: 10 },
                            generateLabels(chart) {
                                return Chart.overrides.doughnut.plugins.legend.labels.generateLabels(chart)
                                    .map((item) => ({ ...item, text: chartLabel(item.text, 24) }));
                            },
                        },
                    },
                    tooltip: { callbacks: { label: ({ label, raw }) => label + ': ' + percent(raw) } },
                },
            },
        }, Math.max(162, 65 + bars.length * 24), 'Composição das seleções em ' + question.body);

        renderTable(table, ['Alternativa', 'Seleções', '% da base'],
            rows.map(({ label, count }) => [label, formatNumber(count), percent(count)]), {});
    }

    function selectQuestion() {
        const question = questions.find(({ id }) => String(id) === select.value);
        distribution = questionDistribution(question, answers[question.id]);
        const labels = distribution.rows.map(({ label }) => label);
        colors = new Map();
        defaultColors = new Map(labels.map((label, index) => [label, optionColor(index)]));
        createOptionControls(filter, labels, { type: 'checkbox', onChange: render });
        createOptionControls(picker, labels, { type: 'color', colors, onChange: render });
        render();
    }

    select.addEventListener('change', selectQuestion);
    bindOptionToggle(toggle, filter, render);
    selectQuestion();
    return render;
}
