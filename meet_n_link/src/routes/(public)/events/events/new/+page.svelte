<script lang="ts">
	import { propose_event } from '$lib/remote/events.remote';
	import { useSearchParams } from 'runed/kit';
	import { newProposeEventSchema } from './models.js';

	const params = useSearchParams(newProposeEventSchema, { showDefaults: true, updateURL: true });

	let { data } = $props();

	const locationId = $derived(data.locationId ?? 'nil');
	const categoriesId = $derived(data.categoriesId ?? 'nil');
	const selectedCurrency = $derived(
		data.selectedCurrency ?? { currency: 'USD', currency_symbol: '₦' }
	);

	function validateProposedDate(dateString: string) {
		const day = new Date(dateString).getDay();
		return day === 3 || day === 6;
	}

	function onChangeProposedDate(e: Event) {
		const input = e.target as HTMLInputElement;
		if (!validateProposedDate(input.value)) input.value = '';
	}
</script>

<main class="mx-auto max-w-3xl px-6 py-6 text-slate-800">
	<section class="rounded-md border border-slate-200 bg-white p-6">
		<header class="mb-6 space-y-1">
			<h1 class="text-xl font-semibold">Propose event</h1>
			<p class="text-sm text-slate-500">All fields marked required must be completed</p>
		</header>

		<form
			{...propose_event.enhance(async ({ form, submit }) => {
				await submit();
				form.reset();
			})}
			class="space-y-6"
		>
			<input {...propose_event.fields.locationId.as('hidden', locationId)} />
			<input {...propose_event.fields.categoryId.as('hidden', categoriesId)} />
			<input {...propose_event.fields.currency.as('hidden', selectedCurrency.currency)} />
			<input
				{...propose_event.fields.currencySymbol.as('hidden', selectedCurrency.currency_symbol)}
			/>

			<section class="space-y-4">
				<div class="space-y-1">
					<label class="text-sm font-medium">Event title</label>
					<input
						{...propose_event.fields.title.as('text')}
						class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					/>
				</div>

				<div class="space-y-1">
					<label class="text-sm font-medium">Description</label>
					<textarea
						{...propose_event.fields.description.as('text')}
						rows="4"
						class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					/>
				</div>
			</section>

			<section class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div class="space-y-1">
					<label class="text-sm font-medium">Country</label>
					<select
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
					<label class="text-sm font-medium">State</label>
					<select
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

				<div class="space-y-1">
					<label class="text-sm font-medium">City</label>
					<select
						required
						bind:value={params.sci}
						class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					>
						<option value="">Select city</option>
						{#each data.cities as city (city)}
							<option value={city}>{city}</option>
						{/each}
					</select>
				</div>

				<div class="space-y-1">
					<label class="text-sm font-medium">Category</label>
					<select
						required
						bind:value={params.scat}
						class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					>
						<option value="">Select category</option>
						{#each data.categories as category (category)}
							<option value={category}>{category}</option>
						{/each}
					</select>
				</div>
			</section>

			<section class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div class="space-y-1">
					<label class="text-sm font-medium">Proposed date</label>
					<input
						{...propose_event.fields.proposedDate.as('datetime-local')}
						required
						onchange={onChangeProposedDate}
						class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					/>
					<p class="text-xs text-slate-500">Wednesdays and Saturdays only</p>
				</div>

				<div class="space-y-1">
					<label class="text-sm font-medium">Voting deadline</label>
					<input
						{...propose_event.fields.votingDeadline.as('datetime-local')}
						required
						class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					/>
				</div>
			</section>

			<section class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div class="space-y-1">
					<label class="text-sm font-medium">Start time</label>
					<input
						{...propose_event.fields.startTime.as('time')}
						required
						class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					/>
				</div>

				<div class="space-y-1">
					<label class="text-sm font-medium">End time</label>
					<input
						{...propose_event.fields.endTime.as('time')}
						required
						class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					/>
				</div>
			</section>

			<section class="grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr]">
				<div class="space-y-1">
					<label class="text-sm font-medium">Funding goal</label>
					<input
						{...propose_event.fields.fundingGoal.as('number')}
						step="0.01"
						min="0"
						class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					/>
					<p class="text-xs text-slate-500">Optional</p>
				</div>

				<div class="space-y-1">
					<label class="text-sm font-medium">Currency</label>
					<select
						required
						bind:value={params.scur}
						class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					>
						<option value="">Select currency</option>
						{#each data.currencies as c (c.id)}
							<option value={c.currency}>
								{c.currency} ({c.currency_symbol})
							</option>
						{/each}
					</select>
				</div>
			</section>

			<div class="space-y-1">
				<label class="text-sm font-medium">Venue details</label>
				<textarea
					{...propose_event.fields.venueDetails.as('text')}
					rows="3"
					class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
				/>
			</div>

			<footer class="flex justify-end border-t border-slate-200 pt-4">
				<button
					type="submit"
					class="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus:ring-1 focus:ring-blue-500 focus:outline-none"
				>
					Submit proposal
				</button>
			</footer>
		</form>
	</section>
</main>
