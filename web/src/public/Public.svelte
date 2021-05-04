<script>
    import { Router, Route } from '../shared/router';
    import LazyRoute from '../shared/LazyRoute.svelte';

    /**
     * Router
     *  Route #1:   /           Listing
     *  Route #2:   /view/:id   View article
     *  Route #3:   /login      Login
     *  Route #4:   *           404
     */
</script>

<Router primary={false}>
    <Route path="/">
        <LazyRoute load={() => import('./ArticleList.svelte')} />
    </Route>

    <Route path="/view/:id">
        <LazyRoute load={() => import('./Article.svelte')} />
    </Route>

    <Route path="/login">
        <LazyRoute load={() => import('./Login.svelte')} />
    </Route>

    <Route path="*">not found</Route>
</Router>
