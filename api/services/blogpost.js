const { notFound } = require('express-error-response');

// Dependencies for the local JSON "database"
const lowDb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

// Instantiation of the db adapter and connection
const adapter = new FileSync('db.json');
const db = lowDb(adapter);

// Initialize defaults for the database
// TODO: bootstrap the database connection in the index and set it in the server connection
db.defaults({ blogs: [], maxID: 0 }).write();

/**
 * Returns a blog by ID.
 *
 * @param {number} id ID of the blog to fetch
 * @return {object} found blog or undefined
 */
exports.find = function (id) {
    return db.get('blogs').find({ id: id }).value();
};

/**
 * Gets a blog by ID, throws if its not found
 * and increases its view counter by 1.
 *
 * @param {number} id ID of the blog to fetch
 * @return {object} fetched blog
 */
exports.get = function (id) {
    // Use the other function to find the blog
    const blog = exports.find(id);

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
 * @return {object} created blog
 */
exports.create = function (body) {
    // Get the max ID stored in the db state
    const lastID = db.get('maxID').value();

    // Initialize new object to push
    const created = {
        id: lastID + 1,
        text: body.text,
        creator: 'Max Mustermann',
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
 * @return {object[]}
 */
exports.getAll = function () {
    return db.get('blogs').value();
};

/**
 * Updates a blog with new text and returns
 *
 * @param {number} id   ID of the blog to update
 * @param {string} text text to set
 * @return {object} updated blog
 */
exports.update = function (id, text) {
    // Use the other function to find the blog
    const blog = exports.find(id);

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
 */
exports.del = function (id) {
    // Find the blog to make sure it exists
    const blog = exports.find(id);

    // Check whether it actually does
    if (!blog) {
        notFound();
    }

    // Persist the deletion
    db.get('blogs').remove({ id }).write();
};
