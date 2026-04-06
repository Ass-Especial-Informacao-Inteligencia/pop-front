import { fetchDeleteQuestion } from './fetch.js';

export async function deleteQuestion() {
    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('remove-question-btn-fetch')) {
            const card = event.target.parentNode;
            const body = card.querySelector('input.form-control.question-body').value.trim();
            const idQuestion = card.getAttribute('data-question-id');

            fetchDeleteQuestion(body,idQuestion);
            card.parentNode.remove();
        }
    });
}
