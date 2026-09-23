import { mostrarMensagem } from '../../js/geraNotificacao.js';
import { capturarRespostas } from './sendAnswers.js';
import { getCookie, api } from '../../js/api.js'; // cliente API centralizado

document.getElementById('btn-novas-respostas')?.addEventListener('click', () => {
    window.location.reload();
});

// Função para criar um input com autocomplete
function criarAutocompleteInput(bairros, index, liberaAcesso) {
    const divAutocomplete = document.createElement('div');
    divAutocomplete.classList.add('autocomplete');

    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('id', `pergunta${index + 1}`);
    input.classList.add('form-control');
    input.setAttribute('placeholder', 'Digite o nome do bairro');
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('required', true);
    input.disabled = !liberaAcesso;

    const divSugestoes = document.createElement('div');
    divSugestoes.classList.add('autocomplete-items');

    input.addEventListener('input', function () {
        const valorDigitado = this.value.toLowerCase();
        divSugestoes.innerHTML = ''; // Limpa sugestões anteriores
        if (valorDigitado) {
            const bairrosFiltrados = bairros.filter(bairro => bairro.toLowerCase().includes(valorDigitado));
            bairrosFiltrados.forEach(bairro => {
                const itemSugestao = document.createElement('div');
                itemSugestao.classList.add('autocomplete-item-clickable'); // Classe para estilizar o clique
                itemSugestao.textContent = bairro;
                itemSugestao.addEventListener('click', function () {
                    input.value = bairro; // Preenche o campo com o bairro selecionado
                    divSugestoes.innerHTML = ''; // Limpa as sugestões
                });
                divSugestoes.appendChild(itemSugestao);
            });
        }
    });

    divAutocomplete.appendChild(input);
    divAutocomplete.appendChild(divSugestoes);

    return divAutocomplete;
}

function criarFormulario(perguntas,liberaAcesso) {
    const container = document.getElementById('formulario-container');
    
    const form = document.createElement('form');
    form.classList.add('was-validated');

    perguntas.forEach((pergunta, index) => {
        const divPergunta = document.createElement('div');
        divPergunta.classList.add('form-group');

        const label = document.createElement('label');
        label.setAttribute('for', `pergunta${index + 1}`);
        label.setAttribute('data-type', `${pergunta.type}`);
        label.setAttribute('data-id', `${pergunta.id}`);
        label.textContent = (index+1)+ ") " + pergunta.body;
        divPergunta.appendChild(label);

        if (pergunta.type === 'Resposta Curta') {
            const input = document.createElement('input');
            input.classList.add('form-control');
            input.setAttribute('type', 'text');
            input.setAttribute('id', `pergunta${index + 1}`);
            input.setAttribute('placeholder', 'Resposta');
            input.setAttribute('required', true);
            input.disabled= !liberaAcesso;
            input.addEventListener('input', function() {
                this.value.trim() === '' ? this.setCustomValidity('Por favor, preencha este campo.') : this.setCustomValidity('');
            });
            divPergunta.appendChild(input);
        } else if (pergunta.type === 'Multipla Escolha') {
            pergunta.Options.forEach((opcao, i) => {
                const divCheck = document.createElement('div');
                divCheck.classList.add('form-check');

                const input = document.createElement('input');
                input.classList.add('form-check-input');
                input.setAttribute('type', 'checkbox');
                input.setAttribute('name', `pergunta${index + 1}`);

                input.disabled= !liberaAcesso;

                input.setAttribute('id', `questao${index + 1}opcao${i + 1}`);

                input.setAttribute('value', `questao${index + 1}opcao${i + 1}`);
                input.setAttribute('required', true);

                // Adicionando evento de clique para gerenciar o atributo required de todas as opções
                input.addEventListener('click', function () {
                    const inputs = document.querySelectorAll(
                        `[name="pergunta${index + 1}"]`
                    );
                    let algumSelecionado = false;
                    inputs.forEach((inp) => {
                        if (inp.checked) {
                            algumSelecionado = true;
                        }
                    });
                    if (algumSelecionado) {
                        inputs.forEach((inp) => {
                            inp.removeAttribute('required');
                        });
                    } else {
                        inputs.forEach((inp) => {
                            inp.setAttribute('required', true);
                        });
                    }
                });

                const label = document.createElement('label');
                label.classList.add('form-check-label');
                label.setAttribute('for', `questao${index + 1}opcao${i + 1}`);
                label.textContent = opcao.text;

                divCheck.appendChild(input);
                divCheck.appendChild(label);
                divPergunta.appendChild(divCheck);
            });
        } else if (pergunta.type === 'Unica Escolha') {
            if (pergunta.Options.length > 9) {
                // Utiliza a função de autocomplete ao invés de select
                const autocompleteInput = criarAutocompleteInput(pergunta.Options.map(op => op.text), index, liberaAcesso);
                divPergunta.appendChild(autocompleteInput);
            } else {
                pergunta.Options.forEach((opcao, i) => {
                    const divCheck = document.createElement('div');
                    divCheck.classList.add('form-check');

                    const input = document.createElement('input');
                    input.classList.add('form-check-input');
                    input.setAttribute('type', 'radio');
                    input.setAttribute('name', `pergunta${index + 1}`);
                    input.setAttribute('id', `questao${index + 1}opcao${i + 1}`);
                    input.setAttribute('value', `questao${index + 1}opcao${i + 1}`);
                    input.disabled = !liberaAcesso;
                    input.setAttribute('required', true);

                    const label = document.createElement('label');
                    label.classList.add('form-check-label');
                    label.setAttribute('for', `questao${index + 1}opcao${i + 1}`);
                    label.textContent = opcao.text;

                    divCheck.appendChild(input);
                    divCheck.appendChild(label);
                    divPergunta.appendChild(divCheck);
                });
            }
        }

        const feedbackValido = document.createElement('div');
        feedbackValido.classList.add('valid-feedback');
        feedbackValido.textContent = 'Tudo certo!';
        divPergunta.appendChild(feedbackValido);

        const feedbackInvalido = document.createElement('div');
        feedbackInvalido.classList.add('invalid-feedback');
        feedbackInvalido.textContent = 'Por favor, preencha este campo.';
        divPergunta.appendChild(feedbackInvalido);

        form.appendChild(divPergunta);
        if (index !== perguntas.length - 1) {
            form.appendChild(document.createElement('hr'));
        }
    });

    const botoesContainer = document.createElement('div');
    botoesContainer.classList.add('form-buttons-container');

    const botaoEnviar = document.createElement('button');
    botaoEnviar.classList.add('btn', 'btn-primary');
    botaoEnviar.id = 'enviarRespostasFormulario';
    botaoEnviar.textContent = 'Enviar Respostas';
    botaoEnviar.type = 'submit';
    botaoEnviar.disabled = !liberaAcesso;

    if (liberaAcesso) {
        botaoEnviar.addEventListener('click', capturarRespostas);
    }
    
    const botaoCancelar = document.createElement('button');
    botaoCancelar.classList.add('btn', 'btn-danger');
    botaoCancelar.setAttribute('type', 'button');
    botaoCancelar.textContent = 'Cancelar';

    botaoCancelar.addEventListener('click', function () {
        window.location.href = '/home';
    });

    botoesContainer.appendChild(botaoEnviar);
    botoesContainer.appendChild(botaoCancelar);
    form.appendChild(botoesContainer);

    container.appendChild(form);
}

async function fetchFullForm() {
    try {
        const formName = getCookie('form');

        const response = await api.get(`/getFullForm/${formName}`);
        if (!response.ok) {
            throw new Error('Failed to fetch forms');
        }
        const form = await response.json();

        // Altera titulo e descrição
        const formTitle = document.getElementById('form-title');
        const formDescription = document.getElementById('form-description');

        formTitle.textContent = form.title ? 'Pesquisa '+form.title : 'Título Aqui';
        formDescription.textContent = form.description
            ? form.description
            : 'Descrição Aqui';

        const question = form.Questions;

        const liberaAcesso = limitaRespostaParaFormAtivos(form.active,form.expiry_date);
        criarFormulario(question,liberaAcesso);
        
    } catch (error) {
        console.error('Error fetching forms:', error);
        throw error;
    }
}

function limitaRespostaParaFormAtivos(active,expiry_date) {
    if (active) {
        // O formulário está ativo
        if (expiry_date && new Date(expiry_date) <= new Date()) {
            // O formulário está ativo, mas já expirou, então não recebe resposta
            mostrarMensagem('O formulário está ativo, mas já expirou, então não recebe mais respostas!','danger',7);
            return false;
        } else {
            const expiryDayMsg = expiry_date? `até ${formatarData(expiry_date)}`:'';
            // O formulário está ativo e não expirou ainda, então pode receber resposta
            mostrarMensagem(`O formulário está ativo ${expiryDayMsg}!`,'success',3);
            return true;
        }
    } else {
        // O formulário não está ativo, então não recebe resposta
        mostrarMensagem('O formulário não está ativo, então não recebe mais respostas!','danger',7);
        return false;
    }
}

function formatarData(dataString) {
    // Converter para objeto Date
    const data = new Date(dataString);

    // Função para adicionar zero à esquerda para números menores que 10
    const adicionaZero = (numero) => (numero < 10 ? `0${numero}` : numero);

    // Extrair os componentes da data
    const dia = adicionaZero(data.getDate());
    const mes = adicionaZero(data.getMonth() + 1); // Mês é base 0, por isso somamos 1
    const ano = data.getFullYear();
    const hora = adicionaZero(data.getHours());
    const minutos = adicionaZero(data.getMinutes());

    // Formatar a data no formato desejado
    const dataFormatada = `${dia}/${mes}/${ano} às ${hora}:${minutos}`;

    return dataFormatada;
}

fetchFullForm();
