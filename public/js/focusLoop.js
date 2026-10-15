// Loop de Tab (focus trap) — mantém a navegação por teclado presa num conjunto de elementos: Tab no último volta ao primeiro; Shift+Tab no primeiro vai ao último. Meio do caminho não é interceptado (ordem natural do DOM).
// Escopo é consultado a cada Tab, então aceita seletores de elementos criados dinamicamente (ex.: o aviso de erro injetado por mostrarMensagem).
// `filtro` (opcional) decide quem participa do loop — usado pelo formAdmin pra manter as mesmas paradas da Tab seletiva (enunciado/alternativas, sem select/radios/botões dos cards). Se outro handler já cancelou o Tab (event.defaultPrevented), este loop cede.
// Ressalva WCAG 2.1.2: loop aceitável porque o escopo é curto (ex.: form de login) e há saídas alternativas (mouse, barra de endereço/F6).
export function ativarFocusLoop(scope, filtro) {
    const seletores = Array.isArray(scope) ? scope : [scope];

    document.addEventListener('keydown', function (event) {
        if (event.key !== 'Tab') return;

        // Outro handler de Tab já decidiu o destino => cede a ele.
        if (event.defaultPrevented) return;

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

        const primeiro = focaveis[0];
        const ultimo = focaveis[focaveis.length - 1];
        const ativo = document.activeElement;

        // Foco fora do escopo => não intercepta (navegação natural).
        if (!focaveis.includes(ativo)) return;

        if (event.shiftKey && ativo === primeiro) {
            event.preventDefault();
            ultimo.focus();
        } else if (!event.shiftKey && ativo === ultimo) {
            event.preventDefault();
            primeiro.focus();
        }
    });
}
