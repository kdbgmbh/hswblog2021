<script>
    import { onMount } from 'svelte';
    import { loadArticle } from './repositories/article';
    import { Container, Button } from 'sveltestrap';
    import Title from '../shared/Title.svelte';
    import { useParams, Link, link } from '../shared/router';

    onMount(load);

    let article = null;
    const params = useParams();

    async function load() {
        article = await loadArticle($params.id);
    }
</script>

{#if null !== article}
    <Container class="mt-5">
        <a class="btn btn-primary btn-sm" href="/" use:link>Back to index</a>

        <h1 class="mt-2">{article.title}</h1>
        <h2>{article.creator}</h2>
        <small>{article.views} views | {article.likes} likes | <Link to={`/view/${$params.id}`}>Permalink</Link></small>

        {@html article.text}
    </Container>
    <Title title="$title" />
{/if}
