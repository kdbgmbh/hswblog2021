// Store
import { writable } from 'svelte/store';
import { GET, POST } from '../http-client';

/**
 * Session store
 */
export const session = writable(null);

/**
 * Loads the user's session
 *
 * @returns {Promise<void>}
 */
export async function load() {
    try {
        const response = await GET('session', { terminateSessionOn401: false });
        session.set(response.body);
    } catch (err) {
        console.error('Failed to load session', err);
    }
}

/**
 * TODO
 *
 * @param username
 * @param password
 * @returns {Promise<null|object>}
 */
export async function create(username, password) {
    try {
        const response = await POST('session', { username, password });
        session.set(response.body);
        return response.body;
    } catch (e) {
        console.error(e);
        return null;
    }
}
