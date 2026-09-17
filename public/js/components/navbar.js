export function renderNavbar({ role = 'user', activeTab = 'home', logoPath = './src/', showSearch = false, searchPlaceholder = '' } = {}) {
    const isAdmin = role === 'admin';

    return `
        <!-- Cabeçalho de navegação -->
        <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
            <a class="navbar-brand" href="/home">
                <img
                    src="${logoPath}BRASAO-PREFEITURA-DE-FERRAZ.png"
                    width="30"
                    height="30"
                    class="d-inline-block align-top"
                    alt="Logo"
                />
            </a>

            <button
                class="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item">
                        <a class="nav-link" id="logout-conta" href="#">Sair</a>
                    </li>
                    <li class="nav-item${activeTab === 'home' ? ' active' : ''}">
                        <a class="nav-link" href="/home">Home${activeTab === 'home' ? ' <span class="sr-only">(current)</span>' : ''}</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" data-toggle="modal" data-target="#perfilModal">Perfil</a>
                    </li>
                    ${isAdmin ? `
                    <li class="nav-item${activeTab === 'usuarios' ? ' active' : ''}">
                        <a class="nav-link" href="/managerUsers">Usuários${activeTab === 'usuarios' ? ' <span class="sr-only">(current)</span>' : ''}</a>
                    </li>` : ''}
                </ul>
                ${showSearch ? `
                <!-- barra de pesquisa -->
                <form class="form-inline my-2 my-lg-0">
                    <div class="input-group">
                        <input
                            class="form-control mr-sm-2 ui-autocomplete-input"
                            type="search"
                            id="searchInput"
                            placeholder="${searchPlaceholder}"
                            aria-label="Search"
                        />
                    </div>
                </form>` : ''}
            </div>
        </nav>`;
}
