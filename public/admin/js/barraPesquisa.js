$(document).ready(function () {
    // #Agendados e #Finalizados são os tab-panes (os containers de cards ficam dentro); o seletor descendente alcança os cards
    const containers = ['#cardContainer', '#cardDesativadosContainer', '#Agendados', '#Finalizados'];
    let timerAnuncio = null;

    // Ignora acento e caixa (NFD) — mesmo padrão do combobox e da home do usuário
    const normalizar = (texto) => texto.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();

    // Enter no form da busca não recarrega a página — só filtra
    $(document).on('submit', 'form', function (e) {
        if (this.querySelector('#searchInput')) e.preventDefault();
    });

    // Botão limpar (X) — injetado na primeira digitação, ao lado do input (o navbar é compartilhado com o user)
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

    // Aviso de "nenhum resultado" aparece na aba que está visível no momento
    function mostrarVazio(texto) {
        const abaAtiva = document.querySelector('#myTabContent .tab-pane.active') || document.querySelector(containers[0]);
        let msg = abaAtiva.querySelector('.search-empty-state');
        if (!msg) {
            msg = document.createElement('div');
            msg.className = 'search-empty-state';
            msg.setAttribute('role', 'status');
            abaAtiva.appendChild(msg);
        }
        msg.textContent = 'Nenhum formulário encontrado para "' + texto + '"';
        msg.classList.remove('d-none');
    }

    function esconderVazio() {
        document.querySelectorAll('#myTabContent .search-empty-state').forEach((m) => m.classList.add('d-none'));
    }

    // Delegação: #searchInput é injetado depois pelo renderNavbar()
    $(document).on('input', '#searchInput', function () {
        const input = this;
        garantirBotaoLimpar(input);
        const btnLimpar = document.querySelector('.search-clear-btn');
        if (btnLimpar) btnLimpar.classList.toggle('d-none', input.value === '');

        const textoOriginal = input.value;
        const textoBusca = normalizar(textoOriginal);
        let visiveis = 0;
        containers.forEach(function (container) {
            $(container + ' .card').each(function () {
                const titulo = normalizar($(this).find('.card-title').text());
                const descricao = normalizar($(this).find('.card-text').text());
                const casa = titulo.includes(textoBusca) || descricao.includes(textoBusca);
                $(this).toggleClass('d-none', !casa);
                if (casa) visiveis++;
            });
        });

        if (textoBusca === '') esconderVazio();
        else if (visiveis === 0) mostrarVazio(textoOriginal);
        else esconderVazio();

        // Anuncia o resultado na região viva (#sr-live) com debounce para não spamar o leitor de tela a cada tecla.
        clearTimeout(timerAnuncio);
        if (textoBusca === '') return;
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
