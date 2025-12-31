<script lang="ts">
	import { propose_event } from '$lib/remote/events.remote';
	import { useSearchParams } from 'runed/kit';
	import { newProposeEventSchema } from './models.js';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	const params = useSearchParams(newProposeEventSchema, { showDefaults: true, updateURL: true });

	let { data } = $props();
	// console.log(JSON.stringify(data.locationId));

	const locationId = $derived(data.locationId ?? 'nil');
	const categoriesId = $derived(data.categoriesId ?? 'nil');
	const selectedCurrency = $derived(
		data.selectedCurrency ?? { currency: 'USD', currency_symbol: '₦' }
	);

	function validateProposedDate(dateString: string) {
		const day = new Date(dateString).getDay();
		// allow only Wednesday (3) & Saturday (6)
		return day === 3 || day === 6; //|| day === 0
	}

	function onChangeProposedDate(e: Event) {
		// e.preventDefault();
		const input = e.target as HTMLInputElement;

		if (!validateProposedDate(input.value)) {
			input.value = '';
		}
	}
</script>

<div class="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-md">
	<h1 class="mb-8 text-3xl font-bold text-gray-900">Propose New Event</h1>
	<form
		{...propose_event.enhance(async ({ form, data, submit }) => {
			try {
				await submit();
				form.reset();
				//TODO: display sucess dialog
				//	showToast('Successfully published!');
			} catch (error) {
				//	showToast('Oh no! Something went wrong');
			}
		})}
		class="space-y-6"
	>
		<input {...propose_event.fields.locationId.as('hidden', locationId)} />
		<input {...propose_event.fields.categoryId.as('hidden', categoriesId)} />
		<input {...propose_event.fields.currency.as('hidden', selectedCurrency.currency)} />
		<input
			{...propose_event.fields.currencySymbol.as('hidden', selectedCurrency.currency_symbol)}
		/>

		<div>
			<label class="mb-2 block text-sm font-medium text-gray-700"
				>Event Title * <input
					{...propose_event.fields.title.as('text')}
					class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
				/>
				{#each propose_event.fields.title.issues() as issue (issue.message)}
					<p>{issue.message}</p>
				{/each}</label
			>
		</div>

		<div>
			<label class="mb-2 block text-sm font-medium text-gray-700"
				>Description * <textarea
					{...propose_event.fields.description.as('text')}
					rows="4"
					class="w-full resize-y rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
				></textarea>
				{#each propose_event.fields.description.issues() as issue (issue.message)}
					<p>{issue.message}</p>
				{/each}</label
			>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
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
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div>
				<label class="mb-2 block text-sm font-medium text-gray-700"
					>City * <select
						required
						bind:value={params.sci}
						class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
					>
						<option value="">Select City</option>
						{#each data.cities as city (city)}
							<option value={city}>{city}</option>
						{/each}
					</select></label
				>
			</div>

			<div>
				<label class="mb-2 block text-sm font-medium text-gray-700"
					>Category * <select
						bind:value={params.scat}
						required
						class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
					>
						<option value="">Select category</option>
						{#each data.categories as category (category)}
							<option value={category}>{category}</option>
						{/each}
					</select></label
				>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div>
				<label class="mb-2 block text-sm font-medium text-gray-700"
					>Proposed Date * <input
						{...propose_event.fields.proposedDate.as('datetime-local')}
						required
						onchange={onChangeProposedDate}
						class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
					/>
					<p class="mt-1 text-xs text-gray-500">Only Wednesdays & Saturdays are available</p>

					{#each propose_event.fields.proposedDate.issues() as issue (issue.message)}
						<p>{issue.message}</p>
					{/each}
				</label>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div>
				<label class="mb-2 block text-sm font-medium text-gray-700"
					>Start Time * <input
						required
						{...propose_event.fields.startTime.as('time')}
						class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
					/></label
				>
			</div>

			<div>
				<label class="mb-2 block text-sm font-medium text-gray-700"
					>End Time * <input
						{...propose_event.fields.endTime.as('time')}
						required
						class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
					/></label
				>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div>
				<label class="mb-2 block text-sm font-medium text-gray-700"
					>Minimum Votes Required * <input
						{...propose_event.fields.minVotesRequired.as('number')}
						min="5"
						value="5"
						required
						class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
					/>
					<p class="mt-1 text-xs text-gray-500">Minimum 5 votes</p>
					{#each propose_event.fields.minVotesRequired.issues() as issue (issue.message)}
						<p>{issue.message}</p>
					{/each}
				</label>
			</div>

			<div>
				<label class="mb-2 block text-sm font-medium text-gray-700"
					>Voting Deadline * <input
						{...propose_event.fields.votingDeadline.as('datetime-local')}
						required
						class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
					/></label
				>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-[2fr_1fr]">
			<div>
				<label class="mb-2 block text-sm font-medium text-gray-700"
					>Funding Goal <input
						step="0.01"
						min="0"
						max="99999999.99"
						placeholder="0.00"
						{...propose_event.fields.fundingGoal.as('number')}
						class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
					/>
					<p class="mt-1 text-xs text-gray-500">
						Enter amount in format: 1000.00 (max 8 digits, 2 decimals)
					</p>
					<p class="mt-1 text-xs text-gray-500">
						Provide a funding goal if this event requires participant contributions.
					</p>
					{#each propose_event.fields.fundingGoal.issues() as issue (issue.message)}
						<p>{issue.message}</p>
					{/each}
				</label>
			</div>

			<div>
				<label class="mb-2 block text-sm font-medium text-gray-700"
					>Currency <select
						required
						bind:value={params.scur}
						class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
					>
						<option value="">Select Currency</option>
						{#each data.currencies as c (c.id)}
							<option value={c.currency}>{c.emoji} :{c.currency} ({c.currency_symbol})</option>
						{/each}
					</select></label
				>
			</div>
		</div>

		<div>
			<label class="mb-2 block text-sm font-medium text-gray-700"
				>Venue Details <textarea
					{...propose_event.fields.venueDetails.as('text')}
					maxlength="2000"
					placeholder="Additional venue information..."
					rows="3"
					class="w-full resize-y rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
				></textarea>
				<p class="mt-1 text-xs text-gray-500">Maximum 2000 characters</p>
				{#each propose_event.fields.venueDetails.issues() as issue (issue.message)}
					<p>{issue.message}</p>
				{/each}
			</label>
		</div>

		<button
			type="submit"
			class="w-full rounded-md bg-green-600 px-8 py-3 font-medium text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none md:w-auto"
		>
			Propose Event
		</button>
	</form>
</div>
