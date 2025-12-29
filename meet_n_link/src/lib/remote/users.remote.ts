import { getRequestEvent, query } from '$app/server';
import { db } from '$lib/db';
import { error } from '@sveltejs/kit';
import * as z from 'zod';

export const get_user_created_events = query(z.number().default(0), async (offset) => {
	const event = getRequestEvent();

	if (!event.locals.user) {
		error(401, 'Unauthorized');
	}
	const res = await db.query.events.findMany({
		where: { creatorId: event.locals.user.id! },
		limit: 50,
		offset: offset,
		with: {
			location: { columns: { fullLocation: true } },
			category: { columns: { name: true, slug: true } },
			votes: { columns: { userId: true } },
			attendees: { columns: { userId: true } }
		}
	});

	// const res = await db.query.user.findFirst({
	// 	where: { id: event.locals.user!.id! },
	// 	with: {
	// 		createdEvents: {
	// 			limit: 100,
	// 			offset: 0,
	// 			with: {
	// 				location: true,
	// 				category: true,
	// 				votes: true,
	// 				attendees: true
	// 			}
	// 		}
	// 	}
	// });

	return res;
});

export const get_user_with_verification_docs = query(z.number().default(0), async (offset) => {
	const event = getRequestEvent();

	if (!event.locals.user) {
		error(401, 'Unauthorized');
	}
	const res = await db.query.verificationDocuments.findMany({
		where: { userId: event.locals.user.id! },
		limit: 10,
		offset: offset
	});

	return res;
});

/// Get events user is attending
export const get_user_attending_event = query(async () => {
	const event = getRequestEvent();

	if (!event.locals.user) {
		error(401, 'Unauthorized');
	}
	const res = await db.query.eventAttendees.findMany({
		where: {
			userId: event.locals.user.id!
		},
		with: {
			event: {
				with: { location: true, category: true, creator: true },
				orderBy: { proposedDate: 'asc' }
			}
		},
		limit: 10
	});

	return res;
});

/// Get user's donation history
export const get_user_donations = query(async () => {
	const event = getRequestEvent();

	if (!event.locals.user) {
		error(401, 'Unauthorized');
	}
	const res = await db.query.donations.findMany({
		where: {
			donorId: event.locals.user.id!
		},
		with: {
			event: {
				with: {
					location: true,
					category: true
				}
			}
		},
		orderBy: { donatedAt: 'desc' }
	});
	return res.length;
});

export const get_unread_notifications = query(async () => {
	const event = getRequestEvent();

	if (!event.locals.user) {
		error(401, 'Unauthorized');
	}
	const res = await db.query.notifications.findMany({
		where: {
			userId: event.locals.user.id!,
			isRead: false
		},
		with: {
			user: true
		},
		orderBy: {
			createdAt: 'desc'
		},
		limit: 30
	});
	return res;
});

/// Get all user notifications
export const get_user_notifications = query(async () => {
	const event = getRequestEvent();

	if (!event.locals.user) {
		error(401, 'Unauthorized');
	}
	const res = await db.query.notifications.findMany({
		where: {
			userId: event.locals.user.id!
		},
		with: {
			user: true
		},
		orderBy: {
			createdAt: 'desc'
		},
		limit: 30
	});
	return res;
});
