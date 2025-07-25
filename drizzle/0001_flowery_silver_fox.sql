ALTER TABLE "user" ADD COLUMN "ntfy_topic" text;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_ntfyTopic_unique" UNIQUE("ntfy_topic");