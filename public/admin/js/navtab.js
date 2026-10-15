import { getUserData } from '../../js/api.js';
import { ativarFocusLoop } from '../../js/focusLoop.js';

// Abas com uma parada só (roving tabindex, padrão ARIA de tablist): o Tab para na aba ativa e segue reto para o conteúdo embaixo; ←/→/Home/End percorrem as abas visíveis com volta nas pontas e ativam a de destino. O .click() dispara exatamente os mesmos handlers de um clique de mouse (navtab + data-api do Bootstrap), então a ativação não muda. Fora do teclado (mouse/Enter/programático) a aba clicada vira a nova parada.
export function ativarTabTeclado() {
    const tablist = document.getElementById('myTabs');
    if (!tablist) return;

    const marcarRoving = aba => {
        tablist.querySelectorAll('[role="tab"]').forEach(tab => {
            tab.tabIndex = tab === aba ? 0 : -1;
        });
    };

    tablist.addEventListener('click', event => {
        const aba = event.target.closest('[role="tab"]');
        if (aba) marcarRoving(aba);
    });

    tablist.addEventListener('keydown', event => {
        const abaAtual = event.target.closest('[role="tab"]');
        if (!abaAtual) return;
        const acoes = { ArrowLeft: -1, ArrowRight: 1, Home: 'inicio', End: 'fim' };
        const acao = acoes[event.key];
        if (acao === undefined) return;
        const visiveis = [...tablist.querySelectorAll('[role="tab"]')]
            .filter(tab => tab.getClientRects().length > 0);
        if (visiveis.length < 2) return;
        const idx = visiveis.indexOf(abaAtual);
        if (idx === -1) return;
        event.preventDefault();
        let alvo;
        if (acao === 'inicio') alvo = visiveis[0];
        else if (acao === 'fim') alvo = visiveis[visiveis.length - 1];
        else alvo = visiveis[(idx + acao + visiveis.length) % visiveis.length];
        if (alvo === abaAtual) return;
        alvo.focus();
        alvo.click();
    });

    const abaAtiva = tablist.querySelector('[role="tab"].active') ||
        tablist.querySelector('[role="tab"]');
    if (abaAtiva) marcarRoving(abaAtiva);
}

export function navtabModificador() {
    ativarTabTeclado();
    // Loop de Tab: barra de abas (parada única, na aba ativa) → conteúdo do painel visível, passando por todos os botões dos cards → × do aviso, se aparecer → volta pra barra. Pesquisa da navbar e "Criar Novo Formulário" ficam antes da barra (alcançáveis ao entrar, e com mouse/F6 depois); modais mantêm o trap do Bootstrap por ficarem fora do escopo.
    ativarFocusLoop(['#myTabs', '#myTabContent', '#container-alertas']);
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
        $('#ativos').show(); // Mostra apenas a aba de ativos
    } else {
        // Se o usuário não for um administrador, ocultar a aba de arquivados e seu conteúdo
        $('#desativados-tab').parent().hide(); // Oculta o tab de arquivados
        $('#Agendados-tab').parent().hide(); // Oculta o tab de agendados
        $('#Finalizados-tab').parent().hide(); // Oculta o tab de finalizados
        $('.tab-pane').hide(); // Oculta todas as abas
        $('#ativos').show(); // Mostra apenas a aba de ativos
    }
}
