import { mostrarMensagem } from '../../js/geraNotificacao.js';
import { fetchDeleteAlternatives } from './fetch.js';
import { confirmarAcao } from '../../js/components/confirmarAcao.js';

export function deleteAlternatives() {
    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('btn-remove-alternative-fetch')) {
            const alternativeId = event.target.getAttribute(
                'data-alternative-id'
            );
            const alternativeContainer =
                document.getElementById(alternativeId).parentNode;

            if (!alternativeContainer) {
                console.error('Alternative container not found');
                return;
            }

            const inputAlternativa =
                alternativeContainer.querySelector('input[type="text"]');

            if (!inputAlternativa) {
                console.error('Input for alternative text not found');
                return;
            }

            const inputText = inputAlternativa.value.trim();
            const questionCard = alternativeContainer.closest('.question-card');

            confirmarAcao(
                'Remover alternativa',
                inputText
                    ? `A alternativa "${inputText}" será removida. Deseja continuar?`
                    : 'Deseja remover esta alternativa?'
            ).then((ok) => {
                if (!ok) return;

                if (!inputText) {
                    removeAlternativeElement(alternativeContainer, questionCard);
                    return;
                }

                const questionBody = alternativeContainer
                    .closest('.card')
                    .querySelector('.form-group .question-body').value;

                const alternativeGroup = {
                    id: inputAlternativa.dataset.idoption,
                    text: inputText,
                    body: questionBody,
                };
                fetchDeleteAlternatives(alternativeGroup)
                    .then(() => {
                        mostrarMensagem('Alternativa Excluída com sucesso!','success',5);
                        removeAlternativeElement(alternativeContainer, questionCard);
                    })
                    .catch((error) => {
                        console.error('Error deleting alternative:', error);
                    });
            });
        }
    });
}

function removeAlternativeElement(alternativeContainer, questionCard) {
    alternativeContainer.remove();
    // Devolve o foco a um elemento estável do card (o X removido sumiu com o foco)
    const alvo = questionCard?.querySelector('.add-alternative-btn')
        || questionCard?.querySelector('.question-body');
    alvo?.focus();
}
