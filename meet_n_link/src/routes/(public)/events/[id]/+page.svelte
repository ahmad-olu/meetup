<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let { data } = $props();

	let messageText = $state('');
	let showDonationModal = $state(false);
	let donationAmount = $state('');

	function formatCurrency(amount: string, symbol: string) {
		return `${symbol}${parseFloat(amount).toLocaleString()}`;
	}

	function calculateProgress(current: string, goal: string) {
		const curr = parseFloat(current);
		const goalNum = parseFloat(goal);
		return goalNum > 0 ? Math.min((curr / goalNum) * 100, 100) : 0;
	}

	function getStatusInfo(status: string) {
		const statuses = {
			proposed: { color: '#f59e0b', label: 'Proposed - Awaiting Votes' },
			approved: { color: '#10b981', label: 'Approved - Registration Open' },
			cancelled: { color: '#ef4444', label: 'Cancelled' },
			completed: { color: '#6b7280', label: 'Completed' }
		};
		return statuses[status] || { color: '#6b7280', label: status };
	}
</script>

<div class="event-detail">
	<header class="event-header">
		<div class="header-container">
			<div class="breadcrumb">
				<a href="/events">← Back to Events</a>
			</div>

			<div class="header-content">
				<div class="header-main">
					<div
						class="status-indicator"
						style="background: {getStatusInfo(data.event.event.status).color}"
					>
						{getStatusInfo(data.event.event.status).label}
					</div>
					<h1>{data.event.event.title}</h1>
					<p class="event-description">{data.event.event.description}</p>
				</div>

				<div class="header-actions">
					{#if data.event.event.status === 'proposed'}
						{#if data.hasVoted}
							<form method="POST" action="?/removeVote" use:enhance>
								<button type="submit" class="btn btn-secondary">
									<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
										<path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
									</svg>
									Voted
								</button>
							</form>
						{:else}
							<form method="POST" action="?/vote" use:enhance>
								<button type="submit" class="btn btn-primary">
									<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
										<path
											d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"
											stroke-width="2"
										/>
									</svg>
									Vote for Event
								</button>
							</form>
						{/if}
					{/if}

					{#if data.event.event.status === 'approved' && !data.isRegistered}
						<form method="POST" action="?/register" use:enhance>
							<button type="submit" class="btn btn-success">
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
									<path
										d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M8.5 3a4 4 0 100 8 4 4 0 000-8zM20 8v6M23 11h-6"
										stroke-width="2"
										stroke-linecap="round"
									/>
								</svg>
								Register to Attend
							</button>
						</form>
					{/if}

					{#if data.event.event.requiresFunding}
						<button class="btn btn-primary" onclick={() => (showDonationModal = true)}>
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<path
									d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
									stroke-width="2"
									stroke-linecap="round"
								/>
							</svg>
							Donate
						</button>
					{/if}
				</div>
			</div>
		</div>
	</header>

	<div class="event-content">
		<div class="content-main">
			<section class="info-section">
				<h2>Event Details</h2>
				<dl class="details-grid">
					<div class="detail">
						<dt>
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke-width="2" />
								<line x1="16" y1="2" x2="16" y2="6" stroke-width="2" />
								<line x1="8" y1="2" x2="8" y2="6" stroke-width="2" />
								<line x1="3" y1="10" x2="21" y2="10" stroke-width="2" />
							</svg>
							Date
						</dt>
						<dd>
							{new Date(data.event.event.proposedDate).toLocaleDateString('en-US', {
								weekday: 'long',
								year: 'numeric',
								month: 'long',
								day: 'numeric'
							})}
						</dd>
					</div>

					<div class="detail">
						<dt>
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<circle cx="12" cy="12" r="10" stroke-width="2" />
								<path d="M12 6v6l4 2" stroke-width="2" />
							</svg>
							Time
						</dt>
						<dd>{data.event.event.startTime} - {data.event.event.endTime}</dd>
					</div>

					{#if data.event.location}
						<div class="detail">
							<dt>
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
									<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke-width="2" />
									<circle cx="12" cy="10" r="3" stroke-width="2" />
								</svg>
								Location
							</dt>
							<dd>{data.event.location.fullLocation || data.event.location.city}</dd>
						</div>
					{/if}

					{#if data.event.category}
						<div class="detail">
							<dt>
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
									<path
										d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"
										stroke-width="2"
									/>
									<line x1="7" y1="7" x2="7.01" y2="7" stroke-width="2" />
								</svg>
								Category
							</dt>
							<dd>{data.event.category.name}</dd>
						</div>
					{/if}

					{#if data.event.event.venueDetails}
						<div class="detail full-width">
							<dt>
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
									<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke-width="2" />
									<polyline points="9 22 9 12 15 12 15 22" stroke-width="2" />
								</svg>
								Venue
							</dt>
							<dd>{data.event.event.venueDetails}</dd>
						</div>
					{/if}
				</dl>
			</section>

			<section class="stats-section">
				<div class="stat-card">
					<div class="stat-icon votes">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke-width="2" />
							<polyline points="14 2 14 8 20 8" stroke-width="2" />
						</svg>
					</div>
					<div class="stat-content">
						<div class="stat-label">Votes</div>
						<div class="stat-value">
							{data.event.event.currentVotes} / {data.event.event.minVotesRequired}
						</div>
						<div class="progress-bar">
							<div
								class="progress-fill"
								style="width: {Math.min(
									(data.event.event.currentVotes / data.event.event.minVotesRequired) * 100,
									100
								)}%"
							></div>
						</div>
					</div>
				</div>

				{#if data.event.event.requiresFunding}
					<div class="stat-card">
						<div class="stat-icon funding">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<path
									d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
									stroke-width="2"
									stroke-linecap="round"
								/>
							</svg>
						</div>
						<div class="stat-content">
							<div class="stat-label">Funding Progress</div>
							<div class="stat-value">
								{formatCurrency(data.event.event.currentFunding, data.event.event.currencySymbol)} /
								{formatCurrency(data.event.event.fundingGoal, data.event.event.currencySymbol)}
							</div>
							<div class="progress-bar">
								<div
									class="progress-fill"
									style="width: {calculateProgress(
										data.event.event.currentFunding,
										data.event.event.fundingGoal
									)}%"
								></div>
							</div>
						</div>
					</div>
				{/if}

				<div class="stat-card">
					<div class="stat-icon attendees">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<path
								d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
								stroke-width="2"
								stroke-linecap="round"
							/>
						</svg>
					</div>
					<div class="stat-content">
						<div class="stat-label">Registered Attendees</div>
						<div class="stat-value">{data.event.attendees.length}</div>
					</div>
				</div>
			</section>

			<section class="chat-section">
				<h2>Event Chat</h2>
				<div class="chat-container">
					<div class="messages">
						{#if data.messages.length === 0}
							<div class="empty-chat">
								<p>No messages yet. Start the conversation!</p>
							</div>
						{:else}
							{#each data.messages as { message, user } (message.id)}
								<div class="message">
									<div class="message-avatar">
										{#if user.image}
											<img src={user.image} alt={user.name} />
										{:else}
											<div class="avatar-placeholder">{user.name.charAt(0).toUpperCase()}</div>
										{/if}
									</div>
									<div class="message-content">
										<div class="message-header">
											<span class="message-author">{user.name}</span>
											<time class="message-time">
												{new Date(message.sentAt).toLocaleString()}
											</time>
										</div>
										<p class="message-text">{message.messageText}</p>
									</div>
								</div>
							{/each}
						{/if}
					</div>

					<form method="POST" action="?/sendMessage" use:enhance class="message-form">
						<input
							type="text"
							name="message"
							bind:value={messageText}
							placeholder="Type a message..."
							required
						/>
						<button type="submit" class="btn btn-primary">Send</button>
					</form>
				</div>
			</section>
		</div>

		<aside class="sidebar">
			<div class="sidebar-card">
				<h3>Organizers</h3>
				<div class="organizers-list">
					{#each data.event.organizers as organizer (organizer.role)}
						<div class="organizer">
							<div class="organizer-badge">
								{organizer.role === 'creator' ? 'Creator' : 'Co-organizer'}
							</div>
						</div>
					{/each}
				</div>
			</div>

			{#if data.event.donations.length > 0}
				<div class="sidebar-card">
					<h3>Recent Donations</h3>
					<div class="donations-list">
						{#each data.event.donations
							.filter((d) => d.status === 'completed')
							.slice(0, 5) as donation (donation.status)}
							<div class="donation-item">
								<div class="donation-amount">
									{formatCurrency(donation.amount, data.event.event.currencySymbol)}
								</div>
								<div class="donation-date">
									{new Date(donation.donatedAt).toLocaleDateString()}
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</aside>
	</div>
</div>

<style>
	.event-detail {
		min-height: 100vh;
		background: #f8f9fa;
	}

	.event-header {
		background: white;
		border-bottom: 1px solid #e5e7eb;
	}

	.header-container {
		max-width: 1400px;
		margin: 0 auto;
		padding: 2rem;
	}

	.breadcrumb {
		margin-bottom: 1.5rem;
	}

	.breadcrumb a {
		color: #6b7280;
		text-decoration: none;
		font-size: 0.875rem;
	}

	.breadcrumb a:hover {
		color: #2563eb;
	}

	.header-content {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 2rem;
	}

	.header-main {
		flex: 1;
	}

	.status-indicator {
		display: inline-block;
		padding: 0.5rem 1rem;
		border-radius: 6px;
		color: white;
		font-size: 0.875rem;
		font-weight: 500;
		margin-bottom: 1rem;
	}

	.header-main h1 {
		font-size: 2rem;
		font-weight: 700;
		margin: 0 0 1rem;
	}

	.event-description {
		font-size: 1.125rem;
		color: #6b7280;
		line-height: 1.6;
		margin: 0;
	}

	.header-actions {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.btn {
		padding: 0.75rem 1.5rem;
		border-radius: 6px;
		font-size: 0.875rem;
		font-weight: 500;
		border: none;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		transition: all 0.15s;
		white-space: nowrap;
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

	.btn-success {
		background: #10b981;
		color: white;
	}

	.btn-success:hover {
		background: #059669;
	}

	.event-content {
		max-width: 1400px;
		margin: 0 auto;
		padding: 2rem;
		display: grid;
		grid-template-columns: 1fr 350px;
		gap: 2rem;
	}

	.content-main {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.info-section,
	.stats-section,
	.chat-section {
		background: white;
		border-radius: 8px;
		border: 1px solid #e5e7eb;
		padding: 1.5rem;
	}

	.info-section h2,
	.chat-section h2 {
		font-size: 1.25rem;
		font-weight: 600;
		margin: 0 0 1.5rem;
	}

	.details-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1.5rem;
	}

	.detail {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.detail.full-width {
		grid-column: 1 / -1;
	}

	.detail dt {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: #6b7280;
		font-weight: 500;
	}

	.detail dd {
		margin: 0;
		font-size: 1rem;
		color: #111827;
	}

	.stats-section {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
		padding: 1.5rem;
	}

	.stat-card {
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

	.stat-icon.votes {
		background: #dbeafe;
		color: #1e40af;
	}

	.stat-icon.funding {
		background: #d1fae5;
		color: #065f46;
	}

	.stat-icon.attendees {
		background: #fce7f3;
		color: #9f1239;
	}

	.stat-content {
		flex: 1;
	}

	.stat-label {
		font-size: 0.875rem;
		color: #6b7280;
		margin-bottom: 0.25rem;
	}

	.stat-value {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
	}

	.progress-bar {
		height: 6px;
		background: #e5e7eb;
		border-radius: 3px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: #2563eb;
		border-radius: 3px;
		transition: width 0.3s;
	}

	.chat-container {
		display: flex;
		flex-direction: column;
		height: 500px;
	}

	.messages {
		flex: 1;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1rem;
		padding-right: 0.5rem;
	}

	.empty-chat {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		color: #9ca3af;
	}

	.message {
		display: flex;
		gap: 0.75rem;
	}

	.message-avatar {
		flex-shrink: 0;
	}

	.message-avatar img,
	.avatar-placeholder {
		width: 40px;
		height: 40px;
		border-radius: 50%;
	}

	.message-avatar img {
		object-fit: cover;
	}

	.avatar-placeholder {
		background: #e5e7eb;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
		color: #6b7280;
	}

	.message-content {
		flex: 1;
	}

	.message-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.25rem;
	}

	.message-author {
		font-weight: 600;
		font-size: 0.875rem;
	}

	.message-time {
		font-size: 0.75rem;
		color: #9ca3af;
	}

	.message-text {
		margin: 0;
		font-size: 0.9375rem;
		line-height: 1.5;
	}

	.message-form {
		display: flex;
		gap: 0.75rem;
		border-top: 1px solid #e5e7eb;
		padding-top: 1rem;
	}

	.message-form input {
		flex: 1;
		padding: 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		font-size: 0.875rem;
	}

	.message-form input:focus {
		outline: none;
		border-color: #2563eb;
		box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
	}

	.sidebar {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.sidebar-card {
		background: white;
		border-radius: 8px;
		border: 1px solid #e5e7eb;
		padding: 1.5rem;
	}

	.sidebar-card h3 {
		font-size: 1rem;
		font-weight: 600;
		margin: 0 0 1rem;
	}

	.organizers-list,
	.donations-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.organizer-badge {
		padding: 0.5rem 0.75rem;
		background: #f3f4f6;
		border-radius: 6px;
		font-size: 0.875rem;
		font-weight: 500;
	}

	.donation-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem;
		background: #f9fafb;
		border-radius: 6px;
	}

	.donation-amount {
		font-weight: 600;
		color: #10b981;
	}

	.donation-date {
		font-size: 0.875rem;
		color: #6b7280;
	}
</style>
