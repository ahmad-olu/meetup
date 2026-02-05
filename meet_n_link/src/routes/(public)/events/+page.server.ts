import { eventService } from '$lib/server/queries/events';
import { db } from '$lib/db';
import { locations, eventCategories } from '../../../../drizzle/schema';
import { parsePaginationParams } from '$lib/server/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
	if (!locals.user) {
		throw new Error('Unauthorized');
	}
	// console.log(`\n\n\n====> 1`);
	const pagination = parsePaginationParams(url, 20);
	// console.log(`\n\n\n====> 2`, JSON.stringify(pagination));
	// Parse filters from URL
	const filters = {
		status: url.searchParams.get('status') as any,
		locationId: url.searchParams.get('location') || undefined,
		categoryId: url.searchParams.get('category') || undefined,
		requiresFunding: url.searchParams.get('funding')
			? url.searchParams.get('funding') === 'true'
			: undefined
	};
	// console.log(`\n\n\n====> 3`, JSON.stringify(filters));
	// Get events
	const events = await eventService.getEvents(filters, pagination);
	// console.log(`\n\n\n====> 4`, JSON.stringify(events));
	// Get filter options
	const [categoriesList] = await Promise.all([
		// db.select().from(locations),
		db.select().from(eventCategories)
	]);
	// console.log(`\n\n\n====> 5`, JSON.stringify(locationsList));
	// console.log(`\n\n\n====> 6`, JSON.stringify(categoriesList));
	return {
		events,
		// locations: locationsList,
		categories: categoriesList,
		filters,
		pagination
	};
};

// id: string;
//     country: string;
//     stateProvince: string | null;
//     city: string | null;
//     fullLocation: string | null;
//     createdAt: Date | null;
