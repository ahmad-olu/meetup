import { db } from '$lib/server/db';
import {
	events,
	eventVotes,
	eventAttendees,
	donations,
	notifications,
	usersExtra
} from '../../../../drizzle/schema';
import { eq, desc, and } from 'drizzle-orm';
import { notificationService } from '$lib/server/queries/notification';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw new Error('Unauthorized');
	}

	const userId = locals.user.id;

	// Get user extra info
	const [userExtra] = await db
		.select()
		.from(usersExtra)
		.where(eq(usersExtra.userId, userId))
		.limit(1);

	// Get user's created events
	const createdEvents = await db
		.select()
		.from(events)
		.where(eq(events.creatorId, userId))
		.orderBy(desc(events.createdAt))
		.limit(5);

	// Get events user has voted for
	const votedEventIds = await db
		.select({ eventId: eventVotes.eventId })
		.from(eventVotes)
		.where(eq(eventVotes.userId, userId));

	const votedEvents =
		votedEventIds.length > 0
			? await db
					.select()
					.from(events)
					.where(and(...votedEventIds.map((v) => eq(events.id, v.eventId!))))
					.limit(5)
			: [];

	// Get events user is attending
	const attendingEventIds = await db
		.select({ eventId: eventAttendees.eventId })
		.from(eventAttendees)
		.where(eq(eventAttendees.userId, userId));

	const attendingEvents =
		attendingEventIds.length > 0
			? await db
					.select()
					.from(events)
					.where(and(...attendingEventIds.map((a) => eq(events.id, a.eventId!))))
					.limit(5)
			: [];

	// Get user's donations
	const userDonations = await db
		.select()
		.from(donations)
		.where(eq(donations.donorId, userId))
		.orderBy(desc(donations.donatedAt))
		.limit(5);

	// Get notifications
	const userNotifications = await notificationService.getUserNotifications(userId, false);
	const unreadCount = await notificationService.getUnreadCount(userId);

	// Calculate stats
	const totalDonated = userDonations
		.filter((d) => d.status === 'completed')
		.reduce((sum, d) => sum + parseFloat(d.amount), 0);

	return {
		user: locals.user,
		userExtra: userExtra || null,
		stats: {
			eventsCreated: createdEvents.length,
			eventsVoted: votedEvents.length,
			eventsAttending: attendingEvents.length,
			totalDonated,
			unreadNotifications: unreadCount
		},
		createdEvents,
		votedEvents,
		attendingEvents,
		donations: userDonations,
		notifications: userNotifications.slice(0, 10)
	};
};
