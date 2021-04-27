const { notFound } = require('express-error-response');
const crypto = require('crypto');

exports.create = function (auth, db) {
    const { username, password } = auth;

    const user = db.get('users').find({ username, password }).value();

    if (!user) {
        notFound({ error: 'Could not find a user for that name and password' });
    }

    const token = crypto.randomBytes(24).toString('hex');

    const session = {
        user: {
            name: user.name,
            username: user.username,
        },
        token,
        expiresAt: Date.now() + 1000 * 60 * 30, // 1000 ms * 60 seconds * 30 minutes
    };

    db.get('sessions').set(token, session).write();

    return session;
};

exports.byToken = function (token, db) {
    const session = db.get('sessions').get(token).value();

    return session;
};
