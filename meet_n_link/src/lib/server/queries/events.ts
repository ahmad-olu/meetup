import { db } from '../../db';
import {
	events,
	eventVotes,
	eventOrganizers,
	donations,
	eventAttendees,
	locations,
	eventCategories
} from '../../../../drizzle/schema';
import { eq, and, sql, gte, lte, desc } from 'drizzle-orm';
import type { PaginationParams } from '../utils';
import { withPagination } from '../utils';

export interface CreateEventParams {
	title: string;
	description: string;
	locationId: string;
	categoryId: string;
	creatorId: string;
	proposedDate: Date;
	dayOfWeek: 'wednesday' | 'saturday';
	startTime?: string;
	endTime?: string;
	minVotesRequired?: number;
	votingDeadline: Date;
	requiresFunding: boolean;
	fundingGoal?: string;
	currency?: string;
	currencySymbol?: string;
	venueDetails?: string;
}

export interface EventFilters {
	status?: 'proposed' | 'approved' | 'cancelled' | 'completed';
	locationId?: string;
	categoryId?: string;
	creatorId?: string;
	requiresFunding?: boolean;
	startDate?: Date;
	endDate?: Date;
}

export class EventService {
	/**
	 * Create a new event
	 */
	async createEvent(params: CreateEventParams) {
		return await db.transaction(async (tx) => {
			const [event] = await tx
				.insert(events)
				.values({
					...params,
					status: 'proposed',
					currentVotes: 0,
					currentFunding: '0',
					fundingGoal: params.fundingGoal || '0',
					currency: params.currency || 'NGN',
					currencySymbol: params.currencySymbol || '₦'
				})
				.returning();

			// Add creator as organizer
			await tx.insert(eventOrganizers).values({
				eventId: event.id,
				userId: params.creatorId,
				role: 'creator',
				addedBy: params.creatorId
			});

			return event;
		});
	}

	/**
	 * Get events with filters and pagination
	 */
	async getEvents(filters: EventFilters, pagination: PaginationParams) {
		let query = db
			.select({
				event: events,
				location: locations,
				category: eventCategories
			})
			.from(events)
			.leftJoin(locations, eq(events.locationId, locations.id))
			.leftJoin(eventCategories, eq(events.categoryId, eventCategories.id))
			.$dynamic();

		const conditions = [];

		if (filters.status) {
			conditions.push(eq(events.status, filters.status));
		}
		if (filters.locationId) {
			conditions.push(eq(events.locationId, filters.locationId));
		}
		if (filters.categoryId) {
			conditions.push(eq(events.categoryId, filters.categoryId));
		}
		if (filters.creatorId) {
			conditions.push(eq(events.creatorId, filters.creatorId));
		}
		if (filters.requiresFunding !== undefined) {
			conditions.push(eq(events.requiresFunding, filters.requiresFunding));
		}
		if (filters.startDate) {
			conditions.push(gte(events.proposedDate, filters.startDate.toLocaleDateString()));
		}
		if (filters.endDate) {
			conditions.push(lte(events.proposedDate, filters.endDate.toLocaleDateString()));
		}

		if (conditions.length > 0) {
			query = query.where(and(...conditions));
		}

		query = query.orderBy(desc(events.createdAt));

		return await withPagination(query, pagination);
	}

	/**
	 * Vote for an event
	 */
	async voteForEvent(eventId: string, userId: string) {
		return await db.transaction(async (tx) => {
			// Check if already voted
			const existingVote = await tx
				.select()
				.from(eventVotes)
				.where(and(eq(eventVotes.eventId, eventId), eq(eventVotes.userId, userId)))
				.limit(1);

			if (existingVote.length > 0) {
				throw new Error('Already voted for this event');
			}

			// Add vote
			await tx.insert(eventVotes).values({
				eventId,
				userId
			});

			// Increment vote count
			const [updatedEvent] = await tx
				.update(events)
				.set({
					currentVotes: sql`${events.currentVotes} + 1`,
					updatedAt: new Date()
				})
				.where(eq(events.id, eventId))
				.returning();

			// Check if threshold met and auto-approve
			if (
				(updatedEvent?.currentVotes ?? 0) >= (updatedEvent?.minVotesRequired ?? 0) &&
				updatedEvent.status === 'proposed'
			) {
				await tx.update(events).set({ status: 'approved' }).where(eq(events.id, eventId));
			}

			return updatedEvent;
		});
	}

	/**
	 * Remove vote from an event
	 */
	async removeVote(eventId: string, userId: string) {
		return await db.transaction(async (tx) => {
			await tx
				.delete(eventVotes)
				.where(and(eq(eventVotes.eventId, eventId), eq(eventVotes.userId, userId)));

			await tx
				.update(events)
				.set({
					currentVotes: sql`${events.currentVotes} - 1`,
					updatedAt: new Date()
				})
				.where(eq(events.id, eventId));
		});
	}

	/**
	 * Make a donation to an event
	 */
	async createDonation(params: {
		eventId: string;
		donorId: string;
		amount: string;
		stripePaymentIntentId: string;
		isAnonymous?: boolean;
	}) {
		return await db.transaction(async (tx) => {
			const [donation] = await tx
				.insert(donations)
				.values({
					...params,
					status: 'pending',
					isAnonymous: params.isAnonymous || false
				})
				.returning();

			return donation;
		});
	}

	/**
	 * Complete a donation and update event funding
	 */
	async completeDonation(donationId: string, stripeTransferId?: string) {
		return await db.transaction(async (tx) => {
			const [donation] = await tx
				.update(donations)
				.set({
					status: 'completed',
					stripeTransferId
				})
				.where(eq(donations.id, donationId))
				.returning();

			// Update event funding
			await tx
				.update(events)
				.set({
					currentFunding: sql`${events.currentFunding} + ${donation.amount}`
				})
				.where(eq(events.id, donation.eventId!));

			return donation;
		});
	}

	/**
	 * Register attendance for an event
	 */
	async registerAttendance(eventId: string, userId: string) {
		const [attendee] = await db
			.insert(eventAttendees)
			.values({
				eventId,
				userId,
				attendanceStatus: 'registered'
			})
			.returning();

		return attendee;
	}

	/**
	 * Mark attendance
	 */
	async markAttended(eventId: string, userId: string) {
		return await db
			.update(eventAttendees)
			.set({ attendanceStatus: 'attended' })
			.where(and(eq(eventAttendees.eventId, eventId), eq(eventAttendees.userId, userId)));
	}

	/**
	 * Get event details with all relationships
	 */
	async getEventById(eventId: string) {
		const [event] = await db
			.select({
				event: events,
				location: locations,
				category: eventCategories
			})
			.from(events)
			.leftJoin(locations, eq(events.locationId, locations.id))
			.leftJoin(eventCategories, eq(events.categoryId, eventCategories.id))
			.where(eq(events.id, eventId))
			.limit(1);

		if (!event) return null;

		const [organizers, votes, donationsList, attendees] = await Promise.all([
			db.select().from(eventOrganizers).where(eq(eventOrganizers.eventId, eventId)),
			db.select().from(eventVotes).where(eq(eventVotes.eventId, eventId)),
			db.select().from(donations).where(eq(donations.eventId, eventId)),
			db.select().from(eventAttendees).where(eq(eventAttendees.eventId, eventId))
		]);

		return {
			...event,
			organizers,
			votes,
			donations: donationsList,
			attendees
		};
	}
}

export const eventService = new EventService();
