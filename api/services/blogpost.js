const { notFound } = require('express-error-response');
const fs = require('fs');

/**
 * Returns a blog by ID.
 *
 * @param {number} id ID of the blog to fetch
 * @param {object} db Database connection
 * @param {object} session session of the user
 * @return {object} found blog or undefined
 */
exports.find = function (id, db, session) {
    if (session) {
        return db.get('blogs').find({ id, creator: session.user.username }).value();
    }

    return db.get('blogs').find({ id: id }).value();
};

/**
 * Gets a blog by ID, throws if its not found
 * and increases its view counter by 1.
 *
 * @param {number} id ID of the blog to fetch
 * @param {object} db Database connection
 * @param {object} session session of the user
 * @param {boolean} increaseViewCounter whether the view counter should be incremented
 * @return {object} fetched blog
 */
exports.get = function (id, db, session, increaseViewCounter = true) {
    // Use the other function to find the blog
    const blog = exports.find(id, db, session);

    // Throw if it's falsy (not found)
    if (!blog) {
        notFound();
    }

    if (increaseViewCounter) {
        // Increase the views property by 1
        blog.views++;

        // Persist the database
        db.write();
    }

    // Finally, return the blog
    return blog;
};

/**
 * Creates a new blog from a body object
 * that must contain a text property
 *
 * @param {object} body  Request body containing the text and title properties
 * @param {object} db Database connection
 * @param {object} session session of the user
 * @return {object} created blog
 */
exports.create = function (body, db, session) {
    const { text, title } = body;

    // Get the max ID stored in the db state
    const lastID = db.get('maxID').value();

    // Initialize new object to push
    const created = {
        id: lastID + 1,
        text,
        title,
        creator: session.user.username,
        likes: 0,
        views: 0,
    };

    // Update the stored max ID with the recently increased one
    db.set('maxID', created.id).write();

    // Add the newly created blog and persist
    db.get('blogs').push(created).write();

    // Finally, return the created record
    return created;
};

/**
 * Returns all blogs
 *
 * @param {object} db Database connection
 * @param {object} session session of the user
 * @return {object[]}
 */
exports.getAll = function (db, session) {
    if (session) {
        return db.get('blogs').filter({ creator: session.user.username }).value();
    }

    return db.get('blogs').value();
};

/**
 * Updates a blog with new text and returns
 *
 * @param {number} id   ID of the blog to update
 * @param {object} body  Request body containing the text and title properties
 * @param {object} db Database connection
 * @param {object} session session of the user
 * @return {object} updated blog
 */
exports.update = function (id, body, db, session) {
    const { text, title } = body;

    // Use the other function to find the blog
    const blog = exports.find(id, db, session);

    // Throw if it's falsy (not found)
    if (!blog) {
        notFound();
    }

    // Update the text prop
    blog.text = text;
    blog.title = title;

    // Persist the database
    db.write();

    // Finally, return the blog after updating
    return blog;
};

/**
 * Deletes a blog by ID
 *
 * @param {number} id ID of the block to delete
 * @param {object} db Database connection
 * @param {object} session session of the user
 */
exports.del = function (id, db, session) {
    // Find the blog to make sure it exists
    const blog = exports.find(id, db, session);

    // Check whether it actually does
    if (!blog) {
        notFound();
    }

    // Persist the deletion
    db.get('blogs').remove({ id }).write();
};

exports.addPicture = function (id, file, db, session) {
    const blog = exports.find(id, db, session);

    if (!blog) {
        notFound();
    }

    const maxID = db.get('maxImageID').value();

    const img = {
        id: maxID + 1,
        mime: file.mimetype,
        original: file.originalname,
        path: file.path,
        size: file.size,
        blog_id: id,
    };

    db.set('maxImageID', img.id).write();

    db.get('images').push(img).write();

    return img;
};

exports.getPictureList = function (id, db) {
    const blog = exports.find(id, db);

    if (!blog) {
        notFound();
    }

    const images = db.get('images').filter({ blog_id: id }).value();

    return images;
};

exports.getPicture = function (id, imageID, db) {
    const blog = exports.find(id, db);

    if (!blog) {
        notFound();
    }

    const img = db.get('images').find({ blog_id: id, id: imageID }).value();

    if (!img) {
        notFound();
    }

    return {
        img,
        stream: fs.createReadStream(img.path),
    };
};
