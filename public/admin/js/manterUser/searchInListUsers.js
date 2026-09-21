export function pesquisarNaListaUsuarios() {
        $("#searchInput").on("keyup", function() {
            const searchText = $(this).val().toLowerCase();
            $("tbody tr").each(function() {
                const lineText = $(this).text().toLowerCase();
                if(lineText.indexOf(searchText) === -1) {
                    $(this).addClass("hidden");
                } else {
                    $(this).removeClass("hidden");
                }
            });
        });

        $("#clearFilterButton").on("click", function() {
            $("#searchInput").val("");
            $("tbody tr").removeClass("hidden");
        });
}