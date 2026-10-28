// Filtro de status dos cards (Todos | Respondidos | Pendentes). A escolha fica em data-filtro na #sortBar e um input sintético no #searchInput reexecuta a regra de visibilidade — a busca (barraPesquisa.js) continua sendo a única dona do d-none, agora com o filtro como condição extra. Teclado: parada única no rádio marcado (roving tabindex, mesmo padrão da barra de abas do admin) e .active dos labels sincronizados no change (o data-toggle do Bootstrap só reage a clique, e setas no teclado disparam só change). Se o /forms/answered falhou, a home chama alternarFiltroStatus(false) e o grupo some (não dá pra filtrar sem saber quem respondeu).
export function initFiltroStatus() {
    const barra = document.getElementById('sortBar');
    if (!barra) return;
    barra.dataset.filtro = 'todos';
    sincronizarTeclado(barra);
    barra.addEventListener('change', (event) => {
        const radio = event.target;
        if (!radio || radio.name !== 'filtroStatus') return;
        barra.dataset.filtro = radio.value;
        barra.querySelectorAll('label').forEach((label) => {
            label.classList.toggle('active', label.querySelector('input') === radio);
        });
        sincronizarTeclado(barra);
        document.getElementById('searchInput')?.dispatchEvent(new Event('input', { bubbles: true }));
    });
}

export function alternarFiltroStatus(disponivel) {
    document.getElementById('filtroStatus')?.classList.toggle('d-none', !disponivel);
}

// Só o rádio marcado fica na ordem de Tab (setas percorrem o grupo nativamente e disparam change)
function sincronizarTeclado(barra) {
    barra.querySelectorAll('input[name="filtroStatus"]').forEach((radio) => {
        radio.tabIndex = radio.checked ? 0 : -1;
    });
}
