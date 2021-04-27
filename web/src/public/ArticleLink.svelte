<script>
    import { Link } from '../shared/router';

    export let author;
    export let title;
    export let id;

    $: shortText = title.length > 30 ? title.substr(0, 30) + '...' : title;
</script>

<div class="mb-3">
    <Link to={`/view/${id}`}>
        {shortText}
        <small>({author})</small>
    </Link>
</div>
