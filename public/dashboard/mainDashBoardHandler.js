import { fillUpModalsInfo } from '../js/userInfo.js';
import { themeToggle } from '../js/temas.js';
import { logout, getCookie } from '../js/api.js';
import { fetchResponsesForFormGraphics } from './js/fetchAnswersForForm.js';
import { MainEditGraphicsAndTables } from './js/handlerDashboardActions.js';
import { mostrarMensagem } from './js/geraNotificacao.js';
import { loadingScreen } from '../js/loadingScreen.js';


function hasValidFormData(formData) {
  if (!formData || typeof formData !== 'object') return false;
  if (!formData.Answers || !formData.Questions || !formData.Questions.Questions) return false;
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

hasValidFormData(formData) ? MainEditGraphicsAndTables() : mostrarMensagem("Nenhuma Resposta Cadastrada!", "danger", 10); // criação de manipulação de gráficos e tabelas

loadingScreen(); // desativa a loading screen
