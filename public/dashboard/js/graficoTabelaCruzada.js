import { getRandomColor } from './handlerDashboardActions.js';
import { formData } from '../mainDashBoardHandler.js';

let colorPickers = {};

export function generateColorPickers(formData, yField) {
    if (yField && yField.value !== '') {
        const colorPickersContainer = document.getElementById('color-pickers');
        colorPickersContainer.innerHTML = '';
        const yOptions = formData.Questions.find(
            (q) => `${q.id}` === `${yField}`
        ).Options.map((obj) => obj.text);

        yOptions.forEach((option, optionIndex) => {
            const colorPickerInput = document.createElement('input');
            colorPickerInput.type = 'color';
            colorPickerInput.style.width = '40px';
            colorPickerInput.style.marginBottom = '10px';
            colorPickerInput.style.marginRight = '5px';
            colorPickerInput.style.padding = "0px";
            colorPickerInput.value = getRandomColor(); // Set a random color initially
            colorPickerInput.dataset.optionId = option;
            colorPickerInput.dataset.questionId = yField;

            const label = document.createElement('label');
            label.textContent = `Cor para ${option}`;
            label.style.fontSize = '0.85em';
            const container = document.createElement('div');
            container.appendChild(colorPickerInput);
            container.appendChild(label);
            

            colorPickersContainer.appendChild(container);

            colorPickers[option] = colorPickerInput;
           
            colorPickerInput.addEventListener('change', () => {
                updateVisualizations();
            });
        });
    }
}

export function generatePivotTable(formData, xField, yField, dataOption) {
    if (xField && yField && xField.value !== '' && yField.value !== '') {
        const pivotTable = document.getElementById('pivotTable');
        let xOptions = getOptions(formData, xField);
        let yOptions = getOptions(formData, yField);
        let xQuestionLabel = getQuestionLabel(formData, xField);
        let yQuestionLabel = getQuestionLabel(formData, yField);

        // Cabeçalho vazio para a primeira célula + opções do eixo Y
        let tableHeaders = [`${xQuestionLabel} x ${yQuestionLabel}`].concat(yOptions);
        tableHeaders.push('Total'); // Adicionar o cabeçalho para a coluna de total

        let tableRows = [];
        // Itera sobre cada opção em xOptions com seu índice correspondente
        xOptions.forEach((xOption, xIndex) => {
            // Cria uma nova linha para a tabela, começando com a opção x
            let row = [xOption];
            // Inicializa uma variável para armazenar o total de contagens
            let total = 0;

            // Itera sobre cada opção em yOptions com seu índice correspondente
            yOptions.forEach((yOption, yIndex) => {
                // Inicializa uma variável para contar as ocorrências
                let count = 0;
                // Itera sobre cada resposta no campo xField do formData
                formData.Answers[xField].forEach((answer, index) => {
                    // Verifica se a resposta contém xOption e se a resposta correspondente em yField contém yOption
                    if (
                        (Array.isArray(answer)
                            ? answer.includes(xOption)  // Se a resposta for um array, verifica se contém xOption
                            : answer === xOption) &&     // Se não for um array, compara diretamente
                        (Array.isArray(formData.Answers[yField][index])
                            ? formData.Answers[yField][index].includes(yOption)  // Se a resposta em yField for um array, verifica se contém yOption
                            : formData.Answers[yField][index] === yOption)         // Se não for um array, compara diretamente
                    ) {
                        count++; // Incrementa o contador se ambas as condições forem verdadeiras
                    }
                });

                // Inicializa a variável value com o valor de count
                let value = count;
                // Se a opção de dados for 'percentage', calcula a porcentagem
                if (dataOption === 'percentage') {
                    // Conta o número total de ocorrências de xOption no campo xField
                    const xOptionCount = formData.Answers[xField].filter((a) =>
                        Array.isArray(a) ? a.includes(xOption) : a === xOption
                    ).length;
                    // Se xOptionCount for maior que 0, calcula a porcentagem
                    if (xOptionCount > 0) {
                        value = `${((count / xOptionCount) * 100).toFixed(2)}%`;
                    } else {
                        value = '0.00%'; // Caso contrário, define como 0%
                    }
                }

                // Adiciona o valor (ou porcentagem) à linha
                row.push(value);
                // Adiciona o valor de count ao total
                total += count;
            });

            // Se a opção de dados for 'percentage', calcula a porcentagem total
            if (dataOption === 'percentage') {
                // Conta o número total de ocorrências de xOption no campo xField
                const xOptionCount = formData.Answers[xField].filter((a) =>
                    Array.isArray(a) ? a.includes(xOption) : a === xOption
                ).length;
                // Se xOptionCount for maior que 0, calcula a porcentagem total
                if (xOptionCount > 0) {
                    total = `${((total / xOptionCount) * 100).toFixed(2)}%`;
                } else {
                    total = '0.00%'; // Caso contrário, define como 0%
                }
            }

            // Adiciona o total (ou porcentagem total) à linha
            row.push(total);
            // Adiciona a linha completa à lista de linhas da tabela
            tableRows.push(row);
        });

        const rowsPerPage = 15;
        let currentPage = 1;
        const totalPages = Math.ceil(tableRows.length / rowsPerPage);

        function renderTable(page) {
            pivotTable.innerHTML = '';
            let start = (page - 1) * rowsPerPage;
            let end = Math.min(start + rowsPerPage, tableRows.length);
            let table = document.createElement('table');

            // Cabeçalho da tabela
            let headerRow = table.insertRow();
            tableHeaders.forEach((headerText) => {
                let th = document.createElement('th');
                th.textContent = headerText;
                headerRow.appendChild(th);
            });

            // Linhas da tabela
            for (let i = start; i < end; i++) {
                let rowData = tableRows[i];
                let tr = table.insertRow();
                rowData.forEach((cellData) => {
                    let td = tr.insertCell();
                    td.textContent = cellData;
                });
            }

            // Adicionar controles de paginação
            let pagination = document.createElement('div');
            pagination.className = 'pagination';

            if (currentPage > 1) {
                let prev = document.createElement('button');
                prev.textContent = 'Anterior';
                prev.onclick = () => {
                    currentPage--;
                    renderTable(currentPage);
                };
                pagination.appendChild(prev);
            }

            for (let i = 1; i <= totalPages; i++) {
                let pageButton = document.createElement('button');
                pageButton.textContent = i;
                pageButton.onclick = () => {
                    currentPage = i;
                    renderTable(currentPage);
                };
                if (i === currentPage) {
                    pageButton.disabled = true;
                }
                pagination.appendChild(pageButton);
            }

            if (currentPage < totalPages) {
                let next = document.createElement('button');
                next.textContent = 'Proximo';
                next.onclick = () => {
                    currentPage++;
                    renderTable(currentPage);
                };
                pagination.appendChild(next);
            }

            pivotTable.appendChild(table);
            pivotTable.appendChild(pagination);
        }

        renderTable(currentPage);
    }
}

// Função para gerar o gráfico de barras cruzado
export function generateCrossedBarChart(formData, xField, yField, dataOption) {
    if (xField && yField && xField.value !== '' && yField.value !== '') {
        const chartParent = document.getElementById('chart').parentElement;
        document.getElementById('chart').remove();

        const newChart = document.createElement('canvas');
        newChart.id = 'chart';
        chartParent.appendChild(newChart);

        const ctx = newChart.getContext('2d');

        if (Object.keys(colorPickers).length === 0) {
            generateColorPickers(formData, yField);
        }

        let labels = getOptions(formData, xField);
        const maxLabels = 15;

        if (labels.length > maxLabels) {
            labels = labels.slice(0, maxLabels);
        }

        let optionsChart = {
            indexAxis: 'y',
            layout: {
                padding: {
                    left: 10,
                    right: 20,
                },
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        display: false,
                    },
                },
                y: {
                    grid: {
                        display: false,
                    },
                },
            },
        };
        // desculpa quem pegar isso mas infelizmente esta extremamente complexo
        // Cria um array de datasets com base nas opções de yField e nas labels
        const datasets = getOptions(formData, yField).map((yOption, yIndex) => {
            // Para cada opção de yField, cria um array de dados
            const data = labels.map((xOption) => {
                // Conta o número de respostas que correspondem a xOption e yOption
                const count = countAnswers(
                    formData,
                    xField,
                    xOption,
                    yField,
                    yOption
                );
                
                // Verifica se o dataOption é 'percentage'
                if (dataOption === 'percentage') {
                    // Calcula o total de respostas para xOption
                    const total = formData.Answers[xField].filter((a) =>
                        // Se a resposta for um array, verifica se xOption está incluído; caso contrário, compara diretamente
                        Array.isArray(a) ? a.includes(xOption) : a === xOption
                    ).length;
                    
                    // Define opções de gráfico para exibir percentuais no eixo x
                    optionsChart = {
                        indexAxis: 'y',
                        layout: {
                            padding: {
                                left: 10,
                                right: 20,
                            },
                        },
                        scales: {
                            x: {
                                beginAtZero: true,
                                min: 0,
                                max: 100,
                                ticks: {
                                    stepSize: 10,
                                },
                                grid: {
                                    display: false,
                                },
                            },
                            y: {
                                grid: {
                                    display: false,
                                },
                            },
                        },
                    };
                    
                    // Calcula o percentual de count em relação ao total
                    return (count / total) * 100;
                } else {
                    // Se não for para calcular percentual, retorna o count diretamente
                    return count;
                }
            });

            // Obtém a cor correspondente à opção de yField
            const selectedColor = colorPickers[yOption].value;
            
            // Retorna um objeto de dataset com o rótulo, os dados, e as cores configuradas
            return {
                label: yOption,
                data: data,
                backgroundColor: selectedColor,
                borderColor: selectedColor,
                borderWidth: 1,
                borderRadius: 6,
                barThickness: 28,
            };
        });


        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: datasets,
            },
            options: optionsChart,
        });
    }
}

// Função para atualizar a exibição da tabela cruzada ou gráfico
export function updateVisualizations() {
    const xField = selectX.value;
    const yField = selectY.value;
    const dataOpt = dataOption.value;
    generatePivotTable(formData, xField, yField, dataOpt);
    generateCrossedBarChart(formData, xField, yField, dataOpt);
} 

// funções auxiliares

// Função para obter as opções de um campo
export function getOptions(formData, fieldId) {
    const question = formData.Questions.find((q) => `${q.id}` === `${fieldId}`);

    if (!question) return [];

    return question.Options
        .filter((obj) => obj.select === true || obj.select === undefined) // Filtra opções onde select é true ou não está presente
        .map((obj) => obj.text); // Mapeia e retorna somente o texto das opções filtradas
}

// Função para contar as respostas que correspondem a uma opção
function countAnswers(formData, xField, xOption, yField, yOption) {
    let count = 0;
    formData.Answers[xField].forEach((answer, index) => {
        if (Array.isArray(answer)) {
            if (
                answer.includes(xOption) &&
                (Array.isArray(formData.Answers[yField][index])
                    ? formData.Answers[yField][index].includes(yOption)
                    : formData.Answers[yField][index] === yOption)
            ) {
                count++;
            }
        } else {
            if (
                answer === xOption &&
                (Array.isArray(formData.Answers[yField][index])
                    ? formData.Answers[yField][index].includes(yOption)
                    : formData.Answers[yField][index] === yOption)
            ) {
                count++;
            }
        }
    });
    return count;
}
// Função para obter o rótulo de uma pergunta
function getQuestionLabel(formData, fieldId) {
    return formData.Questions.find((q) => `${q.id}` === `${fieldId}`).body;
}
