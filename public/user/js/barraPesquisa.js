$(document).ready(function () {
    const containers = ['#cardContainer'];
    let timerAnuncio = null;

    // Ignora acento e caixa (NFD) — mesmo padrão do combobox
    const normalizar = (texto) => texto.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();

    // Enter no form da busca não recarrega a página — só filtra
    $(document).on('submit', 'form', function (e) {
        if (this.querySelector('#searchInput')) e.preventDefault();
    });

    // Botão limpar (X) — injetado na primeira digitação, ao lado do input (o navbar é compartilhado com o admin)
    function garantirBotaoLimpar(input) {
        if (document.querySelector('.search-clear-btn')) return;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'search-clear-btn d-none';
        btn.setAttribute('aria-label', 'Limpar busca');
        btn.innerHTML = '<i class="fas fa-times" aria-hidden="true"></i>';
        btn.addEventListener('click', function () {
            input.value = '';
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.focus();
        });
        const append = document.createElement('div');
        append.className = 'input-group-append';
        append.appendChild(btn);
        input.closest('.input-group').appendChild(append);
    }

    function mostrarVazio(container, texto, filtro) {
        let msg = document.querySelector('.search-empty-state');
        if (!msg) {
            msg = document.createElement('div');
            msg.className = 'search-empty-state';
            msg.setAttribute('role', 'status');
            document.querySelector(container).appendChild(msg);
        }
        // Texto digitado tem prioridade na mensagem; sem texto o filtro explica o vazio
        if (texto) msg.textContent = 'Nenhum formulário encontrado para "' + texto + '"';
        else if (filtro === 'respondidos') msg.textContent = 'Nenhum formulário respondido ainda';
        else msg.textContent = 'Nenhum formulário pendente';
        msg.classList.remove('d-none');
    }

    function esconderVazio() {
        const msg = document.querySelector('.search-empty-state');
        if (msg) msg.classList.add('d-none');
    }

    // Delegação: #searchInput é injetado depois pelo renderNavbar()
    $(document).on('input', '#searchInput', function () {
        const input = this;
        garantirBotaoLimpar(input);
        const btnLimpar = document.querySelector('.search-clear-btn');
        if (btnLimpar) btnLimpar.classList.toggle('d-none', input.value === '');

        const textoOriginal = input.value;
        const textoBusca = normalizar(textoOriginal);
        // Filtro de status mora em data-filtro da #sortBar; a busca continua sendo a única dona do d-none (evita os dois mexendo na mesma classe)
        const filtro = document.getElementById('sortBar')?.dataset.filtro || 'todos';
        let visiveis = 0;
        containers.forEach(function (container) {
            $(container + ' .card').each(function () {
                const titulo = normalizar($(this).find('.card-title').text());
                const descricao = normalizar($(this).find('.card-text').text());
                const respondido = $(this).attr('data-respondido') === 'true';
                // Estado vazio e card de erro não têm data-respondido e ficam fora do filtro (retry continua alcançável)
                const casaFiltro = filtro === 'todos'
                    || !$(this).hasClass('grid-item')
                    || (filtro === 'respondidos') === respondido;
                const casa = (titulo.includes(textoBusca) || descricao.includes(textoBusca)) && casaFiltro;
                $(this).toggleClass('d-none', !casa);
                if (casa) visiveis++;
            });
        });

        if (textoBusca === '' && filtro === 'todos') {
            esconderVazio();
            return;
        }
        if (visiveis === 0) mostrarVazio(containers[0], textoOriginal, filtro);
        else esconderVazio();

        // Anuncia o resultado na região viva (#sr-live) com debounce para não spamar o leitor de tela a cada tecla.
        clearTimeout(timerAnuncio);
        timerAnuncio = setTimeout(function () {
            const live = document.getElementById('sr-live');
            if (!live) return;
            let msg;
            if (visiveis === 0) msg = 'Nenhum formulário encontrado';
            else if (visiveis === 1) msg = '1 formulário encontrado';
            else msg = visiveis + ' formulários encontrados';
            live.textContent = '';
            requestAnimationFrame(function () { live.textContent = msg; });
        }, 500);
    });
});
