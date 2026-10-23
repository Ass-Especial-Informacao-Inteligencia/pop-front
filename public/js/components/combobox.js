// Combobox acessível com filtro de texto (padrão ARIA APG 1.2) — para questões de única escolha com muitas opções (>9), no lugar do select nativo.
// Teclado: setas com wrap, Home/End, Enter seleciona, Esc fecha, Tab sai sem selecionar; clique seleciona. Filtro ignora acento e caixa (NFD). Contagem anunciada em região viva (role=status).
// O valor fica num input hidden [data-combobox-value] com o texto da opção — contrato do sendAnswers.js. Rótulo: o label existente com for=#perguntaN (criado em geraFormularioParaResposta) associa o campo de busca.
export function criarCombobox({ id, opcoes, liberaAcesso = true }) {
    const normalizar = texto => texto.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();

    const raiz = document.createElement('div');
    raiz.classList.add('pop-combobox');
    raiz.setAttribute('data-combobox-root', '');

    const entrada = document.createElement('input');
    entrada.type = 'text';
    entrada.id = id;
    entrada.classList.add('form-control', 'pop-combobox-input');
    entrada.setAttribute('data-combobox-input', '');
    entrada.setAttribute('role', 'combobox');
    entrada.setAttribute('aria-expanded', 'false');
    entrada.setAttribute('aria-controls', `${id}-listbox`);
    entrada.setAttribute('aria-autocomplete', 'list');
    entrada.setAttribute('autocomplete', 'off');
    entrada.setAttribute('placeholder', 'Selecione ou digite para buscar');
    entrada.disabled = !liberaAcesso;

    const valor = document.createElement('input');
    valor.type = 'hidden';
    valor.setAttribute('data-combobox-value', '');
    valor.value = '';

    const lista = document.createElement('ul');
    lista.id = `${id}-listbox`;
    lista.setAttribute('role', 'listbox');
    lista.classList.add('pop-combobox-list');

    opcoes.forEach((texto, i) => {
        const item = document.createElement('li');
        item.setAttribute('role', 'option');
        item.id = `${id}-opcao-${i}`;
        item.dataset.value = texto;
        item.textContent = texto;
        lista.appendChild(item);
    });

    const regiao = document.createElement('div');
    regiao.id = `${id}-contagem`;
    regiao.className = 'sr-only';
    regiao.setAttribute('role', 'status');

    raiz.appendChild(entrada);
    raiz.appendChild(valor);
    raiz.appendChild(lista);
    raiz.appendChild(regiao);

    let ativo = -1;
    // Última opção confirmada (clique/Enter); texto digitado sem confirmar é só estado de busca — Esc/blur restauram pra cá
    let confirmado = '';

    const itensVisiveis = () => [...lista.children].filter(li => !li.hidden);

    function abrir() {
        raiz.classList.add('aberto');
        entrada.setAttribute('aria-expanded', 'true');
    }

    function fechar() {
        raiz.classList.remove('aberto');
        entrada.setAttribute('aria-expanded', 'false');
        limparDestaque();
    }

    // Pendência: divergindo do confirmado (ou vazio) o hidden zera => validação manual do sendAnswers marca o campo
    function sincronizarPendente() {
        valor.value = entrada.value === confirmado ? confirmado : '';
    }

    function aplicarFiltro() {
        const consulta = normalizar(entrada.value);
        [...lista.children].forEach(li => {
            li.hidden = consulta !== '' && !normalizar(li.dataset.value).includes(consulta);
        });
        regiao.textContent = consulta === '' ? '' : `${itensVisiveis().length} opção(ões)`;
        sincronizarPendente();
    }

    function destacar(novo) {
        const visiveis = itensVisiveis();
        if (visiveis.length === 0) {
            limparDestaque();
            return;
        }
        ativo = ((novo % visiveis.length) + visiveis.length) % visiveis.length;
        visiveis.forEach((li, i) => li.classList.toggle('ativo', i === ativo));
        const atual = visiveis[ativo];
        entrada.setAttribute('aria-activedescendant', atual.id);
        atual.scrollIntoView({ block: 'nearest' });
    }

    // Digitar não deixa opção destacada (Enter sem destaque não confirma nada)
    function limparDestaque() {
        ativo = -1;
        [...lista.children].forEach(li => li.classList.remove('ativo'));
        entrada.removeAttribute('aria-activedescendant');
    }

    function selecionar(item) {
        confirmado = item.dataset.value;
        valor.value = confirmado;
        entrada.value = confirmado;
        [...lista.children].forEach(li => li.setAttribute('aria-selected', String(li === item)));
        fechar();
        entrada.focus();
    }

    function restaurar() {
        // Campo esvaziado de propósito => desconfirmar; texto divergente => volta pro último confirmado
        if (entrada.value === '') {
            confirmado = '';
        }
        entrada.value = confirmado;
        valor.value = confirmado;
        aplicarFiltro();
    }

    entrada.addEventListener('keydown', evento => {
        switch (evento.key) {
            case 'ArrowDown':
                evento.preventDefault();
                abrir();
                destacar(ativo === -1 ? 0 : ativo + 1);
                break;
            case 'ArrowUp':
                evento.preventDefault();
                abrir();
                destacar(ativo === -1 ? itensVisiveis().length - 1 : ativo - 1);
                break;
            case 'Home':
                if (raiz.classList.contains('aberto')) {
                    evento.preventDefault();
                    destacar(0);
                }
                break;
            case 'End':
                if (raiz.classList.contains('aberto')) {
                    evento.preventDefault();
                    destacar(-1);
                }
                break;
            case 'Enter':
                if (raiz.classList.contains('aberto')) {
                    evento.preventDefault();
                    const visiveis = itensVisiveis();
                    if (ativo >= 0 && visiveis[ativo]) {
                        selecionar(visiveis[ativo]);
                    } else {
                        fechar();
                    }
                }
                break;
            case 'Escape':
                if (raiz.classList.contains('aberto')) {
                    evento.preventDefault();
                    fechar();
                    restaurar();
                }
                break;
            case 'Tab':
                fechar();
                break;
        }
    });

    entrada.addEventListener('input', () => {
        aplicarFiltro();
        abrir();
        limparDestaque();
    });

    entrada.addEventListener('click', () => {
        aplicarFiltro();
        abrir();
    });

    lista.addEventListener('mousedown', evento => evento.preventDefault());

    lista.addEventListener('click', evento => {
        const item = evento.target.closest('[role="option"]');
        if (item) {
            selecionar(item);
        }
    });

    lista.addEventListener('mouseover', evento => {
        const item = evento.target.closest('[role="option"]');
        if (!item) return;
        const visiveis = itensVisiveis();
        destacar(visiveis.indexOf(item));
    });

    entrada.addEventListener('blur', () => {
        fechar();
        restaurar();
    });

    return raiz;
}
