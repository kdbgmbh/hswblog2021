import { onDestroy } from 'svelte';
import { writable } from 'svelte/store';

/**
 * 'wrapper' around the routing library
 */
import {
    useFocus,
    useLocation,
    useMatch,
    useNavigate,
    useParams,
    useResolvable,
    useResolve,
    Route,
    Router,
    links,
    link,
    Link,
} from 'svelte-navigator';

/**
 * Get the current URL query params in a key/value object
 *
 * @return Store containing the current URL's query params
 */
// function useQuery(): Writable<{ [key: string]: string }> {
function useQuery() {
    const query = writable({});

    const locationStore = useLocation();

    const unsubscribe = locationStore.subscribe(({ search }) => {
        if (search) {
            const values = Object.fromEntries(
                search
                    .substring(1, search.length)
                    .split('&')
                    .map(queryValue => {
                        const [key, value] = queryValue.split('=');
                        return [decodeURIComponent(key), decodeURIComponent(value)];
                    }),
            );

            query.set(values);
        } else {
            query.set({});
        }
    });

    onDestroy(unsubscribe);

    return query;
}

// export interface RouteDefinition {
//     /**
//      * The address to match against
//      */
//     href: string;
//
//     /**
//      * Function that loads the component
//      *
//      * @example
//      * ```
//      * load => () => import('./my-component.svelte')
//      * ```
//      */
//     load: () => Promise<{ default: any }>;
// }

// We will add or overwrite functionality as necessary
export {
    useFocus,
    useLocation,
    useMatch,
    useNavigate,
    useParams,
    useResolvable,
    useResolve,
    useQuery,
    Route,
    Router,
    links,
    link,
    Link,
};
