import { fetchFormUpdate } from '../js/fetch.js';

export function changeTitleAndDescription() {
    const titleElement = document.querySelector('#form-title');
    const descriptionElement = document.querySelector('#form-description');

    const title = titleElement.textContent.trim(); // Remove espaços em branco no início e no final
    const description = descriptionElement.textContent.trim(); // Remove espaços em branco no início e no final

    const inputTitulo = document.querySelector('#titulo');
    const inputDescricao = document.querySelector('#descricao');
    
    document.querySelector('.editFormInfo').addEventListener('click', () => {
        inputTitulo.value = title;
        inputDescricao.value = description;
    });

    document.querySelector('.saveFormInfoChanges').addEventListener('click', async () => {
        const newTitle = inputTitulo.value.trim(); // Remove espaços em branco no início e no final do novo título
        const newDescription = inputDescricao.value.trim(); // Remove espaços em branco no início e no final da nova descrição

        // Aqui você pode aplicar o tratamento adicional para caracteres indesejados no final do título, se necessário

        const params = {
            title: title.trim(), // Remove espaços em branco no início e no final do título original
            newTitle,
            description: newDescription,
        };

        await fetchFormUpdate(params);
        window.location.href = `/edit/${encodeURIComponent(newTitle)}`;
    });
}
