<script lang="ts">
	import { get_event_details } from '$lib/remote/events.remote';
	import type { PageProps } from './$types';
	let { data, params }: PageProps = $props();

	const id = $derived(params.id);
	const event = $derived(await get_event_details(id));

	const statusClasses = {
		proposed: 'bg-yellow-100 text-yellow-700',
		approved: 'bg-green-100 text-green-700',
		rejected: 'bg-red-100 text-red-700'
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

<div class="mx-auto max-w-4xl space-y-8 rounded-xl bg-white p-8 shadow-lg">
	<!-- Header -->
	<header class="space-y-3">
		<h1 class="text-3xl font-bold text-gray-900">
			{event?.title}
		</h1>
		<p class="text-gray-600">
			{event?.description}
		</p>
	</header>

	<!-- Status & Category -->
	<section class="flex flex-wrap items-center gap-3">
		<span
			class={`rounded-full px-3 py-1 text-sm font-semibold ${
				statusClasses[event?.status] ?? 'bg-gray-100 text-gray-700'
			}`}
		>
			{event?.status}
		</span>

		<span class="rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
			{event?.category?.name}
		</span>
	</section>

	<!-- Location -->
	<section class="grid grid-cols-1 gap-4 sm:grid-cols-2">
		<div>
			<p class="text-sm text-gray-500">Location</p>
			<p class="font-semibold text-gray-900">
				{event?.location?.fullLocation}
			</p>
		</div>

		<div>
			<p class="text-sm text-gray-500">Venue</p>
			<p class="font-semibold text-gray-900">
				{event?.venueDetails}
			</p>
		</div>
	</section>

	<!-- Date & Time -->
	<section class="rounded-lg bg-gray-50 p-4">
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
			<div>
				<p class="text-sm text-gray-500">Date</p>
				<p class="font-semibold">
					{formatDate(event!.proposedDate)} ({event!.dayOfWeek})
				</p>
			</div>

			<div>
				<p class="text-sm text-gray-500">Start</p>
				<p class="font-semibold">
					{event?.startTime}
				</p>
			</div>

			<div>
				<p class="text-sm text-gray-500">End</p>
				<p class="font-semibold">
					{event?.endTime}
				</p>
			</div>
		</div>
	</section>

	<!-- Voting -->
	<section class="space-y-3">
		<h2 class="text-xl font-bold text-gray-900">Voting</h2>

		<div class="flex flex-wrap items-center justify-between gap-4 rounded-lg border p-4">
			<div>
				<p class="text-sm text-gray-500">Votes</p>
				<p class="text-lg font-bold text-gray-900">
					{event?.currentVotes} / {event?.minVotesRequired}
				</p>
			</div>

			<p class="text-sm text-gray-500">
				Deadline: {formatDateTime(event!.votingDeadline)}
			</p>
		</div>
	</section>

	<!-- Funding -->
	<section class="space-y-3">
		<h2 class="text-xl font-bold text-gray-900">Funding</h2>

		<div class="rounded-lg border p-4 text-sm text-gray-700">
			{#if event?.requiresFunding}
				{event?.currencySymbol}{event?.currentFunding} raised of {event?.currencySymbol}{event?.fundingGoal}
			{:else}
				This event does not require funding
			{/if}
		</div>
	</section>

	<!-- Organizer -->
	<section class="space-y-2">
		<h2 class="text-xl font-bold text-gray-900">Organizer</h2>
		<p class="font-semibold text-gray-900">
			{event?.creator?.name}
		</p>
	</section>

	<!-- Footer -->
	<footer class="border-t pt-6 text-sm text-gray-500">
		<p>Created: {formatDateTime(event!.createdAt)}</p>
		<p>Updated: {formatDateTime(event!.updatedAt)}</p>
	</footer>
</div>
