import { defineRelations } from 'drizzle-orm';
import {
	user,
	verificationDocuments,
	locations,
	eventCategories,
	events,
	eventOrganizers,
	eventVotes,
	donations,
	eventAttendees,
	chatMessages,
	notifications,
	eventReports,
	usersExtra
} from '../../drizzle/schema';

export const relations = defineRelations(
	{
		user,
		usersExtra,
		verificationDocuments,
		locations,
		eventCategories,
		events,
		eventOrganizers,
		eventVotes,
		donations,
		eventAttendees,
		chatMessages,
		notifications,
		eventReports
	},
	(r) => ({
		user: {
			verificationDocuments: r.many.verificationDocuments(),
			createdEvents: r.many.events({
				alias: 'creator'
			}),
			userExtra: r.one.usersExtra({
				from: r.user.id,
				to: r.usersExtra.userId
			}),
			eventOrganizers: r.many.eventOrganizers(),
			eventVotes: r.many.eventVotes(),
			donations: r.many.donations(),
			eventAttendees: r.many.eventAttendees(),
			chatMessages: r.many.chatMessages(),
			notifications: r.many.notifications(),
			reportedEvents: r.many.eventReports({
				alias: 'reporter'
			}),
			reviewedDocuments: r.many.verificationDocuments({
				alias: 'reviewer'
			})
		},
		verificationDocuments: {
			user: r.one.user({
				from: r.verificationDocuments.userId,
				to: r.user.id
			}),
			reviewer: r.one.user({
				from: r.verificationDocuments.reviewedBy,
				to: r.user.id,
				alias: 'reviewer'
			})
		},
		locations: {
			events: r.many.events()
		},
		eventCategories: {
			events: r.many.events()
		},
		events: {
			location: r.one.locations({
				from: r.events.locationId,
				to: r.locations.id
			}),
			category: r.one.eventCategories({
				from: r.events.categoryId,
				to: r.eventCategories.id
			}),
			creator: r.one.user({
				from: r.events.creatorId,
				to: r.user.id,
				alias: 'creator'
			}),
			organizers: r.many.eventOrganizers(),
			votes: r.many.eventVotes(),
			donations: r.many.donations(),
			attendees: r.many.eventAttendees(),
			chatMessages: r.many.chatMessages(),
			notifications: r.many.notifications(),
			reports: r.many.eventReports()
		},
		eventOrganizers: {
			event: r.one.events({
				from: r.eventOrganizers.eventId,
				to: r.events.id
			}),
			user: r.one.user({
				from: r.eventOrganizers.userId,
				to: r.user.id
			}),
			addedByUser: r.one.user({
				from: r.eventOrganizers.addedBy,
				to: r.user.id,
				alias: 'addedBy'
			})
		},
		eventVotes: {
			event: r.one.events({
				from: r.eventVotes.eventId,
				to: r.events.id
			}),
			user: r.one.user({
				from: r.eventVotes.userId,
				to: r.user.id
			})
		},
		donations: {
			event: r.one.events({
				from: r.donations.eventId,
				to: r.events.id
			}),
			donor: r.one.user({
				from: r.donations.donorId,
				to: r.user.id
			})
		},
		eventAttendees: {
			event: r.one.events({
				from: r.eventAttendees.eventId,
				to: r.events.id
			}),
			user: r.one.user({
				from: r.eventAttendees.userId,
				to: r.user.id
			})
		},
		chatMessages: {
			event: r.one.events({
				from: r.chatMessages.eventId,
				to: r.events.id
			}),
			user: r.one.user({
				from: r.chatMessages.userId,
				to: r.user.id
			})
		},
		notifications: {
			user: r.one.user({
				from: r.notifications.userId,
				to: r.user.id
			}),
			event: r.one.events({
				from: r.notifications.eventId,
				to: r.events.id
			})
		},
		eventReports: {
			event: r.one.events({
				from: r.eventReports.eventId,
				to: r.events.id
			}),
			reporter: r.one.user({
				from: r.eventReports.reporterId,
				to: r.user.id,
				alias: 'reporter'
			})
		}
	})
);

// =========================>

// export const organizationRelations = relations(organization, ({ many }) => ({
// 	members: many(member)
// }));

// export const memberRelations = relations(member, ({ one }) => ({
// 	organization: one(organization, {
// 		fields: [member.organizationId],
// 		references: [organization.id]
// 	}),
// 	user: one(user, {
// 		fields: [member.userId],
// 		references: [user.id]
// 	})
// }));
