export const initAutocomplete = $(function () {
    $('#searchInput').autocomplete({
        source: function (request, response) {
            $.ajax({
                url: '/getSuggestions',
                dataType: 'json',
                data: {
                    term: request.term,
                },
                success: function (data) {
                    response(data);
                },
            });
        },
        minLength: 1,
        open: function (event, ui) {
            // Adiciona uma classe CSS aos elementos de sugestão
            $('.ui-menu-item').addClass('custom-suggestion');
        },
    });
});
