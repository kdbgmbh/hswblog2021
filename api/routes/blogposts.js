// Import functions from the blogpost service
const { get, create, getAll, update, del } = require('../services/blogpost');
// Import ID validation function from utils
const { validateAndParseID } = require('../services/utils');
// Import badRequest function from the dependency
const { badRequest } = require('express-error-response');

module.exports = function (expressApp) {
    // Endpoint that returns all blogposts
    expressApp.get('/blogposts', function (req, res) {
        // Use the service function to obtain the data
        const blogs = getAll();
        // Send the data in the response
        res.json(blogs);
    });

    // Beim Aufrufen eines Blog-Eintrags den Counter erhöhen
    expressApp.get('/blogposts/:id', function (req, res) {
        // Obtain the ID
        const id = validateAndParseID(req.params.id);

        // Get the blog via service
        // Service throws 404 if not found
        const blogPost = get(id);

        // Return the found block
        res.json(blogPost);
    });

    // Blogeintrag hinzufügen
    expressApp.post('/blogposts', function (req, res) {
        // Create blogpost via service
        const created = create(req.body);

        // Send the created record in the response
        res.status(201).json(created);
    });

    // Blogeintrag bearbeiten
    expressApp.put('/blogposts/:id', function (req, res) {
        // Obtain the ID
        const id = validateAndParseID(req.params.id);

        // Accept anything but the property text not existing
        // as that is what the blog text is set to
        if ('undefined' === typeof req.body.text) badRequest();

        // Update the blog by ID and its new body
        const blog = update(id, req.body.text);

        // Return the updated blog
        res.json(blog);
    });

    // Blogeintrag löschen
    expressApp.delete('/blogposts/:id', function (req, res) {
        // Obtain the ID
        const id = validateAndParseID(req.params.id);

        // Attempt to delete the blog
        // Throws not found if a blog with the ID does not exist
        del(id);

        // Return no content
        res.status(204).end();
    });
};
