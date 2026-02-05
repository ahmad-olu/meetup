<script lang="ts">
	import { propose_event } from '$lib/remote/events.remote';
	import { debounce } from '$lib/utils/debounce';
	import { useSearchParams } from 'runed/kit';

	import { z } from 'zod';

	const newProposeEventSchema = z.object({
		location: z.string().default('Ikeja, Lagos, Nigeria'),
		category: z.string().default('Programming')
	});
	const params = useSearchParams(newProposeEventSchema, { showDefaults: true, updateURL: true });

	let searchTerm = $state('');
	let locations: Array<{ id: string; fullLocation: string }> = $state([]);
	let selectedLocationId = $state('');
	let selectedLocationName = $state('');
	let showDropdown = $state(false);
	let loading = $state(false);

	const searchLocations = debounce(async (term: string) => {
		if (term.length < 3) {
			locations = [];
			return;
		}

		loading = true;
		try {
			const response = await fetch(`/api/locations/search?q=${encodeURIComponent(term)}`);
			locations = await response.json();
		} catch (error) {
			console.error('Error searching locations:', error);
			locations = [];
		} finally {
			loading = false;
		}
	}, 300);

	$effect(() => {
		searchLocations(searchTerm);
		showDropdown = true;
	});

	function selectLocation(location: (typeof locations)[0]) {
		selectedLocationId = location.id;
		selectedLocationName = location.fullLocation;
		searchTerm = location.fullLocation;
		showDropdown = false;
	}

	function handleFocus() {
		if (searchTerm.length >= 3) {
			showDropdown = true;
		}
	}
</script>

<div class="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-md">
	<h1 class="mb-8 text-3xl font-bold text-gray-900">Propose New Event</h1>
	<form {...propose_event} class="space-y-6">
		<div>
			<label for="title" class="mb-2 block text-sm font-medium text-gray-700">Event Title *</label>
			<input
				{...propose_event.fields.title.as('text')}
				class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
			/>
			{#each propose_event.fields.title.issues() as issue (issue.message)}
				<p>{issue.message}</p>
			{/each}
		</div>

		<div>
			<label for="description" class="mb-2 block text-sm font-medium text-gray-700"
				>Description *</label
			>
			<textarea
				{...propose_event.fields.description.as('text')}
				rows="4"
				class="w-full resize-y rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
			></textarea>
			{#each propose_event.fields.description.issues() as issue (issue.message)}
				<p>{issue.message}</p>
			{/each}
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div class="relative">
				<label for="locationSearch" class="mb-2 block text-sm font-medium text-gray-700">
					Location *
				</label>
				<input
					type="text"
					id="locationSearch"
					bind:value={searchTerm}
					on:focus={handleFocus}
					on:blur={() => setTimeout(() => (showDropdown = false), 200)}
					placeholder="Type at least 3 characters to search..."
					autocomplete="off"
					class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
				/>
				<input type="hidden" name="locationId" value={selectedLocationId} required />

				{#if showDropdown}
					<div
						class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg"
					>
						{#if loading}
							<div class="px-4 py-2 text-sm text-gray-500">Searching...</div>
						{:else if searchTerm.length < 3}
							<div class="px-4 py-2 text-sm text-gray-500">Type at least 3 characters</div>
						{:else if locations.length === 0}
							<div class="px-4 py-2 text-sm text-gray-500">No locations found</div>
						{:else}
							{#each locations as location (location.id)}
								<button
									type="button"
									on:click={() => selectLocation(location)}
									class="w-full border-b px-4 py-2 text-left text-sm last:border-b-0 hover:bg-gray-100"
								>
									{location.fullLocation}
								</button>
							{/each}
						{/if}
					</div>
				{/if}

				{#if selectedLocationName}
					<p class="mt-1 text-xs text-gray-600">Selected: {selectedLocationName}</p>
				{/if}
			</div>

			<div>
				<label for="categoryId" class="mb-2 block text-sm font-medium text-gray-700"
					>Category *</label
				>
				<select
					id="categoryId"
					name="categoryId"
					required
					class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
				>
					<option value="">Select category</option>
					<option value="cat-1">Programming</option>
					<option value="cat-2">Design</option>
					<option value="cat-3">General Coworking</option>
					<option value="cat-4">Startup Founders</option>
				</select>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div>
				<label for="proposedDate" class="mb-2 block text-sm font-medium text-gray-700"
					>Proposed Date *</label
				>
				<input
					type="datetime-local"
					id="proposedDate"
					name="proposedDate"
					required
					class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
				/>
			</div>

			<div>
				<label for="dayOfWeek" class="mb-2 block text-sm font-medium text-gray-700"
					>Day of Week *</label
				>
				<select
					id="dayOfWeek"
					name="dayOfWeek"
					required
					class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
				>
					<option value="">Select day</option>
					<option value="wednesday">Wednesday</option>
					<option value="saturday">Saturday</option>
					<option value="sunday">Sunday</option>
				</select>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div>
				<label for="startTime" class="mb-2 block text-sm font-medium text-gray-700"
					>Start Time *</label
				>
				<input
					type="time"
					id="startTime"
					name="startTime"
					required
					class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
				/>
			</div>

			<div>
				<label for="endTime" class="mb-2 block text-sm font-medium text-gray-700">End Time *</label>
				<input
					type="time"
					id="endTime"
					name="endTime"
					required
					class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
				/>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div>
				<label for="minVotesRequired" class="mb-2 block text-sm font-medium text-gray-700"
					>Minimum Votes Required *</label
				>
				<input
					type="number"
					id="minVotesRequired"
					name="minVotesRequired"
					min="5"
					value="5"
					required
					class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
				/>
				<p class="mt-1 text-xs text-gray-500">Minimum 5 votes</p>
			</div>

			<div>
				<label for="votingDeadline" class="mb-2 block text-sm font-medium text-gray-700"
					>Voting Deadline *</label
				>
				<input
					type="datetime-local"
					id="votingDeadline"
					name="votingDeadline"
					required
					class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
				/>
			</div>
		</div>

		<div class="flex items-center">
			<input
				type="checkbox"
				id="requiresFunding"
				name="requiresFunding"
				value="true"
				class="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
			/>
			<label for="requiresFunding" class="ml-2 text-sm font-medium text-gray-700"
				>Requires Funding</label
			>
		</div>

		<div>
			<label for="fundingGoal" class="mb-2 block text-sm font-medium text-gray-700"
				>Funding Goal</label
			>
			<input
				type="text"
				id="fundingGoal"
				name="fundingGoal"
				placeholder="0.00"
				value="0.00"
				pattern="^\d{(1, 8)}(\.\d{(1, 2)})?$"
				class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
			/>
			<p class="mt-1 text-xs text-gray-500">
				Enter amount in format: 1000.00 (max 8 digits, 2 decimals)
			</p>
		</div>

		<div>
			<label for="venueDetails" class="mb-2 block text-sm font-medium text-gray-700"
				>Venue Details</label
			>
			<textarea
				id="venueDetails"
				name="venueDetails"
				maxlength="2000"
				placeholder="Additional venue information..."
				rows="3"
				class="w-full resize-y rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
			></textarea>
			<p class="mt-1 text-xs text-gray-500">Maximum 2000 characters</p>
		</div>

		<button
			type="submit"
			class="w-full rounded-md bg-green-600 px-8 py-3 font-medium text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none md:w-auto"
		>
			Propose Event
		</button>
	</form>
</div>
