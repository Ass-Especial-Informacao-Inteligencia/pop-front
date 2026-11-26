import { crossTabulation, formatNumber, formatPercentage, questionDistribution } from './dashboardData.js';
import {
    bindOptionToggle,
    createOptionControls,
    horizontalChartOptions,
    optionColor,
    otherColor,
    renderChart,
    renderTable,
    selectedOptions,
    updateOptionToggle,
} from './dashboardView.js';

export function setupCrosstab(questions, answers, interviewIds, onAvailability) {
    const selectX = document.getElementById('selectX');
    const selectY = document.getElementById('selectY');
    const units = document.getElementById('dataOption');
    const filtersX = document.getElementById('option-pickers-x');
    const filtersY = document.getElementById('option-pickers-y');
    const toggleX = document.getElementById('toggleAlternativesBtnX');
    const toggleY = document.getElementById('toggleAlternativesBtnY');
    const picker = document.getElementById('color-pickers');
    const empty = document.getElementById('cross-empty');
    const results = document.getElementById('cross-results');
    const heading = document.getElementById('cross-question-heading');
    heading.hidden = true;
    const columns = questions.filter(({ type }) => type === 'Unica Escolha');
    let colors;
    let defaultColors;

    function showResults(hasResults, message = '') {
        results.hidden = !hasResults;
        empty.hidden = hasResults;
        empty.textContent = message;
        onAvailability(hasResults);
    }

    if (!interviewIds || !columns.length || questions.length < 2) {
        for (const control of [selectX, selectY, units, toggleX, toggleY]) control.disabled = true;
        showResults(false, !interviewIds
            ? 'O cruzamento requer a identificação das entrevistas na base de análise.'
            : 'O cruzamento precisa de duas questões com respostas, incluindo uma de escolha única.');
        return () => {};
    }

    for (const question of questions) selectX.add(new Option(question.body, question.id));
    for (const question of columns) selectY.add(new Option(question.body, question.id));
    const firstColumn = columns.find(({ id }) => String(id) !== selectX.value);
    if (firstColumn) {
        selectY.value = firstColumn.id;
    } else {
        selectX.value = questions.find(({ id }) => String(id) !== selectY.value).id;
    }

    function render() {
        updateOptionToggle(toggleX, filtersX);
        updateOptionToggle(toggleY, filtersY);
        const x = selectX.value;
        const y = selectY.value;
        // Identifica as questões antes das validações para manter o contexto visível mesmo sem resultados.
        document.getElementById('cross-row-question').textContent = questions.find(({ id }) => String(id) === x).body;
        document.getElementById('cross-column-question').textContent = questions.find(({ id }) => String(id) === y).body;
        heading.hidden = false;
        if (x === y) {
            showResults(false, 'Escolha questões diferentes para linhas e colunas.');
            return;
        }
        const rowLabels = selectedOptions(filtersX);
        const columnLabels = selectedOptions(filtersY);
        if (!rowLabels.length || !columnLabels.length) {
            showResults(false, 'Marque pelo menos uma alternativa em cada questão.');
            return;
        }
        const { rows, paired } = crossTabulation(answers[x], interviewIds[x] || [],
            answers[y], interviewIds[y] || [], rowLabels, columnLabels);
        const sum = (counts) => counts.reduce((total, count) => total + count, 0);
        if (!paired || !rows.some(({ counts }) => sum(counts))) {
            showResults(false, 'Nenhuma entrevista combina as alternativas selecionadas.');
            return;
        }
        showResults(true);
        const percentage = units.value === 'percentage';
        const countValue = (count, base) => percentage ? (base ? 100 * count / base : 0) : count;
        const valueText = (value) => percentage ? formatPercentage(value / 100) : formatNumber(value);
        document.getElementById('cross-summary').textContent = formatNumber(paired) +
            ' entrevistas responderam às duas questões.' +
            (rows.filter(({ counts }) => sum(counts)).length > 8 ? ' O gráfico mostra as 8 alternativas de linha mais frequentes.' : '');
        document.getElementById('cross-table-note').textContent = percentage
            ? 'Cada percentual usa como base as entrevistas da linha que responderam às duas questões.'
            : 'Contagens das alternativas selecionadas nas entrevistas que responderam às duas questões.';
        renderTable(document.getElementById('pivotTable'), ['Alternativa', ...columnLabels, 'Total'],
            rows.map(({ label, counts, base }) => [label, ...counts.map((count) => valueText(countValue(count, base))),
                valueText(countValue(sum(counts), base))]),
            { wide: true, description: 'Tabela cruzada com rolagem horizontal' });

        const visibleRows = rows.filter(({ counts }) => sum(counts))
            .sort((left, right) => sum(right.counts) - sum(left.counts)).slice(0, 8);
        const rankedColumns = columnLabels.map((label, index) => ({
            label, index, total: visibleRows.reduce((total, row) => total + row.counts[index], 0),
        })).filter(({ total }) => total > 0).sort((left, right) => right.total - left.total);
        const leading = rankedColumns.slice(0, 5);
        const extra = rankedColumns.slice(5);
        const style = { borderRadius: 3, maxBarThickness: 23 };
        const datasets = leading.map(({ label, index }) => ({
            ...style, label, backgroundColor: colors.get(label) || defaultColors.get(label),
            data: visibleRows.map(({ counts, base }) => countValue(counts[index], base)),
        }));
        if (extra.length) {
            datasets.push({ ...style, label: 'Demais colunas', backgroundColor: otherColor,
                data: visibleRows.map(({ counts, base }) => countValue(sum(extra.map(({ index }) => counts[index])), base)) });
        }

        // Reproduz no PNG o agrupamento das colunas do gráfico, inclusive a soma de "Demais colunas".
        const columnGroups = leading.map(({ index }) => [index]);
        if (extra.length) columnGroups.push(extra.map(({ index }) => index));

        renderChart('chart', {
            type: 'bar', data: { labels: visibleRows.map(({ label }) => label), datasets },
            options: horizontalChartOptions({ percentage, stacked: true, legend: true, formatValue: valueText }),
        }, Math.max(173, 79 + visibleRows.length * 24), 'Cruzamento entre ' +
            selectX.selectedOptions[0].text + ' e ' + selectY.selectedOptions[0].text, {
                title: 'Cruzamento de questões — ' + (percentage ? 'percentual por linha' : 'quantidade'),
                questions: ['Linhas: ' + selectX.selectedOptions[0].text, 'Colunas: ' + selectY.selectedOptions[0].text],
                base: `Base: ${formatNumber(paired)} ${paired === 1 ? 'entrevista' : 'entrevistas'} com resposta às duas questões.`,
                columns: ['Alternativa da linha', ...datasets.map(({ label }) => label), 'Base da linha'],
                // Cada célula exporta quantidade e percentual sobre a base da própria linha, não sobre o total geral.
                rows: visibleRows.map((row) => [row.label, ...columnGroups.map((indices) => {
                    const count = sum(indices.map((index) => row.counts[index]));
                    return `${formatNumber(count)} · ${formatPercentage(row.base ? count / row.base : 0)}`;
                }), formatNumber(row.base)]),
                note: 'Filtros atuais; até 8 linhas e 5 colunas mais frequentes, com demais colunas agrupadas. Cada célula informa quantidade e percentual sobre a base da linha.',
            });
    }

    function updateFilters(source, target, includeColors) {
        const question = questions.find(({ id }) => String(id) === source.value);
        const labels = questionDistribution(question, answers[question.id]).rows.map(({ label }) => label);
        createOptionControls(target, labels, { type: 'checkbox', onChange: render });
        if (includeColors) {
            colors = new Map();
            defaultColors = new Map(labels.map((label, index) => [label, optionColor(index)]));
            createOptionControls(picker, labels, { type: 'color', colors, onChange: render });
        }
    }

    selectX.addEventListener('change', () => { updateFilters(selectX, filtersX, false); render(); });
    selectY.addEventListener('change', () => { updateFilters(selectY, filtersY, true); render(); });
    units.addEventListener('change', render);
    bindOptionToggle(toggleX, filtersX, render);
    bindOptionToggle(toggleY, filtersY, render);
    updateFilters(selectX, filtersX, false);
    updateFilters(selectY, filtersY, true);
    return render;
}
