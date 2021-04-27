const { notFound } = require('express-error-response');

/**
 * Returns a blog by ID.
 *
 * @param {number} id ID of the blog to fetch
 * @param {object} db Database connection
 * @return {object} found blog or undefined
 */
exports.find = function (id, db) {
    return db.get('blogs').find({ id: id }).value();
};

/**
 * Gets a blog by ID, throws if its not found
 * and increases its view counter by 1.
 *
 * @param {number} id ID of the blog to fetch
 * @param {object} db Database connection
 * @return {object} fetched blog
 */
exports.get = function (id, db) {
    // Use the other function to find the blog
    const blog = exports.find(id, db);

    // Throw if it's falsy (not found)
    if (!blog) {
        notFound();
    }

    // Increase the views property by 1
    blog.views++;

    // Persist the database
    db.write();

    // Finally, return the blog
    return blog;
};

/**
 * Creates a new blog from a body object
 * that must contain a text property
 *
 * @param {object} body  Request body containing the text property
 * @param {object} db Database connection
 * @return {object} created blog
 */
exports.create = function (body, db, session) {
    // Get the max ID stored in the db state
    const lastID = db.get('maxID').value();

    // Initialize new object to push
    const created = {
        id: lastID + 1,
        text: body.text,
        creator: session.user.username,
        likes: 0,
        views: 0,
    };

    console.log('Created blogpost', created);

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
 * @return {object[]}
 */
exports.getAll = function (db) {
    return db.get('blogs').value();
};

/**
 * Updates a blog with new text and returns
 *
 * @param {number} id   ID of the blog to update
 * @param {string} text text to set
 * @param {object} db Database connection
 * @return {object} updated blog
 */
exports.update = function (id, text, db) {
    // Use the other function to find the blog
    const blog = exports.find(id, db);

    // Throw if it's falsy (not found)
    if (!blog) {
        notFound();
    }

    // Update the text prop
    blog.text = text;

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
 */
exports.del = function (id, db) {
    // Find the blog to make sure it exists
    const blog = exports.find(id, db);

    // Check whether it actually does
    if (!blog) {
        notFound();
    }

    // Persist the deletion
    db.get('blogs').remove({ id }).write();
};
