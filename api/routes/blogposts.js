// Import functions from the blogpost service
const { get, create, getAll, update, del, addPicture, getPicture, getPictureList } = require('../services/blogpost');
// Import ID validation function from utils
const { validateAndParseID } = require('../services/utils');
// Import badRequest function from the dependency
const { badRequest } = require('express-error-response');

const multer = require('multer');
const upload = multer({ dest: 'files/' });

module.exports = function (expressApp) {
    // Endpoint that returns all blogposts (public)
    expressApp.get('/p/blogposts', function (req, res) {
        // Get the database connection from the express app
        const db = req.app.get('database');

        // Use the service function to obtain the data
        const blogs = getAll(db);
        // Send the data in the response
        res.json(blogs);
    });

    // Endpoint that returns all blogposts for the current user
    expressApp.get('/blogposts', function (req, res) {
        // Get the database connection from the express app
        const db = req.app.get('database');

        // Use the service function to obtain the data
        const blogs = getAll(db, res.locals.session);
        // Send the data in the response
        res.json(blogs);
    });

    // Increase counter for a blog entry
    expressApp.get('/p/blogposts/:id', function (req, res) {
        // Obtain the ID
        const id = validateAndParseID(req.params.id);

        // Get the database connection from the express app
        const db = req.app.get('database');

        // Get the blog via service
        // Service throws 404 if not found
        const blogPost = get(id, db, undefined, true);

        // Return the found block
        res.json(blogPost);
    });

    // Get blog post by id for our session
    expressApp.get('/blogposts/:id', function (req, res) {
        // Obtain the ID
        const id = validateAndParseID(req.params.id);

        // Get the database connection from the express app
        const db = req.app.get('database');

        // Get the blog via service
        // Service throws 404 if not found
        const blogPost = get(id, db, res.locals.session, false);

        // Return the found block
        res.json(blogPost);
    });

    // Add a blog entry
    expressApp.post('/blogposts', function (req, res) {
        // Get the database connection from the express app
        const db = req.app.get('database');

        // Accept anything but the property text not existing
        // as that is what the blog text is set to
        if ('undefined' === typeof req.body.text) badRequest({ error: 'text property required' });
        // Same for the title
        if ('undefined' === typeof req.body.title) badRequest({ error: 'title property required' });

        // Create blogpost via service
        const created = create(req.body, db, res.locals.session);

        // Send the created record in the response
        res.status(201).json(created);
    });

    // Edit a blog entry
    expressApp.put('/blogposts/:id', function (req, res) {
        // Obtain the ID
        const id = validateAndParseID(req.params.id);

        // Accept anything but the property text not existing
        // as that is what the blog text is set to
        if ('undefined' === typeof req.body.text) badRequest({ error: 'text property required' });
        // Same for the title
        if ('undefined' === typeof req.body.title) badRequest({ error: 'title property required' });

        // Get the database connection from the express app
        const db = req.app.get('database');

        // Update the blog by ID and its new body
        const blog = update(id, req.body, db, res.locals.session);

        // Return the updated blog
        res.json(blog);
    });

    // Delete a blog entry
    expressApp.delete('/blogposts/:id', function (req, res) {
        // Obtain the ID
        const id = validateAndParseID(req.params.id);

        // Get the database connection from the express app
        const db = req.app.get('database');

        // Attempt to delete the blog
        // Throws not found if a blog with the ID does not exist
        del(id, db, res.locals.session);

        // Return no content
        // res.status(204).end();
        res.json({ deleted: true });
    });

    expressApp.post('/blogposts/:id/upload', upload.single('image'), function (req, res) {
        // Obtain the ID
        const id = validateAndParseID(req.params.id);

        // Get the database connection from the express app
        const db = req.app.get('database');

        const pic = addPicture(id, req.file, db, res.locals.session);

        res.json(pic);
    });

    expressApp.get('/p/blogposts/:id/images/:iid', function (req, res) {
        // Obtain the ID
        const id = validateAndParseID(req.params.id);
        const imageID = validateAndParseID(req.params.iid);

        // Get the database connection from the express app
        const db = req.app.get('database');

        const { img, stream } = getPicture(id, imageID, db);

        res.set('content-length', img.size);
        res.set('content-disposition', `inline; filename="${img.original}"`);

        res.type(img.mime);

        stream.pipe(res);
    });

    expressApp.get('/p/blogposts/:id/images', function (req, res) {
        // Obtain the ID
        const id = validateAndParseID(req.params.id);

        // Get the database connection from the express app
        const db = req.app.get('database');

        const images = getPictureList(id, db);

        res.json(images);
    });
};
