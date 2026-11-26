import { mostrarMensagem } from "../../js/geraNotificacao.js";
import { fetchResponsesForForm } from "./fetchAnswersForForm.js";
import { jsonToSheet } from "./geraArquivoExcel.js";
import { getCookie } from "../../js/api.js";
import { chartTextColors, expandTableForExport } from "./dashboardView.js";

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

// Função genérica para baixar gráficos (canvas)
function downloadCanvas(canvas, filename) {
    if (!canvas || !window.Chart?.getChart(canvas) || !canvas.width || !canvas.height) {
        mostrarMensagem('Nenhum gráfico para baixar. Gere a visualização primeiro.', 'danger', 3);
        return;
    }
    const cloneCanvas = document.createElement('canvas');
    cloneCanvas.width = canvas.width;
    cloneCanvas.height = canvas.height;
    const cloneCtx = cloneCanvas.getContext('2d');

    cloneCtx.fillStyle = chartTextColors().background;
    cloneCtx.fillRect(0, 0, cloneCanvas.width, cloneCanvas.height);

    // Desenhar o conteúdo do canvas original no clone
    cloneCtx.drawImage(canvas, 0, 0);

    // Converter o clone do canvas para Blob de imagem PNG
    cloneCanvas.toBlob(function(blob) {
        if (!blob) {
            mostrarMensagem('Erro ao gerar a imagem do gráfico.', 'danger', 3);
            return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }, 'image/png');
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
