export function renderFooter(basePath = './') {
    return `
        <footer class="bg-light text-center py-4">
            <div class="container">
                <p>Uma parceria entre</p>
                <div class="row justify-content-center align-items-center">
                    <img
                        src="${basePath}src/logo-fatec-ferraz.png"
                        alt="Logo da Fatec Ferraz de Vasconcelos"
                        class="img-fluid"
                        style="max-width: 100px; padding: 15px"
                    />
                    <img
                        src="${basePath}src/BRASAO-PREFEITURA-DE-FERRAZ.png"
                        alt="Logo da Prefeitura de Ferraz de Vasconcelos"
                        class="img-fluid"
                        style="max-width: 50px; margin-bottom: 15px"
                    />
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <p class="mb-0 mt-3">
                            Desenvolvido por: Fatec Ferraz de Vasconcelos.<br />
                            &copy; 2024 POP Prefeitura Municipal de Ferraz de
                            Vasconcelos, Todos os direitos reservados.
                        </p>
                    </div>
                </div>
            </div>
        </footer>`;
}
