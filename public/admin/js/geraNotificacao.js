// Função para mostrar mensagem de alerta
export function mostrarMensagem(msg, type, timeInSeconds) {
    // Criar o elemento de alerta dinamicamente
    const alerta = document.createElement('div');
    alerta.className = `alert alert-${type} alert-dismissible fade show`;
    alerta.setAttribute('role', 'alert');
    alerta.innerHTML = `
        ${msg}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    `;

    // Verificar se o container já existe ou criar um novo
    let container = document.getElementById('container-alertas');
    if (!container) {
        container = document.createElement('div');
        container.id = 'container-alertas';
        container.className = 'fixed-top w-100 text-center mt-5 notification-container';
        document.body.appendChild(container); // Adicionar o container ao corpo do documento
    }

    // Adicionar o alerta ao container
    container.appendChild(alerta);
    const timeForTimeout = timeInSeconds*1000;
    setTimeout(() => {
        alerta.remove();
        // Verificar se o container está vazio e remover se estiver
        if (container.childNodes.length === 0) {
            container.remove();
        }
    }, timeForTimeout);
}
