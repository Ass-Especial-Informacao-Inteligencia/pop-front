export function pesquisarNaListaUsuarios() {
        let timerAnuncio = null;

        // Anuncia o resultado na região viva (#sr-live) com debounce para não spamar o leitor de tela a cada tecla.
        function anunciarResultado(total) {
            const live = document.getElementById('sr-live');
            if (!live) return;
            const msg = total === 1 ? '1 usuário encontrado' : total + ' usuários encontrados';
            live.textContent = '';
            requestAnimationFrame(function () { live.textContent = msg; });
        }

        $("#searchInput").on("keyup", function() {
            const searchText = $(this).val().toLowerCase();
            let visiveis = 0;
            $("tbody tr").each(function() {
                const lineText = $(this).text().toLowerCase();
                if(lineText.indexOf(searchText) === -1) {
                    $(this).addClass("hidden");
                } else {
                    $(this).removeClass("hidden");
                    if (lineText.trim() !== '') visiveis++;
                }
            });

            clearTimeout(timerAnuncio);
            if (searchText === '') return;
            timerAnuncio = setTimeout(function() { anunciarResultado(visiveis); }, 500);
        });

        $("#clearFilterButton").on("click", function() {
            $("#searchInput").val("");
            $("tbody tr").removeClass("hidden");
            const live = document.getElementById('sr-live');
            if (live) live.textContent = '';
        });
}
