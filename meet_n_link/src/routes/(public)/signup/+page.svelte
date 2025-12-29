<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client';
	import { resolve } from '$app/paths';

	let error = $state('');
	async function signup(e: Event) {
		e.preventDefault();

		const form = e.target as HTMLFormElement;
		const name = form.username.value;
		const email = form.email.value;
		const password = form.password.value;
		const confirm_password = form.confirm_password.value;

		if (password !== confirm_password) {
			error = "Passwords don't match";
			return;
		}
		if (!name || !email || !password || !confirm_password) {
			error = 'All fields are required';
			return;
		}
		await authClient.signUp.email(
			{ email, name, password },
			{
				onSuccess: async () => {
					goto(resolve('/signin'));
				}
			}
		);
	}
</script>

<h1>Sign up</h1>
<form onsubmit={signup}>
	{#if error}
		<p>{error}</p>
	{/if}
	<div class="row">
		<label
			>Username:
			<input type="text" required id="username" />
		</label>
	</div>
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
	<div class="row">
		<label
			>Confirm Password:
			<input type="password" required id="confirm_password" />
		</label>
	</div>
	<button type="submit">Sign up</button>
</form>

<style></style>
