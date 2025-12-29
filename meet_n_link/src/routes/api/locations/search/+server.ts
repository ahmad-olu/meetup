import { json, error, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { ilike } from 'drizzle-orm';
import { locations } from '../../../../../drizzle/schema';

export const GET: RequestHandler = async ({ url, locals }) => {
	if (!locals.user) {
		error(401, 'Unauthorized');
	}

	const searchTerm = url.searchParams.get('q');

	if (!searchTerm || searchTerm.length < 3) {
		return json([]);
	}

	const results = await db
		.select()
		.from(locations)
		.where(ilike(locations.fullLocation, `%${searchTerm}%`))
		.limit(20)
		.orderBy(locations.fullLocation);

	return json(results);
};
