<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let { data } = $props();

	let selectedUserId: string | null = null;
	let selectedDocs: any[] = [];
	let rejectionReason = '';
	let showRejectModal = false;

	function viewDocuments(userId: string, docs: any[]) {
		selectedUserId = userId;
		selectedDocs = docs;
	}

	function openRejectModal(userId: string) {
		selectedUserId = userId;
		showRejectModal = true;
	}

	function closeModals() {
		selectedUserId = null;
		selectedDocs = [];
		showRejectModal = false;
		rejectionReason = '';
	}
</script>

<div class="verification-admin">
	<header class="page-header">
		<h1>User Verifications</h1>
		<div class="stats">
			<span class="badge pending">{data.pendingVerifications.length} Pending</span>
		</div>
	</header>

	<div class="content-grid">
		<div class="verification-list">
			{#if data.pendingVerifications.length === 0}
				<div class="empty-state">
					<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path
							d="M9 11l3 3L22 4"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"
							stroke-width="2"
							stroke-linecap="round"
						/>
					</svg>
					<h3>All Clear</h3>
					<p>No pending verifications at the moment</p>
				</div>
			{:else}
				<table class="data-table">
					<thead>
						<tr>
							<th>User</th>
							<th>Email</th>
							<th>Submitted</th>
							<th>Documents</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each data.pendingVerifications as verification (verification.id)}
							<tr>
								<td>
									<div class="user-cell">
										{#if verification.user.image}
											<img
												src={verification.user.image}
												alt={verification.user.name}
												class="avatar"
											/>
										{:else}
											<div class="avatar-placeholder">
												{verification.user.name.charAt(0).toUpperCase()}
											</div>
										{/if}
										<span class="name">{verification.user.name}</span>
									</div>
								</td>
								<td class="text-secondary">{verification.user.email}</td>
								<td class="text-secondary">
									{new Date(verification.userExtra.verificationSubmittedAt).toLocaleDateString()}
								</td>
								<td>
									<button
										class="btn-link"
										on:click={() => viewDocuments(verification.user.id, verification.documents)}
									>
										{verification.documents.length} files
									</button>
								</td>
								<td>
									<div class="action-buttons">
										<form method="POST" action="?/approve" use:enhance>
											<input type="hidden" name="userId" value={verification.user.id} />
											<button type="submit" class="btn btn-success btn-sm">Approve</button>
										</form>
										<button
											class="btn btn-danger btn-sm"
											on:click={() => openRejectModal(verification.user.id)}
										>
											Reject
										</button>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		</div>

		{#if selectedDocs.length > 0}
			<aside class="document-viewer">
				<div class="viewer-header">
					<h3>Documents</h3>
					<button class="btn-icon" onclick={closeModals}>
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<path d="M6 18L18 6M6 6l12 12" stroke-width="2" stroke-linecap="round" />
						</svg>
					</button>
				</div>
				<div class="document-list">
					{#each selectedDocs as doc (doc.id)}
						<div class="document-item">
							<div class="doc-header">
								<span class="doc-type">{doc.documentType.replace('_', ' ')}</span>
								<span class="doc-date">
									{new Date(doc.submittedAt).toLocaleDateString()}
								</span>
							</div>
							<a href={doc.documentUrl} target="_blank" class="doc-preview">
								<img src={doc.documentUrl} alt={doc.documentType} />
							</a>
						</div>
					{/each}
				</div>
			</aside>
		{/if}
	</div>
</div>

{#if showRejectModal}
	<div class="modal-overlay" on:click={closeModals}>
		<div class="modal" on:click|stopPropagation>
			<div class="modal-header">
				<h2>Reject Verification</h2>
				<button class="btn-icon" on:click={closeModals}>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path d="M6 18L18 6M6 6l12 12" stroke-width="2" stroke-linecap="round" />
					</svg>
				</button>
			</div>
			<form method="POST" action="?/reject" use:enhance on:submit={closeModals}>
				<input type="hidden" name="userId" value={selectedUserId} />
				<div class="form-group">
					<label for="reason">Rejection Reason</label>
					<textarea
						id="reason"
						name="reason"
						bind:value={rejectionReason}
						rows="4"
						required
						placeholder="Explain why this verification is being rejected..."
					></textarea>
				</div>
				<div class="modal-actions">
					<button type="button" class="btn btn-secondary" on:click={closeModals}> Cancel </button>
					<button type="submit" class="btn btn-danger">Reject Verification</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<style>
	.verification-admin {
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

	.badge.pending {
		background: #fef3c7;
		color: #92400e;
	}

	.content-grid {
		display: grid;
		grid-template-columns: 1fr auto;
		flex: 1;
		overflow: hidden;
	}

	.verification-list {
		overflow-y: auto;
		padding: 1.5rem;
	}

	.empty-state {
		text-align: center;
		padding: 4rem 2rem;
		color: #6b7280;
	}

	.empty-state svg {
		margin: 0 auto 1rem;
		color: #9ca3af;
	}

	.empty-state h3 {
		font-size: 1.125rem;
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

	.user-cell {
		display: flex;
		align-items: center;
		gap: 0.75rem;
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
	}

	.name {
		font-weight: 500;
	}

	.text-secondary {
		color: #6b7280;
	}

	.btn-link {
		background: none;
		border: none;
		color: #2563eb;
		cursor: pointer;
		text-decoration: underline;
		font-size: 0.875rem;
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

	.document-viewer {
		width: 400px;
		background: white;
		border-left: 1px solid #e5e7eb;
		display: flex;
		flex-direction: column;
	}

	.viewer-header {
		padding: 1.5rem;
		border-bottom: 1px solid #e5e7eb;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.viewer-header h3 {
		font-size: 1.125rem;
		font-weight: 600;
		margin: 0;
	}

	.btn-icon {
		background: none;
		border: none;
		padding: 0.5rem;
		cursor: pointer;
		color: #6b7280;
		border-radius: 4px;
	}

	.btn-icon:hover {
		background: #f3f4f6;
	}

	.document-list {
		padding: 1.5rem;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.document-item {
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		overflow: hidden;
	}

	.doc-header {
		padding: 0.75rem;
		background: #f9fafb;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.doc-type {
		font-weight: 500;
		font-size: 0.875rem;
		text-transform: capitalize;
	}

	.doc-date {
		font-size: 0.75rem;
		color: #6b7280;
	}

	.doc-preview {
		display: block;
	}

	.doc-preview img {
		width: 100%;
		height: 250px;
		object-fit: cover;
	}

	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.modal {
		background: white;
		border-radius: 12px;
		width: 90%;
		max-width: 500px;
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
	}

	.modal-header {
		padding: 1.5rem;
		border-bottom: 1px solid #e5e7eb;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.modal-header h2 {
		font-size: 1.25rem;
		font-weight: 600;
		margin: 0;
	}

	.modal form {
		padding: 1.5rem;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	.form-group label {
		display: block;
		font-size: 0.875rem;
		font-weight: 500;
		margin-bottom: 0.5rem;
		color: #374151;
	}

	.form-group textarea {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		font-size: 0.875rem;
		font-family: inherit;
		resize: vertical;
	}

	.form-group textarea:focus {
		outline: none;
		border-color: #2563eb;
		box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
	}

	.modal-actions {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
	}
</style>
