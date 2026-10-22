// Ordenação da tabela de usuários com acessibilidade: botão no th (teclado nativo),
// aria-sort no cabeçalho, ícone de direção e anúncio no #sr-live a cada ativação.
function criarOrdenacao(indiceCol, nomeColuna) {
    let crescente = true;

    return function () {
        const tbody = $('table tbody');
        const rows = tbody.find('tr').get();
        rows.sort(function (a, b) {
            const A = $(a).children('td').eq(indiceCol).text().toUpperCase();
            const B = $(b).children('td').eq(indiceCol).text().toUpperCase();
            if (A < B) return crescente ? -1 : 1;
            if (A > B) return crescente ? 1 : -1;
            return 0;
        });
        $.each(rows, function (index, row) {
            tbody.append(row);
        });

        const th = this.closest('th');
        // Só a coluna ativa guarda aria-sort; as demais voltam para none.
        document.querySelectorAll('th[aria-sort]').forEach(function (outroTh) {
            if (outroTh === th) return;
            outroTh.setAttribute('aria-sort', 'none');
            const outroIcone = outroTh.querySelector('i');
            if (outroIcone) {
                outroIcone.classList.remove('fa-sort-up', 'fa-sort-down');
                outroIcone.classList.add('fa-sort');
            }
        });
        th.setAttribute('aria-sort', crescente ? 'ascending' : 'descending');
        const icone = this.querySelector('i');
        icone.classList.remove('fa-sort', 'fa-sort-up', 'fa-sort-down');
        icone.classList.add(crescente ? 'fa-sort-up' : 'fa-sort-down');

        const live = document.getElementById('sr-live');
        if (live) {
            const msg = 'Ordenado por ' + nomeColuna + ': ' + (crescente ? 'A a Z' : 'Z a A');
            live.textContent = '';
            requestAnimationFrame(function () { live.textContent = msg; });
        }

        crescente = !crescente;
    };
}

export function orderPerNameUsers() {
    $('#ordenar-nome').click(criarOrdenacao(0, 'Nome'));
}

export function orderPerRoleUsers() {
    $('#ordenar-funcao').click(criarOrdenacao(2, 'Função'));
}
