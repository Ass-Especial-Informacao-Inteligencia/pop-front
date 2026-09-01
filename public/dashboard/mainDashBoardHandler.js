import { fillUpModalsInfo } from './js/modals.js';
import { themeToggle } from './js/temas.js';
import { logout } from "../js/api.js";
import { fetchResponsesForFormGraphics } from "./js/fetchAnswersForForm.js";
import { getCookie } from "../js/api.js";
import { MainEditGraphicsAndTables } from "./js/handlerDashboardActions.js";
import { mostrarMensagem } from "./js/geraNotificacao.js";
import { loadingScreen } from './js/loadingScreen.js';


function hasValidFormData(formData) {
  return (
    Object.keys(formData).length >= 1 &&
    Object.keys(formData.Answers).length >= 1 &&
    Object.keys(formData.Questions.Questions).length >= 1
  );
}

const tituloFormulario = document.querySelector('.tituloFormulario');
tituloFormulario.innerText = getCookie('form');

// adiciona info no modal de alterar perfil
fillUpModalsInfo();

const logoutAnchor = document.getElementById('logout-conta');
logoutAnchor.addEventListener('click', logout);

// gerencia temas da página
themeToggle();

// pega as respostas baseado no formulário para análise de dados
export const formData = await fetchResponsesForFormGraphics(getCookie('form'));
console.log(formData);

hasValidFormData(formData) ? MainEditGraphicsAndTables() : mostrarMensagem("Nenhuma Resposta Cadastrada!", "danger", 10); // criação de manipulação de gráficos e tabelas

loadingScreen(); // desativa a loading screen
