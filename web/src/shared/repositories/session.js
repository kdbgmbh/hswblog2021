// Store
import { writable } from 'svelte/store';
import { GET } from '../http-client';

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
