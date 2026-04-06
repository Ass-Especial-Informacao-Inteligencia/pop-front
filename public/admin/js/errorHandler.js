export function displayError(errorMessage, errorElement) {
    errorElement.textContent = errorMessage;
}

export function clearError(errorElement) {
    errorElement.textContent = '';
}
