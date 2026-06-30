-- Schema for the "Claim your shop" flow.
--
-- Apply by hand (no migration framework in this repo). Additive: creates one new
-- table with indexes and RLS. Claims land here as `pending` and are verified by
-- hand before a listing is handed over to an owner.
--
-- shop_claims — one row per ownership claim submitted via POST /api/shops/claim.
--
-- RLS: this table holds PII (contact_name, business_email, phone, message).
-- Anyone may INSERT a claim — the public form posts with the anon key — but there
-- is no SELECT/UPDATE/DELETE policy, so the anon role cannot read claims back.
-- Review claims with the service role (SQL editor / server), which bypasses RLS.
-- The API insert does not chain .select(), so it never needs read access to succeed.

CREATE TABLE IF NOT EXISTS shop_claims (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id        uuid NOT NULL REFERENCES shops(uuid),
  contact_name   text NOT NULL,
  role           text,
  business_email text NOT NULL,
  phone          text,
  message        text,
  status         text NOT NULL DEFAULT 'pending', -- pending | approved | rejected
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS shop_claims_shop_id_idx ON shop_claims(shop_id);
CREATE INDEX IF NOT EXISTS shop_claims_status_idx  ON shop_claims(status);

ALTER TABLE shop_claims ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Anyone can submit a claim" ON shop_claims FOR INSERT TO anon, authenticated WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
