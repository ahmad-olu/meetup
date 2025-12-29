import { form, getRequestEvent, query } from '$app/server';
import { db } from '$lib/db';
import { error } from '@sveltejs/kit';
import { and, ilike, eq, count, sql, asc } from 'drizzle-orm';
import * as z from 'zod';
import { eventOrganizers, events, locations } from '../../../drizzle/schema';

const DayOfWeek = {
	wednesday: 'wednesday',
	saturday: 'saturday'
} as const;

export const propose_event = form(
	z.object({
		title: z.string().min(1, 'Title is required'),
		description: z.string().min(1, 'Description is required'),
		locationId: z.string(),
		categoryId: z.string(),
		proposedDate: z.string().datetime(), // Keep as string, don't transform
		dayOfWeek: z.nativeEnum(DayOfWeek),
		startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, 'Invalid time format'),
		endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, 'Invalid time format'),
		minVotesRequired: z.number().min(5),
		votingDeadline: z.string().datetime(), // Keep as string
		requiresFunding: z
			.union([z.literal('true'), z.literal('false')])
			.transform((v) => v === 'true'),
		venueDetails: z.string().max(2000).optional(),
		fundingGoal: z
			.string()
			.regex(/^\d{1,8}(\.\d{1,2})?$/, 'Invalid decimal (10,2)')
			.default('0.00')
			.transform(Number)
	}),
	async ({
		title,
		description,
		locationId,
		categoryId,
		proposedDate,
		dayOfWeek,
		startTime,
		endTime,
		minVotesRequired,
		votingDeadline,
		status,
		requiresFunding,
		fundingGoal,
		venueDetails
	}) => {
		const event = getRequestEvent();
		if (!event.locals.user) {
			error(401, 'Unauthorized');
		}
		//const slug = title.toLowerCase().replace(/ /g, '-');

		await db.transaction(async (tx) => {
			const [eventRes] = await tx
				.insert(events)
				.values({
					title,
					description,
					proposedDate,
					dayOfWeek,
					votingDeadline: new Date(votingDeadline), // Convert to Date for timestamp()
					locationId,
					categoryId,
					startTime,
					endTime,
					minVotesRequired,
					status: 'proposed',
					requiresFunding,
					venueDetails,
					fundingGoal,
					creatorId: event.locals.user!.id!
				})
				.returning({ id: events.id });

			await tx.insert(eventOrganizers).values({
				userId: event.locals.user!.id!,
				role: 'creator',
				eventId: eventRes.id
			});
		});
		// redirect(303, '/');
	}
);

export const get_location_by_country = query(z.string(), async (country) => {
	const event = getRequestEvent();

	if (!event.locals.user) {
		error(401, 'Unauthorized');
	}
	const res = await db.query.locations.findMany({
		where: { country: country },
		orderBy: { city: 'asc' }
	});
	return res;
});

export const get_location_by_country_state = query(
	z.object({ country: z.string(), state: z.string() }),
	async ({ country, state }) => {
		const event = getRequestEvent();

		if (!event.locals.user) {
			error(401, 'Unauthorized');
		}
		const res = await db
			.select()
			.from(locations)
			.where(and(eq(locations.country, country.trim()), eq(locations.stateProvince, state.trim())));

		return res;
	}
);

export const get_all_country = query(async () => {
	const event = getRequestEvent();

	if (!event.locals.user) {
		error(401, 'Unauthorized');
	}
	const res = await db
		.select({ country: locations.country })
		.from(locations)
		.groupBy(locations.country)
		.orderBy(asc(locations.country));

	return res;
});

export const get_event_details = query(z.string(), async (eventId) => {
	const event = getRequestEvent();

	if (!event.locals.user) {
		error(401, 'Unauthorized');
	}
	const res = await db.query.events.findFirst({
		where: { id: eventId },
		with: {
			location: true,
			category: true,
			creator: true,
			organizers: {
				with: {
					user: true
				}
			},
			votes: {
				with: {
					user: true
				}
			},
			attendees: {
				with: {
					user: true
				}
			},
			donations: {
				with: {
					donor: true
				}
			},
			chatMessages: {
				with: {
					user: true
				},
				orderBy: {
					sentAt: 'asc'
				}
			}
		}
	});

	return res;
});

export const get_upcoming_events_by_location = query(z.string(), async (locationId) => {
	const event = getRequestEvent();

	if (!event.locals.user) {
		error(401, 'Unauthorized');
	}
	const res = await db.query.events.findMany({
		where: {
			locationId: locationId,
			status: 'approved',
			proposedDate: {
				gte: new Date().toISOString()
			}
		},
		with: {
			location: true,
			category: true,
			creator: true,
			votes: true,
			attendees: true
		},
		orderBy: { proposedDate: 'asc' }
	});

	return res;
});

export const get_events_by_category = query(z.string(), async (categoryId) => {
	const event = getRequestEvent();

	if (!event.locals.user) {
		error(401, 'Unauthorized');
	}
	const res = await db.query.events.findMany({
		where: {
			categoryId: categoryId
		},
		with: {
			location: true,
			category: true,
			creator: true,
			votes: true
		},
		limit: 10,
		orderBy: { createdAt: 'desc' }
	});

	return res;
});

/// Get events needing votes
export const get_events_needing_votes = query(async () => {
	const event = getRequestEvent();

	if (!event.locals.user) {
		error(401, 'Unauthorized');
	}
	const res = await db.query.events.findMany({
		where: {
			status: 'proposed',
			votingDeadline: {
				gte: new Date()
			}
		},
		with: {
			location: true,
			category: true,
			creator: true,
			votes: true
		},
		limit: 10,
		orderBy: { votingDeadline: 'asc' }
	});

	return res;
});

export const has_user_voted = query(z.string(), async (eventId) => {
	const event = getRequestEvent();

	if (!event.locals.user) {
		error(401, 'Unauthorized');
	}
	const res = await db.query.eventVotes.findMany({
		where: {
			userId: event.locals.user.id!,
			eventId: eventId
		}
	});

	//const votes = !!res;

	return !!res;
});

export const get_vote_count = query(z.string(), async (eventId) => {
	const event = getRequestEvent();

	if (!event.locals.user) {
		error(401, 'Unauthorized');
	}
	const res = await db.query.eventVotes.findMany({
		where: {
			eventId: eventId
		}
	});
	return res.length;
});

/// Get total funding for event
export const get_event_funding = query(z.string(), async (eventId) => {
	const event = getRequestEvent();

	if (!event.locals.user) {
		error(401, 'Unauthorized');
	}
	const donations = await db.query.donations.findMany({
		where: {
			eventId: eventId,
			status: 'completed'
		}
	});
	return donations.reduce((sum, d) => sum + parseFloat(d.amount), 0);
});

export const get_event_chat = query(z.string(), async (eventId) => {
	const event = getRequestEvent();

	if (!event.locals.user) {
		error(401, 'Unauthorized');
	}
	const res = await db.query.chatMessages.findMany({
		where: {
			eventId: eventId,
			isDeleted: false
		},
		with: {
			user: true
		},
		orderBy: {
			sentAt: 'desc'
		},
		limit: 100
	});
	return res;
});

export const get_pending_reports = query(async () => {
	const event = getRequestEvent();

	if (!event.locals.user) {
		error(401, 'Unauthorized');
	}

	if (event.locals.user.role !== 'admin') {
		error(401, 'Unauthorized');
	}
	const res = await db.query.eventReports.findMany({
		where: {
			status: 'pending'
		},
		with: {
			event: {
				with: {
					creator: true,
					location: true
				}
			},
			reporter: true
		},
		orderBy: {
			reportedAt: 'desc'
		},
		limit: 100
	});
	return res;
});
