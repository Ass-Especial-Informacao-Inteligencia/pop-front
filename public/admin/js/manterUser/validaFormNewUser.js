export function validaFormUser() {
        // Função para validar e salvar novo usuário
        $('#btnSalvarNovoUsuario').click(function () {
            // Verifica se todos os campos obrigatórios estão preenchidos
            if (
                $('#cpf').val() == '' ||
                $('#nome').val() == '' ||
                $('#email').val() == '' ||
                $('#senha').val() == '' ||
                $('#funcao').val() == ''
            ) {
                // Exibe o alerta de campos obrigatórios
                $('#alertCamposObrigatorios').removeClass('d-none');
            } else {
                // Esconde o alerta de campos obrigatórios caso esteja visível
                $('#alertCamposObrigatorios').addClass('d-none');
            }
        });
}
