import { GeraEventoDowloads } from './dowloadChartAndGraphics.js';
import {
    generateOptionFilters,
    generateSingleQuestionColorPickers,
    updateSingleQuestionVisualizations,
} from './graficosTabelaUnica.js';
import {
    generateColorPickers,
    updateVisualizations,
} from './graficoTabelaCruzada.js';
import { formData } from '../mainDashBoardHandler.js';
import { mostrarMensagem } from './geraNotificacao.js';

function selectedQuestionFunction() {
    return document.getElementById('selectSingleQuestion').value;
}

export function getRandomColor() {
    const randomR = Math.floor(Math.random() * 256);
    const randomG = Math.floor(Math.random() * 256);
    const randomB = Math.floor(Math.random() * 256);
    return `#${randomR.toString(16).padStart(2, '0')}${randomG
        .toString(16)
        .padStart(2, '0')}${randomB.toString(16).padStart(2, '0')}`;
}

function populateSelectOptions(selectElement, options, position) {
    const isValidOption = (option) => position === 'X'
        ? option.type === 'Multipla Escolha' || option.type === 'Unica Escolha'
        : option.type === 'Unica Escolha';

    options
        .filter(isValidOption)
        .forEach((option) => {
            const optionElement = document.createElement('option');
            optionElement.textContent = option.body;
            optionElement.value = option.id;
            selectElement.appendChild(optionElement);
        });
}

function updateOptions(questionId, position, isAlteration) {
    const question = formData.Questions.Questions.find(
        (q) => q.id === questionId
    );
    if (question) {
        const positionPicker =
            position === 'X' ? 'option-pickers-x' : 'option-pickers-y';
        const selectedAlternatives = Array.from(
            document.getElementById(positionPicker).querySelectorAll('input[type="checkbox"]')
        ).map(checkbox => ({
            text: checkbox.value,
            select: isAlteration || checkbox.checked,
        }));
        question.Options = selectedAlternatives;
        updateVisualizations();
    }
}

function toggleAlternatives(questionId, position, button) {
    const question = formData.Questions.Questions.find(
        (q) => parseInt(q.id) === parseInt(questionId)
    );
    if (question) {
        const positionPicker = document.getElementById(position);
        const checkboxes = positionPicker.querySelectorAll('input[type="checkbox"]');
        const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);

        const newStatus = !allChecked;
        checkboxes.forEach(checkbox => checkbox.checked = newStatus);
        question.Options = question.Options.map(option => ({
            text: option.text,
            select: newStatus,
        }));
        button.textContent = newStatus ? 'Desselecionar Todos' : 'Selecionar Todos';
        updateVisualizations();
    }
}

function createAlternatives(question, optionPickers) {
    optionPickers.innerHTML = '';

    question.Options.forEach((alternative) => {
        const ShowOption = alternative.select === undefined ? true : alternative.select;
        const checkboxElement = document.createElement('input');
        checkboxElement.type = 'checkbox';
        checkboxElement.style.marginRight = '5px';
        checkboxElement.checked = ShowOption;
        checkboxElement.id = `alternative-${encodeURIComponent(alternative.text)}`;
        checkboxElement.value = alternative.text;

        const labelElement = document.createElement('label');
        labelElement.textContent = alternative.text;
        labelElement.htmlFor = checkboxElement.id;

        const containerElement = document.createElement('div');
        containerElement.appendChild(checkboxElement);
        containerElement.appendChild(labelElement);

        optionPickers.appendChild(containerElement);
    });
}

function populationHandlerEventListeners() {
    const selectX = document.getElementById('selectX');
    const selectY = document.getElementById('selectY');
    const selectSingleQuestion = document.getElementById('selectSingleQuestion');

    const toggleAlternativesBtnX = document.getElementById('toggleAlternativesBtnX');
    const toggleAlternativesBtnY = document.getElementById('toggleAlternativesBtnY');
    
    const dataOption = document.getElementById('dataOption');

    populateSelectOptions(selectX, formData.Questions.Questions, 'X');
    populateSelectOptions(selectY, formData.Questions.Questions, 'Y');

    selectX.addEventListener('change', () => {
        const xField = selectX.value;
        updateOptions(xField, 'X', true);
        updateVisualizations();
    });

    selectY.addEventListener('change', () => {
        const yField = selectY.value;
        generateColorPickers(formData, yField);
        updateOptions(yField, 'Y', true);
        updateVisualizations();
    });

    document.addEventListener('click', (e) => {
        if (e.target.matches('#toggleAlternativesBtnX')) {
            const xField = selectX.value;
            toggleAlternatives(xField, 'option-pickers-x', toggleAlternativesBtnX);
        }
        if (e.target.matches('#toggleAlternativesBtnY')) {
            const yField = selectY.value;
            toggleAlternatives(yField, 'option-pickers-y', toggleAlternativesBtnY);
        }
        if (e.target.matches('#toggleAlternativesBtnSingle')) {
            const zField = selectSingleQuestion.value;
            if(zField === '') return;

            const checkboxes = document.querySelectorAll('#single-question-filter input[type="checkbox"]');
            const areAllChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
            checkboxes.forEach(checkbox => checkbox.checked = !areAllChecked);

            updateSingleQuestionVisualizations(zField);
        }
    });

    dataOption.addEventListener('change', () => {
        updateVisualizations();
    });
}

function populationSingleQuestionAndListeners() {
    formData.Questions.Questions.forEach((question) => {
        if (question.type === 'Multipla Escolha' || question.type === 'Unica Escolha') {
            const optionElement = document.createElement('option');
            optionElement.textContent = question.body;
            optionElement.value = question.id;
            document.getElementById('selectSingleQuestion').appendChild(optionElement);
        }
    });

    document.getElementById('selectSingleQuestion').addEventListener('change', (e) => {
        const questionId = e.target.value;
        if (questionId !== '') {
            generateOptionFilters(formData, questionId);
            generateSingleQuestionColorPickers(formData, questionId);
            updateSingleQuestionVisualizations(questionId);
        }
    });

    document.getElementById('color-for-porcent-bars').addEventListener('change', () => {
        const questionId = document.getElementById('selectSingleQuestion').value;
        if (questionId !== '') {
            updateSingleQuestionVisualizations(questionId);
        }
    });
}

function populateAlternativesAndListeners() {
    const selectX = document.getElementById('selectX');
    const selectY = document.getElementById('selectY');
    const optionPickersX = document.getElementById('option-pickers-x');
    const optionPickersY = document.getElementById('option-pickers-y');

    selectX.addEventListener('change', () => {
        const selectedQuestionIdX = selectX.value;
        const selectedQuestion = formData.Questions.Questions.find(
            (question) => question.id === parseInt(selectedQuestionIdX)
        );

        if (selectedQuestion) {
            createAlternatives(selectedQuestion, optionPickersX);
        } else {
            mostrarMensagem('Questão selecionada não é válida!','info',2);
        }
    });

    selectY.addEventListener('change', () => {
        const selectedQuestionIdY = selectY.value;
        const selectedQuestion = formData.Questions.Questions.find(
            (question) => question.id === parseInt(selectedQuestionIdY)
        );

        if (selectedQuestion) {
            createAlternatives(selectedQuestion, optionPickersY);
        } else {
            mostrarMensagem('Questão selecionada não é válida!','info',2);
        }
    });

    document.addEventListener('change', (e) => {
        if (e.target.matches('#option-pickers-x input[type="checkbox"]')) {
            updateOptions(parseInt(selectX.value), 'X', false);
        }
        if (e.target.matches('#option-pickers-y input[type="checkbox"]')) {
            updateOptions(parseInt(selectY.value), 'Y', false);
        }
    });
}

function geraGraficosUnicos() {
    const selectedQuestionId = selectedQuestionFunction();
    generateSingleQuestionColorPickers(formData, selectedQuestionId);
    updateSingleQuestionVisualizations(selectedQuestionId);
}

export function MainEditGraphicsAndTables() {
    const selectX = document.getElementById('selectX');
    const selectY = document.getElementById('selectY');

    populationHandlerEventListeners();
    populationSingleQuestionAndListeners();
    populateAlternativesAndListeners();
    GeraEventoDowloads();

    if (selectX && selectY && selectX.value !== '' && selectY.value !== '') {
        updateVisualizations();
        geraGraficosUnicos();
    }
}
