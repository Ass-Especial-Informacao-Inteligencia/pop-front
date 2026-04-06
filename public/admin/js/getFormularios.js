import {
    fetchActiveForms,
    fetchDeactivatedForms,
    fetchFormsAgendados,
    fetchFormsFinalzados,
} from './fetchForms.js';
import {
    createCardDesactiveLayout,
    createCardLayout,
} from './geraCardsForm.js';
import { userData } from './getUserData.js';

export async function displayForms() {
    try {
        const user = await userData;
        const forms = await fetchActiveForms();
        createCardLayout('cardContainer', forms, user);
    } catch (error) {
        // Handle error here, e.g., display an error message to the user
        console.error('Error displaying forms:', error);
    }
}

export async function displayFormsDesativados() {
    try {
        const forms = await fetchDeactivatedForms();
        createCardDesactiveLayout(forms);
    } catch (error) {
        // Handle error here, e.g., display an error message to the user
        console.error('Error displaying forms:', error);
    }
}

export async function displayFormsAgendados() {
    try {
        const user = await userData;
        const forms = await fetchFormsAgendados();
        createCardLayout('cardAgendadosContainer', forms, user);
    } catch (error) {
        // Handle error here, e.g., display an error message to the user
        console.error('Error displaying forms:', error);
    }
}

export async function displayFormsFinalizados() {
    try {
        const user = await userData;
        const forms = await fetchFormsFinalzados();
        createCardLayout('cardFinalizadosContainer', forms, user);
    } catch (error) {
        // Handle error here, e.g., display an error message to the user
        console.error('Error displaying forms:', error);
    }
}
