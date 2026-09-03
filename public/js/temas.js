export function themeToggle() {
    const themeToggleButton = document.getElementById('themeToggle');
    const themeToggleIcon = themeToggleButton.firstElementChild;

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

    function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    themeToggleButton.addEventListener('click', () => {
        const isDarkMode = document.body.classList.contains('dark-mode');
        const newTheme = isDarkMode ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });

    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme || getSystemTheme();
    applyTheme(initialTheme);
}
