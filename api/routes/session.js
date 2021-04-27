const { create } = require('../services/session');

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

        res.json(session);
    });
};
