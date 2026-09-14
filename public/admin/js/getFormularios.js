import {
    fetchActiveForms,
    fetchDeactivatedForms,
    fetchFormsAgendados,
    fetchFormsFinalizados,
} from './fetchForms.js';
import {
    createCardDesactiveLayout,
    createCardLayout,
} from './geraCardsForm.js';
import { getUserData } from '../../js/api.js';

export async function displayForms() {
    try {
        const user = await getUserData();
        const forms = await fetchActiveForms();
        createCardLayout('cardContainer', forms, user);
    } catch (error) {
        // Tratar erro aqui, ex: exibir mensagem de erro ao usuário
        console.error('Error displaying forms:', error);
    }
}

export async function displayFormsDesativados() {
    try {
        const forms = await fetchDeactivatedForms();
        createCardDesactiveLayout(forms);
    } catch (error) {
        // Tratar erro aqui, ex: exibir mensagem de erro ao usuário
        console.error('Error displaying forms:', error);
    }
}

export async function displayFormsAgendados() {
    try {
        const user = await getUserData();
        const forms = await fetchFormsAgendados();
        createCardLayout('cardAgendadosContainer', forms, user);
    } catch (error) {
        // Tratar erro aqui, ex: exibir mensagem de erro ao usuário
        console.error('Error displaying forms:', error);
    }
}

export async function displayFormsFinalizados() {
    try {
        const user = await getUserData();
        const forms = await fetchFormsFinalizados();
        createCardLayout('cardFinalizadosContainer', forms, user);
    } catch (error) {
        // Tratar erro aqui, ex: exibir mensagem de erro ao usuário
        console.error('Error displaying forms:', error);
    }
}
