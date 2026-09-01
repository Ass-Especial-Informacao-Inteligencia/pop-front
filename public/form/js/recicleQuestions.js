import { questionsRecicle } from '../indexForm.js';
import { getCookie } from '../../js/api.js';
import { mostrarMensagem } from './geraNotificacao.js';

// Função para pegar todas as questões
export async function getQuestions() {
    const title = getCookie('form');
    try {
        const response = await fetch(`/questions/${title}/all`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const questions = await response.json();
        console.log(questions);
        
        return questions;
    } catch (error) {
        console.error('Erro ao buscar as questões:', error);
        return [];
    }
}

// Função para renderizar as questões no modal
function renderQuestionsRecicle(questions) {
    const searchResults = document.getElementById('search-results');
    searchResults.innerHTML = '';
    if (questions.length === 0) {
        searchResults.innerHTML = '<p>Nenhuma questão encontrada.</p>';
        return;
    }
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

// Função para buscar e renderizar questões com base no input de pesquisa
async function searchQuestions() {
    const query = document.getElementById('search-question').value.toLowerCase();
    const filteredQuestions = questionsRecicle.filter(q => q.body.toLowerCase().includes(query));
    renderQuestionsRecicle(filteredQuestions);
}

function addQuestionFromModal(question) {
    const questionId = `question-${Date.now()}`;
    const questionCard = document.createElement('div');
    questionCard.classList.add('card', 'question-card');
    questionCard.dataset.position = document.getElementById('questions-container').children.length;

    let alternativesHtml = '';

    if (question.type === 'Multipla Escolha' || question.type === 'Unica Escolha' || question.type === 'Unica Escolha-Bairro' || question.type === 'Unica Escolha-Ubs' || question.type === 'Unica Escolha-Setor') {
        alternativesHtml = question.Options.map((option, index) => {
            const alternativeId = `${questionId}-alt-${index}`;
            return `
                <div class="input-group mb-2">
                    <input type="${question.type === 'Multipla Escolha' ? 'checkbox' : 'radio'}" name="${questionId}-alternatives" id="${alternativeId}" class="mr-2">
                    <input type="text" class="form-control question-alternatives" style="width: calc(100% - 90px);" value="${option.text}" placeholder="Digite a alternativa">
                    <div class="input-group-append">
                        <button type="button" class="btn btn-danger btn-remove-alternative" data-alternative-id="${alternativeId}" onclick="removeAlternative('${alternativeId}')">X</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    questionCard.innerHTML = `
        <div class="card-body" id="${questionId}">
            <div class="d-flex justify-content-between align-items-center">
                <h5 class="card-title">${question.body}</h5>
                <div>
                    <button type="button" class="btn btn-light btn-move-up" onclick="moveQuestion('${questionId}', 'up')">↑</button>
                    <button type="button" class="btn btn-light btn-move-down" onclick="moveQuestion('${questionId}', 'down')">↓</button>
                </div>
            </div>
            <div class="form-group">
                <label for="${questionId}-text">Texto da Questão</label>
                <input type="text" class="form-control question-body" id="${questionId}-text" value="${question.body}" placeholder="Digite o texto da questão">
            </div>
            <div class="form-group">
                <label for="${questionId}-type">Tipo de Questão</label>
                <select class="form-control question-type-select" id="${questionId}-type" onchange="changeQuestionType('${questionId}')">
                    <option value="Resposta Curta" ${question.type === 'Resposta Curta' ? 'selected' : ''}>Resposta Curta</option>
                    <option value="Multipla Escolha" ${question.type === 'Multipla Escolha' ? 'selected' : ''}>Múltipla Escolha</option>
                    <option value="Unica Escolha" ${question.type === 'Unica Escolha' ? 'selected' : ''}>Única Escolha</option>
                </select>
            </div>
            ${question.type === 'Resposta Curta' ? '' : `<div id="${questionId}-alternatives" class="form-group overflow-auto"  style="max-height:200px;">${alternativesHtml}</div>`}
            <button type="button" class="btn btn-danger" onclick="removeQuestion('${questionId}')">Remover Questão</button>
        </div>
    `;

    document.getElementById('questions-container').appendChild(questionCard);
}

export async function HandlerRecicleEvents() {
    
// Adiciona o listener para o input de pesquisa
document.getElementById('search-question').addEventListener('input', searchQuestions);

// Chamada inicial para pegar e renderizar todas as questões quando o modal é aberto
document.getElementById('pesquisarQuestaoModal').addEventListener('shown.bs.modal', async function() {
    renderQuestionsRecicle(questionsRecicle);
});

document.getElementById('btn-select-question').addEventListener('click', function () {
    const selectedRadio = document.querySelector('input[name="question-select"]:checked');
    if (selectedRadio) {
        const questionId = selectedRadio.value;
        const selectedQuestion = questionsRecicle.find(q => q.id === parseInt(questionId));
        if (selectedQuestion) {
            addQuestionFromModal(selectedQuestion);
            mostrarMensagem('Questão copiada com Sucesso!','success',4);
        }
    } else {
        mostrarMensagem('Por favor, selecione uma questão.','info',4);
    }
});
}