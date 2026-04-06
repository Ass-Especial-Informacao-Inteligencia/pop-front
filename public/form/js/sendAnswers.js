import { getCookie } from './getCookie.js';
import { mostrarMensagem } from './geraNotificacao.js';

export function capturarRespostas(ev) {
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
    
        // Se o questionType for "Unica Escolha-Bairro", altere para "Unica Escolha"
        if (questionType === 'Unica Escolha-Bairro') {
            questionType = 'Unica Escolha';
        }
        if (questionType === 'Unica Escolha-Setor') {
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

    console.log(answersData);

    const title = getCookie('form');

    // Enviar as respostas capturadas para o servidor
    fetch(`/form/${title}/saveAnswers`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answersData }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Erro ao salvar respostas');
            }
            return response.json();
        })
        .then((data) => {
            console.log('Respostas salvas com sucesso:', data.message);
            // Aqui você pode adicionar qualquer lógica adicional após o salvamento das respostas, se necessário
        })
        .catch((error) => {
            console.error('Erro ao salvar respostas:', error);
            // Tratar erros de salvamento, se necessário
        });
}
