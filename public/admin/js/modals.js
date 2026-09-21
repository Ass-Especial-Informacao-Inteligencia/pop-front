import { adicionarUsersComAcesso } from './accessFormDelegation.js';
import { handleRemoveButtonClick } from './fetchDelegationForm.js';
import { getUserData } from '../../js/api.js';
import { getUsersWithAccess } from './searchUsers.js';

const user = await getUserData();

export function fillUpModalsInfo() {
    const name = document.getElementById('modal-name');
    const cpf = document.getElementById('modal-cpf');
    const email = document.getElementById('modal-email');

    name.textContent = user.name;
    cpf.textContent = user.cpf.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        '$1.$2.$3-$4'
    );
    email.textContent = user.email;
}

export function fillAccessModal() {
    const accesBtn = document.querySelectorAll('.permission-btn');
    accesBtn.forEach((button) => {
        const title = button.getAttribute('data-form');
        button.addEventListener('click', async () => {
            document.querySelector('.nome-formulario').textContent =
                title.toUpperCase();
            document.querySelector('#search-user-no-allow').value = '';
            document.querySelector('#usersWithNotAccess').innerHTML = '';

            await getUsersWithAccess(title).then((users) =>
                adicionarUsersComAcesso(users)
            );
            handleRemoveButtonClick();
        });
    });
}

export function showModalAgendamentoInputs() {
    // Evento para mostrar/ocultar os campos de agendamento quando o botão for clicado
    $('#showAgendamento').click(function() {
        $('.agendamento').toggle();
    });
}
