import { db } from '../../db';
import { notifications } from '../../../../drizzle/schema';
import { eq, and, desc } from 'drizzle-orm';

export type NotificationType =
	| 'event_approved'
	| 'vote_threshold_met'
	| 'new_message'
	| 'event_reminder'
	| 'donation_received';

export interface CreateNotificationParams {
	userId: string;
	eventId?: string;
	type: NotificationType;
	message: string;
}

export class NotificationService {
	/**
	 * Create a notification
	 */
	async create(params: CreateNotificationParams) {
		const [notification] = await db
			.insert(notifications)
			.values({
				...params,
				isRead: false
			})
			.returning();

		return notification;
	}

	/**
	 * Get user notifications
	 */
	async getUserNotifications(userId: string, unreadOnly = false) {
		let query = db.select().from(notifications).where(eq(notifications.userId, userId)).$dynamic();

		if (unreadOnly) {
			query = query.where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
		}

		return await query.orderBy(desc(notifications.createdAt));
	}

	/**
	 * Mark notification as read
	 */
	async markAsRead(notificationId: string, userId: string) {
		return await db
			.update(notifications)
			.set({ isRead: true })
			.where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId)));
	}

	/**
	 * Mark all notifications as read for a user
	 */
	async markAllAsRead(userId: string) {
		return await db
			.update(notifications)
			.set({ isRead: true })
			.where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
	}

	/**
	 * Get unread count
	 */
	async getUnreadCount(userId: string) {
		const result = await db
			.select()
			.from(notifications)
			.where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));

		return result.length;
	}

	/**
	 * Notify event approval
	 */
	async notifyEventApproved(eventId: string, creatorId: string, eventTitle: string) {
		return await this.create({
			userId: creatorId,
			eventId,
			type: 'event_approved',
			message: `Your event "${eventTitle}" has been approved!`
		});
	}

	/**
	 * Notify vote threshold met
	 */
	async notifyVoteThresholdMet(eventId: string, creatorId: string, eventTitle: string) {
		return await this.create({
			userId: creatorId,
			eventId,
			type: 'vote_threshold_met',
			message: `Your event "${eventTitle}" has reached the required votes!`
		});
	}

	/**
	 * Notify donation received
	 */
	async notifyDonationReceived(
		eventId: string,
		creatorId: string,
		amount: string,
		currency: string
	) {
		return await this.create({
			userId: creatorId,
			eventId,
			type: 'donation_received',
			message: `You received a donation of ${currency}${amount}!`
		});
	}
}

export const notificationService = new NotificationService();
