import { getCookie, api } from '../../js/api.js'; // cliente API centralizado
import { mostrarMensagem } from './geraNotificacao.js';

export async function captureAndSendQuestions() {
    const questionsData = [];
    const questionCards = document.querySelectorAll('.question-card');

    questionCards.forEach((questionCard) => {
        // Garantir que a posição esteja atualizada
        const questionId = questionCard.querySelector('.card-body')?.getAttribute('data-question-id');
        const questionBody = questionCard.querySelector('.question-body')?.value.trim().replace(/[`"\'´‘’“”‛›«»]/g, '');
        let questionType = questionCard.querySelector('.question-type-select')?.value.trim();
        const position = questionCard.dataset.position;
        //Condicional para alterar o tipo de questionType para Unica Escolha
        if (questionType ==='Unica Escolha-Bairro' || questionType === 'Unica Escolha-Ubs' || questionType === 'Unica Escolha-Setor') {
            questionType = 'Unica Escolha'
        }

        // Validar dados obrigatórios
        if (!questionBody || !questionType) {
            console.warn('Dados inválidos para uma das questões. Ignorando...');
            return;
        }

        const options = [];
        if (questionType === 'Multipla Escolha' || questionType === 'Unica Escolha') {
            const optionInputs = questionCard.querySelectorAll('.question-alternatives');
            for (const input of optionInputs) {
                const idOption = input.dataset.idoption;
                const optionValue = input.value.trim();
                if (optionValue) {
                    options.push({ text: optionValue, id: idOption });
                }
            }
        }
        const questionData = {
            questionId,
            questionBody,
            questionType,
            options,
            position,
        };
        questionsData.push(questionData);
    });

    const title = getCookie('form');
    if (!title) {
        mostrarMensagem('Título do formulário não encontrado.', 'danger', 5);
        return;
    }

    try {
        const response = await api.post(`/forms/link/${title}/questions`, { allQuestionsData: questionsData });

        if (!response.ok) {
            throw new Error(`Falha ao enviar as questões: ${response.statusText}`);
        }

        await response.json();
        mostrarMensagem('Questões enviadas com sucesso!', 'success', 5);
        setTimeout(() => { location.href = '/home'; }, 500);
    } catch (error) {
        console.error('Erro ao enviar as questões:', error);
        mostrarMensagem(`Erro ao enviar as questões: ${error.message}`, 'danger', 5);
    }
}

