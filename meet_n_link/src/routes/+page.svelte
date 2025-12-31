<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu/index.js';
	import { cn } from '$lib/utils.js';
	import { navigationMenuTriggerStyle } from '$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';

	import { resolve } from '$app/paths';
	import { useSearchParams } from 'runed/kit';
	import { eventsSearchSchema, getClosestApprovedDate, type UpComingEvent } from './models.js';
	import StandardNav from './(protected)/StandardNav.svelte';
	import PublicNav from './(protected)/PublicNav.svelte';

	let { data } = $props();
	const user = $derived(data?.user ?? null);
	// console.log(JSON.stringify(data));

	const params = useSearchParams(eventsSearchSchema, { showDefaults: true, updateURL: true });

	const closestDate = $derived(data.closestDate);
</script>

{#if user}
	<StandardNav obj={{ user }} />
{:else}
	<PublicNav />
{/if}

<main class="mt-3 mr-8 ml-8">
	<div class="flex justify-center">
		<a href={resolve('/events/new')}> <Button class="">Propose Event</Button></a>
	</div>

	<div class="mb-8 text-center">
		<h1 class="text-3xl font-semibold text-gray-800">Events</h1>
		<div class="mx-auto mt-2 h-1 w-12 rounded bg-gray-300"></div>
	</div>

	<p>{closestDate}</p>
	<div class="flex justify-center">
		<form action="" class="w-full max-w-4xl space-y-6">
			<div class="mr-24 ml-24 grid grid-cols-1 gap-6 md:grid-cols-2">
				<div>
					<label class="mb-2 block text-sm font-medium text-gray-700"
						>Country * <select
							required
							bind:value={params.sco}
							class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
						>
							<option value="">Select Country</option>
							{#each data.countries as country (country)}
								<option value={country}>{country}</option>
							{/each}
						</select></label
					>
				</div>

				<div>
					<label class="mb-2 block text-sm font-medium text-gray-700"
						>State * <select
							required
							bind:value={params.sst}
							class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
						>
							<option value="">Select state</option>
							{#each data.states as state (state)}
								<option value={state}>{state}</option>
							{/each}
						</select></label
					>
				</div>
			</div>
		</form>
	</div>

	<ul class="divide-y divide-gray-200">
		{#each data.events.filter((l) => l.events?.length) as location (location.id)}
			<li class="py-4">
				<div class="font-medium text-gray-800">{location.city}</div>

				<ul class="mt-2 ml-4 list-disc space-y-1 text-sm text-gray-600">
					{#each location.events as event (event.id)}
						<li>
							<a href={resolve(`/(protected)/events/${event.id}`)}>
								{event.title}
								<span
									class="rounded-full px-2 py-0.5 text-xs font-medium"
									class:bg-green-100={event.status === 'approved'}
									class:text-green-700={event.status === 'approved'}
									class:bg-yellow-100={event.status === 'proposed'}
									class:text-yellow-700={event.status === 'proposed'}
									class:bg-red-100={event.status === 'cancelled'}
									class:text-red-700={event.status === 'cancelled'}>({event.status})</span
								>
							</a>
						</li>
					{/each}
				</ul>
			</li>
		{/each}
	</ul>
</main>
