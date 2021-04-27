<script>
    import { Container } from 'sveltestrap';
    import { onMount } from 'svelte';
    import { load, session } from './shared/repositories/session';
    import Admin from './admin/Admin.svelte';
    import Public from './public/Public.svelte';

    let triedToLoadSession = false;

    onMount(loadSession);

    /**
     * Loads the user's session
     *
     * @returns {Promise<void>}
     */
    async function loadSession() {
        await load();

        triedToLoadSession = true;
    }
</script>

<!-- Render only if we tried to load the session -->
{#if triedToLoadSession}
    {#if null !== $session}
        <Admin />
    {:else}
        <Public />
    {/if}
{/if}
