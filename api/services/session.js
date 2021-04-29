const { notFound } = require('express-error-response');
const crypto = require('crypto');

const COOKIE_NAME = 'HSWBAUTH';

const getExpirationTime = () => Date.now() + 1000 * 60 * 30;

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
        expiresAt: getExpirationTime(), // 1000 ms * 60 seconds * 30 minutes
    };

    db.get('sessions').set(token, session).write();

    return session;
};

exports.setCookie = function (token, res) {
    res.cookie(COOKIE_NAME, token, {
        path: '/',
        secure: false,
        httpOnly: true,
    });
};

exports.sessionTokenFromRequest = function (req) {
    const header = req.headers['b-api'];
    const cookie = req.cookies[COOKIE_NAME];

    if (header) return header;

    if (cookie) return cookie;

    return null;
};

exports.byToken = function (token, db, prolong = false) {
    const session = db.get('sessions').get(token).value();

    if (!session) {
        return null;
    }

    if (Date.now() > session.expiresAt) {
        db.get('sessions').unset(token).write();
        return null;
    }

    if (prolong) {
        db.get('sessions').set(`${token}.expiresAt`, getExpirationTime()).write();
    }

    return session;
};
