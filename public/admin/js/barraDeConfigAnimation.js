export function animationConfigBarForm() {
    const configButtons = document.querySelectorAll('.config-btn');
    
    configButtons.forEach((button) => {
    button.addEventListener('click', () => {
    const cardFooter = button.closest('.card').querySelector('.card-footer');
    if (cardFooter.classList.contains('d-none')) {
        cardFooter.classList.remove('d-none');
    } else {
        cardFooter.classList.add('d-none');
    }
    });
});
}