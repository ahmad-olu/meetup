<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client';
	import { resolve } from '$app/paths';

	let error = '';

	async function signin(e: Event) {
		e.preventDefault();

		const form = e.target as HTMLFormElement;
		const email = (form.elements.namedItem('email') as HTMLInputElement).value;
		const password = (form.elements.namedItem('password') as HTMLInputElement).value;

		if (!email || !password) {
			error = 'All fields are required';
			return;
		}

		error = '';

		await authClient.signIn.email(
			{ email, password },
			{
				onSuccess: async () => {
					goto(resolve('/'));
				},
				onError: () => {
					error = 'Invalid email or password';
				}
			}
		);
	}
</script>

<div class="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-slate-50 px-4">
	<div class="w-full max-w-sm rounded-md border border-slate-200 bg-white p-6">
		<h1 class="mb-1 text-base font-medium text-slate-900">Sign in</h1>
		<p class="mb-4 text-sm text-slate-500">Use your email and password to access your account.</p>

		<form on:submit={signin} class="space-y-4">
			{#if error}
				<div class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
					{error}
				</div>
			{/if}

			<div class="space-y-1">
				<label for="email" class="block text-sm text-slate-700"> Email </label>
				<input
					id="email"
					name="email"
					type="email"
					required
					class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
				/>
			</div>

			<div class="space-y-1">
				<label for="password" class="block text-sm text-slate-700"> Password </label>
				<input
					id="password"
					name="password"
					type="password"
					required
					class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
				/>
			</div>

			<button
				type="submit"
				class="w-full rounded-md bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
			>
				Sign in
			</button>
		</form>

		<div class="mt-4 text-sm text-slate-600">
			<span>Don’t have an account?</span>
			<a href={resolve('/(public)/signup')} class="ml-1 text-blue-600 hover:underline"> Sign up </a>
		</div>
	</div>
</div>
