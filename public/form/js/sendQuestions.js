import { getCookie } from '../../js/api.js';

export async function captureAndSendQuestions() {
    const questionsData = [];
    const questionCards = document.querySelectorAll('.question-card');

    questionCards.forEach((questionCard) => {
        // Garantir que a posição esteja atualizada
        const questionId = questionCard.querySelector('.card-body')?.getAttribute('data-question-id');
        const questionBody = questionCard.querySelector('.question-body')?.value.trim().replace(/[`"\'´‘’“”‛›«»]/g, '');
        let questionType = questionCard.querySelector('.question-type-select')?.value.trim();
        const position = questionCard.dataset.position;
        console.log(questionId);
        //Condicional para alterar o tipo de quesitonType para Unica Escolha
        if (questionType ==='Unica Escolha-Bairro' || questionType === 'Unica Escolha-Ubs' || questionType === 'Unica Escolha-Setor') {
            questionType = 'Unica Escolha'
        }

        // Validar dados obrigatórios
        if (!questionBody || !questionType) {
            console.warn('Dados inválidos para uma das questões. Ignorando...');
            return;
        }

        const options = [];
        if (questionType === 'Multipla Escolha' || questionType === 'Unica Escolha' || questionType === 'Unica Escolha-Bairro' || questionType === 'Unica Escolha-Ubs' || questionType === 'Unica Escolha-Setor') {
            const optionInputs = questionCard.querySelectorAll('.question-alternatives');
            optionInputs.forEach(async (input) => {
                const idOption = input.dataset.idoption;
                const optionValue = input.value.trim();
                if (optionValue) {
                    options.push({ text: optionValue, id: idOption });
                }                
            });
        }
        const questionData = {
            questionId,
            questionBody,
            questionType,
            options,
            position,
        };
        questionsData.push(questionData);
        console.log(questionData);
    });

    const title = getCookie('form');
    if (!title) {
        alert('Título do formulário não encontrado.');
        return;
    }

    try {
        const response = await fetch(`/forms/link/${title}/questions`, {
            method: 'POST',
            body: JSON.stringify({ allQuestionsData: questionsData }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error(`Falha ao enviar as questões: ${response.statusText}`);
        }

        const data = await response.json();
        alert('Questões enviadas com sucesso!');
        location.href = '/home';
    } catch (error) {
        console.error('Erro ao enviar as questões:', error);
        alert(`Erro ao enviar as questões: ${error.message}`);
    }
}

