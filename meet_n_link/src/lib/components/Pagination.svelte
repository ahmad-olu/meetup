<!-- Pagination Component -->
<script context="module" lang="ts">
	export interface PaginationProps {
		currentPage: number;
		totalPages: number;
		onPageChange: (page: number) => void;
	}
</script>

<script lang="ts">
	export let currentPage: number;
	export let totalPages: number;
	export let onPageChange: (page: number) => void;

	$: pages = Array.from({ length: totalPages }, (_, i) => i + 1);
	$: visiblePages = getVisiblePages(currentPage, totalPages);

	function getVisiblePages(current: number, total: number) {
		if (total <= 7) return pages;

		if (current <= 4) {
			return [...pages.slice(0, 5), -1, total];
		}

		if (current >= total - 3) {
			return [1, -1, ...pages.slice(total - 5)];
		}

		return [1, -1, current - 1, current, current + 1, -1, total];
	}
</script>

<nav class="pagination" aria-label="Pagination">
	<button
		class="pagination-btn"
		disabled={currentPage === 1}
		on:click={() => onPageChange(currentPage - 1)}
	>
		Previous
	</button>

	{#each visiblePages as page (page)}
		{#if page === -1}
			<span class="pagination-ellipsis">...</span>
		{:else}
			<button
				class="pagination-page"
				class:active={page === currentPage}
				on:click={() => onPageChange(page)}
			>
				{page}
			</button>
		{/if}
	{/each}

	<button
		class="pagination-btn"
		disabled={currentPage === totalPages}
		on:click={() => onPageChange(currentPage + 1)}
	>
		Next
	</button>
</nav>

<style>
	.pagination {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		justify-content: center;
	}

	.pagination-btn,
	.pagination-page {
		padding: 0.5rem 0.875rem;
		border: 1px solid #d1d5db;
		background: white;
		border-radius: 6px;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.15s;
	}

	.pagination-btn:hover:not(:disabled),
	.pagination-page:hover {
		background: #f3f4f6;
	}

	.pagination-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.pagination-page.active {
		background: #2563eb;
		color: white;
		border-color: #2563eb;
	}

	.pagination-ellipsis {
		padding: 0.5rem;
		color: #6b7280;
	}
</style>
