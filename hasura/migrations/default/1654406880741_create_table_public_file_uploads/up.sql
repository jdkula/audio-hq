CREATE TABLE "public"."file_uploads" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "base64" text NOT NULL, PRIMARY KEY ("id") , UNIQUE ("id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;
