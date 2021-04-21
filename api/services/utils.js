const { badRequest } = require('express-error-response');

/**
 * Accepts any ID parameter,
 * attempts to parse it into an integer/number
 * and throws badRequest if that fails (parseInt evaluates to NaN)
 *
 * @param {mixed} id ID req param to parse
 * @return {number} parsed ID as number
 */
exports.validateAndParseID = function (id) {
    const parsed = parseInt(id, 10);

    if (isNaN(parsed)) {
        badRequest({ error: 'invalid ID' });
    }

    return parsed;
};
