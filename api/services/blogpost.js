const { notFound } = require('express-error-response');

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

exports.find = function (id) {
    return blogs.find((b) => b.id === id);
};

exports.get = function (id) {
    const blog = exports.find(id);

    if (!blog) {
        notFound();
    }

    blog.views++;

    return blog;
};

exports.create = function (body) {
    const created = {
        id: blogs.length + 1,
        text: body.text,
        creator: 'Max Mustermann',
        likes: 0,
        views: 0,
    };

    blogs.push(created);

    return created;
};

exports.getAll = function () {
    return blogs;
};

exports.update = function (id, text) {
    const blog = exports.find(id);

    if (!blog) {
        notFound();
    }

    blog.text = text;

    return blog;
};

exports.del = function (id) {
    const blog = exports.find(id);

    if (!blog) {
        notFound();
    }

    blogs = blogs.filter((blog) => blog.id !== id);
};
