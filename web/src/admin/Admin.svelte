<script>
    import { Router, Route } from '../shared/router';
    import LazyRoute from '../shared/LazyRoute.svelte';

    /**
     * Router
     *  Route #1:   /           Listing
     *  Route #2:   /edit/:id   View/edit article
     *  Route #3:   *           404
     */
</script>

<Router primary={false}>
    <Route path="/">
        <LazyRoute load={() => import('./ArticleList.svelte')} />
    </Route>

    <Route path="/edit/:id">
        <LazyRoute load={() => import('./ArticleEditor.svelte')} />
    </Route>

    <Route path="/new">
        <LazyRoute load={() => import('./ArticleEditor.svelte')} />
    </Route>

    <Route path="*">not found</Route>
</Router>
