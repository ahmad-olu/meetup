<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import type { PageData } from './$types';

	let { data } = $props();

	function getStatusBadge(status: string) {
		const badges = {
			proposed: { class: 'badge-warning', label: 'Proposed' },
			approved: { class: 'badge-success', label: 'Approved' },
			cancelled: { class: 'badge-danger', label: 'Cancelled' },
			completed: { class: 'badge-secondary', label: 'Completed' }
		};
		return badges[status] || { class: '', label: status };
	}

	function updateFilter(status: string) {
		const params = new SvelteURLSearchParams($page.url.searchParams);
		if (status) {
			params.set('status', status);
		} else {
			params.delete('status');
		}
		goto(`?${params.toString()}`);
	}
</script>

<div class="admin-events">
	<header class="page-header">
		<h1>Manage Events</h1>
		<div class="stats">
			<span class="badge badge-info">{data.totalEvents} Total Events</span>
		</div>
	</header>

	<div class="page-content">
		<div class="toolbar">
			<div class="filter-tabs">
				<button
					class="tab"
					class:active={!$page.url.searchParams.get('status')}
					on:click={() => updateFilter('')}
				>
					All
				</button>
				<button
					class="tab"
					class:active={$page.url.searchParams.get('status') === 'proposed'}
					on:click={() => updateFilter('proposed')}
				>
					Proposed
				</button>
				<button
					class="tab"
					class:active={$page.url.searchParams.get('status') === 'approved'}
					on:click={() => updateFilter('approved')}
				>
					Approved
				</button>
				<button
					class="tab"
					class:active={$page.url.searchParams.get('status') === 'cancelled'}
					on:click={() => updateFilter('cancelled')}
				>
					Cancelled
				</button>
				<button
					class="tab"
					class:active={$page.url.searchParams.get('status') === 'completed'}
					on:click={() => updateFilter('completed')}
				>
					Completed
				</button>
			</div>
		</div>

		<div class="events-table-container">
			{#if data.events.length === 0}
				<div class="empty-state">
					<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<rect x="3" y="4" width="18" height="18" rx="2" stroke-width="2" />
						<line x1="16" y1="2" x2="16" y2="6" stroke-width="2" />
						<line x1="8" y1="2" x2="8" y2="6" stroke-width="2" />
						<line x1="3" y1="10" x2="21" y2="10" stroke-width="2" />
					</svg>
					<h3>No events found</h3>
					<p>No events match your current filter</p>
				</div>
			{:else}
				<table class="data-table">
					<thead>
						<tr>
							<th>Event</th>
							<th>Creator</th>
							<th>Date</th>
							<th>Location</th>
							<th>Votes</th>
							<th>Status</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each data.events as { event, location, category, creator } (event.id)}
							<tr>
								<td>
									<div class="event-cell">
										<a href="/events/{event.id}" class="event-title">{event.title}</a>
										{#if category}
											<span class="event-category">{category.name}</span>
										{/if}
									</div>
								</td>
								<td>
									{#if creator}
										<div class="creator-cell">
											{#if creator.image}
												<img src={creator.image} alt={creator.name} class="avatar" />
											{:else}
												<div class="avatar-placeholder">
													{creator.name.charAt(0).toUpperCase()}
												</div>
											{/if}
											<span>{creator.name}</span>
										</div>
									{/if}
								</td>
								<td class="text-secondary">
									{new Date(event.proposedDate).toLocaleDateString()}
								</td>
								<td class="text-secondary">
									{location?.city || location?.fullLocation || '-'}
								</td>
								<td>
									<div class="votes-cell">
										<span class="votes-count">{event.currentVotes} / {event.minVotesRequired}</span>
										{#if event.currentVotes >= event.minVotesRequired}
											<svg
												width="16"
												height="16"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												class="check-icon"
											>
												<path d="M9 11l3 3L22 4" stroke-width="2" stroke-linecap="round" />
											</svg>
										{/if}
									</div>
								</td>
								<td>
									<span class="badge {getStatusBadge(event.status).class}">
										{getStatusBadge(event.status).label}
									</span>
								</td>
								<td>
									<div class="action-buttons">
										{#if event.status === 'proposed'}
											<form method="POST" action="?/approve" use:enhance>
												<input type="hidden" name="eventId" value={event.id} />
												<button type="submit" class="btn btn-sm btn-success">Approve</button>
											</form>
										{/if}
										{#if event.status !== 'cancelled'}
											<form method="POST" action="?/cancel" use:enhance>
												<input type="hidden" name="eventId" value={event.id} />
												<button type="submit" class="btn btn-sm btn-danger">Cancel</button>
											</form>
										{/if}
										<a href="/events/{event.id}" class="btn btn-sm btn-secondary">View</a>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		</div>
	</div>
</div>

<style>
	.admin-events {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background: #f8f9fa;
	}

	.page-header {
		background: white;
		border-bottom: 1px solid #e5e7eb;
		padding: 1.5rem 2rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.page-header h1 {
		font-size: 1.5rem;
		font-weight: 600;
		margin: 0;
	}

	.stats {
		display: flex;
		gap: 0.75rem;
	}

	.badge {
		padding: 0.375rem 0.75rem;
		border-radius: 6px;
		font-size: 0.875rem;
		font-weight: 500;
	}

	.badge-info {
		background: #dbeafe;
		color: #1e40af;
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

	.page-content {
		flex: 1;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.toolbar {
		background: white;
		border-bottom: 1px solid #e5e7eb;
		padding: 1rem 2rem;
	}

	.filter-tabs {
		display: flex;
		gap: 0.5rem;
	}

	.tab {
		padding: 0.5rem 1rem;
		border: none;
		background: transparent;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 500;
		color: #6b7280;
		border-radius: 6px;
		transition: all 0.15s;
	}

	.tab:hover {
		background: #f3f4f6;
		color: #374151;
	}

	.tab.active {
		background: #eff6ff;
		color: #1e40af;
	}

	.events-table-container {
		flex: 1;
		overflow-y: auto;
		padding: 1.5rem 2rem;
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

	.data-table {
		width: 100%;
		background: white;
		border-radius: 8px;
		border: 1px solid #e5e7eb;
		border-collapse: collapse;
	}

	.data-table th {
		background: #f9fafb;
		padding: 0.75rem 1rem;
		text-align: left;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		color: #6b7280;
		border-bottom: 1px solid #e5e7eb;
	}

	.data-table td {
		padding: 1rem;
		border-bottom: 1px solid #f3f4f6;
	}

	.data-table tr:last-child td {
		border-bottom: none;
	}

	.event-cell {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.event-title {
		font-weight: 600;
		color: #111827;
		text-decoration: none;
	}

	.event-title:hover {
		color: #2563eb;
	}

	.event-category {
		font-size: 0.75rem;
		color: #6b7280;
	}

	.creator-cell {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.avatar {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		object-fit: cover;
	}

	.avatar-placeholder {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: #e5e7eb;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
		color: #6b7280;
		font-size: 0.875rem;
	}

	.text-secondary {
		color: #6b7280;
		font-size: 0.875rem;
	}

	.votes-cell {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.votes-count {
		font-weight: 500;
	}

	.check-icon {
		color: #10b981;
	}

	.action-buttons {
		display: flex;
		gap: 0.5rem;
	}

	.btn {
		padding: 0.5rem 1rem;
		border-radius: 6px;
		font-size: 0.875rem;
		font-weight: 500;
		border: none;
		cursor: pointer;
		text-decoration: none;
		display: inline-block;
		transition: all 0.15s;
	}

	.btn-sm {
		padding: 0.375rem 0.75rem;
		font-size: 0.8125rem;
	}

	.btn-success {
		background: #10b981;
		color: white;
	}

	.btn-success:hover {
		background: #059669;
	}

	.btn-danger {
		background: #ef4444;
		color: white;
	}

	.btn-danger:hover {
		background: #dc2626;
	}

	.btn-secondary {
		background: #e5e7eb;
		color: #374151;
	}

	.btn-secondary:hover {
		background: #d1d5db;
	}
</style>
