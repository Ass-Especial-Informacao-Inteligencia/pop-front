$(document).ready(function () {
    const containers = ['#cardContainer'];
    let timerAnuncio = null;

    // Delegação: #searchInput é injetado depois pelo renderNavbar()
    $(document).on('input', '#searchInput', function () {
        const searchText = $(this).val().toLowerCase();
        let visiveis = 0;
        containers.forEach(function (container) {
            $(container + ' .card').each(function () {
                const currentTitle = $(this).find('.card-title').text().toLowerCase();
                if (currentTitle.indexOf(searchText) === -1) {
                    $(this).addClass('d-none');
                } else {
                    $(this).removeClass('d-none');
                    visiveis++;
                }
            });
        });

        // Anuncia o resultado na região viva (#sr-live) com debounce para não spamar o leitor de tela a cada tecla.
        clearTimeout(timerAnuncio);
        if (searchText === '') return;
        timerAnuncio = setTimeout(function () {
            const live = document.getElementById('sr-live');
            if (!live) return;
            const msg = visiveis === 1 ? '1 formulário encontrado' : visiveis + ' formulários encontrados';
            live.textContent = '';
            requestAnimationFrame(function () { live.textContent = msg; });
        }, 500);
    });
});
