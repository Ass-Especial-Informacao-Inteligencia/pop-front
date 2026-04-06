export function themeToggle() {
    const themeToggleButton = document.getElementById('themeToggle');
    const themeToggleIcon = themeToggleButton.firstElementChild;

    // Função para aplicar o tema
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            document.querySelectorAll('.navbar, .jumbotron, .card, footer, thead, tbody, tr').forEach((element) => {
                element.classList.add('dark-mode');
            });
            document.querySelectorAll('.nav-tabs').forEach((element) => {
                element.classList.add('dark-mode-tabs');
            });
            themeToggleIcon.classList.remove('fa-moon');
            themeToggleIcon.classList.add('fa-sun');
        } else {
            document.body.classList.remove('dark-mode');
            document.querySelectorAll('.navbar, .jumbotron, .card, footer, thead, tbody, tr').forEach((element) => {
                element.classList.remove('dark-mode');
            });
            document.querySelectorAll('.nav-tabs').forEach((element) => {
                element.classList.remove('dark-mode-tabs');
            });
            themeToggleIcon.classList.remove('fa-sun');
            themeToggleIcon.classList.add('fa-moon');
        }
    }

    // Função para obter a preferência do sistema
    function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // Event listener para alternar o tema
    themeToggleButton.addEventListener('click', () => {
        // Verifica o tema atual e alterna
        const isDarkMode = document.body.classList.contains('dark-mode');
        const newTheme = isDarkMode ? 'light' : 'dark';

        // Aplica o novo tema
        applyTheme(newTheme);

        // Salva o tema no localStorage
        localStorage.setItem('theme', newTheme);
    });

    // Verifica e aplica o tema salvo no localStorage ou a preferência do sistema ao carregar a página
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme || getSystemTheme();
    applyTheme(initialTheme);
}
