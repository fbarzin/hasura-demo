CREATE TABLE "app_db"."todo" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid (),
  "title" text NOT NULL,
  "description" text,
  "is_completed" boolean NOT NULL DEFAULT FALSE,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "user_id" uuid NOT NULL,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("user_id") REFERENCES "app_db"."user" ("id") ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE OR REPLACE FUNCTION "app_db"."set_current_timestamp_updated_at" ()
  RETURNS TRIGGER
  AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER "set_app_db_todo_updated_at"
  BEFORE UPDATE ON "app_db"."todo"
  FOR EACH ROW
  EXECUTE PROCEDURE "app_db"."set_current_timestamp_updated_at" ();

COMMENT ON TRIGGER "set_app_db_todo_updated_at" ON "app_db"."todo" IS 'trigger to set value of column "updated_at" to current timestamp on row update';

CREATE EXTENSION IF NOT EXISTS pgcrypto;

