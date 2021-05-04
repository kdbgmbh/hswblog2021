<script>
    import { Button, Input, FormGroup, Label } from 'sveltestrap';
    import Title from '../shared/Title.svelte';
    import { POST } from '../shared/http-client';
    import { create } from '../shared/repositories/session';
    import { useNavigate } from '../shared/router';

    const goto = useNavigate();
    const values = {
        username: '',
        password: '',
    };
    let valid = true;

    async function formSubmitted() {
        if (0 === values.username.length || 0 === values.password.length) {
            valid = false;
            return;
        }

        valid = true;

        const session = await create(values.username, values.password);

        if (null === session) {
            return;
        }

        goto('/');
    }
</script>

<style>
    .form-wrapper {
        max-width: 23rem;
    }
</style>

<form class="container-fluid mt-5" on:submit|preventDefault|stopPropagation={formSubmitted}>
    <div class="form-wrapper">
        <FormGroup>
            <Label for="username">User name:</Label>
            <Input id="username" bind:value={values.username} />
        </FormGroup>

        <FormGroup>
            <Label for="password">Password:</Label>
            <Input type="password" id="password" bind:value={values.password} />
        </FormGroup>

        {#if !valid}
            <div class="alert alert-danger">Please enter a user name and a password</div>
        {/if}
    </div>

    <Button type="submit" color="primary">Log in</Button>
</form>

<Title title="Login" />
