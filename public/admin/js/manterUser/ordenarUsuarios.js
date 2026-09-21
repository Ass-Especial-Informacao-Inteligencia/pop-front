export function orderPerNameUsers() {
    // Função para ordenar os nomes dos usuários
    $('#ordenar-nome').click(function () {
        const tbody = $('table tbody');
        const rows = tbody.find('tr').get();
        rows.sort(function (a, b) {
            const A = $(a).children('td').eq(0).text().toUpperCase();
            const B = $(b).children('td').eq(0).text().toUpperCase();

            if (A < B) return -1;
            if (A > B) return 1;
            return 0;
        });
        $.each(rows, function (index, row) {
            tbody.append(row);
        });
    });
}

export function orderPerRoleUsers() {
    $('#ordenar-funcao').click(function () {
        const tbody = $('table tbody');
        const rows = tbody.find('tr').get();
        rows.sort(function (a, b) {
            const A = $(a).children('td').eq(2).text().toUpperCase();
            const B = $(b).children('td').eq(2).text().toUpperCase();
            if (A < B) {
                return -1;
            }
            if (A > B) {
                return 1;
            }
            return 0;
        });
        $.each(rows, function (index, row) {
            tbody.append(row);
        });
    });
}

export function limparFiltrosListUser() {
    $('#limpar-filtros').click(function () {
        $('table tbody tr').show();
    });
}


