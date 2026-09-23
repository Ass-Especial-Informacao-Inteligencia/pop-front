export function mostrarMensagem(msg, type, timeInSeconds) {
    const alerta = document.createElement('div');
    alerta.className = `alert alert-${type} alert-dismissible fade show`;
    alerta.setAttribute('role', 'alert');
    alerta.innerHTML = `
        ${msg}
        <button type="button" class="close" data-dismiss="alert" aria-label="Fechar">
            <span aria-hidden="true">&times;</span>
        </button>
    `;

    let container = document.getElementById('container-alertas');
    if (!container) {
        container = document.createElement('div');
        container.id = 'container-alertas';
        container.className = 'fixed-top w-100 text-center mt-5 notification-container';
        document.body.appendChild(container);
    }

    container.appendChild(alerta);

    setTimeout(() => {
        alerta.remove();
        if (container.childNodes.length === 0) {
            container.remove();
        }
    }, timeInSeconds * 1000);
}
