import { fetchActiveForms } from './fetchForms.js';
import { createCardLayout } from './geraCardsForm.js';

export async function displayForms() {
    try {
        const forms = await fetchActiveForms();
        createCardLayout(forms);
    } catch (error) {
        // Handle error here, e.g., display an error message to the user
        console.error('Error displaying forms:', error);
    }
}
