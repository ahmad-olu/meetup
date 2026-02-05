<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props();

	function getStatusColor(status: string) {
		const colors = {
			proposed: '#f59e0b',
			approved: '#10b981',
			cancelled: '#ef4444',
			completed: '#6b7280'
		};
		return colors[status] || '#6b7280';
	}

	function formatCurrency(amount: number) {
		return `₦${amount.toLocaleString()}`;
	}
</script>

<div class="dashboard">
	<header class="dashboard-header">
		<div class="header-content">
			<div class="user-welcome">
				<h1>Welcome back, {data.user.name}!</h1>
				<p class="subtitle">Here's what's happening with your events</p>
			</div>

			{#if !data.userExtra?.isVerified}
				<a href="/profile/verification" class="btn btn-warning">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
							stroke-width="2"
							stroke-linecap="round"
						/>
					</svg>
					Verify Your Account
				</a>
			{/if}
		</div>
	</header>

	<div class="dashboard-content">
		<section class="stats-grid">
			<div class="stat-card">
				<div class="stat-icon events">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<rect x="3" y="4" width="18" height="18" rx="2" stroke-width="2" />
						<line x1="16" y1="2" x2="16" y2="6" stroke-width="2" />
						<line x1="8" y1="2" x2="8" y2="6" stroke-width="2" />
						<line x1="3" y1="10" x2="21" y2="10" stroke-width="2" />
					</svg>
				</div>
				<div class="stat-content">
					<div class="stat-value">{data.stats.eventsCreated}</div>
					<div class="stat-label">Events Created</div>
				</div>
			</div>

			<div class="stat-card">
				<div class="stat-icon votes">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke-width="2" />
						<polyline points="14 2 14 8 20 8" stroke-width="2" />
						<line x1="9" y1="15" x2="15" y2="15" stroke-width="2" />
					</svg>
				</div>
				<div class="stat-content">
					<div class="stat-value">{data.stats.eventsVoted}</div>
					<div class="stat-label">Events Voted</div>
				</div>
			</div>

			<div class="stat-card">
				<div class="stat-icon attending">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke-width="2" />
						<circle cx="9" cy="7" r="4" stroke-width="2" />
						<path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke-width="2" />
					</svg>
				</div>
				<div class="stat-content">
					<div class="stat-value">{data.stats.eventsAttending}</div>
					<div class="stat-label">Attending</div>
				</div>
			</div>

			<div class="stat-card">
				<div class="stat-icon donations">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<line x1="12" y1="1" x2="12" y2="23" stroke-width="2" />
						<path
							d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
							stroke-width="2"
							stroke-linecap="round"
						/>
					</svg>
				</div>
				<div class="stat-content">
					<div class="stat-value">{formatCurrency(data.stats.totalDonated)}</div>
					<div class="stat-label">Total Donated</div>
				</div>
			</div>
		</section>

		<div class="content-grid">
			<div class="main-content">
				{#if data.createdEvents.length > 0}
					<section class="panel">
						<div class="panel-header">
							<h2>Your Events</h2>
							<a href="/events/new" class="btn-link">Create new</a>
						</div>
						<div class="event-list">
							{#each data.createdEvents as event (event.id)}
								<a href="/events/{event.id}" class="event-item">
									<div class="event-info">
										<h3>{event.title}</h3>
										<div class="event-meta">
											<span>{new Date(event.proposedDate).toLocaleDateString()}</span>
											<span class="separator">•</span>
											<span>{event.currentVotes} / {event.minVotesRequired} votes</span>
										</div>
									</div>
									<div
										class="event-status"
										style="background: {getStatusColor(event.status)}"
									></div>
								</a>
							{/each}
						</div>
					</section>
				{/if}

				{#if data.attendingEvents.length > 0}
					<section class="panel">
						<div class="panel-header">
							<h2>Events You're Attending</h2>
							<a href="/events" class="btn-link">Browse more</a>
						</div>
						<div class="event-list">
							{#each data.attendingEvents as event (event.id)}
								<a href="/events/{event.id}" class="event-item">
									<div class="event-info">
										<h3>{event.title}</h3>
										<div class="event-meta">
											<span>{new Date(event.proposedDate).toLocaleDateString()}</span>
										</div>
									</div>
								</a>
							{/each}
						</div>
					</section>
				{/if}

				{#if data.donations.length > 0}
					<section class="panel">
						<div class="panel-header">
							<h2>Your Donations</h2>
						</div>
						<div class="donations-table">
							<table>
								<thead>
									<tr>
										<th>Date</th>
										<th>Amount</th>
										<th>Status</th>
									</tr>
								</thead>
								<tbody>
									{#each data.donations as donation (donation.id)}
										<tr>
											<td>{new Date(donation.donatedAt).toLocaleDateString()}</td>
											<td>{formatCurrency(parseFloat(donation.amount))}</td>
											<td>
												<span class="badge badge-{donation.status}">{donation.status}</span>
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</section>
				{/if}
			</div>

			<aside class="sidebar">
				<section class="panel">
					<div class="panel-header">
						<h3>Notifications</h3>
						{#if data.stats.unreadNotifications > 0}
							<span class="notification-badge">{data.stats.unreadNotifications}</span>
						{/if}
					</div>
					{#if data.notifications.length === 0}
						<p class="empty-text">No notifications yet</p>
					{:else}
						<div class="notification-list">
							{#each data.notifications as notification (notification.id)}
								<div class="notification-item" class:unread={!notification.isRead}>
									<div class="notification-content">
										<p>{notification.message}</p>
										<time>{new Date(notification.createdAt).toLocaleDateString()}</time>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</section>
			</aside>
		</div>
	</div>
</div>

<style>
	.dashboard {
		min-height: 100vh;
		background: #f8f9fa;
	}

	.dashboard-header {
		background: white;
		border-bottom: 1px solid #e5e7eb;
		padding: 2rem;
	}

	.header-content {
		max-width: 1400px;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.user-welcome h1 {
		font-size: 1.75rem;
		font-weight: 700;
		margin: 0 0 0.25rem;
	}

	.subtitle {
		color: #6b7280;
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
		text-decoration: none;
	}

	.btn-warning {
		background: #fef3c7;
		color: #92400e;
	}

	.btn-warning:hover {
		background: #fde68a;
	}

	.dashboard-content {
		max-width: 1400px;
		margin: 0 auto;
		padding: 2rem;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.stat-card {
		background: white;
		border-radius: 8px;
		border: 1px solid #e5e7eb;
		padding: 1.5rem;
		display: flex;
		gap: 1rem;
	}

	.stat-icon {
		width: 48px;
		height: 48px;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.stat-icon.events {
		background: #dbeafe;
		color: #1e40af;
	}

	.stat-icon.votes {
		background: #fce7f3;
		color: #9f1239;
	}

	.stat-icon.attending {
		background: #d1fae5;
		color: #065f46;
	}

	.stat-icon.donations {
		background: #fef3c7;
		color: #92400e;
	}

	.stat-content {
		flex: 1;
	}

	.stat-value {
		font-size: 1.875rem;
		font-weight: 700;
		margin-bottom: 0.25rem;
	}

	.stat-label {
		color: #6b7280;
		font-size: 0.875rem;
	}

	.content-grid {
		display: grid;
		grid-template-columns: 1fr 350px;
		gap: 2rem;
	}

	.main-content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.panel {
		background: white;
		border-radius: 8px;
		border: 1px solid #e5e7eb;
		padding: 1.5rem;
	}

	.panel-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.25rem;
	}

	.panel-header h2,
	.panel-header h3 {
		font-size: 1.125rem;
		font-weight: 600;
		margin: 0;
	}

	.btn-link {
		color: #2563eb;
		text-decoration: none;
		font-size: 0.875rem;
		font-weight: 500;
	}

	.btn-link:hover {
		text-decoration: underline;
	}

	.event-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.event-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		background: #f9fafb;
		border-radius: 6px;
		text-decoration: none;
		color: inherit;
		transition: background 0.15s;
	}

	.event-item:hover {
		background: #f3f4f6;
	}

	.event-info h3 {
		font-size: 1rem;
		font-weight: 600;
		margin: 0 0 0.25rem;
	}

	.event-meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: #6b7280;
	}

	.separator {
		color: #d1d5db;
	}

	.event-status {
		width: 8px;
		height: 8px;
		border-radius: 50%;
	}

	.donations-table {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	thead {
		background: #f9fafb;
	}

	th {
		text-align: left;
		padding: 0.75rem;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		color: #6b7280;
	}

	td {
		padding: 0.75rem;
		border-top: 1px solid #f3f4f6;
	}

	.badge {
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 500;
	}

	.badge-completed {
		background: #d1fae5;
		color: #065f46;
	}

	.badge-pending {
		background: #fef3c7;
		color: #92400e;
	}

	.badge-failed {
		background: #fee2e2;
		color: #991b1b;
	}

	.sidebar {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.notification-badge {
		background: #ef4444;
		color: white;
		padding: 0.125rem 0.5rem;
		border-radius: 10px;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.empty-text {
		text-align: center;
		color: #9ca3af;
		padding: 2rem 0;
		margin: 0;
	}

	.notification-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.notification-item {
		padding: 0.75rem;
		border-radius: 6px;
		background: #f9fafb;
	}

	.notification-item.unread {
		background: #eff6ff;
		border-left: 3px solid #2563eb;
	}

	.notification-content p {
		margin: 0 0 0.25rem;
		font-size: 0.875rem;
	}

	.notification-content time {
		font-size: 0.75rem;
		color: #6b7280;
	}
</style>
