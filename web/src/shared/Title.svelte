<script>
    import { onMount } from 'svelte';

    export let title;

    onMount(function () {
        document.title = `${title} | HSW Blog`;
    });
</script>
