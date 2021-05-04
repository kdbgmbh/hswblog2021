<script>
    import { onMount, onDestroy } from 'svelte';
    import Quill from 'quill';

    /**
     * Reactive value of the editor
     */
    export let value;

    /**
     * Whether the editor is invalid
     */
    export let invalid = false;

    export let updateValue = null;

    let wrapperRef = null;
    let editorRef = null;
    let editor = null;

    const initialValue = value;

    onMount(function () {
        if (!editorRef) {
            return;
        }

        editor = new Quill(editorRef, {
            modules: {
                toolbar: [[{ header: [1, 2, 3, false] }], ['bold', 'italic', 'underline', 'strike']],
            },
            theme: 'snow', // or 'bubble'
        });

        updateValue = function (value) {
            editor.clipboard.dangerouslyPasteHTML(value);
        };

        editor.on('text-change', editorChanged);
    });

    onDestroy(function () {
        editor.off('text-change', editorChanged);
    });

    /**
     * Editor value has changed
     */
    function editorChanged() {
        if (!wrapperRef) {
            return;
        }

        const contentWrap = wrapperRef.querySelector('.ql-editor');

        if (!contentWrap) {
            return;
        }

        value = contentWrap.innerHTML;
    }
</script>

<style>
    .visual-editor :global(.ql-editor) {
        min-height: 200px;
    }

    .visual-editor.is-invalid :global(.ql-container),
    .visual-editor.is-invalid :global(.ql-toolbar) {
        border-color: var(--danger);
    }
</style>

<div class="visual-editor" bind:this={wrapperRef} class:is-invalid={invalid}>
    <div bind:this={editorRef}>
        {@html initialValue}
    </div>
</div>
