import { json } from '@sveltejs/kit';
import { db } from '$lib/db';
import { locations } from '../../../../../drizzle/schema';
import { or, like } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const query = url.searchParams.get('q') || '';
	const limit = Math.min(parseInt(url.searchParams.get('limit') || '10'), 50);

	if (query.length < 2) {
		return json([]);
	}

	// Search in city, state, and full location
	const results = await db
		.select({
			id: locations.id,
			city: locations.city,
			stateProvince: locations.stateProvince,
			country: locations.country,
			fullLocation: locations.fullLocation
		})
		.from(locations)
		.where(
			or(
				// like(locations.city, `%${query}%`),
				// like(locations.stateProvince, `%${query}%`),
				like(locations.fullLocation, `%${query}%`)
			)
		)
		.limit(limit);

	return json(results);
};
