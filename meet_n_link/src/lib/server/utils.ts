import { and, or, desc, asc, gte, lte, like } from 'drizzle-orm';
import type { PgColumn, PgSelect } from 'drizzle-orm/pg-core';

export type SortOrder = 'asc' | 'desc';

export interface PaginationParams {
	page: number;
	limit: number;
}

export interface PaginationResult<T> {
	data: T[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}

/**
 * Apply pagination to a query
 */
export function withPagination<T extends PgSelect>(query: T, { page, limit }: PaginationParams) {
	return query.limit(limit).offset((page - 1) * limit);
}

/**
 * Get paginated results with total count
 */
export async function getPaginatedResults<T>(
	query: PgSelect,
	params: PaginationParams
): Promise<PaginationResult<T>> {
	const { page, limit } = params;

	// Execute count and data queries in parallel
	const [dataResult, countResult] = await Promise.all([
		withPagination(query, params),
		query.then((results) => results.length) // Simple count for now
	]);

	const total = countResult;
	const totalPages = Math.ceil(total / limit);

	return {
		data: dataResult as T[],
		pagination: {
			page,
			limit,
			total,
			totalPages
		}
	};
}

/**
 * Build dynamic sort order
 */
export function applySorting(column: PgColumn, order: SortOrder = 'asc') {
	return order === 'asc' ? asc(column) : desc(column);
}

/**
 * Build search filter for multiple text columns
 */
export function searchFilter(searchTerm: string, columns: PgColumn[]) {
	if (!searchTerm || columns.length === 0) return undefined;

	const conditions = columns.map((col) => like(col, `%${searchTerm}%`));

	return or(...conditions);
}

/**
 * Build date range filter
 */
export function dateRangeFilter(column: PgColumn, startDate?: Date, endDate?: Date) {
	const conditions = [];

	if (startDate) {
		conditions.push(gte(column, startDate));
	}

	if (endDate) {
		conditions.push(lte(column, endDate));
	}

	return conditions.length > 0 ? and(...conditions) : undefined;
}

/**
 * Parse pagination params from URL search params
 */
export function parsePaginationParams(url: URL, defaultLimit = 20): PaginationParams {
	const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
	const limit = Math.min(
		100,
		Math.max(1, parseInt(url.searchParams.get('limit') || String(defaultLimit)))
	);

	return { page, limit };
}

/**
 * Parse sort params from URL
 */
export function parseSortParams(url: URL) {
	const sortBy = url.searchParams.get('sortBy') || undefined;
	const sortOrder = (url.searchParams.get('sortOrder') || 'asc') as SortOrder;

	return { sortBy, sortOrder };
}
