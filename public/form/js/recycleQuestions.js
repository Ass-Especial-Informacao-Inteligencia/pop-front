import { questionsRecycle } from '../indexForm.js';
import { getCookie, api } from '../../js/api.js';
import { mostrarMensagem, anunciarSr } from '../../js/geraNotificacao.js';
import { initCustomSelect } from '../../js/components/customSelect.js';
import {
    changeQuestionType,
    removeQuestion,
    moveQuestion,
    renumberPositions,
} from './manterQuestaoAlternativa.js';

// Função para pegar todas as questões
export async function getQuestions() {
    const title = getCookie('form');
    try {
        const response = await api.get(`/questions/${title}/all`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const questions = await response.json();
        
        return questions;
    } catch (error) {
        console.error('Erro ao buscar as questões:', error);
        return [];
    }
}

// Função para renderizar as questões no modal
let timerAnuncioResultados = null;
function renderQuestionsRecycle(questions) {
    const searchResults = document.getElementById('search-results');
    searchResults.innerHTML = '';
    if (questions.length === 0) {
        searchResults.innerHTML = '<p>Nenhuma questão encontrada.</p>';
    } else {
        questions.forEach(question => {
            const div = document.createElement('div');
            div.className = 'search-result';
            div.innerHTML = `
                <div class="search-result-item">
                    <input type="radio" name="question-select" value="${question.id}" id="question-${question.id}" />
                    <label for="question-${question.id}">${question.body}</label>
                </div>
            `;
            searchResults.appendChild(div);
        });
    }
    // Anuncia o resultado para leitores de tela (debounce: digitação rápida
    // não dispara um anúncio por tecla)
    clearTimeout(timerAnuncioResultados);
    timerAnuncioResultados = setTimeout(() => {
        anunciarSr(questions.length === 0
            ? 'Nenhuma questão encontrada'
            : `${questions.length} ${questions.length === 1 ? 'questão encontrada' : 'questões encontradas'}`);
    }, 500);
}

// Função para buscar e renderizar questões com base no input de pesquisa
async function searchQuestions() {
    const query = document.getElementById('search-question').value.toLowerCase();
    const filteredQuestions = questionsRecycle.filter(q => q.body.toLowerCase().includes(query));
    renderQuestionsRecycle(filteredQuestions);
}

function addQuestionFromModal(question) {
    const questionId = `question-${Date.now()}`;
    const questionCard = document.createElement('div');
    questionCard.classList.add('card', 'question-card');
    questionCard.dataset.position = document.getElementById('questions-container').children.length;

    let alternativesHtml = '';

    if (question.type === 'Multipla Escolha' || question.type === 'Unica Escolha' || question.type === 'Unica Escolha-Bairro' || question.type === 'Unica Escolha-Ubs' || question.type === 'Unica Escolha-Setor') {
        const options = question.Options || [];
        alternativesHtml = options.map((option, index) => {
            const alternativeId = `${questionId}-alt-${index}`;
            return `
                <div class="input-group mb-2">
                    <input type="${question.type === 'Multipla Escolha' ? 'checkbox' : 'radio'}" name="${questionId}-alternatives" id="${alternativeId}" class="mr-2" aria-label="Selecionar alternativa">
                    <label class="sr-only" for="${alternativeId}-text">Texto da alternativa</label>
                    <input type="text" id="${alternativeId}-text" class="form-control question-alternatives alternative-input" value="${option.text}" placeholder="Digite a alternativa">
                    <div class="input-group-append">
                        <button type="button" class="btn btn-danger btn-remove-alternative" data-alternative-id="${alternativeId}" aria-label="Remover alternativa">X</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    questionCard.innerHTML = `
        <div class="card-body" id="${questionId}">
            <div class="d-flex justify-content-between align-items-center">
                <h2 class="card-title"></h2>
                <div>
                    <button type="button" class="btn btn-light btn-move-up" aria-label="Mover questão para cima">↑</button>
                    <button type="button" class="btn btn-light btn-move-down" aria-label="Mover questão para baixo">↓</button>
                </div>
            </div>
            <div class="form-group">
                <label for="${questionId}-text">Texto da Questão</label>
                <input type="text" class="form-control question-body" id="${questionId}-text" value="${question.body}" placeholder="Digite o texto da questão">
            </div>
            <div class="form-group">
                <label for="${questionId}-type">Tipo de Questão</label>
                    <select class="form-control question-type-select" id="${questionId}-type">
                        <option value="Resposta Curta" ${question.type === 'Resposta Curta' ? 'selected' : ''}>Resposta Curta</option>
                        <option value="Multipla Escolha" ${question.type === 'Multipla Escolha' ? 'selected' : ''}>Múltipla Escolha</option>
                        <option value="Unica Escolha" ${question.type === 'Unica Escolha' ? 'selected' : ''}>Única Escolha</option>
                        <option value="Unica Escolha-Bairro" ${question.type === 'Unica Escolha-Bairro' ? 'selected' : ''}>Única Escolha-Bairro</option>
                        <option value="Unica Escolha-Ubs" ${question.type === 'Unica Escolha-Ubs' ? 'selected' : ''}>Única Escolha-Ubs</option>
                        <option value="Unica Escolha-Setor" ${question.type === 'Unica Escolha-Setor' ? 'selected' : ''}>Única Escolha-Setor</option>
                    </select>
            </div>
            ${question.type === 'Resposta Curta' ? '' : `<div id="${questionId}-alternatives" class="form-group overflow-auto">${alternativesHtml}</div>`}
            <button type="button" class="btn btn-danger remove-question-btn">Remover Questão</button>
        </div>
    `;

    document.getElementById('questions-container').appendChild(questionCard);
    initCustomSelect(questionCard.querySelector('select.question-type-select'));
    renumberPositions(); // preenche o título "Questão N" e ajusta as setas ↑↓

    questionCard.querySelector('.btn-move-up').addEventListener('click', () => moveQuestion(questionId, 'up'));
    questionCard.querySelector('.btn-move-down').addEventListener('click', () => moveQuestion(questionId, 'down'));
    questionCard.querySelector('.question-type-select').addEventListener('change', () => changeQuestionType(questionId));
    questionCard.querySelector('.remove-question-btn').addEventListener('click', () => removeQuestion(questionId));
}

export async function HandlerRecycleEvents() {
    
// Adiciona o listener para o input de pesquisa
document.getElementById('search-question').addEventListener('input', searchQuestions);

// Chamada inicial para pegar e renderizar todas as questões quando o modal é aberto
document.getElementById('pesquisarQuestaoModal').addEventListener('shown.bs.modal', async function() {
    renderQuestionsRecycle(questionsRecycle);
});

document.getElementById('btn-select-question').addEventListener('click', function () {
    const selectedRadio = document.querySelector('input[name="question-select"]:checked');
    if (selectedRadio) {
        const questionId = selectedRadio.value;
        const selectedQuestion = questionsRecycle.find(q => q.id === parseInt(questionId, 10));
        if (selectedQuestion) {
            addQuestionFromModal(selectedQuestion);
            mostrarMensagem('Questão copiada com Sucesso!','success',4);
        }
    } else {
        mostrarMensagem('Por favor, selecione uma questão.','info',4);
    }
});
}