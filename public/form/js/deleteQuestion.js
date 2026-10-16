import { fetchDeleteQuestion } from './fetch.js';
import { renumberPositions } from './manterQuestaoAlternativa.js';
import { anunciarSr } from '../../js/geraNotificacao.js';
import { confirmarAcao } from '../../js/components/confirmarAcao.js';

export async function deleteQuestion() {
    document.addEventListener('click', async function (event) {
        if (event.target.classList.contains('remove-question-btn-fetch')) {
            const card = event.target.parentNode;
            const body = card.querySelector('input.form-control.question-body').value.trim();
            const idQuestion = card.getAttribute('data-question-id');

            const ok = await confirmarAcao(
                'Remover questão',
                body
                    ? `A questão "${body}" será removida do formulário. Deseja continuar?`
                    : 'Deseja remover esta questão do formulário?'
            );
            if (!ok) return;

            fetchDeleteQuestion(body,idQuestion);
            card.parentNode.remove();
            renumberPositions(); // mantém data-position sem buracos após remoção
            // Devolve o foco a um elemento estável (o foco anterior sumiu com o card)
            anunciarSr('Questão removida');
            document.getElementById('btnAddQuestionForm')?.focus();
        }
    });
}
