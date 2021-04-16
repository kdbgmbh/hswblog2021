// Blog API
const express = require('express');

const app = express();

app.use(express.json());

// Static list of blogs... for now
let blogs = [
    {
        id: 1,
        text:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc porta, tellus rhoncus hendrerit rhoncus, metus lacus aliquet nisl, ac iaculis turpis metus nec ligula. Nunc tempor nulla risus, pulvinar tempus ipsum volutpat id. Vestibulum ante.',
        creator: 'Max Mustermann',
        likes: 300,
        views: 866,
    },
    {
        id: 2,
        text:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec lectus nulla, ultricies vitae nisl a, viverra dictum neque. Aliquam diam massa, aliquet eu nibh in, viverra sollicitudin nulla. Etiam rutrum sapien ac justo sodales maximus.',
        creator: 'Paula Fritz',
        likes: 800,
        views: 4987,
    },
    {
        id: 3,
        text:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas tempus nibh vulputate condimentum convallis. Aliquam erat volutpat. Nullam sodales ex et libero imperdiet, sit amet dapibus dui luctus. Quisque ac molestie lacus. Nulla luctus risus.',
        creator: 'Max Mustermann',
        likes: -2,
        views: 22,
    },
];

app.get('/blogposts', function (req, res) {
    res.json(blogs);
});

// Beim aufrufen eines Blogs den Counter erhöhen
app.get('/blogposts/:id', function (req, res) {
    // Invalide ID
    const blogPost = blogs.find((b) => b.id === parseInt(req.params.id));

    if (isNaN(parseInt(req.params.id))) {
        res.status(400).json({ error: 'bad request' }).end();
        return;
    }

    if (!blogPost) {
        res.status(404).json({ error: 'not found' }).end();
        return;
    }

    res.json(blogPost);
});

// Blogeintrag hinzufügen
app.post('/blogposts', function (req, res) {
    const created = {
        id: blogs.length + 1,
        text: req.body.text,
        creator: 'Max Mustermann',
        likes: 0,
        views: 0,
    };

    blogs.push(created);

    res.status(201).json(created);
});

// Blogeintrag bearbeiten
app.put('/blogposts/:id', function (req, res) {});

// Blogeintrag löschen
app.delete('/blogposts/:id', function (req, res) {});

app.listen(3001, function () {
    console.log('Started the server on port 3001');
});
