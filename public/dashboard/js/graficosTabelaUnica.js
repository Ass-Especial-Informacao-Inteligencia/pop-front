import { getRandomColor } from './handlerDashboardActions.js';
import { formData } from '../mainDashBoardHandler.js';
import { getOptions } from './graficoTabelaCruzada.js';

let currentPage = 1;

function getBarChartColor() {
    const colorInput = document.getElementById('color-for-porcent-bars');
    return colorInput.value || '#212121';
}

export function getFilteredOptions(formData, questionId) {
    const options = getOptions(formData, questionId);
    const filterContainer = document.getElementById('single-question-filter');
    const checkboxes = filterContainer.querySelectorAll(
        'input[type="checkbox"]'
    );

    const filteredOptions = options.filter((option) => {
        const checkbox = Array.from(checkboxes).find(
            (checkbox) => checkbox.dataset.option === option
        );
        return checkbox && checkbox.checked;
    });
    return filteredOptions;
}

export function generateSingleQuestionVisualizations(formData, questionId) {
    const options = getFilteredOptions(formData, questionId);
    const answers = formData.Answers[questionId] || [];
    const rowsPerPage = 10;
    const tableContainer = document.getElementById('singleQuestionTable');

    // Garante que answers é um array
    const totalAnswers = Array.isArray(answers)
        ? answers.reduce((acc, answer) => acc + (Array.isArray(answer) ? answer.length : 1), 0)
        : 0;

    const tableRows = options.map((option) => {
        const count = answers.filter((answer) =>
            Array.isArray(answer) ? answer.includes(option) : answer === option
        ).length;
        const percentage = (count / totalAnswers) * 100;
        return [option, `${percentage.toFixed(2)}%`];
    });

    // Adiciona a alternativa "Outros" se necessário
    function addOthersRow(rows) {
        const totalPercentage = rows.reduce(
            (acc, row) => acc + parseFloat(row[1].replace('%', '')),
            0
        );
        
        if (totalPercentage < 99.99) {
            const othersPercentage = 100 - totalPercentage;
            rows.push(['Outros', `${othersPercentage.toFixed(2)}%`]);
        }
    }

    function renderTablePage(page) {
        currentPage = page;
        const startIndex = (page - 1) * rowsPerPage;
        const endIndex = Math.min(startIndex + rowsPerPage, tableRows.length);
        const pageRows = tableRows.slice(startIndex, endIndex);

        // Garante que a alternativa "Outros" seja adicionada se necessário
        addOthersRow(pageRows);

        tableContainer.innerHTML = '';

        const table = document.createElement('table');
        table.className = 'table table-bordered';
        const tableHeaderRow = table.insertRow();
        const tableHeaders = ['Alternativas', 'Porcentagem'];
        tableHeaders.forEach((headerText) => {
            const th = document.createElement('th');
            th.textContent = headerText;
            tableHeaderRow.appendChild(th);
        });

        pageRows.forEach((rowData) => {
            const tr = table.insertRow();
            rowData.forEach((cellData) => {
                const td = tr.insertCell();
                td.textContent = cellData;
            });
        });

        tableContainer.appendChild(table);

        const pagination = document.createElement('div');
        pagination.className = 'pagination';
        
        const totalPages = Math.ceil(tableRows.length / rowsPerPage);
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            if (i === page) {
                pageButton.disabled = true;
            }
            pageButton.onclick = () => renderTablePage(i);
            pagination.appendChild(pageButton);
        }

        tableContainer.appendChild(pagination);

        generateSingleQuestionBarChart(pageRows);
        generateSingleQuestionPieChart(pageRows);
    }

    renderTablePage(currentPage);
}

export function generateSingleQuestionBarChart(tableRows = []) {
    if (!Array.isArray(tableRows)) {
        return;
    }

    const chartContainer = document.getElementById('singleQuestionChart');
    const ctx = chartContainer.getContext('2d');

    // Destrói a instância anterior do gráfico
    if (chartContainer.chartInstance) {
        chartContainer.chartInstance.destroy();
    }

    // Função para escapar caracteres especiais
    function escapeSelector(selector) {
        return selector.replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, '\\$1');
    }

    // Pega cores específicas para cada alternativa
    const colors = tableRows.map((row) => {
        const escapedOption = escapeSelector(row[0]); // Escapa o texto da opção
        const colorPicker = document.querySelector(
            `#single-question-color-picker-${escapedOption}`
        );
        return colorPicker ? colorPicker.value : getRandomColor(); // Usa uma cor aleatória caso o seletor não esteja presente
    });

    chartContainer.chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: tableRows.map((row) => row[0]), // Define as alternativas como rótulos
            datasets: [
                {
                    label: 'Porcentagem (%)', // Define o label para a legenda
                    data: tableRows.map((row) => parseFloat(row[1])),
                    backgroundColor: colors, // Define as cores personalizadas
                    borderRadius: 6,
                    barThickness: 28,
                },
            ],
        },
        options: {
            indexAxis: 'y',
            layout: {
                padding: {
                    left: 10,
                    right: 20,
                },
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
            },
            scales: {
                x: {
                    beginAtZero: true,
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
        },
    });
}


export function generateSingleQuestionPieChart(tableRows = []) {
    if (!Array.isArray(tableRows)) {
      return;
    }
  
    const chartContainer = document.getElementById('singleQuestionPieChart');
    const ctx = chartContainer.getContext('2d');
  
    // Destrói a instância anterior do gráfico
    if (chartContainer.chartInstance) {
      chartContainer.chartInstance.destroy();
    }
  
    // pega as alternativas filtradas
    const filteredAlternatives = tableRows.map((row) => row[0]);
  
    //  pega as cores das alternativas filtradas
    const colorPickers = document.querySelectorAll(
      '#single-question-color-pickers input[type="color"]'
    );
    const colors = [];
    filteredAlternatives.forEach((alternative) => {
      const colorPicker = Array.from(colorPickers).find(
        (colorPicker) => colorPicker.dataset.optionId === alternative
      );
      if (colorPicker) {
        colors.push(colorPicker.value);
      }
    });
  
    // Cria uma nova instância do gráfico
    chartContainer.chartInstance = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: filteredAlternatives,
        datasets: [
          {
            label: 'Porcentagem',
            data: tableRows.map((row) => parseFloat(row[1])),
            backgroundColor: colors,
          },
        ],
      },
      options: {},
    });
}

export function generateSingleQuestionColorPickers(formData, questionId) {
    const options = getOptions(formData, questionId);
    const colorPickersContainer = document.getElementById(
        'single-question-color-pickers'
    );
    colorPickersContainer.innerHTML = '';

    options.unshift('Outros');
    options.forEach((option, optionIndex) => {
        const colorPickerInput = document.createElement('input');
        colorPickerInput.type = 'color';
        colorPickerInput.style.width = '40px';
        colorPickerInput.style.marginBottom = '10px';
        colorPickerInput.style.marginRight = '5px';
        colorPickerInput.style.padding = '0px';
        colorPickerInput.value = getRandomColor(); 
        colorPickerInput.id = `single-question-color-picker-${option}`;
        colorPickerInput.dataset.optionId = option;
        colorPickerInput.dataset.questionId = questionId;

        const label = document.createElement('label');
        label.textContent = `Cor para ${option} `;

        const container = document.createElement('div');
        container.appendChild(colorPickerInput);
        container.appendChild(label);

        colorPickersContainer.appendChild(container);

        // atualiza as cores no grafico de pizza
        colorPickerInput.addEventListener('change', (e) => {
            
            updateSingleQuestionVisualizations(questionId);
        });
    });
}

export function generateOptionFilters(formData, questionId) {
    const options = getOptions(formData, questionId);
    const filterContainer = document.getElementById('single-question-filter');
    filterContainer.innerHTML = ''; 

    options.forEach((option) => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = true;
        checkbox.id = `filter-${option}`;
        checkbox.dataset.option = option;

        const label = document.createElement('label');
        label.textContent = option;
        label.htmlFor = checkbox.id;

        const container = document.createElement('div');
        container.appendChild(checkbox);
        container.appendChild(label);

        filterContainer.appendChild(container);

        
        checkbox.addEventListener('change', () => {
            updateSingleQuestionVisualizations(questionId);
        });
    });
}

export function updateSingleQuestionVisualizations(questionId) {
    generateSingleQuestionVisualizations(formData, questionId);
}
