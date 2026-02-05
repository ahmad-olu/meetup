<script lang="ts">
	import '../app.css';
	import { resolve } from '$app/paths';
	import { useSearchParams } from 'runed/kit';
	import StandardNav from './(protected)/StandardNav.svelte';
	import PublicNav from './(protected)/PublicNav.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { eventsSearchSchema } from './models.js';

	let { data } = $props();
	const user = $derived(data?.user ?? null);
	const params = useSearchParams(eventsSearchSchema, { showDefaults: true, updateURL: true });
	const closestDate = $derived(data.closestDate);
</script>

{#if user}
	<StandardNav obj={{ user }} />
{:else}
	<PublicNav />
{/if}

<main class="mx-auto max-w-6xl px-6 py-6 text-slate-800">
	<header class="mb-6 flex items-center justify-between">
		<div class="space-y-1">
			<h1 class="text-xl font-semibold">Events</h1>
			{#if closestDate}
				<p class="text-sm text-slate-500">Next approved date: {closestDate}</p>
			{/if}
		</div>
		<a href={resolve('/events/new')}>
			<Button class="bg-slate-900 text-white hover:bg-slate-800">Propose event</Button>
		</a>
	</header>

	<section class="mb-8 rounded-md border border-slate-200 bg-white p-4">
		<form class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<div class="space-y-1">
				<label for="country" class="text-sm font-medium text-slate-700">Country</label>
				<select
					id="country"
					required
					bind:value={params.sco}
					class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
				>
					<option value="">Select country</option>
					{#each data.countries as country (country)}
						<option value={country}>{country}</option>
					{/each}
				</select>
			</div>

			<div class="space-y-1">
				<label for="state" class="text-sm font-medium text-slate-700">State</label>
				<select
					id="state"
					required
					bind:value={params.sst}
					class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
				>
					<option value="">Select state</option>
					{#each data.states as state (state)}
						<option value={state}>{state}</option>
					{/each}
				</select>
			</div>
		</form>
	</section>

	<section class="rounded-md border border-slate-200 bg-white">
		<ul class="divide-y divide-slate-200">
			{#each data.events.filter((l) => l.events?.length) as location (location.id)}
				<li class="p-4">
					<div class="mb-2 text-sm font-medium text-slate-700">{location.city}</div>
					<ul class="space-y-1 text-sm">
						{#each location.events as event (event.id)}
							<li class="flex items-center justify-between">
								<a
									href={resolve(`/(protected)/events/${event.id}`)}
									class="text-blue-600 hover:underline"
								>
									{event.title}
								</a>
								<span
									class="rounded-md border px-2 py-0.5 text-xs font-medium"
									class:border-slate-300={event.status === 'proposed'}
									class:text-slate-600={event.status === 'proposed'}
									class:border-blue-200={event.status === 'approved'}
									class:text-blue-700={event.status === 'approved'}
									class:border-slate-400={event.status === 'cancelled'}
									class:text-slate-500={event.status === 'cancelled'}
								>
									{event.status}
								</span>
							</li>
						{/each}
					</ul>
				</li>
			{/each}
		</ul>
	</section>
</main>
