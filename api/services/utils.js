const { badRequest } = require('express-error-response');

exports.validateAndParseID = function (id) {
    const parsed = parseInt(id, 10);

    if (isNaN(parsed)) {
        badRequest({ error: 'invalid ID' });
    }

    return parsed;
};
