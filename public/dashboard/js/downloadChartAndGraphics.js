import { mostrarMensagem } from "../../js/geraNotificacao.js";
import { fetchResponsesForForm } from "./fetchAnswersForForm.js";
import { jsonToSheet } from "./geraArquivoExcel.js";
import { getCookie } from "../../js/api.js";
import { chartTextColors, expandTableForExport, getChartExportDetails } from "./dashboardView.js";

const chartFiles = new Map([
    ['chart', 'grafico_cruzado.png'],
    ['singleQuestionChart', 'grafico_pergunta_unica.png'],
    ['singleQuestionPieChart', 'grafico_pizza_pergunta_unica.png'],
]);

function downloadChart(chartId) {
    downloadCanvas(document.getElementById(chartId), chartFiles.get(chartId));
}

function downloadPivotTable() {
    const table = document.querySelector('#pivotTable table');
    downloadTable(table, 'tabela_cruzada.png');
}

function downloadSingleQuestionTable() {
    const table = document.querySelector('#singleQuestionTable table');
    downloadTable(table, 'tabela_pergunta_unica.png', {
        scale: 1,
        onclone(_document, clonedTable) {
            expandTableForExport(table, clonedTable);
        },
    });
}

// Impede downloads simultâneos do mesmo gráfico sem bloquear a exportação de outros gráficos.
const exportingCharts = new WeakSet();

// Copia dados e configurações sem alterar o gráfico da tela; callbacks de formatação continuam sendo funções.
function copyExportValue(value, seen = new WeakMap()) {
    if (!value || typeof value !== 'object') return value;
    // O Chart.js também usa objetos sem protótipo nas escalas; eles precisam ser copiados para não compartilhar configurações.
    const prototype = Object.getPrototypeOf(value);
    if (!Array.isArray(value) && prototype !== Object.prototype && prototype !== null) return value;
    if (seen.has(value)) return seen.get(value);
    const copy = Array.isArray(value) ? [] : Object.create(prototype);
    seen.set(value, copy);
    for (const [key, item] of Object.entries(value)) copy[key] = copyExportValue(item, seen);
    return copy;
}

// Quebra inclusive palavras longas, sem cortar os enunciados ou depender da largura da tela.
function exportTextLines(context, text, width) {
    const lines = [];
    for (const paragraph of String(text).split(/\r?\n/)) {
        let line = '';
        for (const word of paragraph.split(/\s+/).filter(Boolean)) {
            if (line && context.measureText(line + ' ' + word).width > width) {
                lines.push(line);
                line = '';
            }
            if (context.measureText(word).width > width) {
                for (const character of word) {
                    if (line && context.measureText(line + character).width > width) {
                        lines.push(line);
                        line = '';
                    }
                    line += character;
                }
            } else line += (line ? ' ' : '') + word;
        }
        lines.push(line);
    }
    return lines;
}

// Compõe cabeçalho, gráfico, tabela de valores e rodapé; mede o texto antes de definir a altura final da imagem.
function composeChartReport(chartCanvas, details, formName, theme, exportedAt, warning) {
    const width = 1200;
    const padding = 40;
    const contentWidth = width - padding * 2;
    const family = getComputedStyle(document.body).fontFamily || 'Arial, sans-serif';
    const measure = document.createElement('canvas').getContext('2d');
    const blocks = (items) => items.map(([text, size, bold = false]) => {
        const font = `${bold ? '600' : '400'} ${size}px ${family}`;
        measure.font = font;
        return { font, lineHeight: size + 9, lines: exportTextLines(measure, text, contentWidth) };
    });
    const header = blocks([[formName || 'Pesquisa de Opinião', 22, true],
        ...details.questions.map((question) => [question, 20]), [details.title, 18, true]]);
    const footer = blocks([[details.base, 16], [details.note || '', 15],
        ...(warning ? [[warning, 15]] : []), ['Exportado em ' + exportedAt, 14]]);
    const blockHeight = (items) => items.reduce((sum, block) => sum + block.lines.length * block.lineHeight + 8, 0);
    const firstColumn = details.columns.length > 3 ? 0.32 : 0.6;
    const columnWidths = details.columns.map((_, index) => contentWidth * (index === 0
        ? firstColumn : (1 - firstColumn) / (details.columns.length - 1)));
    const tableRows = [details.columns, ...details.rows].map((cells, rowIndex) => {
        const font = `${rowIndex === 0 ? '600' : '400'} 16px ${family}`;
        measure.font = font;
        const lines = cells.map((cell, column) => exportTextLines(measure, cell,
            columnWidths[column] - (column === 0 && rowIndex > 0 && details.colors ? 46 : 24)));
        return { font, lines, height: Math.max(...lines.map((cell) => cell.length)) * 24 + 20 };
    });
    // O canvas do gráfico já está em escala 2; o relatório trabalha em unidades lógicas e gera um PNG com 2400 px de largura.
    const chartHeight = chartCanvas.height / 2;
    const height = padding * 2 + blockHeight(header) + chartHeight + 24
        + tableRows.reduce((sum, row) => sum + row.height, 0) + 24 + blockHeight(footer);
    // Recusa conteúdo excessivo em vez de cortar textos ou tentar criar uma imagem muito grande para o navegador.
    if (height > 8000) throw new Error('O conteúdo é muito longo para um único PNG. Use a exportação Excel.');
    const output = document.createElement('canvas');
    output.width = width * 2;
    output.height = Math.ceil(height * 2);
    const context = output.getContext('2d');
    context.scale(2, 2);
    context.fillStyle = theme.background;
    context.fillRect(0, 0, width, height);
    context.textBaseline = 'top';
    let y = padding;
    const paintBlocks = (items) => {
        for (const block of items) {
            context.font = block.font;
            context.fillStyle = theme.text;
            for (const line of block.lines) {
                context.fillText(line, padding, y);
                y += block.lineHeight;
            }
            y += 8;
        }
    };
    paintBlocks(header);
    context.drawImage(chartCanvas, padding, y, contentWidth, chartHeight);
    y += chartHeight + 24;
    tableRows.forEach((row, rowIndex) => {
        context.font = row.font;
        let x = padding;
        row.lines.forEach((lines, column) => {
            const swatch = column === 0 && rowIndex > 0 && details.colors;
            if (swatch) {
                context.fillStyle = details.colors[rowIndex - 1];
                context.fillRect(x + 12, y + 16, 12, 12);
            }
            context.fillStyle = theme.text;
            context.textAlign = column === 0 ? 'left' : 'right';
            lines.forEach((line, index) => context.fillText(line,
                column === 0 ? x + (swatch ? 34 : 12) : x + columnWidths[column] - 12, y + 10 + index * 24));
            x += columnWidths[column];
        });
        context.fillStyle = theme.grid;
        context.fillRect(padding, y + row.height - 1, contentWidth, 1);
        y += row.height;
    });
    context.textAlign = 'left';
    y += 24;
    paintBlocks(footer);
    return output;
}

// Redesenha uma cópia em resolução fixa para que o PNG tenha o mesmo detalhamento no celular e no desktop.
async function downloadCanvas(canvas, filename) {
    const source = canvas && window.Chart?.getChart(canvas);
    if (!source || !canvas.width || !canvas.height || !getChartExportDetails(source)) {
        mostrarMensagem('Nenhum gráfico para baixar. Gere a visualização primeiro.', 'danger', 3);
        return;
    }
    if (exportingCharts.has(canvas)) return;
    exportingCharts.add(canvas);
    let exportedChart;
    let chartCanvas;
    try {
        // Captura filtros, valores, tema e data antes de aguardar as fontes, evitando misturar estados durante a exportação.
        const details = copyExportValue(getChartExportDetails(source));
        const configuration = copyExportValue(source.config._config);
        const formName = getCookie('form');
        const theme = chartTextColors();
        const exportedAt = new Date().toLocaleString('pt-BR');
        const notice = document.getElementById('dashboard-limit');
        // Leva para a imagem o mesmo aviso da tela quando a análise usa uma base limitada de respostas.
        const warning = notice && !notice.hidden ? notice.textContent : '';
        await document.fonts?.ready;
        chartCanvas = document.createElement('canvas');
        chartCanvas.width = 1120;
        chartCanvas.height = Math.max(360, configuration.data.labels.length * 44 + 80);
        chartCanvas.style.cssText = 'position:fixed;left:-10000px;top:0;pointer-events:none';
        chartCanvas.setAttribute('aria-hidden', 'true');
        document.body.appendChild(chartCanvas);
        configuration.options = { ...configuration.options, responsive: false, animation: false,
            devicePixelRatio: 2, maintainAspectRatio: false };
        configuration.options.plugins.tooltip = { enabled: false };
        // Na composição, a tabela colorida do relatório substitui a legenda resumida do gráfico.
        if (configuration.type === 'doughnut') configuration.options.plugins.legend.display = false;
        if (details.barLabels) {
            // Reserva espaço à direita para mostrar quantidade e percentual sem sobrepor as barras.
            configuration.options.layout = { padding: { top: 12, bottom: 12, left: 8, right: 180 } };
            configuration.plugins = [...(configuration.plugins || []), {
                id: 'pop-export-values',
                afterDatasetsDraw(chart) {
                    const context = chart.ctx;
                    context.save();
                    context.fillStyle = theme.text;
                    context.font = '16px Arial, sans-serif';
                    context.textBaseline = 'middle';
                    chart.getDatasetMeta(0).data.forEach((bar, index) =>
                        context.fillText(details.barLabels[index], bar.x + 8, bar.y));
                    context.restore();
                },
            }];
        }
        exportedChart = new Chart(chartCanvas, configuration);
        const report = composeChartReport(chartCanvas, details, formName, theme, exportedAt, warning);
        const blob = await new Promise((resolve) => report.toBlob(resolve, 'image/png'));
        if (!blob) throw new Error('Erro ao gerar a imagem do gráfico.');
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
        mostrarMensagem(error.message || 'Erro ao gerar a imagem do gráfico.', 'danger', 5);
    } finally {
        // Libera o gráfico fora da tela e o bloqueio de exportação mesmo quando a geração da imagem falha.
        exportedChart?.destroy();
        chartCanvas?.remove();
        exportingCharts.delete(canvas);
    }
}

// Função para baixar tabelas (usando html2canvas)
function downloadTable(table, filename, options = {}) {
    if (!table || table.children.length === 0) {
        mostrarMensagem('Nenhuma tabela para baixar. Gere a visualização primeiro.', 'danger', 3);
        return;
    }
    html2canvas(table, { backgroundColor: chartTextColors().background, ...options }).then(canvas => {
        canvas.toBlob(function(blob) {
            if (!blob) {
                mostrarMensagem('Erro ao gerar a imagem da tabela.', 'danger', 3);
                return;
            }
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        }, 'image/png');
    }).catch(() => {
        mostrarMensagem('Erro ao gerar a imagem da tabela.', 'danger', 3);
    });
}

export function GeraEventoDownloads() {
    document.querySelectorAll('[data-chart-download]').forEach((button) => {
        button.addEventListener('click', () => downloadChart(button.dataset.chartDownload));
    });
    document.getElementById('downloadSingleQuestionTable').addEventListener('click', downloadSingleQuestionTable);
    document.getElementById('downloadButton').addEventListener('click', function() {
        // Pegar o valor selecionado no <select>
        const selectedOption = document.getElementById('selectTableOrGraphicsDownload').value;

        // Determinar qual elemento deve ser baixado com base na seleção
        switch (selectedOption) {
            case 'chart':
            case 'singleQuestionChart':
            case 'singleQuestionPieChart':
                downloadChart(selectedOption);
                break;
            case 'pivotTable':
                downloadPivotTable();
                break;
            case 'singleQuestionTable':
                downloadSingleQuestionTable();
                break;
            case 'arquivoExcel':
                downloadExcel(this);
                break;
            default:
                mostrarMensagem('Por favor, selecione uma opção válida!','danger',3);
        }
    });
}

async function downloadExcel(button) {
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    try {
        const answers = await fetchResponsesForForm(getCookie('form'));
        jsonToSheet(answers);
    } catch (error) {
        mostrarMensagem(error.message || 'Erro ao exportar a planilha.', 'danger', 5);
    } finally {
        button.disabled = false;
        button.removeAttribute('aria-busy');
    }
}
