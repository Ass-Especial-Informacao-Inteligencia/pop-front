import { mostrarMensagem } from '../js/geraNotificacao.js';
import { fetchDeleteAlternatives } from './fetch.js';

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
            if (!inputText) {
                removeAlternativeElement(alternativeContainer);
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
                    removeAlternativeElement(alternativeContainer);
                })
                .catch((error) => {
                    console.error('Error deleting alternative:', error);
                });
        }
    });
}

function removeAlternativeElement(alternativeContainer) {
    alternativeContainer.remove();
}
