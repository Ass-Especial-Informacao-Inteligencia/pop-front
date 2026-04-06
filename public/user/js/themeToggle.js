export function themeToggle() {
    document.getElementById('themeToggle').addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        document
        .querySelectorAll('.navbar, .jumbotron, .card, footer,thead, tbody,tr')
            .forEach((element) => {
                element.classList.toggle('dark-mode');
            });

        // atualiza icone do botão
        let themeToggleButton =
            document.getElementById('themeToggle').firstElementChild;
        if (document.body.classList.contains('dark-mode')) {
            themeToggleButton.classList.remove('fa-moon');
            themeToggleButton.classList.add('fa-sun');
        } else {
            themeToggleButton.classList.remove('fa-sun');
            themeToggleButton.classList.add('fa-moon');
        }
    });
}
//