const palette = ['#137c7d', '#4477ad', '#9069a7', '#bf763a', '#648249', '#ad5977', '#587d8c', '#82683d'];
export const otherColor = '#87979d';

export function optionColor(index) {
    return palette[index % palette.length];
}

export function createOptionControls(container, labels, { type, colors, onChange }) {
    container.replaceChildren();
    labels.forEach((text, index) => {
        const label = document.createElement('label');
        label.className = 'dashboard-option';
        const input = document.createElement('input');
        input.type = type;
        input.dataset.option = text;
        if (type === 'color') {
            input.value = colors.get(text) || optionColor(index);
            input.addEventListener('change', () => {
                colors.set(text, input.value);
                onChange();
            });
        } else {
            input.checked = true;
            input.addEventListener('change', onChange);
        }

        label.append(input, document.createTextNode(text));
        container.append(label);
    });
}

export function selectedOptions(container) {
    return [...container.querySelectorAll('input:checked')].map((input) => input.dataset.option);
}

export function bindOptionToggle(button, container, onChange) {
    button.addEventListener('click', () => {
        const options = [...container.querySelectorAll('input')];
        const allChecked = options.every((option) => option.checked);
        options.forEach((option) => { option.checked = !allChecked; });
        onChange();
    });
}

export function updateOptionToggle(button, container) {
    const options = [...container.querySelectorAll('input')];
    button.disabled = !options.length;
    button.textContent = options.every((option) => option.checked) ? 'Desmarcar todas' : 'Marcar todas';
}

const renderedRows = new WeakMap();

function renderTableRows(body, rows) {
    body.replaceChildren();
    for (const values of rows) {
        const row = body.insertRow();
        const label = body.ownerDocument.createElement('th');
        label.scope = 'row';
        label.textContent = values[0];
        row.append(label);
        for (const value of values.slice(1)) row.insertCell().textContent = value;
    }
}

export function expandTableForExport(table, clonedTable) {
    const rows = renderedRows.get(table);
    if (rows) renderTableRows(clonedTable.tBodies[0], rows);
}

export function renderTable(container, headings, rows, { wide = false, description }) {
    const table = document.createElement('table');
    table.className = wide ? 'dashboard-table dashboard-table-wide' : 'dashboard-table';
    const header = table.createTHead().insertRow();
    for (const heading of headings) {
        const cell = document.createElement('th');
        cell.scope = 'col';
        cell.textContent = heading;
        header.append(cell);
    }

    const body = table.createTBody();
    renderedRows.set(table, rows);
    const scroll = document.createElement('div');
    scroll.className = 'dashboard-table-wrap';
    if (wide) {
        scroll.tabIndex = 0;
        scroll.setAttribute('role', 'region');
        scroll.setAttribute('aria-label', description);
    }
    scroll.append(table);
    container.replaceChildren(scroll);

    const rowsPerPage = 8;
    const pages = Math.ceil(rows.length / rowsPerPage);
    let page = 0;
    const navigation = document.createElement('div');
    navigation.className = 'dashboard-pagination';
    const previous = document.createElement('button');
    const next = document.createElement('button');
    const position = document.createElement('span');
    position.setAttribute('aria-live', 'polite');

    for (const button of [previous, next]) {
        button.type = 'button';
        button.className = 'btn dashboard-secondary';
    }
    previous.textContent = 'Anterior';
    next.textContent = 'Próxima';

    function renderPage() {
        renderTableRows(body, rows.slice(page * rowsPerPage, (page + 1) * rowsPerPage));
        position.textContent = (page + 1) + ' de ' + pages;
        previous.disabled = page === 0;
        next.disabled = page >= pages - 1;
    }

    previous.addEventListener('click', () => { page -= 1; renderPage(); });
    next.addEventListener('click', () => { page += 1; renderPage(); });
    if (pages > 1) {
        navigation.append(previous, position, next);
        container.append(navigation);
    }
    renderPage();
}

export function chartTextColors() {
    const styles = getComputedStyle(document.body);
    return {
        text: styles.getPropertyValue('--dash-secondary').trim(),
        grid: styles.getPropertyValue('--dash-grid').trim(),
        background: styles.getPropertyValue('--dash-panel').trim(),
    };
}

export function chartLabel(value, maxLength) {
    return value.length > maxLength ? value.slice(0, maxLength - 1) + '…' : value;
}

// Associa o contexto numérico à instância exibida; o WeakMap não mantém gráficos destruídos vivos na memória.
const chartExportDetails = new WeakMap();

// Recupera enunciados, base e valores correspondentes aos filtros usados na última renderização.
export function getChartExportDetails(chart) {
    return chartExportDetails.get(chart);
}

// Recria o gráfico e associa os dados de exportação sem acrescentar informações ao canvas visível.
export function renderChart(id, configuration, height, label, exportDetails) {
    const canvas = document.getElementById(id);
    canvas.setAttribute('aria-label', label);
    canvas.parentElement.style.setProperty('--chart-height', height + 'px');
    if (!window.Chart) return;
    Chart.getChart(canvas)?.destroy();
    const chart = new Chart(canvas, configuration);
    chartExportDetails.set(chart, exportDetails);
}

export function horizontalChartOptions({ percentage, stacked = false, legend = false, formatValue }) {
    const colors = chartTextColors();
    return {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        layout: { padding: { right: 8 } },
        plugins: {
            legend: {
                display: legend,
                position: 'bottom',
                labels: { color: colors.text, boxWidth: 9, usePointStyle: true, font: { size: 11 } },
            },
            tooltip: {
                callbacks: {
                    label(context) {
                        const value = formatValue(context.parsed.x);
                        return context.dataset.label ? context.dataset.label + ': ' + value : value;
                    },
                },
            },
        },
        scales: {
            x: {
                stacked,
                beginAtZero: true,
                suggestedMax: percentage ? 100 : undefined,
                grid: { color: colors.grid },
                ticks: { color: colors.text, maxTicksLimit: 6, precision: percentage ? undefined : 0, callback: formatValue },
            },
            y: {
                stacked,
                grid: { display: false },
                ticks: {
                    color: colors.text,
                    font: { size: 11 },
                    callback(value) {
                        const maxLength = this.chart.width < 430 ? 18 : 30;
                        return chartLabel(this.getLabelForValue(value), maxLength);
                    },
                },
            },
        },
    };
}
