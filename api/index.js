// Blog API
const express = require('express');
const err = require('express-error-response');
const app = express();

// Register JSON parser for the request body
app.use(express.json());

// Import and register the session middleware
const sessionMiddleware = require('./middlewares/001_session');
sessionMiddleware(app);

// Import and register routes
const blogRoute = require('./routes/blogposts');
blogRoute(app);

// Register the error middleware to use RequestErrors in the services
app.use(
    err({
        logger: function (err) {
            console.log(err);
        },
        json: true,
        catchAll: true,
        endRequest: true,
    }),
);

// Start listening on port 3001
app.listen(3001, function () {
    console.log('Started the server on port 3001');
});
