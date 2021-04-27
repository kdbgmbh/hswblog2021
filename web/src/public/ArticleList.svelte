<script>
    import { onMount } from 'svelte';
    import { loadArticles } from './repositories/article';
    import { Container } from 'sveltestrap';
    import ArticleLink from './ArticleLink.svelte';
    import Title from '../shared/Title.svelte';

    onMount(load);

    let articles = null;

    async function load() {
        articles = await loadArticles();
    }
</script>

<Container>
    <h1 class="mt-5">All articles</h1>

    {#if articles !== null}
        {#each articles as article (article.id)}
            <ArticleLink title={article.text} id={article.id} author={article.creator} />
        {/each}
    {/if}

    <Title title="All blog articles" />
</Container>
