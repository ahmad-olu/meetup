import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	account: {
		user: r.one.user({
			from: r.account.userId,
			to: r.user.id
		}),
	},
	user: {
		accounts: r.many.account(),
		eventsViaChatMessages: r.many.events({
			alias: "events_id_user_id_via_chatMessages"
		}),
		eventsViaDonations: r.many.events({
			from: r.user.id.through(r.donations.donorId),
			to: r.events.id.through(r.donations.eventId),
			alias: "user_id_events_id_via_donations"
		}),
		eventsViaEventAttendees: r.many.events({
			alias: "events_id_user_id_via_eventAttendees"
		}),
		eventOrganizersAddedBy: r.many.eventOrganizers({
			alias: "eventOrganizers_addedBy_user_id"
		}),
		eventOrganizersUserId: r.many.eventOrganizers({
			alias: "eventOrganizers_userId_user_id"
		}),
		eventsViaEventReports: r.many.events({
			alias: "events_id_user_id_via_eventReports"
		}),
		eventsViaEventVotes: r.many.events({
			alias: "events_id_user_id_via_eventVotes"
		}),
		eventsCreatorId: r.many.events({
			alias: "events_creatorId_user_id"
		}),
		organizationsViaInvitation: r.many.organization({
			from: r.user.id.through(r.invitation.inviterId),
			to: r.organization.id.through(r.invitation.organizationId),
			alias: "user_id_organization_id_via_invitation"
		}),
		organizationsViaMember: r.many.organization({
			alias: "organization_id_user_id_via_member"
		}),
		eventsViaNotifications: r.many.events({
			alias: "events_id_user_id_via_notifications"
		}),
		sessions: r.many.session(),
		usersExtras: r.many.usersExtra(),
	},
	events: {
		usersViaChatMessages: r.many.user({
			from: r.events.id.through(r.chatMessages.eventId),
			to: r.user.id.through(r.chatMessages.userId),
			alias: "events_id_user_id_via_chatMessages"
		}),
		usersViaDonations: r.many.user({
			alias: "user_id_events_id_via_donations"
		}),
		usersViaEventAttendees: r.many.user({
			from: r.events.id.through(r.eventAttendees.eventId),
			to: r.user.id.through(r.eventAttendees.userId),
			alias: "events_id_user_id_via_eventAttendees"
		}),
		eventOrganizers: r.many.eventOrganizers(),
		usersViaEventReports: r.many.user({
			from: r.events.id.through(r.eventReports.eventId),
			to: r.user.id.through(r.eventReports.reporterId),
			alias: "events_id_user_id_via_eventReports"
		}),
		usersViaEventVotes: r.many.user({
			from: r.events.id.through(r.eventVotes.eventId),
			to: r.user.id.through(r.eventVotes.userId),
			alias: "events_id_user_id_via_eventVotes"
		}),
		eventCategory: r.one.eventCategories({
			from: r.events.categoryId,
			to: r.eventCategories.id
		}),
		user: r.one.user({
			from: r.events.creatorId,
			to: r.user.id,
			alias: "events_creatorId_user_id"
		}),
		location: r.one.locations({
			from: r.events.locationId,
			to: r.locations.id
		}),
		usersViaNotifications: r.many.user({
			from: r.events.id.through(r.notifications.eventId),
			to: r.user.id.through(r.notifications.userId),
			alias: "events_id_user_id_via_notifications"
		}),
	},
	eventOrganizers: {
		userAddedBy: r.one.user({
			from: r.eventOrganizers.addedBy,
			to: r.user.id,
			alias: "eventOrganizers_addedBy_user_id"
		}),
		event: r.one.events({
			from: r.eventOrganizers.eventId,
			to: r.events.id
		}),
		userUserId: r.one.user({
			from: r.eventOrganizers.userId,
			to: r.user.id,
			alias: "eventOrganizers_userId_user_id"
		}),
	},
	eventCategories: {
		events: r.many.events(),
	},
	locations: {
		events: r.many.events(),
	},
	organization: {
		usersViaInvitation: r.many.user({
			alias: "user_id_organization_id_via_invitation"
		}),
		usersViaMember: r.many.user({
			from: r.organization.id.through(r.member.organizationId),
			to: r.user.id.through(r.member.userId),
			alias: "organization_id_user_id_via_member"
		}),
	},
	session: {
		user: r.one.user({
			from: r.session.userId,
			to: r.user.id
		}),
	},
	usersExtra: {
		user: r.one.user({
			from: r.usersExtra.userId,
			to: r.user.id
		}),
	},
}))