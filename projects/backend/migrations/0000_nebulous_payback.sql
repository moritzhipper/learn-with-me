CREATE TABLE "banks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"speaking" varchar(256) NOT NULL,
	"learning" varchar(256) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"lastDownloadAt" timestamp,
	"ttl" timestamp,
	"bankJson" jsonb NOT NULL,
	"downloadCount" integer DEFAULT 0 NOT NULL
);
