export async function fetchActiveForms() {
    try {
        const response = await fetch('/forms/active');
        if (!response.ok) {
            throw new Error('Failed to fetch forms');
        }
        const forms = await response.json();
        return forms;
    } catch (error) {
        console.error('Error fetching forms:', error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }
}
