CREATE TABLE "event_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"type" varchar(255) NOT NULL,
	"data" json
);
