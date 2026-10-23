import { getCookie, api } from '../../js/api.js'; // cliente API centralizado
import { mostrarMensagem, anunciarSr } from '../../js/geraNotificacao.js';

export async function capturarRespostas(ev) {
    ev.preventDefault();
    const answersData = [];
    let numCaseRemoveCountForForm = 3;
    const questionsGroup = document.querySelectorAll('.form-group'); // Assume que há apenas um formulário na página
    const btnSubmitForOpenModal = document.getElementById('enviarRespostasFormulario'); // Assume que há apenas um formulário na página

    // Variável para verificar se todos os campos estão preenchidos
    let allFieldsValid = true;

    questionsGroup.forEach((questionContainer, index) => {
        questionContainer.classList.remove('campo-nao-preenchido'); // limpa a marca da tentativa anterior
        if (index === 9) {
            numCaseRemoveCountForForm++;
        }
        
        const questionId = questionContainer.dataset.id;
        
        const inputsCheckbox = questionContainer.querySelectorAll(
            'input[type="checkbox"]:checked'
        );
    
        let questionType = questionContainer.dataset.type;
    
        // Subtipos legados (Unica Escolha-Bairro/Ubs/Setor) são enviados como o tipo base
        if (questionType?.startsWith('Unica Escolha') && questionType !== 'Unica Escolha') {
            questionType = 'Unica Escolha';
        }
    
        const answer = [];
    
        if (inputsCheckbox.length > 0) {
            inputsCheckbox.forEach((input) => {
                answer.push(input.nextSibling.textContent.trim());
            });
        } else {
            // Combobox (>9 opções): o valor vive no hidden [data-combobox-value]; o campo de busca é input[type=text], então este branch precisa vir antes do texto
            const comboboxValue = questionContainer.querySelector('[data-combobox-value]');
            if (comboboxValue) {
                if (comboboxValue.value !== '') {
                    answer.push(comboboxValue.value);
                } else {
                    allFieldsValid = false;
                    questionContainer.classList.add('campo-nao-preenchido');
                }
            } else {
                const inputText =
                    questionContainer.querySelector('input[type="text"]');
                if (inputText && inputText.value.trim() !== '') {
                    answer.push(inputText.value.trim());
                } else {
                    const selectInput =
                        questionContainer.querySelector('select');
                    if (selectInput) {
                        // value '' = opção placeholder selecionada = questão sem resposta
                        if (selectInput.value !== '') {
                            answer.push(selectInput.options[selectInput.selectedIndex].text.trim());
                        } else {
                            allFieldsValid = false;
                            questionContainer.classList.add('campo-nao-preenchido');
                        }
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
        // was-validated só agora (no carregamento deixaria toda questão vazia vermelha) + foco no 1º campo faltante
        btnSubmitForOpenModal.form?.classList.add('was-validated');
        document.querySelector(
            '#formulario-container .campo-nao-preenchido input:not([disabled]), #formulario-container .campo-nao-preenchido select:not([disabled])'
        )?.focus();
        mostrarMensagem("Existem campos não preenchidos!","danger",5);
        return;
    }

    const title = getCookie('form');

    // Envia respostas do formulário via api centralizada
    try {
        const response = await api.post(`/form/${title}/saveAnswers`, { answersData });
        if (!response.ok) {
            throw new Error('Erro ao salvar respostas');
        }
        // Modal só depois do servidor confirmar (antes abria otimista no clique e mostrava "salvo" mesmo em erro)
        window.jQuery('#confirmacaoModal').modal('show');
        anunciarSr('Respostas salvas com sucesso');
    } catch (error) {
        console.error('Erro ao salvar respostas:', error);
        mostrarMensagem('Erro ao salvar respostas!', 'danger', 7);
    }
}
