CREATE TABLE "banks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(512) NOT NULL,
	"speaking" varchar NOT NULL,
	"learning" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires" timestamp,
	"is_community_bank" boolean DEFAULT false NOT NULL,
	"bank_json" jsonb NOT NULL
);

CREATE TABLE "download_counts" (
	"bank_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "download_counts_bank_id_user_id_pk" PRIMARY KEY("bank_id","user_id")
);

ALTER TABLE "download_counts" ADD CONSTRAINT "download_counts_bank_id_banks_id_fk" FOREIGN KEY ("bank_id") REFERENCES "public"."banks"("id") ON DELETE cascade ON UPDATE no action;