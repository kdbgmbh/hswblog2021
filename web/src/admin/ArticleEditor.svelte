<script>
    import { onMount } from 'svelte';
    import { loadArticle } from './repositories/article';
    import { Container, Button, FormGroup, Label, Input } from 'sveltestrap';
    import Title from '../shared/Title.svelte';
    import { useParams, useNavigate, link } from '../shared/router';
    import VisualEditor from '../shared/VisualEditor.svelte';
    import { PUT, DELETE, POST } from '../shared/http-client';

    onMount(load);

    let article = null;
    let original = null;

    let notFound = false;

    const params = useParams();
    const goto = useNavigate();

    $: createsNewArticle = !$params.id;

    async function load() {
        if (createsNewArticle) {
            original = article = {
                title: '',
                text: '',
            };

            return;
        }

        article = await loadArticle($params.id);

        if (null === article) {
            notFound = true;
            return;
        }

        original = JSON.parse(JSON.stringify(article));
    }

    async function save() {
        try {
            if (createsNewArticle) {
                const response = await POST(`blogposts`, { title: article.title, text: article.text });
                alert('Article has been created');

                goto(`/edit/${response.body.id}`);
            } else {
                await PUT(`blogposts/${article.id}`, { title: article.title, text: article.text });
                alert('Article has been saved.');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to save');
        }
    }

    async function deleteArticle() {
        const proceed = window.confirm('Do you want to delete this article?');

        if (!proceed) {
            return;
        }

        try {
            await DELETE(`blogposts/${article.id}`);

            goto('/');
        } catch (err) {
            console.error(err);
            alert('Failed to delete');
        }
    }
</script>

{#if null !== article}
    <Container class="mt-5">
        <form on:submit|stopPropagation|preventDefault={save}>
            <div class="text-right mb-3">
                {#if !createsNewArticle}
                    <Button on:click={deleteArticle} type="button" color="danger">Delete</Button>
                {/if}
                <a class="btn btn-secondary ml-5" href="/" use:link>Cancel</a>
                <Button color="primary" class="ml-3">Save article</Button>
            </div>

            <FormGroup>
                <Label for="title">Title</Label>
                <Input disabled={!createsNewArticle} id="title" type="text" bind:value={article.title} />
            </FormGroup>

            <FormGroup>
                <Label for="text">Text</Label>
                <VisualEditor bind:value={article.text} />
            </FormGroup>
        </form>
    </Container>
    <Title title={original.title} />
{/if}

{#if notFound}
    <Container class="mt-5">
        <div class="alert alert-danger">Article not found</div>
        <a class="btn btn-secondary" href="/" use:link>Back to index</a>
    </Container>
{/if}
