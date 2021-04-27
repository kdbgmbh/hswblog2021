<script>
    import { onMount, onDestroy } from 'svelte';

    /**
     * Function that loads the component
     */
    export let load;

    /**
     * Timeout after which the loading is to be shown.
     * Unit is milliseconds.
     */
    export let fallbackAfter = 500;

    // Whether to show the fallback
    let showFallback = false;

    // The component to render
    let component = null;

    // Timeout ID
    let timeoutId = null;

    onMount(async function () {
        timeoutId = setTimeout(function () {
            showFallback = true;
        }, fallbackAfter);

        const loaded = await load();
        component = loaded.default;

        clearTimeout(timeoutId);
        timeoutId = null;
    });

    onDestroy(function () {
        if (null !== timeoutId) {
            clearTimeout(timeoutId);
        }
    });
</script>

{#if null !== component}
    <svelte:component this={component} />
{:else if showFallback}Loading ...{/if}
