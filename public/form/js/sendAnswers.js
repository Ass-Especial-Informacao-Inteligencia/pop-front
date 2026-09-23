import { getCookie, api } from '../../js/api.js'; // cliente API centralizado
import { mostrarMensagem } from '../../js/geraNotificacao.js';

export async function capturarRespostas(ev) {
    ev.preventDefault();
    const answersData = [];
    let numCaseRemoveCountForForm = 3;
    const questionsGroup = document.querySelectorAll('.form-group'); // Assume que há apenas um formulário na página
    const btnSubmitForOpenModal = document.getElementById('enviarRespostasFormulario'); // Assume que há apenas um formulário na página

    // Variável para verificar se todos os campos estão preenchidos
    let allFieldsValid = true;

    questionsGroup.forEach((questionContainer, index) => {
        if (index === 9) {
            numCaseRemoveCountForForm++;
        }
        const questionLabel = questionContainer.querySelector('label');
       
        const questionId = questionLabel.dataset.id;
        
        const inputsCheckbox = questionContainer.querySelectorAll(
            'input[type="checkbox"]:checked'
        );
    
        let questionType = questionLabel.dataset.type;
    
        if (questionType === 'Unica Escolha-Bairro' || questionType === 'Unica Escolha-Ubs' || questionType === 'Unica Escolha-Setor') {
            questionType = 'Unica Escolha';
        }
    
        const answer = [];
    
        if (inputsCheckbox.length > 0) {
            inputsCheckbox.forEach((input) => {
                answer.push(input.nextSibling.textContent.trim());
            });
        } else {
            const inputText =
                questionContainer.querySelector('input[type="text"]');
            if (inputText && inputText.value.trim() !== '') {
                answer.push(inputText.value.trim());
            } else {
                const selectInput =
                    questionContainer.querySelector('select');
                if (selectInput) {
                    answer.push(selectInput.options[selectInput.selectedIndex].text.trim());
                } else {
                    const inputRadio = questionContainer.querySelector(
                        'input[type="radio"]:checked'
                    );
                    if (inputRadio) {
                        answer.push(inputRadio.nextSibling.textContent.trim());
                    } else {
                        // Se nenhum tipo de input foi selecionado, marcamos como campo não preenchido
                        allFieldsValid = false;
                        // Adicionar classe ou outra lógica para indicar campo não preenchido visualmente
                        questionContainer.classList.add('campo-nao-preenchido');
                    }
                }
            }
        }
    
        const answers = {
            questionId,
            questionType, // Renomeando para se adequar ao formato esperado no servidor
            answer,
        };
        answersData.push(answers);
    });

    // Se algum campo não estiver preenchido, não fazemos o fetch
    if (!allFieldsValid) {
        mostrarMensagem("Existem campos não preenchidos!","danger",5);
        // Aqui você pode adicionar lógica para exibir mensagens de erro ao usuário
        return;
    } else {
        btnSubmitForOpenModal.dataset.toggle = "modal";
        btnSubmitForOpenModal.dataset.target = "#confirmacaoModal";
    }

    const title = getCookie('form');

    // Envia respostas do formulário via api centralizada
    try {
        const response = await api.post(`/form/${title}/saveAnswers`, { answersData });
        if (!response.ok) {
            throw new Error('Erro ao salvar respostas');
        }
        const data = await response.json();
    } catch (error) {
        console.error('Erro ao salvar respostas:', error);
    }
}
