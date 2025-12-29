import { pgSchema, pgEnum, pgTable, text, uuid, serial, varchar, timestamp, bigint, boolean, numeric, date, time, integer, index, foreignKey, primaryKey, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const drizzle = pgSchema("drizzle");
export const role = pgEnum("role", ["member", "admin", "owner"])
export const userRole = pgEnum("user_role", ["user", "admin", "moderator"])
export const attendanceStatus = pgEnum("attendance_status", ["registered", "attended", "no-show"])
export const dayOfWeek = pgEnum("day_of_week", ["wednesday", "saturday"])
export const documentStatus = pgEnum("document_status", ["pending", "approved", "rejected"])
export const documentType = pgEnum("document_type", ["government_id", "address_proof", "selfie"])
export const donationStatus = pgEnum("donation_status", ["pending", "completed", "failed", "refunded"])
export const eventStatus = pgEnum("event_status", ["proposed", "approved", "cancelled", "completed"])
export const notificationType = pgEnum("notification_type", ["event_approved", "vote_threshold_met", "new_message", "event_reminder", "donation_received"])
export const organizerRole = pgEnum("organizer_role", ["creator", "co-organizer"])
export const reportReason = pgEnum("report_reason", ["fraud", "inappropriate", "spam", "safety_concern", "other"])
export const reportStatus = pgEnum("report_status", ["pending", "reviewed", "resolved"])
export const verificationStatus = pgEnum("verification_status", ["none", "pending", "approved", "rejected"])


export const drizzleMigrationsInDrizzle = drizzle.table("__drizzle_migrations", {
	id: serial().primaryKey(),
	hash: text().notNull(),
	createdAt: bigint("created_at", { mode: 'number' }),
});

export const account = pgTable("account", {
	id: text().primaryKey(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" } ),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at"),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
	scope: text(),
	password: text(),
	createdAt: timestamp("created_at").default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
});

export const chatMessages = pgTable("chat_messages", {
	id: uuid().defaultRandom().primaryKey(),
	eventId: uuid("event_id").references(() => events.id, { onDelete: "cascade" } ),
	userId: text("user_id").references(() => user.id, { onDelete: "cascade" } ),
	messageText: text("message_text").notNull(),
	sentAt: timestamp("sent_at").default(sql`now()`),
	isDeleted: boolean("is_deleted").default(false),
}, (table) => [
	index("idx_chat_event").using("btree", table.eventId.asc().nullsLast(), table.sentAt.asc().nullsLast()),
]);

export const donations = pgTable("donations", {
	id: uuid().defaultRandom().primaryKey(),
	eventId: uuid("event_id").references(() => events.id, { onDelete: "cascade" } ),
	donorId: text("donor_id").references(() => user.id),
	amount: numeric({ precision: 10, scale: 2 }).notNull(),
	stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
	stripeTransferId: varchar("stripe_transfer_id", { length: 255 }),
	status: donationStatus().default("pending"),
	donatedAt: timestamp("donated_at").default(sql`now()`),
	isAnonymous: boolean("is_anonymous").default(false),
}, (table) => [
	unique("donations_stripe_payment_intent_id_key").on(table.stripePaymentIntentId),]);

export const eventAttendees = pgTable("event_attendees", {
	id: uuid().defaultRandom().primaryKey(),
	eventId: uuid("event_id").references(() => events.id, { onDelete: "cascade" } ),
	userId: text("user_id").references(() => user.id, { onDelete: "cascade" } ),
	registeredAt: timestamp("registered_at").default(sql`now()`),
	attendanceStatus: attendanceStatus("attendance_status").default("registered"),
}, (table) => [
	index("idx_event_attendees_composite").using("btree", table.eventId.asc().nullsLast(), table.userId.asc().nullsLast()),
]);

export const eventCategories = pgTable("event_categories", {
	id: uuid().defaultRandom().primaryKey(),
	name: varchar({ length: 100 }).notNull(),
	slug: varchar({ length: 100 }).notNull(),
	description: text(),
	iconName: varchar("icon_name", { length: 50 }),
}, (table) => [
	unique("event_categories_slug_key").on(table.slug),]);

export const eventOrganizers = pgTable("event_organizers", {
	id: uuid().defaultRandom().primaryKey(),
	eventId: uuid("event_id").references(() => events.id, { onDelete: "cascade" } ),
	userId: text("user_id").references(() => user.id, { onDelete: "cascade" } ),
	role: organizerRole().default("co-organizer"),
	addedAt: timestamp("added_at").default(sql`now()`),
	addedBy: text("added_by").references(() => user.id),
}, (table) => [
	index("idx_event_organizers_composite").using("btree", table.eventId.asc().nullsLast(), table.userId.asc().nullsLast()),
]);

export const eventReports = pgTable("event_reports", {
	id: uuid().defaultRandom().primaryKey(),
	eventId: uuid("event_id").references(() => events.id, { onDelete: "cascade" } ),
	reporterId: text("reporter_id").references(() => user.id),
	reason: reportReason().notNull(),
	description: text(),
	reportedAt: timestamp("reported_at").default(sql`now()`),
	status: reportStatus().default("pending"),
});

export const eventVotes = pgTable("event_votes", {
	id: uuid().defaultRandom().primaryKey(),
	eventId: uuid("event_id").references(() => events.id, { onDelete: "cascade" } ),
	userId: text("user_id").references(() => user.id, { onDelete: "cascade" } ),
	votedAt: timestamp("voted_at").default(sql`now()`),
}, (table) => [
	index("idx_event_votes_composite").using("btree", table.eventId.asc().nullsLast(), table.userId.asc().nullsLast()),
]);

export const events = pgTable("events", {
	id: uuid().defaultRandom().primaryKey(),
	title: varchar({ length: 200 }).notNull(),
	description: text().notNull(),
	locationId: uuid("location_id").references(() => locations.id),
	categoryId: uuid("category_id").references(() => eventCategories.id),
	creatorId: text("creator_id").references(() => user.id, { onDelete: "cascade" } ),
	proposedDate: date("proposed_date").notNull(),
	dayOfWeek: dayOfWeek("day_of_week").notNull(),
	startTime: time("start_time").default('09:00:00'),
	endTime: time("end_time").default('17:00:00'),
	minVotesRequired: integer("min_votes_required").default(5),
	currentVotes: integer("current_votes").default(0),
	votingDeadline: timestamp("voting_deadline").notNull(),
	status: eventStatus().default("proposed"),
	requiresFunding: boolean("requires_funding").default(false),
	fundingGoal: numeric("funding_goal", { mode: 'number', precision: 10, scale: 2 }).default(0),
	currentFunding: numeric("current_funding", { mode: 'number', precision: 10, scale: 2 }).default(0),
	venueDetails: text("venue_details"),
	createdAt: timestamp("created_at").default(sql`now()`),
	updatedAt: timestamp("updated_at").default(sql`now()`),
}, (table) => [
	index("idx_events_date").using("btree", table.proposedDate.asc().nullsLast()),
	index("idx_events_location").using("btree", table.locationId.asc().nullsLast()),
	index("idx_events_status").using("btree", table.status.asc().nullsLast()),
]);

export const invitation = pgTable("invitation", {
	id: text().primaryKey(),
	organizationId: text("organization_id").notNull().references(() => organization.id, { onDelete: "cascade" } ),
	email: text().notNull(),
	role: text(),
	status: text().default("pending").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	inviterId: text("inviter_id").notNull().references(() => user.id, { onDelete: "cascade" } ),
});

export const locations = pgTable("locations", {
	id: uuid().defaultRandom().primaryKey(),
	country: varchar({ length: 100 }).notNull(),
	stateProvince: varchar("state_province", { length: 100 }),
	city: varchar({ length: 100 }),
	fullLocation: varchar("full_location", { length: 255 }),
	createdAt: timestamp("created_at").default(sql`now()`),
}, (table) => [
	index("idx_locations_country").using("btree", table.country.asc().nullsLast()),
	index("idx_locations_state").using("btree", table.stateProvince.asc().nullsLast()),
]);

export const member = pgTable("member", {
	id: text().primaryKey(),
	organizationId: text("organization_id").notNull().references(() => organization.id, { onDelete: "cascade" } ),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" } ),
	role: role().default("member").notNull(),
	createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const notifications = pgTable("notifications", {
	id: uuid().defaultRandom().primaryKey(),
	userId: text("user_id").references(() => user.id, { onDelete: "cascade" } ),
	eventId: uuid("event_id").references(() => events.id, { onDelete: "cascade" } ),
	type: notificationType().notNull(),
	message: text().notNull(),
	isRead: boolean("is_read").default(false),
	createdAt: timestamp("created_at").default(sql`now()`),
}, (table) => [
	index("idx_notifications_user").using("btree", table.userId.asc().nullsLast(), table.isRead.asc().nullsLast(), table.createdAt.asc().nullsLast()),
]);

export const organization = pgTable("organization", {
	id: text().primaryKey(),
	name: text().notNull(),
	slug: text(),
	logo: text(),
	createdAt: timestamp("created_at").default(sql`now()`).notNull(),
	metadata: text(),
}, (table) => [
	unique("organization_slug_key").on(table.slug),]);

export const session = pgTable("session", {
	id: text().primaryKey(),
	expiresAt: timestamp("expires_at").notNull(),
	token: text().notNull(),
	createdAt: timestamp("created_at").default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" } ),
	activeOrganizationId: text("active_organization_id"),
	impersonatedBy: text("impersonated_by"),
}, (table) => [
	unique("session_token_key").on(table.token),]);

export const user = pgTable("user", {
	id: text().primaryKey(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text(),
	role: userRole().default("user").notNull(),
	createdAt: timestamp("created_at").default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
	banned: boolean().default(false),
	banReason: text("ban_reason"),
	banExpires: timestamp("ban_expires"),
}, (table) => [
	unique("user_email_key").on(table.email),]);

export const usersExtra = pgTable("users_extra", {
	id: uuid().defaultRandom().primaryKey(),
	userId: text("user_id").references(() => user.id, { onDelete: "cascade" } ),
	bio: text(),
	updatedAt: timestamp("updated_at").default(sql`now()`),
	isVerified: boolean("is_verified").default(false),
	verificationSubmittedAt: timestamp("verification_submitted_at"),
	verificationStatus: verificationStatus("verification_status").default("none"),
	stripeAccountId: varchar("stripe_account_id", { length: 255 }),
	accountOnboardingComplete: boolean("account_onboarding_complete").default(false),
});

export const verification = pgTable("verification", {
	id: text().primaryKey(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
});

export const verificationDocuments = pgTable("verification_documents", {
	id: uuid().defaultRandom().primaryKey(),
	userId: text("user_id").references(() => user.id, { onDelete: "cascade" } ),
	documentType: documentType("document_type").notNull(),
	documentUrl: text("document_url").notNull(),
	submittedAt: timestamp("submitted_at").default(sql`now()`),
	reviewedAt: timestamp("reviewed_at"),
	reviewedBy: text("reviewed_by").references(() => user.id),
	status: documentStatus().default("pending"),
	rejectionReason: text("rejection_reason"),
});
