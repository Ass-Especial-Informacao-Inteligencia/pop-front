const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// DOM/jQuery mínimos para executar os handlers reais sem instalar dependências.
function page(role) {
    let now = 0;
    let id = 0;
    const tasks = new Map();
    const handlers = new Map();
    const live = { textContent: '' };
    const sortBar = { dataset: { filtro: 'todos' } };
    const cards = [{ title: 'Saúde', text: 'Atendimento municipal' }, { title: 'Saúde pública', text: 'Unidades de saúde' }];
    const button = { classList: { toggle() {} } };
    const document = {
        getElementById: name => name === 'sr-live' ? live : name === 'sortBar' ? sortBar : null,
        querySelector: selector => selector === '.search-clear-btn' ? button : null,
        querySelectorAll: () => [],
    };
    function $(value) {
        if (value === document) return {
            ready: callback => callback(),
            on: (event, selector, callback) => handlers.set(`${event}:${selector}`, callback),
        };
        if (typeof value === 'string') return {
            each: callback => (value === '#cardContainer .card' ? cards : [])
                .forEach(card => callback.call(card)),
        };
        return {
            find: selector => ({ text: () => selector === '.card-title' ? value.title : value.text }),
            toggleClass() {},
            attr: () => 'false',
            hasClass: () => true,
        };
    }
    const setTimeout = (callback, delay) => {
        tasks.set(++id, { callback, at: now + delay });
        return id;
    };
    const context = vm.createContext({
        document, $, setTimeout, clearTimeout: id => tasks.delete(id),
        requestAnimationFrame: callback => setTimeout(callback, 16),
    });
    const read = relative => readFileSync(path.join(__dirname, '..', relative), 'utf8');
    vm.runInContext(read('public/js/geraNotificacao.js').replace(/^export /gm, ''), context);
    vm.runInContext(read(`public/${role}/js/barraPesquisa.js`).replace(/^import .*;\r?\n/gm, ''), context);
    return {
        live,
        search(value) { handlers.get('input:#searchInput').call({ value }); },
        tick(milliseconds) {
            const end = now + milliseconds;
            while (true) {
                const next = [...tasks.entries()].filter(([, task]) => task.at <= end)
                    .sort((a, b) => a[1].at - b[1].at || a[0] - b[0])[0];
                if (!next) break;
                tasks.delete(next[0]);
                now = next[1].at;
                next[1].callback();
            }
            now = end;
        },
    };
}

for (const role of ['admin', 'user']) {
    test(`${role}: aviso de busca desaparece após quatro segundos`, () => {
        const app = page(role);
        app.search('saúde');
        app.tick(516);
        assert.equal(app.live.textContent, '2 formulários encontrados');
        app.tick(4000);
        assert.equal(app.live.textContent, '');
    });

    test(`${role}: limpar a busca remove o aviso imediatamente`, () => {
        const app = page(role);
        app.search('saúde');
        app.tick(516);
        app.search('');
        assert.equal(app.live.textContent, '');
        app.tick(5000);
        assert.equal(app.live.textContent, '');
    });

    test(`${role}: limpar antes do debounce cancela o aviso pendente`, () => {
        const app = page(role);
        app.search('saúde');
        app.tick(200);
        app.search('');
        app.tick(500);
        assert.equal(app.live.textContent, '');
    });

    test(`${role}: nova busca reinicia o prazo do aviso`, () => {
        const app = page(role);
        app.search('saúde');
        app.tick(3516);
        app.search('atendimento');
        app.tick(516);
        assert.equal(app.live.textContent, '1 formulário encontrado');
        app.tick(1000);
        assert.equal(app.live.textContent, '1 formulário encontrado');
        app.tick(3000);
        assert.equal(app.live.textContent, '');
    });

    test(`${role}: HTML carrega a busca como módulo para compartilhar as notificações`, () => {
        const html = readFileSync(path.join(__dirname, '..', `public/${role}/index.html`), 'utf8');
        assert.match(html, /<script\s+type="module"\s+src="\.\/js\/barraPesquisa\.js"><\/script>/);
    });
}
