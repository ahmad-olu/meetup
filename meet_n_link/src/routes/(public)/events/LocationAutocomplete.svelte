<script lang="ts">
	import { onMount } from 'svelte';

	interface Location {
		id: string;
		city: string | null;
		stateProvince: string | null;
		country: string;
		fullLocation: string | null;
	}

	interface Props {
		value?: string;
		placeholder?: string;
		onselect?: (location: Location) => void;
	}

	let { value = $bindable(''), placeholder = 'Search locations...', onselect }: Props = $props();

	let searchQuery = $state('');
	let results = $state<Location[]>([]);
	let isLoading = $state(false);
	let showDropdown = $state(false);
	let selectedIndex = $state(-1);
	let debounceTimer: ReturnType<typeof setTimeout>;
	let inputElement: HTMLInputElement;

	async function searchLocations(query: string) {
		if (query.length < 2) {
			results = [];
			showDropdown = false;
			return;
		}

		isLoading = true;
		try {
			const response = await fetch(`/api/locations/search?q=${encodeURIComponent(query)}&limit=10`);
			if (response.ok) {
				results = await response.json();
				showDropdown = results.length > 0;
			}
		} catch (error) {
			console.error('Failed to search locations:', error);
			results = [];
		} finally {
			isLoading = false;
		}
	}

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		searchQuery = target.value;
		selectedIndex = -1;

		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			searchLocations(searchQuery);
		}, 300);
	}

	function selectLocation(location: Location) {
		value = location.id;
		searchQuery = formatLocationDisplay(location);
		showDropdown = false;
		selectedIndex = -1;
		onselect?.(location);
	}

	function formatLocationDisplay(location: Location): string {
		if (location.fullLocation) return location.fullLocation;
		const parts = [location.city, location.stateProvince, location.country].filter(Boolean);
		return parts.join(', ');
	}

	function handleKeydown(event: KeyboardEvent) {
		if (!showDropdown) return;

		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				selectedIndex = Math.min(selectedIndex + 1, results.length - 1);
				break;
			case 'ArrowUp':
				event.preventDefault();
				selectedIndex = Math.max(selectedIndex - 1, -1);
				break;
			case 'Enter':
				event.preventDefault();
				if (selectedIndex >= 0 && selectedIndex < results.length) {
					selectLocation(results[selectedIndex]);
				}
				break;
			case 'Escape':
				showDropdown = false;
				selectedIndex = -1;
				break;
		}
	}

	function handleBlur() {
		// Delay to allow click on dropdown items
		setTimeout(() => {
			showDropdown = false;
			selectedIndex = -1;
		}, 200);
	}

	onMount(() => {
		return () => clearTimeout(debounceTimer);
	});
</script>

<div class="location-autocomplete">
	<div class="input-wrapper">
		<input
			type="text"
			bind:this={inputElement}
			value={searchQuery}
			oninput={handleInput}
			onkeydown={handleKeydown}
			onblur={handleBlur}
			onfocus={() => {
				if (results.length > 0) showDropdown = true;
			}}
			{placeholder}
			autocomplete="off"
			class="location-input"
		/>

		{#if isLoading}
			<div class="loading-indicator">
				<div class="spinner"></div>
			</div>
		{/if}

		{#if searchQuery && !isLoading}
			<button
				type="button"
				class="clear-button"
				onclick={() => {
					searchQuery = '';
					value = '';
					results = [];
					showDropdown = false;
					inputElement?.focus();
				}}
			>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
					<path d="M18 6L6 18M6 6l12 12" stroke-width="2" stroke-linecap="round" />
				</svg>
			</button>
		{/if}
	</div>

	{#if showDropdown && results.length > 0}
		<div class="dropdown">
			<ul class="results-list">
				{#each results as location, index (location.id)}
					<li
						class="result-item"
						class:selected={index === selectedIndex}
						onclick={() => selectLocation(location)}
					>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke-width="2" />
							<circle cx="12" cy="10" r="3" stroke-width="2" />
						</svg>
						<div class="result-text">
							<div class="location-name">{formatLocationDisplay(location)}</div>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	{#if searchQuery.length > 0 && searchQuery.length < 2 && !isLoading}
		<div class="hint">Type at least 2 characters to search</div>
	{/if}

	{#if !isLoading && searchQuery.length >= 2 && results.length === 0}
		<div class="no-results">No locations found</div>
	{/if}
</div>

<style>
	.location-autocomplete {
		position: relative;
		width: 100%;
	}

	.input-wrapper {
		position: relative;
	}

	.location-input {
		width: 100%;
		padding: 0.75rem;
		padding-right: 2.5rem;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		font-size: 0.875rem;
		transition: all 0.15s;
	}

	.location-input:focus {
		outline: none;
		border-color: #2563eb;
		box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
	}

	.loading-indicator {
		position: absolute;
		right: 0.75rem;
		top: 50%;
		transform: translateY(-50%);
	}

	.spinner {
		width: 16px;
		height: 16px;
		border: 2px solid #e5e7eb;
		border-top-color: #2563eb;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.clear-button {
		position: absolute;
		right: 0.75rem;
		top: 50%;
		transform: translateY(-50%);
		background: none;
		border: none;
		padding: 0.25rem;
		cursor: pointer;
		color: #6b7280;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		transition: all 0.15s;
	}

	.clear-button:hover {
		background: #f3f4f6;
		color: #374151;
	}

	.dropdown {
		position: absolute;
		top: calc(100% + 0.25rem);
		left: 0;
		right: 0;
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 6px;
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
		max-height: 300px;
		overflow-y: auto;
		z-index: 50;
	}

	.results-list {
		list-style: none;
		margin: 0;
		padding: 0.25rem;
	}

	.result-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		cursor: pointer;
		border-radius: 4px;
		transition: background 0.15s;
	}

	.result-item:hover,
	.result-item.selected {
		background: #f3f4f6;
	}

	.result-item svg {
		flex-shrink: 0;
		color: #6b7280;
	}

	.result-text {
		flex: 1;
		min-width: 0;
	}

	.location-name {
		font-size: 0.875rem;
		color: #111827;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.hint,
	.no-results {
		margin-top: 0.5rem;
		font-size: 0.8125rem;
		color: #6b7280;
	}

	.no-results {
		padding: 0.75rem;
		text-align: center;
		background: #f9fafb;
		border-radius: 6px;
		margin-top: 0.25rem;
	}
</style>
