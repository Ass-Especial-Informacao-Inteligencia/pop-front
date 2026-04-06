$(document).ready(function () {
    // Função para lidar com a pesquisa e o filtro
    function handleSearchAndFilter(container) {
        $('#searchInput').on('input', function () {
            var searchText = $(this).val().toLowerCase();
            $(container + ' .card').each(function () {
                var currentTitle = $(this).find('.card-title').text().toLowerCase();
                if (currentTitle.indexOf(searchText) === -1) {
                    $(this).addClass('d-none');
                } else {
                    $(this).removeClass('d-none');
                }
            });
        });
    }

    // Chamando a função para os contêineres
    handleSearchAndFilter('#cardContainer');
    handleSearchAndFilter('#cardDesativadosContainer');
    handleSearchAndFilter('#Agendados');
    handleSearchAndFilter('#Finalizados');
});
