import { submit } from './submit.js';

document
    .querySelector('#sign-in-cpf-email')
    .addEventListener('input', function (event) {
        let input = event.target.value;
        let tipoEntrada = verificarTipoEntrada(input);

        if (tipoEntrada === 'cpf') {
            event.target.value = formatarCPF(input);
        } else {
            // Para outros tipos, não formata
            event.target.value = input;
        }
    });
    

submit();

function formatarCPF(cpf) {
    cpf = cpf.replace(/\D/g, ''); // Remove tudo que não é dígito
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2'); // Adiciona ponto após os primeiros 3 dígitos
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2'); // Adiciona ponto após os segundos 3 dígitos
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Adiciona traço antes dos últimos 2 dígitos
    return cpf;
}

// Função para verificar o tipo de entrada
function verificarTipoEntrada(valor) {
    if (/\b[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}\b/.test(valor)) {
        return 'cpf';
    } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
        return 'email';
    } else {
        return 'nome de usuario';
    }
}
