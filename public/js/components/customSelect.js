/* ══════════════════════════════════════════════
   POP — Select customizado (componente JS)
   ══════════════════════════════════════════════ */

/**
 * Substitui um <select> nativo por um dropdown customizado.
 * @param {HTMLSelectElement} select - elemento <select> original
 */
export function initCustomSelect(select) {
  if (select.dataset.customSelect === 'true') return;

  const wrapper = document.createElement('div');
  wrapper.className = 'custom-select-wrapper';
  select.style.display = 'none';

  const trigger = document.createElement('div');
  trigger.className = 'custom-select-trigger';
  trigger.textContent = select.options[select.selectedIndex]?.text || 'Selecione';
  trigger.tabIndex = 0;

  const optionsList = document.createElement('ul');
  optionsList.className = 'custom-select-options';

  Array.from(select.options).forEach((opt) => {
    const li = document.createElement('li');
    li.className = 'custom-select-option';
    li.textContent = opt.text;
    li.dataset.value = opt.value;

    if (opt.selected) li.classList.add('selected');

    li.addEventListener('click', () => {
      select.value = opt.value;
      select.dispatchEvent(new Event('change', { bubbles: true }));

      optionsList.querySelectorAll('.custom-select-option').forEach((o) => o.classList.remove('selected'));
      li.classList.add('selected');
      trigger.textContent = opt.text;
      wrapper.classList.remove('open');
    });

    optionsList.appendChild(li);
  });

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    document.querySelectorAll('.custom-select-wrapper.open').forEach((w) => {
      if (w !== wrapper) w.classList.remove('open');
    });
    wrapper.classList.toggle('open');
  });

  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      trigger.click();
    }
    if (e.key === 'Escape') {
      wrapper.classList.remove('open');
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
 * Fecha todos os dropdowns abertos ao clicar fora.
 */
document.addEventListener('click', () => {
  document.querySelectorAll('.custom-select-wrapper.open').forEach((w) => w.classList.remove('open'));
});
