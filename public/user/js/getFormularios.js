import { fetchActiveForms } from './fetchForms.js';
import { createCardLayout } from './geraCardsForm.js';
import { getUserData } from '../../js/api.js';

export async function displayForms() {
    try {
        const user = await getUserData();
        const forms = await fetchActiveForms();
        createCardLayout('cardContainer', forms, user);
    } catch (error) {
        console.error('Error displaying forms:', error);
    }
}
