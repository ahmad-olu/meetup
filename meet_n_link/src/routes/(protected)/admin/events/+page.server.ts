import { fail } from '@sveltejs/kit';
import { db } from '$lib/db';
import { events, locations, eventCategories, user } from '../../../../../drizzle/schema';
import { eq, desc } from 'drizzle-orm';
import { parsePaginationParams } from '$lib/server/utils';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
	if (!locals.user || locals.user.role !== 'admin') {
		throw new Error('Unauthorized');
	}

	const pagination = parsePaginationParams(url, 20);
	const statusFilter = url.searchParams.get('status') as any;

	let query = db
		.select({
			event: events,
			location: locations,
			category: eventCategories,
			creator: user
		})
		.from(events)
		.leftJoin(locations, eq(events.locationId, locations.id))
		.leftJoin(eventCategories, eq(events.categoryId, eventCategories.id))
		.leftJoin(user, eq(events.creatorId, user.id))
		.orderBy(desc(events.createdAt))
		.$dynamic();

	if (statusFilter) {
		query = query.where(eq(events.status, statusFilter));
	}

	const allEvents = await query;

	return {
		events: allEvents.slice(
			(pagination.page - 1) * pagination.limit,
			pagination.page * pagination.limit
		),
		totalEvents: allEvents.length,
		pagination
	};
};

export const actions: Actions = {
	approve: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') {
			return fail(403, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const eventId = formData.get('eventId') as string;

		if (!eventId) {
			return fail(400, { error: 'Event ID required' });
		}

		try {
			await db.update(events).set({ status: 'approved' }).where(eq(events.id, eventId));

			return { success: true };
		} catch (error) {
			return fail(500, {
				error: error instanceof Error ? error.message : 'Failed to approve event'
			});
		}
	},

	cancel: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') {
			return fail(403, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const eventId = formData.get('eventId') as string;

		if (!eventId) {
			return fail(400, { error: 'Event ID required' });
		}

		try {
			await db.update(events).set({ status: 'cancelled' }).where(eq(events.id, eventId));

			return { success: true };
		} catch (error) {
			return fail(500, {
				error: error instanceof Error ? error.message : 'Failed to cancel event'
			});
		}
	}
};
