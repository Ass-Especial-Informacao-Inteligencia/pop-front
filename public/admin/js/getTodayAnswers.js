import { api } from '../../../js/api.js'; // cliente API centralizado
import { mostrarMensagem } from '../../js/geraNotificacao.js';

document.addEventListener('DOMContentLoaded', () => {
    let currentPage = 1;
    let totalAnswers = [];

    const paginationInput = document.getElementById('pagination');
    const monthFilter = document.getElementById('month-filter');
    const answersContainer = document.getElementById('answers-container');
    const itemsPerPage = parseInt(paginationInput.value, 10) || 10;

    document.getElementById('filter-btn').addEventListener('click', () => {
        currentPage = 1;
        fetchAnswers();
    });

    document.getElementById('next-page').addEventListener('click', () => {
        if (currentPage * itemsPerPage < totalAnswers.length) {
            currentPage++;
            displayAnswers(totalAnswers);
        }
    });

    document.getElementById('prev-page').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayAnswers(totalAnswers);
        }
    });

    function filterAnswers(answers) {
        const month = monthFilter.value;

        if (!month) {
            return answers;
        }

        const [year, monthNumber] = month.split('-');

        return answers.filter((answer) => {
            const answerDate = new Date(answer.createdAt);
            return (
                answerDate.getFullYear() === parseInt(year, 10) &&
                answerDate.getMonth() + 1 === parseInt(monthNumber, 10)
            );
        });
    }

    async function fetchAnswers() {
        try {
            // Busca todas as respostas via api centralizada
            const response = await api.get('/allAnswers');

            if (!response.ok) {
                throw new Error(`Erro: ${response.status}`);
            }

            const answers = await response.json();
            totalAnswers = filterAnswers(answers);
            displayAnswers(totalAnswers);
        } catch (error) {
            console.error('Erro ao buscar respostas:', error);
            answersContainer.innerHTML = '<p>Erro ao carregar as respostas.</p>';
        }
    }

    function displayAnswers(answers) {
        answersContainer.innerHTML = '';

        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedAnswers = answers.slice(start, end);

        if (paginatedAnswers.length === 0) {
            answersContainer.innerHTML =
                '<p>Nenhuma resposta encontrada para os filtros aplicados.</p>';
            return;
        }

        const table = document.createElement('table');
        table.classList.add('answers-table');

        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Entrevistado</th>
                <th>Pergunta</th>
                <th>Resposta</th>
                <th>Usuário</th>
                <th>Formulário</th>
                <th>Data de Criação</th>
                <th>Ações</th>
            </tr>
        `;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        const groupedAnswers = paginatedAnswers.reduce((acc, answer) => {
            if (!acc[answer.interviewed]) {
                acc[answer.interviewed] = [];
            }
            acc[answer.interviewed].push(answer);
            return acc;
        }, {});

        Object.keys(groupedAnswers).forEach((interviewed) => {
            const group = groupedAnswers[interviewed];

            group.forEach((answer, index) => {
                const questionId = answer.Question ? answer.Question.id : answer.question_id;
                const row = document.createElement('tr');

                if (index === 0) {
                    row.innerHTML = `
                        <td rowspan="${group.length}">${interviewed}</td>
                        <td>${answer.Question ? answer.Question.body : 'Desconhecida'}</td>
                        <td><input type="text" id="answer-${interviewed}-${questionId}" value="${answer.answer}"></td>
                        <td>${answer.User ? answer.User.name : 'Desconhecido'}</td>
                        <td>${answer.form_id}</td>
                        <td>${new Date(answer.createdAt).toLocaleString()}</td>
                        <td><button class="save-btn" data-interviewed="${interviewed}" data-question="${questionId}">Salvar</button></td>
                    `;
                } else {
                    row.innerHTML = `
                        <td>${answer.Question ? answer.Question.body : 'Desconhecida'}</td>
                        <td><input type="text" id="answer-${interviewed}-${questionId}" value="${answer.answer}"></td>
                        <td>${answer.User ? answer.User.name : 'Desconhecido'}</td>
                        <td>${answer.form_id}</td>
                        <td>${new Date(answer.createdAt).toLocaleString()}</td>
                        <td><button class="save-btn" data-interviewed="${interviewed}" data-question="${questionId}">Salvar</button></td>
                    `;
                }

                tbody.appendChild(row);
            });
        });

        table.appendChild(tbody);
        answersContainer.appendChild(table);

        document.querySelectorAll('.save-btn').forEach((button) => {
            button.addEventListener('click', handleSave);
        });
    }

    async function handleSave(event) {
        const interviewedId = event.target.dataset.interviewed;
        const questionId = event.target.dataset.question;
        const inputElement = document.getElementById(
            `answer-${interviewedId}-${questionId}`
        );

        if (!inputElement) {
            mostrarMensagem(`Elemento de input não encontrado para ${interviewedId} e ${questionId}`, 'danger', 5);
            return;
        }

        try {
            // Atualiza resposta individual via api centralizada
            const response = await api.put(`/updateAnswer/${interviewedId}/${questionId}`, { answer: inputElement.value });

            if (response.ok) {
                mostrarMensagem('Resposta atualizada com sucesso!', 'success', 5);
                return;
            }

            const errorMessage = await response.json();
            mostrarMensagem(
                `Erro ao atualizar a resposta: ${
                    errorMessage.error || 'Erro desconhecido.'
                }`,
                'danger',
                5
            );
        } catch (error) {
            console.error('Erro ao salvar a resposta:', error);
            mostrarMensagem('Erro ao salvar a resposta.', 'danger', 5);
        }
    }

    fetchAnswers();
});
