// Blog API
const express = require('express');
const err = require('express-error-response');
const { notFound } = require('express-error-response');
const cookieParser = require('cookie-parser');
const app = express();

// Dependencies for the local JSON "database"
const lowDb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

// Instantiation of the db adapter and connection
const adapter = new FileSync('db.json');
const db = lowDb(adapter);

// Initialize defaults for the database
db.defaults({
    blogs: [],
    maxID: 0,
    users: [
        { username: 'mustermann', name: 'Max Mustermann', password: 'password' },
        { username: 'fritz', name: 'Paula Fritz', password: 'supersecure' },
    ],
    sessions: {},
    images: [],
    maxImageID: 0,
}).write();

// Register JSON parser for the request body
app.use(express.json());
// Register cookie parser
app.use(cookieParser());

// Import and register the session middleware
const sessionMiddleware = require('./middlewares/001_session');
sessionMiddleware(app);

// Import and register routes
const blogRoute = require('./routes/blogposts');
blogRoute(app);

const sessionRoute = require('./routes/session');
sessionRoute(app);

// Register variables
app.set('database', db);

app.use(function () {
    notFound({ error: 'Could not find the route' });
});

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
