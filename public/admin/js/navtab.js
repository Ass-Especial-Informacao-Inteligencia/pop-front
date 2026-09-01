import { getUserData } from '../../js/api.js';

export function navtabModificador() {
    $(document).ready(function () {
        $('#ativos').show();
        $('#desativados').hide();
        $('#Agendados').hide();
        $('#Finalizados').hide();
        $('#myTabs a').click(function (e) {
            e.preventDefault();
            $('#ativos, #desativados,#Agendados,#Finalizados').hide(); // Oculta todos os conteúdos de guias
            let tab = $(this).attr('href');// Obtém o href do link clicado
            $(tab).show();// Exibe o conteúdo correspondente à guia clicada
        });
    });
}

export async function updatetabsPerUser() {
    const user = await getUserData();

    const isAdmin = user.role === 'admin';

    if (isAdmin) {
        // Se o usuário for um administrador, mostrar as duas abas e o conteúdo de arquivados
        $('#desativados-tab').parent().show(); // Mostra o tab de arquivados
        $('.tab-pane').show(); // Mostra todas as abas
    } else {
        // Se o usuário não for um administrador, ocultar a aba de arquivados e seu conteúdo
        $('#desativados-tab').parent().hide(); // Oculta o tab de arquivados
        $('#Agendados-tab').parent().hide(); // Oculta o tab de agendados
        $('#Finalizados-tab').parent().hide(); // Oculta o tab de finalizados
        $('.tab-pane').hide(); // Oculta todas as abas
        $('#ativos').show(); // Mostra apenas a aba de ativos
    }
}
