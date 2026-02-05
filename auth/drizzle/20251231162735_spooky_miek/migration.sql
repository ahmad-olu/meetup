ALTER TABLE "events" ADD COLUMN "currency" text DEFAULT 'NGN' NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "currency_symbol" text DEFAULT '₦' NOT NULL;