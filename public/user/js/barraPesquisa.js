$(document).ready(function () {
    const containers = ['#cardContainer'];

    // Delegação: #searchInput é injetado depois pelo renderNavbar()
    $(document).on('input', '#searchInput', function () {
        const searchText = $(this).val().toLowerCase();
        containers.forEach(function (container) {
            $(container + ' .card').each(function () {
                const currentTitle = $(this).find('.card-title').text().toLowerCase();
                if (currentTitle.indexOf(searchText) === -1) {
                    $(this).addClass('d-none');
                } else {
                    $(this).removeClass('d-none');
                }
            });
        });
    });
});
