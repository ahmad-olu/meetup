import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  pgEnum,
  integer,
  decimal,
  time,
  date,
  primaryKey,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { user } from "./auth-schema";

// Enums
export const verificationStatusEnum = pgEnum("verification_status", [
  "none",
  "pending",
  "approved",
  "rejected",
]);
export const documentTypeEnum = pgEnum("document_type", [
  "government_id",
  "address_proof",
  "selfie",
]);
export const documentStatusEnum = pgEnum("document_status", [
  "pending",
  "approved",
  "rejected",
]);
export const dayOfWeekEnum = pgEnum("day_of_week", ["wednesday", "saturday"]);
export const eventStatusEnum = pgEnum("event_status", [
  "proposed",
  "approved",
  "cancelled",
  "completed",
]);
export const organizerRoleEnum = pgEnum("organizer_role", [
  "creator",
  "co-organizer",
]);
export const donationStatusEnum = pgEnum("donation_status", [
  "pending",
  "completed",
  "failed",
  "refunded",
]);
export const attendanceStatusEnum = pgEnum("attendance_status", [
  "registered",
  "attended",
  "no-show",
]);
export const notificationTypeEnum = pgEnum("notification_type", [
  "event_approved",
  "vote_threshold_met",
  "new_message",
  "event_reminder",
  "donation_received",
]);
export const reportReasonEnum = pgEnum("report_reason", [
  "fraud",
  "inappropriate",
  "spam",
  "safety_concern",
  "other",
]);
export const reportStatusEnum = pgEnum("report_status", [
  "pending",
  "reviewed",
  "resolved",
]);

export const usersExtra = pgTable("users_extra", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
  bio: text("bio"),
  updatedAt: timestamp("updated_at").defaultNow(),
  isVerified: boolean("is_verified").default(false),
  verificationSubmittedAt: timestamp("verification_submitted_at"),
  verificationStatus: verificationStatusEnum("verification_status").default(
    "none",
  ),
  stripeAccountId: varchar("stripe_account_id", { length: 255 }),
  accountOnboardingComplete: boolean("account_onboarding_complete").default(
    false,
  ),
});

export const verificationDocuments = pgTable("verification_documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
  documentType: documentTypeEnum("document_type").notNull(),
  documentUrl: text("document_url").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: text("reviewed_by").references(() => user.id),
  status: documentStatusEnum("status").default("pending"),
  rejectionReason: text("rejection_reason"),
});

export const locations = pgTable(
  "locations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    country: varchar("country", { length: 100 }).notNull(),
    stateProvince: varchar("state_province", { length: 100 }),
    city: varchar("city", { length: 100 }),
    fullLocation: varchar("full_location", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("idx_locations_country").on(table.country),
    index("idx_locations_state").on(table.stateProvince),
  ],
);

export const eventCategories = pgTable("event_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  iconName: varchar("icon_name", { length: 50 }),
});

export const events = pgTable(
  "events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description").notNull(),
    locationId: uuid("location_id").references(() => locations.id),
    categoryId: uuid("category_id").references(() => eventCategories.id),
    creatorId: text("creator_id").references(() => user.id, {
      onDelete: "cascade",
    }),
    proposedDate: date("proposed_date").notNull(),
    dayOfWeek: dayOfWeekEnum("day_of_week").notNull(),
    startTime: time("start_time").default("09:00:00"),
    endTime: time("end_time").default("17:00:00"),
    minVotesRequired: integer("min_votes_required").default(5),
    currentVotes: integer("current_votes").default(0),
    votingDeadline: timestamp("voting_deadline").notNull(),
    status: eventStatusEnum("status").default("proposed"),
    requiresFunding: boolean("requires_funding").default(false),
    fundingGoal: decimal("funding_goal", { precision: 10, scale: 2 }).default(
      "0",
    ),
    currency: text("currency").notNull().default("NGN"),
    currencySymbol: text("currency_symbol").notNull().default("₦"),
    currentFunding: decimal("current_funding", {
      precision: 10,
      scale: 2,
    }).default("0"),
    venueDetails: text("venue_details"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("idx_events_location").on(table.locationId),
    index("idx_events_date").on(table.proposedDate),
    index("idx_events_status").on(table.status),
  ],
);

export const eventOrganizers = pgTable(
  "event_organizers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id").references(() => events.id, {
      onDelete: "cascade",
    }),
    userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
    role: organizerRoleEnum("role").default("co-organizer"),
    addedAt: timestamp("added_at").defaultNow(),
    addedBy: text("added_by").references(() => user.id),
  },
  (table) => [
    index("idx_event_organizers_composite").on(table.eventId, table.userId),
  ],
);

export const eventVotes = pgTable(
  "event_votes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id").references(() => events.id, {
      onDelete: "cascade",
    }),
    userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
    votedAt: timestamp("voted_at").defaultNow(),
  },
  (table) => [
    index("idx_event_votes_composite").on(table.eventId, table.userId),
  ],
);

export const donations = pgTable("donations", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id").references(() => events.id, {
    onDelete: "cascade",
  }),
  donorId: text("donor_id").references(() => user.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", {
    length: 255,
  }).unique(),
  stripeTransferId: varchar("stripe_transfer_id", { length: 255 }),
  status: donationStatusEnum("status").default("pending"),
  donatedAt: timestamp("donated_at").defaultNow(),
  isAnonymous: boolean("is_anonymous").default(false),
});

export const eventAttendees = pgTable(
  "event_attendees",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id").references(() => events.id, {
      onDelete: "cascade",
    }),
    userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
    registeredAt: timestamp("registered_at").defaultNow(),
    attendanceStatus:
      attendanceStatusEnum("attendance_status").default("registered"),
  },
  (table) => [
    index("idx_event_attendees_composite").on(table.eventId, table.userId),
  ],
);

export const chatMessages = pgTable(
  "chat_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id").references(() => events.id, {
      onDelete: "cascade",
    }),
    userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
    messageText: text("message_text").notNull(),
    sentAt: timestamp("sent_at").defaultNow(),
    isDeleted: boolean("is_deleted").default(false),
  },
  (table) => [index("idx_chat_event").on(table.eventId, table.sentAt)],
);

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
    eventId: uuid("event_id").references(() => events.id, {
      onDelete: "cascade",
    }),
    type: notificationTypeEnum("type").notNull(),
    message: text("message").notNull(),
    isRead: boolean("is_read").default(false),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("idx_notifications_user").on(
      table.userId,
      table.isRead,
      table.createdAt,
    ),
  ],
);

export const eventReports = pgTable("event_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id").references(() => events.id, {
    onDelete: "cascade",
  }),
  reporterId: text("reporter_id").references(() => user.id),
  reason: reportReasonEnum("reason").notNull(),
  description: text("description"),
  reportedAt: timestamp("reported_at").defaultNow(),
  status: reportStatusEnum("status").default("pending"),
});
