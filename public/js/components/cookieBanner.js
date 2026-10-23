// Banner de cookies global — injeta o aviso e o modal da política nas telas com #sharedComponents (login e respostas por mês ficam de fora, sem cromo de navegação).
// Consentimento em localStorage vale para sempre tanto o aceite quanto a recusa (o comportamento antigo só persistia o aceite e a recusa voltava a cada visita); migra o cookie antigo cookiesAccepted e o apaga.
const CHAVE_CONSENTIMENTO = 'pop:cookies';

function lerConsentimento() {
    const salvo = localStorage.getItem(CHAVE_CONSENTIMENTO);
    if (salvo) return salvo;
    const cookie = document.cookie.split(';').map(p => p.trim()).find(p => p.startsWith('cookiesAccepted='));
    if (!cookie) return null;
    const valor = cookie.slice('cookiesAccepted='.length) === 'false' ? 'declined' : 'accepted';
    localStorage.setItem(CHAVE_CONSENTIMENTO, valor);
    document.cookie = 'cookiesAccepted=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    return valor;
}

export function renderCookieBanner() {
    return `
        <!-- Banner de Cookie -->
        <div id="cookie-banner" role="region" aria-label="Aviso de cookies" style="display: none;">
            <p>Este site utiliza cookies para melhorar a sua experiência e analisar o tráfego. Ao continuar navegando, você concorda com o uso de cookies conforme descrito em nossa política de cookies:</p>
            <button type="button" class="btn btn-info" data-toggle="modal" data-target="#cookiesModal">
                Política de Cookies
            </button>
            <button type="button" class="btn btn-success" id="accept-cookies">Aceitar Todos</button>
            <button type="button" class="btn btn-danger" id="decline-cookies">Recusar</button>
        </div>

        <!-- Modal de política de cookies -->
        <div class="modal fade" id="cookiesModal" tabindex="-1" role="dialog" aria-labelledby="cookiesModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="cookiesModalLabel">Política de Cookies</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Fechar">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <h6 class="h5">Introdução</h6>
                        <p>Bem-vindo à nossa Política de Cookies. Esta página tem como objetivo informar você sobre como utilizamos cookies e outras tecnologias semelhantes para garantir o funcionamento adequado do nosso sistema, bem como para fornecer uma experiência de usuário segura e eficiente. Nosso compromisso é com a transparência e a conformidade com a Lei Geral de Proteção de Dados (LGPD).</p>

                        <h6 class="h5">O que são Cookies?</h6>
                        <p>Cookies são pequenos arquivos de texto armazenados no seu dispositivo (computador, smartphone ou tablet) quando você visita um site. Eles permitem que o site reconheça seu dispositivo e armazene certas informações sobre suas preferências ou ações, facilitando a sua navegação e a funcionalidade do sistema.</p>

                        <h6 class="h5">Como Utilizamos Cookies</h6>
                        <p>Em nosso sistema, utilizamos cookies exclusivamente para os seguintes propósitos:</p>
                        <ul>
                            <li><strong>Autenticação e Segurança</strong>: Para armazenar chaves de login e autenticação, garantindo que você possa acessar sua conta e usar o sistema de forma segura.</li>
                            <li><strong>Preferências do Usuário</strong>: Para lembrar suas preferências e configurações durante as sessões de uso do sistema, proporcionando uma experiência personalizada.</li>
                            <li><strong>Funcionalidade do Sistema</strong>: Para garantir o bom funcionamento do sistema e melhorar a performance, incluindo o gerenciamento de sessões e a manutenção da integridade do sistema.</li>
                        </ul>

                        <h6 class="h5">Tipos de Cookies Utilizados</h6>
                        <p>Os tipos de cookies que utilizamos incluem:</p>
                        <ul>
                            <li><strong>Cookies de Sessão</strong>: São temporários e desaparecem quando você fecha o navegador. Eles são usados para gerenciar a autenticação e a funcionalidade durante sua sessão.</li>
                            <li><strong>Cookies Persistentes</strong>: Permanecem no seu dispositivo por um período definido e são usados para lembrar suas preferências e configurações para visitas futuras.</li>
                        </ul>

                        <h6 class="h5">Como Gerenciar Cookies</h6>
                        <p>Você pode gerenciar suas preferências de cookies através das configurações do seu navegador. A maioria dos navegadores permite que você bloqueie cookies ou exclua cookies já armazenados. No entanto, se você optar por desativar os cookies, isso pode afetar a funcionalidade do nosso sistema e a sua experiência de uso.</p>

                        <h6 class="h5">Seus Direitos</h6>
                        <p>De acordo com a LGPD, você tem o direito de acessar, corrigir, excluir e bloquear seus dados pessoais. Se você tiver alguma dúvida ou preocupação sobre o uso de cookies e suas informações pessoais, entre em contato conosco através das informações fornecidas na seção de Contato.</p>

                        <h6 class="h5">Alterações na Política de Cookies</h6>
                        <p>Podemos atualizar esta Política de Cookies periodicamente para refletir mudanças nas nossas práticas e nas regulamentações aplicáveis. Recomendamos que você revise esta política regularmente para estar ciente de qualquer alteração.</p>

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function iniciarCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (!banner) return;
    if (lerConsentimento()) return; // já decidiu antes => banner permanece oculto (display: none do HTML)
    banner.style.display = 'block';
    const guardar = valor => () => {
        localStorage.setItem(CHAVE_CONSENTIMENTO, valor);
        banner.style.display = 'none';
    };
    document.getElementById('accept-cookies')?.addEventListener('click', guardar('accepted'));
    document.getElementById('decline-cookies')?.addEventListener('click', guardar('declined'));
}
