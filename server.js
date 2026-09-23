// Servidor estático + proxy do front (POP 1.0).
// Serve public/ e encaminha chamadas de API para o pop-back (BACKEND_URL).
// Rotas amigáveis (/home, /form/:title…) gravam cookie `form` e redirecionam
// para o HTML correspondente — o cookie é lido pelo front para saber qual form.
require('dotenv').config();

const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.IP || '0.0.0.0';
const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:3333';
const publicDir = path.join(__dirname, 'public');

const apiProxy = createProxyMiddleware({
    target: BACKEND_URL,
    changeOrigin: true,
    xfwd: false,
    pathRewrite: (path, req) => req.originalUrl,
});

app.use(express.static(publicDir));

app.get('/', (req, res) => {
    res.redirect('/sign/index.html');
});

app.get('/home', (req, res) => {
    res.redirect('/home.html');
});

app.get('/managerUsers', (req, res) => {
    res.redirect('/admin/manterUsers.html');
});

app.get('/dashboard', (req, res) => {
    res.redirect('/dashboard/index.html');
});

app.get('/form/:title', (req, res) => {
    res.cookie('form', req.params.title, { path: '/', sameSite: 'lax' });
    res.redirect('/form/formUser.html');
});

app.get('/edit/:title', (req, res) => {
    res.cookie('form', req.params.title, { path: '/', sameSite: 'lax' });
    res.redirect('/form/formAdmin.html');
});

app.get('/adminResponse/:title', (req, res) => {
    res.cookie('form', req.params.title, { path: '/', sameSite: 'lax' });
    res.redirect('/form/formResponseAdmin.html');
});

app.use(/^\/[^/]+\/get$/, apiProxy);
app.use(
    [
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

app.listen(PORT, HOST, () => {
    console.log(`Frontend rodando em http://${HOST}:${PORT}`);
});
