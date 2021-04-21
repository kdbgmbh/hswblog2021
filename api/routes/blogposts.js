const { get, create, getAll, update, del } = require('../services/blogpost');
const { validateAndParseID } = require('../services/utils');
const { badRequest, RequestError } = require('express-error-response');

module.exports = function (expressApp) {
    expressApp.get(
        '/blogposts',
        function (req, res, next) {
            console.log('I am the middleware and you shall not pass');
            next();
        },
        function (req, res) {
            const blogs = getAll();
            res.json(blogs);
        },
    );

    // Beim Aufrufen eines Blog-Eintrags den Counter erhöhen
    expressApp.get('/blogposts/:id', function (req, res) {
        const id = validateAndParseID(req.params.id);

        const blogPost = get(id);

        res.json(blogPost);
    });

    // Blogeintrag hinzufügen
    expressApp.post('/blogposts', function (req, res) {
        const created = create(req.body);

        res.status(201).json(created);
    });

    // Blogeintrag bearbeiten
    expressApp.put('/blogposts/:id', function (req, res) {
        const id = validateAndParseID(req.params.id);

        if ('undefined' === typeof req.body.text) badRequest();

        const blog = update(id, req.body.text);

        res.json(blog);
    });

    // Blogeintrag löschen
    expressApp.delete('/blogposts/:id', function (req, res) {
        const id = validateAndParseID(req.params.id);

        del(id);

        res.status(204).end();
    });
};
