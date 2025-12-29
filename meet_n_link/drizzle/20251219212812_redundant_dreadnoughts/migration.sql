-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE SCHEMA "drizzle";
--> statement-breakpoint
CREATE TYPE "role" AS ENUM('member', 'admin', 'owner');--> statement-breakpoint
CREATE TYPE "user_role" AS ENUM('user', 'admin', 'moderator');--> statement-breakpoint
CREATE TYPE "attendance_status" AS ENUM('registered', 'attended', 'no-show');--> statement-breakpoint
CREATE TYPE "day_of_week" AS ENUM('wednesday', 'saturday');--> statement-breakpoint
CREATE TYPE "document_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "document_type" AS ENUM('government_id', 'address_proof', 'selfie');--> statement-breakpoint
CREATE TYPE "donation_status" AS ENUM('pending', 'completed', 'failed', 'refunded');--> statement-breakpoint
CREATE TYPE "event_status" AS ENUM('proposed', 'approved', 'cancelled', 'completed');--> statement-breakpoint
CREATE TYPE "notification_type" AS ENUM('event_approved', 'vote_threshold_met', 'new_message', 'event_reminder', 'donation_received');--> statement-breakpoint
CREATE TYPE "organizer_role" AS ENUM('creator', 'co-organizer');--> statement-breakpoint
CREATE TYPE "report_reason" AS ENUM('fraud', 'inappropriate', 'spam', 'safety_concern', 'other');--> statement-breakpoint
CREATE TYPE "report_status" AS ENUM('pending', 'reviewed', 'resolved');--> statement-breakpoint
CREATE TYPE "verification_status" AS ENUM('none', 'pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "drizzle"."__drizzle_migrations" (
	"id" serial PRIMARY KEY,
	"hash" text NOT NULL,
	"created_at" bigint
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"event_id" uuid,
	"user_id" text,
	"message_text" text NOT NULL,
	"sent_at" timestamp DEFAULT now(),
	"is_deleted" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "donations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"event_id" uuid,
	"donor_id" text,
	"amount" numeric(10,2) NOT NULL,
	"stripe_payment_intent_id" varchar(255) CONSTRAINT "donations_stripe_payment_intent_id_key" UNIQUE,
	"stripe_transfer_id" varchar(255),
	"status" "donation_status" DEFAULT 'pending'::"donation_status",
	"donated_at" timestamp DEFAULT now(),
	"is_anonymous" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "event_attendees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"event_id" uuid,
	"user_id" text,
	"registered_at" timestamp DEFAULT now(),
	"attendance_status" "attendance_status" DEFAULT 'registered'::"attendance_status"
);
--> statement-breakpoint
CREATE TABLE "event_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL CONSTRAINT "event_categories_slug_key" UNIQUE,
	"description" text,
	"icon_name" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "event_organizers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"event_id" uuid,
	"user_id" text,
	"role" "organizer_role" DEFAULT 'co-organizer'::"organizer_role",
	"added_at" timestamp DEFAULT now(),
	"added_by" text
);
--> statement-breakpoint
CREATE TABLE "event_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"event_id" uuid,
	"reporter_id" text,
	"reason" "report_reason" NOT NULL,
	"description" text,
	"reported_at" timestamp DEFAULT now(),
	"status" "report_status" DEFAULT 'pending'::"report_status"
);
--> statement-breakpoint
CREATE TABLE "event_votes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"event_id" uuid,
	"user_id" text,
	"voted_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"location_id" uuid,
	"category_id" uuid,
	"creator_id" text,
	"proposed_date" date NOT NULL,
	"day_of_week" "day_of_week" NOT NULL,
	"start_time" time DEFAULT '09:00:00',
	"end_time" time DEFAULT '17:00:00',
	"min_votes_required" integer DEFAULT 5,
	"current_votes" integer DEFAULT 0,
	"voting_deadline" timestamp NOT NULL,
	"status" "event_status" DEFAULT 'proposed'::"event_status",
	"requires_funding" boolean DEFAULT false,
	"funding_goal" numeric(10,2) DEFAULT '0',
	"current_funding" numeric(10,2) DEFAULT '0',
	"venue_details" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "invitation" (
	"id" text PRIMARY KEY,
	"organization_id" text NOT NULL,
	"email" text NOT NULL,
	"role" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"inviter_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "locations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"country" varchar(100) NOT NULL,
	"state_province" varchar(100),
	"city" varchar(100),
	"full_location" varchar(255),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "member" (
	"id" text PRIMARY KEY,
	"organization_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" "role" DEFAULT 'member'::"role" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text,
	"event_id" uuid,
	"type" "notification_type" NOT NULL,
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "organization" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"slug" text CONSTRAINT "organization_slug_key" UNIQUE,
	"logo" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"metadata" text
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL CONSTRAINT "session_token_key" UNIQUE,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"active_organization_id" text
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"email" text NOT NULL CONSTRAINT "user_email_key" UNIQUE,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role" "user_role" DEFAULT 'user'::"user_role" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users_extra" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text,
	"bio" text,
	"updated_at" timestamp DEFAULT now(),
	"is_verified" boolean DEFAULT false,
	"verification_submitted_at" timestamp,
	"verification_status" "verification_status" DEFAULT 'none'::"verification_status",
	"stripe_account_id" varchar(255),
	"account_onboarding_complete" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text,
	"document_type" "document_type" NOT NULL,
	"document_url" text NOT NULL,
	"submitted_at" timestamp DEFAULT now(),
	"reviewed_at" timestamp,
	"reviewed_by" text,
	"status" "document_status" DEFAULT 'pending'::"document_status",
	"rejection_reason" text
);
--> statement-breakpoint
CREATE INDEX "idx_chat_event" ON "chat_messages" ("event_id","sent_at");--> statement-breakpoint
CREATE INDEX "idx_event_attendees_composite" ON "event_attendees" ("event_id","user_id");--> statement-breakpoint
CREATE INDEX "idx_event_organizers_composite" ON "event_organizers" ("event_id","user_id");--> statement-breakpoint
CREATE INDEX "idx_event_votes_composite" ON "event_votes" ("event_id","user_id");--> statement-breakpoint
CREATE INDEX "idx_events_date" ON "events" ("proposed_date");--> statement-breakpoint
CREATE INDEX "idx_events_location" ON "events" ("location_id");--> statement-breakpoint
CREATE INDEX "idx_events_status" ON "events" ("status");--> statement-breakpoint
CREATE INDEX "idx_locations_country" ON "locations" ("country");--> statement-breakpoint
CREATE INDEX "idx_locations_state" ON "locations" ("state_province");--> statement-breakpoint
CREATE INDEX "idx_notifications_user" ON "notifications" ("user_id","is_read","created_at");--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_inviter_id_user_id_fkey" FOREIGN KEY ("inviter_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_organization_id_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_organization_id_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_event_id_events_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "donations" ADD CONSTRAINT "donations_donor_id_user_id_fkey" FOREIGN KEY ("donor_id") REFERENCES "user"("id");--> statement-breakpoint
ALTER TABLE "donations" ADD CONSTRAINT "donations_event_id_events_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "event_attendees" ADD CONSTRAINT "event_attendees_event_id_events_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "event_attendees" ADD CONSTRAINT "event_attendees_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "event_organizers" ADD CONSTRAINT "event_organizers_added_by_user_id_fkey" FOREIGN KEY ("added_by") REFERENCES "user"("id");--> statement-breakpoint
ALTER TABLE "event_organizers" ADD CONSTRAINT "event_organizers_event_id_events_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "event_organizers" ADD CONSTRAINT "event_organizers_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "event_reports" ADD CONSTRAINT "event_reports_event_id_events_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "event_reports" ADD CONSTRAINT "event_reports_reporter_id_user_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "user"("id");--> statement-breakpoint
ALTER TABLE "event_votes" ADD CONSTRAINT "event_votes_event_id_events_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "event_votes" ADD CONSTRAINT "event_votes_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_category_id_event_categories_id_fkey" FOREIGN KEY ("category_id") REFERENCES "event_categories"("id");--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_creator_id_user_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_location_id_locations_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id");--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_event_id_events_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "users_extra" ADD CONSTRAINT "users_extra_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "verification_documents" ADD CONSTRAINT "verification_documents_reviewed_by_user_id_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "user"("id");--> statement-breakpoint
ALTER TABLE "verification_documents" ADD CONSTRAINT "verification_documents_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;
*/