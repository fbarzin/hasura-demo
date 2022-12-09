CREATE TABLE "app_db"."user" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid (),
  "first_name" text NOT NULL,
  "last_name" text NOT NULL,
  "email" text NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("id")
);

COMMENT ON TABLE "app_db"."user" IS E'Stores information about users of the application';

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

CREATE TRIGGER "set_app_db_user_updated_at"
  BEFORE UPDATE ON "app_db"."user"
  FOR EACH ROW
  EXECUTE PROCEDURE "app_db"."set_current_timestamp_updated_at" ();

COMMENT ON TRIGGER "set_app_db_user_updated_at" ON "app_db"."user" IS 'trigger to set value of column "updated_at" to current timestamp on row update';

CREATE EXTENSION IF NOT EXISTS pgcrypto;

