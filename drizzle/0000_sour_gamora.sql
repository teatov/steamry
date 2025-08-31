CREATE TABLE "dailies" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	CONSTRAINT "dailies_date_unique" UNIQUE("date")
);
--> statement-breakpoint
CREATE TABLE "games" (
	"daily_id" integer NOT NULL,
	"round" integer NOT NULL,
	"appid" integer NOT NULL,
	"name" text NOT NULL,
	"reviews_positive" integer NOT NULL,
	"reviews_negative" integer NOT NULL,
	"description" text NOT NULL,
	"price" text,
	"release_date" text NOT NULL,
	"header_image" text NOT NULL,
	"developers" json NOT NULL,
	"publishers" json NOT NULL,
	"categories" json NOT NULL,
	"genres" json NOT NULL,
	"screenshots" json NOT NULL,
	"trailers" json NOT NULL,
	"content_descriptors" json NOT NULL,
	CONSTRAINT "games_daily_id_appid_pk" PRIMARY KEY("daily_id","appid")
);
--> statement-breakpoint
CREATE TABLE "steam_apps" (
	"id" serial PRIMARY KEY NOT NULL,
	"appid" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "steam_apps_appid_unique" UNIQUE("appid")
);
--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_daily_id_dailies_id_fk" FOREIGN KEY ("daily_id") REFERENCES "public"."dailies"("id") ON DELETE cascade ON UPDATE cascade;