-- Backing table for the "Claim your shop" flow (draft / exploration).
-- Not yet applied to Supabase. Mirrors the moderation/shop_reports pattern:
-- claims land here as `pending` and are verified by hand before a listing is
-- handed over to an owner.

create table if not exists public.shop_claims (
  id             uuid primary key default gen_random_uuid(),
  shop_id        uuid not null references public.shops (uuid),
  contact_name   text not null,
  role           text,
  business_email text not null,
  phone          text,
  message        text,
  status         text not null default 'pending', -- pending | approved | rejected
  created_at     timestamptz not null default now()
);

create index if not exists shop_claims_shop_id_idx on public.shop_claims (shop_id);
create index if not exists shop_claims_status_idx on public.shop_claims (status);
