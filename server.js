// Servidor estático + proxy do front (POP 1.0).
// Serve public/ e encaminha chamadas de API para o pop-back (BACKEND_URL).
// Rotas amigáveis (/home, /form/:title…) gravam cookie `form` e redirecionam
// para o HTML correspondente — o cookie é lido pelo front para saber qual form.
require('dotenv').config();

const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const router = express.Router();
const basePath = (process.env.POP_BASE_PATH || '').replace(/\/$/, '');
if (basePath && !/^\/[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*$/.test(basePath)) {
    throw new Error('POP_BASE_PATH inválido.');
}
if (basePath) {
    app.get(basePath, (req, res, next) => {
        if (req.path === basePath) return res.redirect(308, basePath + '/');
        next();
    });
}
const cookiePath = basePath + '/';

function redirectTo(res, path) {
    res.redirect(basePath + path);
}

function redirectToForm(req, res, path) {
    res.cookie('form', req.params.title, {
        path: cookiePath,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production' && process.env.POP_COOKIE_SECURE !== 'false',
    });
    redirectTo(res, path);
}
const PORT = process.env.PORT || 3000;
const HOST = process.env.IP || '0.0.0.0';
const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:3333';
const publicDir = path.join(__dirname, 'public');

const apiProxy = createProxyMiddleware({
    target: BACKEND_URL,
    changeOrigin: true,
    xfwd: false,
    pathRewrite: (_path, req) => req.originalUrl.slice(basePath.length),
});

router.use(express.static(publicDir));

router.get('/', (_req, res) => redirectTo(res, '/sign/index.html'));

router.get('/home', (_req, res) => redirectTo(res, '/home.html'));

router.get('/managerUsers', (_req, res) => redirectTo(res, '/admin/manterUsers.html'));

router.get('/dashboard', (_req, res) => redirectTo(res, '/dashboard/index.html'));

router.get('/form/:title', (req, res) => redirectToForm(req, res, '/form/formUser.html'));

router.get('/edit/:title', (req, res) => redirectToForm(req, res, '/form/formAdmin.html'));

router.get('/adminResponse/:title', (req, res) => redirectToForm(req, res, '/form/formResponseAdmin.html'));

router.use(/^\/[^/]+\/get$/, apiProxy);
router.use(
    [
        '/health',
        '/signup',
        '/signin',
        '/logout',
        '/refresh-token',
        '/userData',
        '/forms',
        '/getSuggestions',
        '/getFullForm',
        '/todayAnswers',
        '/allAnswers',
        '/search',
        '/access',
        '/delete',
        '/get',
        '/edit',
        '/restore',
        '/dashboard',
        '/questions',
        '/updateAnswer',
        '/form',
    ],
    apiProxy
);

app.use(basePath || '/', router);

app.listen(PORT, HOST, () => {
    console.log(`Frontend rodando em http://${HOST}:${PORT}`);
});
