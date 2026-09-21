import { mostrarMensagem } from "../js/geraNotificacao.js";
import { api } from '../../js/api.js';
import { initCustomSelect } from '../../js/components/customSelect.js';
let isRequestInProgress = false; // Variável de controle
export function addQuestion() {
  if (isRequestInProgress) return; // Impede múltiplos cliques

  isRequestInProgress = true; // Marca a requisição como em andamento
  const questionId = `question-${Date.now()}`;
  const questionCard = document.createElement('div');
  questionCard.classList.add('card', 'question-card');
  questionCard.dataset.position = document.getElementById('questions-container').children.length; // Define a posição inicial
  questionCard.innerHTML = `
  <div class="card-body" id="${questionId}">
    <div class="d-flex justify-content-between align-items-center">
      <h5 class="card-title">Nova Questão</h5>
      <div>
        <button type="button" class="btn btn-light btn-move-up" onclick="moveQuestion('${questionId}', 'up')">↑</button>
        <button type="button" class="btn btn-light btn-move-down" onclick="moveQuestion('${questionId}', 'down')">↓</button>
      </div>
    </div>
    <div class="form-group">
      <label for="${questionId}-text">Texto da Questão</label>
      <input type="text" class="form-control question-body" id="${questionId}-text" placeholder="Digite o texto da questão">
    </div>
    <div class="form-group">
      <label for="${questionId}-type">Tipo de Questão</label>
      <select class="form-control question-type-select" id="${questionId}-type" onchange="changeQuestionType('${questionId}')">
        <option value="Resposta Curta">Resposta Curta</option>
        <option value="Multipla Escolha">Múltipla Escolha</option>
        <option value="Unica Escolha">Única Escolha</option>
        <option value="Unica Escolha-Bairro">Única Escolha (bairros)</option>
        <option value="Unica Escolha-Ubs">Única Escolha (UBS)</option>
        <option value="Unica Escolha-Setor">Única Escolha (Bairros-Setor)</option>
      </select>
    </div>
    <div id="${questionId}-alternatives" class="form-group"></div>
    <button type="button" class="btn btn-danger" onclick="removeQuestion('${questionId}')">Remover Questão</button>
  </div>
`;
  document.getElementById('questions-container').appendChild(questionCard);
  initCustomSelect(questionCard.querySelector('select.question-type-select'));
      // Exemplo de reabilitação após uma ação fictícia
      setTimeout(() => { // Simulando uma operação assíncrona
        isRequestInProgress = false; // Reabilita o botão após a operação
    }, 1000); // Ajuste conforme necessário
}

// Atualize displayFormQuestionsFromFetch da mesma forma
function displayFormQuestionsFromFetch(questions) {
    const questionsContainer = document.getElementById('questions-container');
    questionsContainer.innerHTML = '';
    
    questions.forEach((question, index) => {
        const questionId = `question-${index}`;
        const questionCard = document.createElement('div');
        questionCard.classList.add('card', 'question-card');
        questionCard.dataset.position = index;
        questionCard.innerHTML = `
          <div class="card-body" id="${questionId}" data-question-id="${question.id}">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="card-title">Questão ${index + 1}</h5>
                <div>
                  <button type="button" class="btn btn-light btn-move-up" onclick="moveQuestion('${questionId}', 'up')">↑</button>
                  <button type="button" class="btn btn-light btn-move-down" onclick="moveQuestion('${questionId}', 'down')">↓</button>
                </div>
              </div>
              <div class="form-group">
                  <label for="${questionId}-text">Texto da Questão</label>
                  <input type="text" class="form-control question-body" id="${questionId}-text" placeholder="Digite o texto da questão" value="${question.body}" required>
              </div>
              <div class="form-group">
                  <label for="${questionId}-type">Tipo de Questão</label>
                  <select class="form-control question-type-select" id="${questionId}-type" onchange="changeQuestionType('${questionId}')">
                      <option value="Resposta Curta" ${question.type === 'Resposta Curta' ? 'selected' : ''}>Resposta Curta</option>
                      <option value="Multipla Escolha" ${question.type === 'Multipla Escolha' ? 'selected' : ''}>Múltipla Escolha</option>
                      <option value="Unica Escolha" ${question.type === 'Unica Escolha' ? 'selected' : ''}>Única Escolha</option>
                      <option value="Unica Escolha-Bairro" ${question.type === 'Unica Escolha-Bairro' ? 'selected' : ''}>Única Escolha (Bairros)</option>
                      <option value="Unica Escolha-Ubs" ${question.type === 'Unica Escolha-Ubs' ? 'selected' : ''}>Única Escolha (UBS)</option>
                        <option value="Unica Escolha-Setor" ${question.type === 'Unica Escolha-Setor' ? 'selected' : ''}>Única Escolha (Bairros-Setor)</option>

                      </select>
              </div>
              <div id="${questionId}-alternatives" class="form-group overflow-auto"></div>
              <button type="button" class="remove-question-btn-fetch btn btn-danger" onclick="removeQuestion('${questionId}')">Remover Questão</button>
          </div>
      `;
        questionsContainer.appendChild(questionCard);
        initCustomSelect(questionCard.querySelector('select.question-type-select'));
  
        // Se a pergunta for de múltipla escolha ou única escolha, exiba as opções
        if (question.type === 'Multipla Escolha' || question.type === 'Unica Escolha' || question.type === 'Unica Escolha-Bairro' || question.type === 'Unica Escolha-Ubs' || question.type === 'Unica Escolha-Setor') {
            const addAlternativeButton = document.createElement('button');
            addAlternativeButton.type = 'button';
            addAlternativeButton.classList.add('btn', 'btn-secondary', 'mt-2', 'mb-2');
            addAlternativeButton.innerText = 'Adicionar Alternativa';
            addAlternativeButton.onclick = () => addAlternative(questionId, question.type);
            document.getElementById(`${questionId}-alternatives`).appendChild(addAlternativeButton);
  
            question.Options.forEach((option, i) => {
                const alternativeIdGerado = `${questionId}-alt-${i}`;
                const alternativeId = option.id;
                const alternativeContainer = document.createElement('div');
                alternativeContainer.classList.add('input-group', 'mb-2');
  
                alternativeContainer.innerHTML = `
                  <input type="${question.type === 'Multipla Escolha' ? 'checkbox' : 'radio'}" name="${questionId}-alternatives" id="${alternativeIdGerado}" class="mr-2">
                  <input type="text" data-idoption="${alternativeId}" class="form-control question-alternatives alternative-input" placeholder="Digite a alternativa" value="${option.text}">
                  <div class="input-group-append">
                      <button type="button" class="btn btn-danger btn-remove-alternative-fetch" data-alternative-id="${alternativeIdGerado}">X</button>
                  </div>
              `;
                document.getElementById(`${questionId}-alternatives`).appendChild(alternativeContainer);
            });
        }
    });
}

// carrega perguntas ja cadastradas
export async function fetchFormQuestions(formName) {
    try {
        const response = await api.get(`/getFullForm/${formName}`);
        if (!response.ok) {
            throw new Error('Failed to fetch form questions');
        }
        const formData = await response.json();
        
        const formTitle = document.getElementById('form-title');
        const formDescription = document.getElementById('form-description');

        formTitle.textContent = formData.title;
        formDescription.textContent = formData.description;
        
        displayFormQuestionsFromFetch(formData.Questions);
        liberarEdicaoParaFormularioNovo(formData.created_at,formData.active,formData.expiry_date);
    } catch (error) {
        console.error('Error fetching form questions:', error);
    }
}

function liberarEdicaoParaFormularioNovo(dataCriacao, formActive, dataExpiracao) {
    const horarioDataAtual = new Date();
    const tempoParaEditarEmMinutos = 240; // 4 hora

    // Verifica se dataCriacao é válida
    let dateMaxEditForm = null;
    if (dataCriacao) {
        dateMaxEditForm = new Date(dataCriacao);
        dateMaxEditForm.setMinutes(dateMaxEditForm.getMinutes() + tempoParaEditarEmMinutos);
    }

    // Verifica se dataExpiracao é válida
    let dateExpiryForm = null;
    if (dataExpiracao) {
        dateExpiryForm = new Date(dataExpiracao);
    }

    // não permite edição de forms ativos com criação a mais de 1 hora, caso seja novo permite edição de até uma hora
    if (formActive && dateMaxEditForm && horarioDataAtual > dateMaxEditForm) {
        desativaBotoesForm(formActive);
        mostrarMensagem('Formulários Ativos não podem ser Editados! Arquive o formulário caso queira editar!', 'info', 6);
    } 

    // não permite editar forms finalizados se dataExpiryForm for válida
    if (!formActive && dateExpiryForm && horarioDataAtual > dateExpiryForm) {
        desativaBotoesForm(!formActive);
        mostrarMensagem('Formulários Finalizados não podem ser Editados! Arquive o formulário caso queira editar!','info',6);
    }
}

function desativaBotoesForm(formActive) {
    const formulario = document.getElementById('formulario');
    const btnExternos = document.querySelectorAll('#btnSalvarForm,#btnEditarTituloDescricao,#btnAddQuestionForm,#btnRecicleQuestionForm');
    const elements = formulario.querySelectorAll('button, input, select');

    elements.forEach(el => el.disabled = formActive);
    btnExternos.forEach(el => el.disabled=formActive);
}

