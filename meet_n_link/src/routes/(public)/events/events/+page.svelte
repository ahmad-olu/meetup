<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import { SvelteURLSearchParams } from 'svelte/reactivity';

	let { data } = $props();

	function updateFilters(key: string, value: string) {
		const params = new SvelteURLSearchParams($page.url.searchParams);
		if (value) {
			params.set(key, value);
		} else {
			params.delete(key);
		}
		params.set('page', '1');
		goto(`?${params.toString()}`);
	}

	function clearFilters() {
		goto('/events');
	}

	function getStatusBadge(status: string) {
		const badges = {
			proposed: { class: 'badge-warning', label: 'Proposed' },
			approved: { class: 'badge-success', label: 'Approved' },
			cancelled: { class: 'badge-danger', label: 'Cancelled' },
			completed: { class: 'badge-secondary', label: 'Completed' }
		};
		return badges[status] || { class: '', label: status };
	}

	function formatCurrency(amount: string, symbol: string) {
		return `${symbol}${parseFloat(amount).toLocaleString()}`;
	}

	function calculateFundingProgress(current: string, goal: string) {
		const currentNum = parseFloat(current);
		const goalNum = parseFloat(goal);
		return goalNum > 0 ? Math.min((currentNum / goalNum) * 100, 100) : 0;
	}
</script>

<div class="events-page">
	<header class="page-header">
		<div class="header-content">
			<h1>Events</h1>
			<a href="/events/new" class="btn btn-primary">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
					<path d="M12 5v14M5 12h14" stroke-width="2" stroke-linecap="round" />
				</svg>
				Create Event
			</a>
		</div>
	</header>

	<div class="page-content">
		<aside class="filters-panel">
			<div class="panel-header">
				<h3>Filters</h3>
				{#if data.filters.status || data.filters.locationId || data.filters.categoryId || data.filters.requiresFunding !== undefined}
					<button class="btn-link" onclick={clearFilters}>Clear all</button>
				{/if}
			</div>

			<div class="filter-group">
				<label for="status">Status</label>
				<select
					id="status"
					value={data.filters.status || ''}
					onchange={(e) => updateFilters('status', e.currentTarget.value)}
				>
					<option value="">All Statuses</option>
					<option value="proposed">Proposed</option>
					<option value="approved">Approved</option>
					<option value="cancelled">Cancelled</option>
					<option value="completed">Completed</option>
				</select>
			</div>

			<div class="filter-group">
				<label for="category">Category</label>
				<select
					id="category"
					value={data.filters.categoryId || ''}
					onchange={(e) => updateFilters('category', e.currentTarget.value)}
				>
					<option value="">All Categories</option>
					{#each data.categories as category (category.id)}
						<option value={category.id}>{category.name}</option>
					{/each}
				</select>
			</div>

			<div class="filter-group">
				<label for="location">Location</label>
				<select
					id="location"
					value={data.filters.locationId || ''}
					onchange={(e) => updateFilters('location', e.currentTarget.value)}
				>
					<option value="">All Locations</option>
					{#each data.locations as location (location.id)}
						<option value={location.id}>{location.fullLocation || location.city}</option>
					{/each}
				</select>
			</div>

			<div class="filter-group">
				<label for="funding">Funding Status</label>
				<select
					id="funding"
					value={data.filters.requiresFunding === true
						? 'true'
						: data.filters.requiresFunding === false
							? 'false'
							: ''}
					onchange={(e) => updateFilters('funding', e.currentTarget.value)}
				>
					<option value="">All Events</option>
					<option value="true">Requires Funding</option>
					<option value="false">No Funding Needed</option>
				</select>
			</div>
		</aside>

		<main class="events-content">
			{#if data.events.length === 0}
				<div class="empty-state">
					<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke-width="2" />
						<line x1="16" y1="2" x2="16" y2="6" stroke-width="2" stroke-linecap="round" />
						<line x1="8" y1="2" x2="8" y2="6" stroke-width="2" stroke-linecap="round" />
						<line x1="3" y1="10" x2="21" y2="10" stroke-width="2" />
					</svg>
					<h3>No events found</h3>
					<p>Try adjusting your filters or create a new event</p>
				</div>
			{:else}
				<div class="events-grid">
					{#each data.events as { event, location, category } (event.id)}
						<article class="event-card">
							<div class="card-header">
								<div class="card-meta">
									<span class="badge {getStatusBadge(event.status).class}">
										{getStatusBadge(event.status).label}
									</span>
									{#if category}
										<span class="category">{category.name}</span>
									{/if}
								</div>
								<time class="event-date">
									{new Date(event.proposedDate).toLocaleDateString('en-US', {
										month: 'short',
										day: 'numeric',
										year: 'numeric'
									})}
								</time>
							</div>

							<h3 class="card-title">
								<a href="/events/{event.id}">{event.title}</a>
							</h3>

							<p class="card-description">{event.description.slice(0, 150)}...</p>

							<div class="card-details">
								{#if location}
									<div class="detail-item">
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
										>
											<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke-width="2" />
											<circle cx="12" cy="10" r="3" stroke-width="2" />
										</svg>
										<span>{location.city || location.fullLocation}</span>
									</div>
								{/if}

								<div class="detail-item">
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
										<circle cx="12" cy="12" r="10" stroke-width="2" />
										<path d="M12 6v6l4 2" stroke-width="2" stroke-linecap="round" />
									</svg>
									<span>{event.startTime} - {event.endTime}</span>
								</div>
							</div>

							<div class="card-stats">
								<div class="stat">
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
										<path
											d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
											stroke-width="2"
										/>
										<polyline points="14 2 14 8 20 8" stroke-width="2" />
										<line x1="9" y1="15" x2="15" y2="15" stroke-width="2" />
									</svg>
									<span>{event.currentVotes} / {event.minVotesRequired} votes</span>
								</div>

								{#if event.requiresFunding}
									<div class="stat">
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
										>
											<line
												x1="12"
												y1="1"
												x2="12"
												y2="23"
												stroke-width="2"
												stroke-linecap="round"
											/>
											<path
												d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
												stroke-width="2"
												stroke-linecap="round"
											/>
										</svg>
										<span>
											{formatCurrency(event.currentFunding, event.currencySymbol)} /
											{formatCurrency(event.fundingGoal, event.currencySymbol)}
										</span>
									</div>
								{/if}
							</div>

							{#if event.requiresFunding}
								<div class="funding-progress">
									<div class="progress-bar">
										<div
											class="progress-fill"
											style="width: {calculateFundingProgress(
												event.currentFunding,
												event.fundingGoal
											)}%"
										></div>
									</div>
									<span class="progress-label">
										{calculateFundingProgress(event.currentFunding, event.fundingGoal).toFixed(0)}%
										funded
									</span>
								</div>
							{/if}
						</article>
					{/each}
				</div>

				{#if data.pagination.totalPages > 1}
					<div class="pagination">
						<button
							class="btn btn-secondary"
							disabled={data.pagination.page === 1}
							onclick={() => {
								const params = new SvelteURLSearchParams($page.url.searchParams);
								params.set('page', String(data.pagination.page - 1));
								goto(`?${params.toString()}`);
							}}
						>
							Previous
						</button>

						<span class="page-info">
							Page {data.pagination.page} of {data.pagination.totalPages}
						</span>

						<button
							class="btn btn-secondary"
							disabled={data.pagination.page >= data.pagination.totalPages}
							onclick={() => {
								const params = new SvelteURLSearchParams($page.url.searchParams);
								params.set('page', String(data.pagination.page + 1));
								goto(`?${params.toString()}`);
							}}
						>
							Next
						</button>
					</div>
				{/if}
			{/if}
		</main>
	</div>
</div>

<style>
	.events-page {
		min-height: 100vh;
		background: #f8f9fa;
	}

	.page-header {
		background: white;
		border-bottom: 1px solid #e5e7eb;
		padding: 1.5rem 2rem;
	}

	.header-content {
		max-width: 1400px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.page-header h1 {
		font-size: 1.5rem;
		font-weight: 600;
		margin: 0;
	}

	.btn {
		padding: 0.625rem 1rem;
		border-radius: 6px;
		font-size: 0.875rem;
		font-weight: 500;
		border: none;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		transition: all 0.15s;
		text-decoration: none;
	}

	.btn-primary {
		background: #2563eb;
		color: white;
	}

	.btn-primary:hover {
		background: #1d4ed8;
	}

	.btn-secondary {
		background: #e5e7eb;
		color: #374151;
	}

	.btn-secondary:hover:not(:disabled) {
		background: #d1d5db;
	}

	.btn-secondary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-link {
		background: none;
		border: none;
		color: #2563eb;
		cursor: pointer;
		font-size: 0.875rem;
		text-decoration: underline;
	}

	.page-content {
		max-width: 1400px;
		margin: 0 auto;
		padding: 2rem;
		display: grid;
		grid-template-columns: 280px 1fr;
		gap: 2rem;
	}

	.filters-panel {
		background: white;
		border-radius: 8px;
		border: 1px solid #e5e7eb;
		padding: 1.5rem;
		height: fit-content;
		position: sticky;
		top: 2rem;
	}

	.panel-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1.5rem;
	}

	.panel-header h3 {
		font-size: 1rem;
		font-weight: 600;
		margin: 0;
	}

	.filter-group {
		margin-bottom: 1.25rem;
	}

	.filter-group:last-child {
		margin-bottom: 0;
	}

	.filter-group label {
		display: block;
		font-size: 0.875rem;
		font-weight: 500;
		margin-bottom: 0.5rem;
		color: #374151;
	}

	.filter-group select {
		width: 100%;
		padding: 0.625rem;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		font-size: 0.875rem;
		background: white;
		cursor: pointer;
	}

	.filter-group select:focus {
		outline: none;
		border-color: #2563eb;
		box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
	}

	.events-content {
		min-height: 400px;
	}

	.empty-state {
		text-align: center;
		padding: 4rem 2rem;
		color: #6b7280;
	}

	.empty-state svg {
		margin: 0 auto 1.5rem;
		color: #d1d5db;
	}

	.empty-state h3 {
		font-size: 1.25rem;
		margin-bottom: 0.5rem;
		color: #374151;
	}

	.events-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
		gap: 1.5rem;
	}

	.event-card {
		background: white;
		border-radius: 8px;
		border: 1px solid #e5e7eb;
		padding: 1.5rem;
		transition: box-shadow 0.2s;
	}

	.event-card:hover {
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}

	.card-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: 1rem;
	}

	.card-meta {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.badge {
		padding: 0.25rem 0.625rem;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 500;
	}

	.badge-success {
		background: #d1fae5;
		color: #065f46;
	}

	.badge-warning {
		background: #fef3c7;
		color: #92400e;
	}

	.badge-danger {
		background: #fee2e2;
		color: #991b1b;
	}

	.badge-secondary {
		background: #e5e7eb;
		color: #374151;
	}

	.category {
		padding: 0.25rem 0.625rem;
		background: #eff6ff;
		color: #1e40af;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 500;
	}

	.event-date {
		font-size: 0.875rem;
		color: #6b7280;
	}

	.card-title {
		margin: 0 0 0.75rem;
		font-size: 1.125rem;
		font-weight: 600;
	}

	.card-title a {
		color: #111827;
		text-decoration: none;
	}

	.card-title a:hover {
		color: #2563eb;
	}

	.card-description {
		color: #6b7280;
		font-size: 0.875rem;
		line-height: 1.5;
		margin-bottom: 1rem;
	}

	.card-details {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 1rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid #f3f4f6;
	}

	.detail-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: #6b7280;
		font-size: 0.875rem;
	}

	.detail-item svg {
		flex-shrink: 0;
	}

	.card-stats {
		display: flex;
		gap: 1.5rem;
		margin-bottom: 1rem;
	}

	.stat {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: #374151;
	}

	.stat svg {
		color: #6b7280;
		flex-shrink: 0;
	}

	.funding-progress {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.progress-bar {
		flex: 1;
		height: 6px;
		background: #e5e7eb;
		border-radius: 3px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: #10b981;
		border-radius: 3px;
		transition: width 0.3s;
	}

	.progress-label {
		font-size: 0.75rem;
		color: #6b7280;
		white-space: nowrap;
	}

	.pagination {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		margin-top: 2rem;
	}

	.page-info {
		font-size: 0.875rem;
		color: #6b7280;
	}
</style>
