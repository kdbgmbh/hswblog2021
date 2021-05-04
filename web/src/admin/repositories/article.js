import { GET } from '../../shared/http-client';

/**
 * Loads all articles
 *
 * @returns {Promise<null|object[]>}
 */
export async function loadArticles() {
    try {
        const response = await GET('blogposts');
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
        const response = await GET(`blogposts/${id}`);
        return response.body;
    } catch (err) {
        return null;
    }
}
