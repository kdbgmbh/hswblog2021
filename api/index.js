// Blog API
const express = require('express');
const err = require('express-error-response');
const app = express();

app.use(express.json());

// Static list of blogs... for now

const blogRoute = require('./routes/blogposts');

blogRoute(app);

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

app.listen(3001, function () {
    console.log('Started the server on port 3001');
});
