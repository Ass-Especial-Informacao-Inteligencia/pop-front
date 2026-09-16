export function renderProfileModal({ isAdmin = false } = {}) {
    const footer = isAdmin
        ? `<div class="text-center mt-3">
                <button
                    type="button"
                    class="btn btn-primary ml-2"
                    onclick="window.location.href='/managerUsers'"
                >
                    Editar Informações
                </button>
            </div>`
        : `<div class="modal-footer">
                <p>Para atualizar suas informações, solicite para um administrador.</p>
            </div>`;

    return `
        <div
            class="modal fade"
            id="perfilModal"
            tabindex="-1"
            role="dialog"
            aria-labelledby="perfilModalLabel"
            aria-hidden="true"
        >
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="perfilModalLabel">
                            <i class="fas fa-user-circle mr-2"></i>Perfil do Usuário
                        </h5>
                        <button
                            type="button"
                            class="close"
                            data-dismiss="modal"
                            aria-label="Close"
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-4 d-flex justify-content-center align-items-center">
                                <i class="fas fa-user fa-5x"></i>
                            </div>
                            <div class="col-md-8">
                                <p>
                                    <strong>Nome:</strong>
                                    <span id="modal-name"></span>
                                </p>
                                <p>
                                    <strong>CPF:</strong>
                                    <span id="modal-cpf"></span>
                                </p>
                                <p>
                                    <strong>Email:</strong>
                                    <span id="modal-email"></span>
                                </p>
                            </div>
                        </div>
                        ${footer}
                    </div>
                </div>
            </div>
        </div>`;
}
