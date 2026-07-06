-- Schema for the "Claim your listing" flow.
--
-- Apply by hand (no migration framework in this repo). Additive: creates one new
-- table with indexes and RLS. Claims land here as `pending` and are verified by
-- hand before a listing is handed over to an owner.
--
-- claims — one row per ownership claim submitted via POST /api/shops/claim.
--
-- A claim targets exactly one of a shop, a company, or a roaster. Ownership rolls
-- up the company tree: a company owns its shops and its roaster, so the claim page
-- resolves a company-owned shop or roaster to the company and claims company_id.
-- Only a company-less shop lands as shop_id, only a company-less roaster as
-- roaster_id. The CHECK enforces exactly one target. Note a shop's roaster_id is
-- "serves this coffee", not ownership, so a roaster claim never reaches those shops.
--
-- RLS: this table holds PII (contact_name, business_email, phone, social_media,
-- message).
-- Anyone may INSERT a claim — the public form posts with the anon key — but there
-- is no SELECT/UPDATE/DELETE policy, so the anon role cannot read claims back.
-- Review claims with the service role (SQL editor / server), which bypasses RLS.
-- The API insert does not chain .select(), so it never needs read access to succeed.

CREATE TABLE IF NOT EXISTS claims (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id        uuid REFERENCES shops(uuid),
  company_id     uuid REFERENCES companies(id),
  roaster_id     uuid REFERENCES roaster(id),
  contact_name   text NOT NULL,
  role           text,
  business_email text NOT NULL,
  phone          text,
  social_media   text,
  message        text,
  status         text NOT NULL DEFAULT 'pending', -- pending | approved | rejected
  created_at     timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT claims_one_target CHECK (num_nonnulls(shop_id, company_id, roaster_id) = 1)
);

CREATE INDEX IF NOT EXISTS claims_shop_id_idx    ON claims(shop_id);
CREATE INDEX IF NOT EXISTS claims_company_id_idx ON claims(company_id);
CREATE INDEX IF NOT EXISTS claims_roaster_id_idx ON claims(roaster_id);
CREATE INDEX IF NOT EXISTS claims_status_idx     ON claims(status);

ALTER TABLE claims ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Anyone can submit a claim" ON claims FOR INSERT TO anon, authenticated WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
