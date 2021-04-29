const { create, setCookie } = require('../services/session');

module.exports = function (expressApp) {
    expressApp.get('/session', function (req, res) {
        res.json(res.locals.session);
    });

    expressApp.post('/session', function (req, res) {
        const db = req.app.get('database');

        const session = create(
            {
                username: req.body.username,
                password: req.body.password,
            },
            db,
        );

        setCookie(session.token, res);

        res.json(session);
    });
};
