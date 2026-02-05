<script lang="ts">
	import '../../app.css';
	import { resolve } from '$app/paths';

	let { obj } = $props();
	const user: {
		id: string;
		email: string;
		name: string;
		role: 'admin' | 'member';
	} | null = $derived(obj.user);

	let accountOpen = $state(false);
	let adminOpen = $state(false);
</script>

<header class="border-b border-slate-200 bg-white">
	<div class="mx-auto max-w-7xl px-4">
		<nav class="flex h-14 items-center justify-between text-sm text-slate-700">
			<div class="flex items-center gap-4">
				<a href={resolve('/')} class="rounded-md px-2 py-1 hover:bg-slate-100"> Home </a>
				<a href={resolve('/(protected)/my-events')} class="rounded-md px-2 py-1 hover:bg-slate-100">
					My Events
				</a>
				<a href={resolve('/(protected)/messages')} class="rounded-md px-2 py-1 hover:bg-slate-100">
					Messages
				</a>
				<a href={resolve('/notifications/')} class="rounded-md px-2 py-1 hover:bg-slate-100">
					Notifications
				</a>

				{#if user?.role === 'admin'}
					<div class="relative">
						<button
							type="button"
							class="rounded-md px-2 py-1 hover:bg-slate-100"
							onclick={() => (adminOpen = !adminOpen)}
						>
							Admin
						</button>

						{#if adminOpen}
							<div class="absolute left-0 mt-1 w-56 rounded-md border border-slate-200 bg-white">
								<div class="px-3 py-2 text-xs font-medium text-slate-400 uppercase">
									Administration
								</div>
								<a href={resolve('/admin/verifications')} class="block px-3 py-2 hover:bg-slate-50">
									Verifications
								</a>
								<a href={resolve('/admin/reports')} class="block px-3 py-2 hover:bg-slate-50">
									Reported Events
								</a>
								<a href={resolve('/admin/events')} class="block px-3 py-2 hover:bg-slate-50">
									All Events
								</a>
								<a href={resolve('/admin/analytics')} class="block px-3 py-2 hover:bg-slate-50">
									Analytics
								</a>
							</div>
						{/if}
					</div>
				{/if}
			</div>

			<div class="flex items-center gap-3">
				{#if user}
					<div class="relative">
						<button
							type="button"
							class="rounded-md px-2 py-1 hover:bg-slate-100"
							onclick={() => (accountOpen = !accountOpen)}
						>
							Account
						</button>

						{#if accountOpen}
							<div class="absolute right-0 mt-1 w-60 rounded-md border border-slate-200 bg-white">
								<div class="px-3 py-2 text-xs font-medium text-slate-400 uppercase">Account</div>
								<a href={resolve('/(protected)/profile')} class="block px-3 py-2 hover:bg-slate-50">
									View profile
								</a>
								<a
									href={resolve('/(protected)/profile/edit')}
									class="block px-3 py-2 hover:bg-slate-50"
								>
									Edit profile
								</a>

								<div class="px-3 py-2 text-xs font-medium text-slate-400 uppercase">
									Preferences
								</div>
								<a href={resolve('/donations/history/')} class="block px-3 py-2 hover:bg-slate-50">
									Donations
								</a>
								<a href={resolve('/settings/')} class="block px-3 py-2 hover:bg-slate-50">
									Settings
								</a>
								<a href="/help" class="block px-3 py-2 hover:bg-slate-50"> Help & Support </a>

								<div class="mt-1 border-t border-slate-200">
									<form method="post" action="/logout">
										<button
											type="submit"
											class="w-full px-3 py-2 text-left text-slate-600 hover:bg-slate-50"
										>
											Sign out
										</button>
									</form>
								</div>
							</div>
						{/if}
					</div>
				{:else}
					<a href={resolve('/(public)/signin')} class="rounded-md px-2 py-1 hover:bg-slate-100">
						Sign in
					</a>
				{/if}
			</div>
		</nav>
	</div>
</header>
