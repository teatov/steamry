CREATE TABLE "results" (
	"daily_id" integer NOT NULL,
	"ip_hashed" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"correct_guesses" integer NOT NULL,
	"guesses" json NOT NULL,
	CONSTRAINT "results_daily_id_ip_hashed_pk" PRIMARY KEY("daily_id","ip_hashed")
);
--> statement-breakpoint
ALTER TABLE "games" DROP CONSTRAINT "games_daily_id_appid_pk";--> statement-breakpoint
ALTER TABLE "event_logs" ALTER COLUMN "data" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_daily_id_round_appid_pk" PRIMARY KEY("daily_id","round","appid");--> statement-breakpoint
ALTER TABLE "results" ADD CONSTRAINT "results_daily_id_dailies_id_fk" FOREIGN KEY ("daily_id") REFERENCES "public"."dailies"("id") ON DELETE cascade ON UPDATE cascade;