import { mostrarMensagem } from "../../js/geraNotificacao.js";
import { fetchResponsesForForm } from "./fetchAnswersForForm.js";
import { jsonToSheet } from "./geraArquivoExcel.js";
import { getCookie } from "../../js/api.js";

function downloadChart() {
    const chartCanvas = document.getElementById('chart');
    downloadCanvas(chartCanvas, 'grafico_cruzado.png');
}

function downloadPivotTable() {
    const table = document.getElementById('pivotTable');
    downloadTable(table, 'tabela_cruzada.png');
}

function downloadSingleQuestionChart() {
    const chartCanvas = document.getElementById('singleQuestionChart');
    downloadCanvas(chartCanvas, 'grafico_pergunta_unica.png');
}

function downloadSingleQuestionTable() {
    const table = document.getElementById('singleQuestionTable');
    downloadTable(table, 'tabela_pergunta_unica.png');
}

function downloadSingleQuestionPieChart() {
    const chartCanvas = document.getElementById('singleQuestionPieChart');
    downloadCanvas(chartCanvas, 'grafico_pizza_pergunta_unica.png');
}

// Função genérica para baixar gráficos (canvas)
function downloadCanvas(canvas, filename) {
    if (!canvas || canvas.width === 0 || canvas.height === 0) {
        mostrarMensagem('Nenhum gráfico para baixar. Gere a visualização primeiro.', 'danger', 3);
        return;
    }
    const cloneCanvas = document.createElement('canvas');
    cloneCanvas.width = canvas.width;
    cloneCanvas.height = canvas.height;
    const cloneCtx = cloneCanvas.getContext('2d');

    // Adicionar um fundo branco ao clone
    cloneCtx.fillStyle = '#ffffff'; // Cor branca
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
function downloadTable(table, filename) {
    if (!table || table.children.length === 0) {
        mostrarMensagem('Nenhuma tabela para baixar. Gere a visualização primeiro.', 'danger', 3);
        return;
    }
    html2canvas(table).then(canvas => {
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
    document.getElementById('downloadButton').addEventListener('click', function() {
        // Pegar o valor selecionado no <select>
        const selectedOption = document.getElementById('selectTableOrGraphicsDownload').value;

        // Determinar qual elemento deve ser baixado com base na seleção
        switch (selectedOption) {
            case 'chart':
                downloadChart();
                break;
            case 'pivotTable':
                downloadPivotTable();
                break;
            case 'singleQuestionChart':
                downloadSingleQuestionChart();
                break;
            case 'singleQuestionTable':
                downloadSingleQuestionTable();
                break;
            case 'singleQuestionPieChart':
                downloadSingleQuestionPieChart();
                break;
            case 'arquivoExcel':
                downloadExcel(); 
                break;
            default:
                mostrarMensagem('Por favor, selecione uma opção válida!','danger',3);
        }
    });
}

async function downloadExcel() {
    const dataDownloadExcel = await fetchResponsesForForm(getCookie('form'));
    jsonToSheet(dataDownloadExcel);
}
