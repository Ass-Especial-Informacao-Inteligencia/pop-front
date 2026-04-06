export function orderPerNameUsers() {
    // Função para ordenar os nomes dos usuários
    $('#ordenar-nome').click(function () {
        var tbody = $('table tbody');
        var rows = tbody.find('tr').get();
        rows.sort(function (a, b) {
            var A = $(a).children('td').eq(0).text().toUpperCase();
            var B = $(b).children('td').eq(0).text().toUpperCase();

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
        var tbody = $('table tbody');
        var rows = tbody.find('tr').get();
        rows.sort(function (a, b) {
            var A = $(a).children('td').eq(2).text().toUpperCase();
            var B = $(b).children('td').eq(2).text().toUpperCase();
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


