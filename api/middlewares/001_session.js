const { byToken, sessionTokenFromRequest } = require('../services/session');

let requestNum = 0;

function isPublic(req) {
    const { method, path } = req;

    if (method === 'POST' && path === '/session') return true;

    if (path.startsWith('/p/')) return true;

    return false;
}

module.exports = function (app) {
    app.use(function (req, res, next) {
        if (isPublic(req)) {
            return next();
        }

        const token = sessionTokenFromRequest(req);

        let session = null;

        if (token) {
            session = byToken(token, req.app.get('database'), true);
            res.locals.session = session;
        }

        if (!session) {
            res.status(401).json({ error: 'not authenticated' }).end();
            return;
        }

        next();
    });
};
