let requestNum = 0;

module.exports = function (app) {
    app.use(function (req, res, next) {
        console.log(`Received request #${++requestNum}`);

        const token = req.headers['b-api'];

        if (token !== 'auth1234' && req.path !== '/login') {
            res.status(401).json({ error: 'not authenticated' }).end();
            return;
        }

        next();
    });
};
