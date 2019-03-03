const proxy = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(proxy(
        '/api/cpu', {
            target: 'http://localhost:8080',
            changeOrigin: true,
        },
    ));
};