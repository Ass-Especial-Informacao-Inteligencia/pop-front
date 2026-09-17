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
        createCardLayout('cardContainer', forms, user, 'active');
    } catch (error) {
        console.error('Error displaying forms:', error);
    }
}

export async function displayFormsDesativados() {
    try {
        const forms = await fetchDeactivatedForms();
        createCardDesactiveLayout(forms, 'disabled');
    } catch (error) {
        console.error('Error displaying forms:', error);
    }
}

export async function displayFormsAgendados() {
    try {
        const user = await getUserData();
        const forms = await fetchFormsAgendados();
        createCardLayout('cardAgendadosContainer', forms, user, 'scheduled');
    } catch (error) {
        console.error('Error displaying forms:', error);
    }
}

export async function displayFormsFinalizados() {
    try {
        const user = await getUserData();
        const forms = await fetchFormsFinalizados();
        createCardLayout('cardFinalizadosContainer', forms, user, 'finished');
    } catch (error) {
        console.error('Error displaying forms:', error);
    }
}
