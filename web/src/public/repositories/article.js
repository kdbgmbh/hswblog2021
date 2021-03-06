import { GET } from '../../shared/http-client';

/**
 * Loads all public articles
 *
 * @returns {Promise<null|object[]>}
 */
export async function loadArticles() {
    try {
        const response = await GET('p/blogposts');
        return response.body;
    } catch (err) {
        return null;
    }
}

/**
 * Loads a single article with the given id
 *
 * @param id
 * @returns {Promise<null|object>}
 */
export async function loadArticle(id) {
    try {
        const response = await GET(`p/blogposts/${id}`);
        return response.body;
    } catch (err) {
        return null;
    }
}
