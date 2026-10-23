// Loop de Tab (focus trap) — mantém a navegação por teclado presa num conjunto de elementos: Tab no último volta ao primeiro; Shift+Tab no primeiro vai ao último. Meio do caminho sem salto segue a ordem natural do DOM.
// Escopo é consultado a cada Tab, então aceita seletores de elementos criados dinamicamente (ex.: o aviso de erro injetado por mostrarMensagem).
// `filtro` (opcional) decide quem participa do loop — usado pelo formAdmin pra manter as mesmas paradas da Tab seletiva (enunciado/alternativas, sem select/radios/botões dos cards). Se outro handler já cancelou o Tab (event.defaultPrevented), este loop cede.
// Se o destino natural do navegador sai do conjunto (fim do documento, ou lacuna entre os membros do escopo — ex.: #container-alertas sempre no fim do body, com #sharedComponents/themeToggle no meio), o loop intercepta e salta pro próximo do conjunto: era esse o vazamento do Tab durante o aviso verde.
// Ressalva WCAG 2.1.2: loop aceitável porque o escopo é curto (ex.: form de login) e há saídas alternativas (mouse, barra de endereço/F6).
export function ativarFocusLoop(scope, filtro) {
    const seletores = Array.isArray(scope) ? scope : [scope];

    document.addEventListener('keydown', function (event) {
        if (event.key !== 'Tab') return;

        // Outro handler de Tab já decidiu o destino => cede a ele.
        if (event.defaultPrevented) return;

        // Teclas modificadas (Ctrl+Tab de aba do navegador etc.) não são do loop.
        if (event.ctrlKey || event.metaKey || event.altKey) return;

        // Focáveis visíveis e habilitados, na ordem do DOM, dentro do escopo.
        const focaveis = seletores
            .flatMap(seletor => [...document.querySelectorAll(seletor)])
            .flatMap(raiz => [...raiz.querySelectorAll(
                'a[href], button, input, select, textarea, [tabindex]'
            )])
            .filter(el =>
                !el.disabled &&
                el.tabIndex >= 0 &&
                el.getClientRects().length > 0 &&
                (!filtro || filtro(el))
            );
        if (focaveis.length === 0) return;

        const ativo = document.activeElement;

        // Foco fora do escopo => não intercepta (navegação natural).
        if (!focaveis.includes(ativo)) return;

        const passo = event.shiftKey ? -1 : 1;

        // Próximo focável que o navegador escolheria, na ordem do documento inteiro.
        const naturais = [...document.querySelectorAll(
            'a[href], button, input, select, textarea, [tabindex]'
        )].filter(el => !el.disabled && el.tabIndex >= 0 && el.getClientRects().length > 0);
        const idxNatural = naturais.indexOf(ativo);
        const natural = idxNatural === -1 ? null : (naturais[idxNatural + passo] || null);

        // Destino natural já participa do conjunto => deixa o navegador (Tab seletiva segue atuando, se houver).
        if (natural && focaveis.includes(natural)) return;

        // Fora do conjunto (lacuna do DOM, fim do documento ou elemento filtrado) => intercepta e quebra pro próximo do conjunto.
        const idxAtivo = focaveis.indexOf(ativo);
        const destino = focaveis[idxAtivo + passo] || (passo === 1 ? focaveis[0] : focaveis[focaveis.length - 1]);
        event.preventDefault();
        if (destino !== ativo) destino.focus();
    });
}
