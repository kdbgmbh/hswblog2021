import 'bootstrap-icons/font/bootstrap-icons.css';
import HSWBlog from './HSWBlog.svelte';

document.addEventListener('DOMContentLoaded', function () {
    new HSWBlog({
        target: document.querySelector('body'),
    });
});
