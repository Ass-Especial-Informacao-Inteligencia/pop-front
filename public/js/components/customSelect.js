/* ══════════════════════════════════════════════
   POP — Select customizado (componente JS)
   Padrão ARIA combobox + listbox:
   - trigger: role="combobox", aria-haspopup/expanded/controls
   - lista: role="listbox", opções role="option" com aria-selected
   - Teclado: Enter/Espaço/↑↓ abrem; ↑↓ navegam (wrap);
     Home/End primeiro/último; Enter/Espaço selecionam;
     Esc fecha mantendo o foco no trigger; Tab fecha e segue.
   ══════════════════════════════════════════════ */

let customSelectSeq = 0;

/**
 * Substitui um <select> nativo por um dropdown customizado.
 * @param {HTMLSelectElement} select - elemento <select> original
 */
export function initCustomSelect(select) {
  if (select.dataset.customSelect === 'true') return;

  customSelectSeq += 1;
  const listboxId = `custom-select-options-${customSelectSeq}`;

  const wrapper = document.createElement('div');
  wrapper.className = 'custom-select-wrapper';
  select.style.display = 'none';

  const trigger = document.createElement('div');
  trigger.className = 'custom-select-trigger';
  trigger.textContent = select.options[select.selectedIndex]?.text || 'Selecione';
  trigger.tabIndex = 0;
  trigger.setAttribute('role', 'combobox');
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-controls', listboxId);

  const optionsList = document.createElement('ul');
  optionsList.className = 'custom-select-options';
  optionsList.id = listboxId;
  optionsList.setAttribute('role', 'listbox');

  let indiceAtivo = -1;
  const itens = [];

  Array.from(select.options).forEach((opt, index) => {
    const li = document.createElement('li');
    li.className = 'custom-select-option';
    li.textContent = opt.text;
    li.dataset.value = opt.value;
    li.id = `${listboxId}-option-${index}`;
    li.setAttribute('role', 'option');
    li.setAttribute('aria-selected', opt.selected ? 'true' : 'false');
    if (opt.selected) li.classList.add('selected');

    li.addEventListener('click', () => selecionar(index));
    itens.push(li);
    optionsList.appendChild(li);
  });

  const estaAberto = () => wrapper.classList.contains('open');

  function abrir() {
    document.querySelectorAll('.custom-select-wrapper.open').forEach((w) => {
      if (w !== wrapper) w.classList.remove('open');
    });
    wrapper.classList.add('open');
    trigger.setAttribute('aria-expanded', 'true');
    const selecionado = itens.findIndex((li) => li.classList.contains('selected'));
    destacar(selecionado >= 0 ? selecionado : 0);
  }

  function fechar() {
    wrapper.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.removeAttribute('aria-activedescendant');
    indiceAtivo = -1;
  }

  function destacar(index) {
    if (index < 0 || index >= itens.length) return;
    itens.forEach((li) => li.classList.remove('active'));
    itens[index].classList.add('active');
    trigger.setAttribute('aria-activedescendant', itens[index].id);
    itens[index].scrollIntoView({ block: 'nearest' });
    indiceAtivo = index;
  }

  function selecionar(index) {
    const opt = select.options[index];
    if (!opt) return;
    select.value = opt.value;
    select.dispatchEvent(new Event('change', { bubbles: true }));

    itens.forEach((li) => {
      li.classList.remove('selected');
      li.setAttribute('aria-selected', 'false');
    });
    itens[index].classList.add('selected');
    itens[index].setAttribute('aria-selected', 'true');
    trigger.textContent = opt.text;
    fechar();
    trigger.focus();
  }

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (estaAberto()) fechar();
    else abrir();
  });

  trigger.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!estaAberto()) abrir();
        else if (indiceAtivo >= 0) selecionar(indiceAtivo);
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!estaAberto()) abrir();
        else destacar(indiceAtivo + 1 >= itens.length ? 0 : indiceAtivo + 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!estaAberto()) abrir();
        else destacar(indiceAtivo - 1 < 0 ? itens.length - 1 : indiceAtivo - 1);
        break;
      case 'Home':
        if (estaAberto()) {
          e.preventDefault();
          destacar(0);
        }
        break;
      case 'End':
        if (estaAberto()) {
          e.preventDefault();
          destacar(itens.length - 1);
        }
        break;
      case 'Escape':
        if (estaAberto()) {
          e.preventDefault();
          fechar();
        }
        break;
      case 'Tab':
        if (estaAberto()) fechar();
        break;
    }
  });

  wrapper.appendChild(trigger);
  wrapper.appendChild(optionsList);
  select.parentNode.insertBefore(wrapper, select);
  select.dataset.customSelect = 'true';
}

/**
 * Inicializa todos os <select> com classe .question-type-select na página.
 */
export function initAllCustomSelects() {
  document.querySelectorAll('select.question-type-select').forEach(initCustomSelect);
}

/**
 * Fecha todos os dropdowns abertos ao clicar fora (mantendo aria-expanded consistente).
 */
document.addEventListener('click', () => {
  document.querySelectorAll('.custom-select-wrapper.open').forEach((w) => {
    w.classList.remove('open');
    w.querySelector('.custom-select-trigger')?.setAttribute('aria-expanded', 'false');
  });
});
