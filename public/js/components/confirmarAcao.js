/* ══════════════════════════════════════════════
   POP — Modal de confirmação reutilizável
   Uso: const ok = await confirmarAcao('Título', 'Texto.');
   Requer jQuery + Bootstrap 4 (jQuery.fn.modal) na página.
   ══════════════════════════════════════════════ */

let acaoPendente = null;

function garantirModal() {
    let modal = document.getElementById('confirmarAcaoModal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'confirmarAcaoModal';
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'confirmarAcaoModalLabel');
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title" id="confirmarAcaoModalLabel"></h2>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Fechar">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p class="confirmar-acao-texto mb-0"></p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-danger" id="confirmarAcaoConfirmar" data-dismiss="modal">Confirmar</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('#confirmarAcaoConfirmar').addEventListener('click', () => encerrarAcao(true));
    modal.addEventListener('hidden.bs.modal', () => encerrarAcao(false));
    return modal;
}

function encerrarAcao(confirmado) {
    if (!acaoPendente) return;
    const { resolve, retornoFoco } = acaoPendente;
    acaoPendente = null;
    resolve(confirmado);
    // No cancelamento devolve o foco ao elemento que abriu o modal
    if (!confirmado && retornoFoco && retornoFoco.isConnected) retornoFoco.focus();
}

/**
 * Abre um modal Bootstrap de confirmação.
 * @param {string} titulo - título do modal
 * @param {string} texto - pergunta de confirmação
 * @returns {Promise<boolean>} true se confirmado; false se cancelado/fechado.
 */
export function confirmarAcao(titulo, texto) {
    const modal = garantirModal();
    const $ = window.jQuery;
    if (!$ || !$.fn || !$.fn.modal) return Promise.resolve(false);
    if (acaoPendente || $(modal).hasClass('show')) return Promise.resolve(false);

    modal.querySelector('.modal-title').textContent = titulo;
    modal.querySelector('.confirmar-acao-texto').textContent = texto;

    const retornoFoco = document.activeElement;
    return new Promise((resolve) => {
        acaoPendente = { resolve, retornoFoco };
        $(modal).modal('show');
    });
}
