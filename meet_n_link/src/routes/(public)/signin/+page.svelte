<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client';
	import { resolve } from '$app/paths';

	let error = $state('');
	async function signin(e: Event) {
		e.preventDefault();

		const form = e.target as HTMLFormElement;
		const email = form.email.value;
		const password = form.password.value;
		if (!email || !password) {
			error = 'All fields are required';
			return;
		}
		await authClient.signIn.email(
			{ email, password },
			{
				onSuccess: async () => {
					goto(resolve('/'));
				}
			}
		);
	}
</script>

<h1>Sign In</h1>
<form onsubmit={signin}>
	{#if error}
		<p>{error}</p>
	{/if}
	<div class="row">
		<label
			>Email:
			<input type="email" required id="email" />
		</label>
	</div>
	<div class="row">
		<label
			>Password:
			<input type="password" required id="password" />
		</label>
	</div>

	<button type="submit">Sign In</button>
</form>

<style></style>
