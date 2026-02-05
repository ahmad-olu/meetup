<script lang="ts">
	import { get_event_details } from '$lib/remote/events.remote';
	import type { PageProps } from './$types';

	let { params }: PageProps = $props();

	const id = $derived(params.id);
	const event = $derived(await get_event_details(id));

	const statusStyles: Record<string, string> = {
		proposed: 'border-slate-300 text-slate-600',
		approved: 'border-blue-200 text-blue-700',
		rejected: 'border-slate-400 text-slate-500'
	};

	function formatDate(date: string | Date) {
		return new Date(date).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function formatDateTime(date: string | Date) {
		return new Date(date).toLocaleString();
	}
</script>

<main class="mx-auto max-w-4xl px-6 py-6 text-slate-800">
	<section class="space-y-6 rounded-md border border-slate-200 bg-white p-6">
		<header class="space-y-2">
			<h1 class="text-xl font-semibold">{event?.title}</h1>
			<p class="text-sm text-slate-600">{event?.description}</p>
		</header>

		<section class="flex flex-wrap items-center gap-2 text-sm">
			<span
				class={`rounded-md border px-2 py-0.5 ${
					statusStyles[event?.status] ?? 'border-slate-300 text-slate-600'
				}`}
			>
				{event?.status}
			</span>
			<span class="rounded-md border border-slate-300 px-2 py-0.5 text-slate-600">
				{event?.category?.name}
			</span>
		</section>

		<section class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
			<div>
				<p class="text-slate-500">Location</p>
				<p class="font-medium">{event?.location?.fullLocation}</p>
			</div>
			<div>
				<p class="text-slate-500">Venue</p>
				<p class="font-medium break-words">{event?.venueDetails}</p>
			</div>
		</section>

		<section class="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm">
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
				<div>
					<p class="text-slate-500">Date</p>
					<p class="font-medium">
						{formatDate(event!.proposedDate)} ({event!.dayOfWeek})
					</p>
				</div>
				<div>
					<p class="text-slate-500">Start</p>
					<p class="font-medium">{event?.startTime}</p>
				</div>
				<div>
					<p class="text-slate-500">End</p>
					<p class="font-medium">{event?.endTime}</p>
				</div>
			</div>
		</section>

		<section class="space-y-2">
			<h2 class="text-sm font-medium text-slate-700">Voting</h2>
			<div class="flex items-center justify-between rounded-md border border-slate-200 p-4 text-sm">
				<div>
					<p class="text-slate-500">Votes</p>
					<p class="font-medium">
						{event?.currentVotes} / {event?.minVotesRequired}
					</p>
				</div>
				<p class="text-slate-500">
					Deadline: {formatDateTime(event!.votingDeadline)}
				</p>
			</div>
		</section>

		<section class="space-y-2">
			<h2 class="text-sm font-medium text-slate-700">Funding</h2>
			<div class="rounded-md border border-slate-200 p-4 text-sm text-slate-700">
				{#if event?.requiresFunding}
					{event?.currencySymbol}{event?.currentFunding} raised of
					{event?.currencySymbol}{event?.fundingGoal}
				{:else}
					This event does not require funding
				{/if}
			</div>
		</section>

		<section class="space-y-1 text-sm">
			<h2 class="font-medium text-slate-700">Organizer</h2>
			<p class="font-medium">{event?.creator?.name}</p>
		</section>

		<footer class="border-t border-slate-200 pt-4 text-xs text-slate-500">
			<p>Created: {formatDateTime(event!.createdAt)}</p>
			<p>Updated: {formatDateTime(event!.updatedAt)}</p>
		</footer>
	</section>
</main>
