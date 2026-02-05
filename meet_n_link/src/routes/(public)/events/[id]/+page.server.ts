import { error, fail } from '@sveltejs/kit';
import { eventService } from '$lib/server/queries/events';
import { db } from '$lib/db';
import { chatMessages, user } from '../../../../../drizzle/schema';
import { eq, desc } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	const event = await eventService.getEventById(params.id);

	if (!event) {
		throw error(404, 'Event not found');
	}

	// Get chat messages
	const messages = await db
		.select({
			message: chatMessages,
			user: user
		})
		.from(chatMessages)
		.innerJoin(user, eq(chatMessages.userId, user.id))
		.where(eq(chatMessages.eventId, params.id))
		.orderBy(desc(chatMessages.sentAt))
		.limit(50);

	// Check if current user has voted
	const hasVoted = event.votes.some((v) => v.userId === locals.user.id);

	// Check if current user is registered
	const isRegistered = event.attendees.some((a) => a.userId === locals.user.id);

	return {
		event,
		messages: messages.reverse(),
		hasVoted,
		isRegistered
	};
};

export const actions: Actions = {
	vote: async ({ params, locals }) => {
		if (!locals.user) {
			return fail(401, { error: 'Unauthorized' });
		}

		try {
			await eventService.voteForEvent(params.id, locals.user.id);
			return { success: true };
		} catch (error) {
			return fail(400, {
				error: error instanceof Error ? error.message : 'Failed to vote'
			});
		}
	},

	removeVote: async ({ params, locals }) => {
		if (!locals.user) {
			return fail(401, { error: 'Unauthorized' });
		}

		try {
			await eventService.removeVote(params.id, locals.user.id);
			return { success: true };
		} catch (error) {
			return fail(400, {
				error: error instanceof Error ? error.message : 'Failed to remove vote'
			});
		}
	},

	register: async ({ params, locals }) => {
		if (!locals.user) {
			return fail(401, { error: 'Unauthorized' });
		}

		try {
			await eventService.registerAttendance(params.id, locals.user.id);
			return { success: true };
		} catch (error) {
			return fail(400, {
				error: error instanceof Error ? error.message : 'Failed to register'
			});
		}
	},

	sendMessage: async ({ params, locals, request }) => {
		if (!locals.user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const messageText = formData.get('message') as string;

		if (!messageText || messageText.trim().length === 0) {
			return fail(400, { error: 'Message cannot be empty' });
		}

		try {
			await db.insert(chatMessages).values({
				eventId: params.id,
				userId: locals.user.id,
				messageText: messageText.trim()
			});

			return { success: true };
		} catch (error) {
			return fail(500, {
				error: error instanceof Error ? error.message : 'Failed to send message'
			});
		}
	}
};
