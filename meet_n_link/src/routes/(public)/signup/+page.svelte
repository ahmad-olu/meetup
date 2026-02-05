<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client';
	import { resolve } from '$app/paths';

	let error = '';

	async function signup(e: Event) {
		e.preventDefault();

		const form = e.target as HTMLFormElement;
		const name = (form.elements.namedItem('username') as HTMLInputElement).value;
		const email = (form.elements.namedItem('email') as HTMLInputElement).value;
		const password = (form.elements.namedItem('password') as HTMLInputElement).value;
		const confirm_password = (form.elements.namedItem('confirm_password') as HTMLInputElement)
			.value;

		if (!name || !email || !password || !confirm_password) {
			error = 'All fields are required';
			return;
		}

		if (password !== confirm_password) {
			error = "Passwords don't match";
			return;
		}

		error = '';

		await authClient.signUp.email(
			{ email, name, password },
			{
				onSuccess: () => goto(resolve('/signin')),
				onError: () => (error = 'Failed to create account. Please try again.')
			}
		);
	}
</script>

<div class="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-slate-50 px-4">
	<div class="w-full max-w-sm rounded-md border border-slate-200 bg-white p-6">
		<h1 class="mb-1 text-base font-medium text-slate-900">Sign up</h1>
		<p class="mb-4 text-sm text-slate-500">Create a new account to get started.</p>

		<form on:submit={signup} class="space-y-4">
			{#if error}
				<div class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
					{error}
				</div>
			{/if}

			<div class="space-y-1">
				<label for="username" class="block text-sm text-slate-700">Username</label>
				<input
					id="username"
					name="username"
					type="text"
					required
					class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
				/>
			</div>

			<div class="space-y-1">
				<label for="email" class="block text-sm text-slate-700">Email</label>
				<input
					id="email"
					name="email"
					type="email"
					required
					class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
				/>
			</div>

			<div class="space-y-1">
				<label for="password" class="block text-sm text-slate-700">Password</label>
				<input
					id="password"
					name="password"
					type="password"
					required
					class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
				/>
			</div>

			<div class="space-y-1">
				<label for="confirm_password" class="block text-sm text-slate-700">Confirm Password</label>
				<input
					id="confirm_password"
					name="confirm_password"
					type="password"
					required
					class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
				/>
			</div>

			<button
				type="submit"
				class="w-full rounded-md bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
			>
				Sign up
			</button>
		</form>

		<div class="mt-4 text-sm text-slate-600">
			<span>Already have an account?</span>
			<a href={resolve('/(public)/signin')} class="ml-1 text-blue-600 hover:underline"> Sign in </a>
		</div>
	</div>
</div>
