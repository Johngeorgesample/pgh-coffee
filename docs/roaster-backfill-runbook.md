# Roaster Backfill — Pass 2 Runbook

Derived from `docs/roaster-backfill-findings.md`. This is the **action** document: UPDATE statements (bucket A) and `/add-roaster` invocations + follow-up UPDATEs (bucket B). Buckets C and N get no action.

**Join key:** `shops.uuid`. **FK:** `shops.roaster_id → roaster.id`.

Every UPDATE is uuid-scoped and idempotent (guarded with `roaster_id IS NULL` so re-running can't clobber a value set in the meantime).

---

## Phase 1 — Bucket A, high/med confidence (shop-stated or strong evidence)

Safe to apply directly — roaster already exists, `roaster.id` known.

```sql
-- Commonplace Coffee (5902c75b-a894-4390-9c6b-dc96afcd4132)
UPDATE shops SET roaster_id = '5902c75b-a894-4390-9c6b-dc96afcd4132' WHERE uuid = 'd2aafc02-2f93-4e08-8651-34cfe925f9a6' AND roaster_id IS NULL; -- Commonplace/Shadyside (step0)
UPDATE shops SET roaster_id = '5902c75b-a894-4390-9c6b-dc96afcd4132' WHERE uuid = 'eb8724b6-9ddd-41b0-b082-39e496d92096' AND roaster_id IS NULL; -- Divvy Coffee & Buns
UPDATE shops SET roaster_id = '5902c75b-a894-4390-9c6b-dc96afcd4132' WHERE uuid = '60eb6a2b-b1f4-4079-aa19-1cbb7e234ec7' AND roaster_id IS NULL; -- Dragon's Roast Cafe
UPDATE shops SET roaster_id = '5902c75b-a894-4390-9c6b-dc96afcd4132' WHERE uuid = '5cfeaaaf-3990-4c56-bfcb-032edaa7f58a' AND roaster_id IS NULL; -- West View Brew
UPDATE shops SET roaster_id = '5902c75b-a894-4390-9c6b-dc96afcd4132' WHERE uuid = '99b375a1-5e0d-493e-afbf-4b356cf626b6' AND roaster_id IS NULL; -- White Whale Bookstore
UPDATE shops SET roaster_id = '5902c75b-a894-4390-9c6b-dc96afcd4132' WHERE uuid = 'e7490bbf-ba3e-447c-b077-7a8927521075' AND roaster_id IS NULL; -- Everyday Cafe
UPDATE shops SET roaster_id = '5902c75b-a894-4390-9c6b-dc96afcd4132' WHERE uuid = 'e7a22221-fff9-4ad3-97bd-639efbf81e51' AND roaster_id IS NULL; -- Ka-Fair
UPDATE shops SET roaster_id = '5902c75b-a894-4390-9c6b-dc96afcd4132' WHERE uuid = '1e1bdead-34b3-4411-a356-4e62add472dd' AND roaster_id IS NULL; -- Caffe d'Amore (likely, confirm)
UPDATE shops SET roaster_id = '5902c75b-a894-4390-9c6b-dc96afcd4132' WHERE uuid = 'fc3df462-b25e-49da-9e52-84be9e9c913a' AND roaster_id IS NULL; -- The Abbey (likely, confirm)

-- The Coffee Tree Roasters (14f0ce88-b5c1-4185-97dd-7b5ed89dbd85)
UPDATE shops SET roaster_id = '14f0ce88-b5c1-4185-97dd-7b5ed89dbd85' WHERE uuid = '2ee74f65-ff06-464c-90d3-ff928bd72988' AND roaster_id IS NULL; -- Coffee Tree/O'Hara (step0)
UPDATE shops SET roaster_id = '14f0ce88-b5c1-4185-97dd-7b5ed89dbd85' WHERE uuid = '1ccd9edf-fb8a-4bad-850d-016d7f717178' AND roaster_id IS NULL; -- Cares CommuniTEA

-- Steel Cup Coffee Roasters (7aa60f42-f740-4638-8085-55cca08e4dc8)
UPDATE shops SET roaster_id = '7aa60f42-f740-4638-8085-55cca08e4dc8' WHERE uuid = '0960b600-b973-4859-82b9-e415c5bc6595' AND roaster_id IS NULL; -- Steel Cup/New Kensington (step0)

-- Nicholas Coffee & Tea Co. (b18c1162-3b4b-4040-a929-fa1df56d7d18)
UPDATE shops SET roaster_id = 'b18c1162-3b4b-4040-a929-fa1df56d7d18' WHERE uuid = 'a3dae785-5218-42c9-ac47-7421b079c4a9' AND roaster_id IS NULL; -- ABC Coffee Company

-- 19 Coffee (feb064ee-9f9b-4afa-b985-c9390be074cb)
UPDATE shops SET roaster_id = 'feb064ee-9f9b-4afa-b985-c9390be074cb' WHERE uuid = 'c1d93506-5250-4e6d-a0aa-ffad851fc379' AND roaster_id IS NULL; -- Biddle's Escape
UPDATE shops SET roaster_id = 'feb064ee-9f9b-4afa-b985-c9390be074cb' WHERE uuid = '811d9be0-72d8-4297-90c7-66232e385f96' AND roaster_id IS NULL; -- Café 412
UPDATE shops SET roaster_id = 'feb064ee-9f9b-4afa-b985-c9390be074cb' WHERE uuid = '4f945fd9-faf1-49f1-933a-5acf5070447b' AND roaster_id IS NULL; -- California Coffee Bar
UPDATE shops SET roaster_id = 'feb064ee-9f9b-4afa-b985-c9390be074cb' WHERE uuid = '1f3c5279-f73b-4526-afbf-e1c809d4fa61' AND roaster_id IS NULL; -- Orbis Caffe (flagship, confirm)
UPDATE shops SET roaster_id = 'feb064ee-9f9b-4afa-b985-c9390be074cb' WHERE uuid = '9ffac27f-91e7-4137-a494-67509300c204' AND roaster_id IS NULL; -- Potomac Station
UPDATE shops SET roaster_id = 'feb064ee-9f9b-4afa-b985-c9390be074cb' WHERE uuid = '605caff1-3f8e-4492-9668-00f3251a81f8' AND roaster_id IS NULL; -- Yinz/Central Northside
UPDATE shops SET roaster_id = 'feb064ee-9f9b-4afa-b985-c9390be074cb' WHERE uuid = 'eb5d9630-df29-47da-bb20-d5aef18af118' AND roaster_id IS NULL; -- Yinz/Downtown
UPDATE shops SET roaster_id = 'feb064ee-9f9b-4afa-b985-c9390be074cb' WHERE uuid = 'cf54c04f-2a40-4b96-a04d-69d2aac3022d' AND roaster_id IS NULL; -- Yinz/North Oakland
UPDATE shops SET roaster_id = 'feb064ee-9f9b-4afa-b985-c9390be074cb' WHERE uuid = '00dba2e1-2ec2-4cfb-8b2a-d0b7b936fb63' AND roaster_id IS NULL; -- Yinz/Friendship
UPDATE shops SET roaster_id = 'feb064ee-9f9b-4afa-b985-c9390be074cb' WHERE uuid = '5c9daa19-2472-46c7-b06c-4730e25b6a42' AND roaster_id IS NULL; -- Yinz/South Shore
UPDATE shops SET roaster_id = 'feb064ee-9f9b-4afa-b985-c9390be074cb' WHERE uuid = '0f4f5ebe-23ee-4216-b9ea-08eb81b06ad0' AND roaster_id IS NULL; -- Yinz/Downtown
UPDATE shops SET roaster_id = 'feb064ee-9f9b-4afa-b985-c9390be074cb' WHERE uuid = 'b0d2d4a0-8703-4cb4-9c47-24d080afb966' AND roaster_id IS NULL; -- Yinz/Downtown
UPDATE shops SET roaster_id = 'feb064ee-9f9b-4afa-b985-c9390be074cb' WHERE uuid = '3fa0ee94-e6cb-4b49-9520-88588c5a4c5f' AND roaster_id IS NULL; -- Yinz/Bloomfield

-- De Fer Coffee & Tea (6195523a-d783-4290-b93b-93e9a6c86a7c)
UPDATE shops SET roaster_id = '6195523a-d783-4290-b93b-93e9a6c86a7c' WHERE uuid = '1365441b-c275-4117-a2e5-10be619314a2' AND roaster_id IS NULL; -- Bunny Bakes
UPDATE shops SET roaster_id = '6195523a-d783-4290-b93b-93e9a6c86a7c' WHERE uuid = '4c03a9b2-7d8d-4461-93ef-fa1cb9dee387' AND roaster_id IS NULL; -- Inkwell

-- Onyx Coffee Lab (8e2dcce5-e71c-462b-9fca-6cab32361438)
UPDATE shops SET roaster_id = '8e2dcce5-e71c-462b-9fca-6cab32361438' WHERE uuid = '2820333e-f739-49ce-b5b5-553308713893' AND roaster_id IS NULL; -- Delanie's/South Side
UPDATE shops SET roaster_id = '8e2dcce5-e71c-462b-9fca-6cab32361438' WHERE uuid = '82252d12-3e03-4116-8d76-33b5849aea2b' AND roaster_id IS NULL; -- Delanie's/Shadyside

-- KLVN Coffee Lab (eac42364-2974-4043-a8e7-70476b07dca6)
UPDATE shops SET roaster_id = 'eac42364-2974-4043-a8e7-70476b07dca6' WHERE uuid = '37acab68-028f-4541-ab47-e9bb34e97e47' AND roaster_id IS NULL; -- Field Day (primary, confirm)

-- Redhawk Coffee Roasters (bfd6b197-09fe-4fd8-9779-fbc0cbffb54c)
UPDATE shops SET roaster_id = 'bfd6b197-09fe-4fd8-9779-fbc0cbffb54c' WHERE uuid = '580a1c6a-28d4-4f9a-a63f-6985ec0af1e9' AND roaster_id IS NULL; -- Spigolo

-- La Prima Espresso (9567b077-d7e2-4fec-9218-115cda3b4fc4)
UPDATE shops SET roaster_id = '9567b077-d7e2-4fec-9218-115cda3b4fc4' WHERE uuid = '3c4a5839-1c27-46e0-b88d-762b94630cc5' AND roaster_id IS NULL; -- The Garden Cafe
UPDATE shops SET roaster_id = '9567b077-d7e2-4fec-9218-115cda3b4fc4' WHERE uuid = 'cdb1546e-35a0-4766-8fd1-0e955764910d' AND roaster_id IS NULL; -- Tú y Yo/Sewickley
UPDATE shops SET roaster_id = '9567b077-d7e2-4fec-9218-115cda3b4fc4' WHERE uuid = 'e82fb8cf-8d59-4ad3-80ce-8beccd0a48e6' AND roaster_id IS NULL; -- Tú y Yo/Indiana Twp
UPDATE shops SET roaster_id = '9567b077-d7e2-4fec-9218-115cda3b4fc4' WHERE uuid = '2a330d8b-4c42-410d-ba69-0859889a6c8b' AND roaster_id IS NULL; -- Uptown Coffee (house, confirm)
```

**Phase 1 count: 33 shops.**

---

## Phase 2 — Bucket A, low confidence (confirm before applying)

Inferred primary, not shop-stated. Hold for explicit sign-off.

```sql
-- Moonbeam Café → De Fer (rotating, ~2020 source)
UPDATE shops SET roaster_id = '6195523a-d783-4290-b93b-93e9a6c86a7c' WHERE uuid = '8579cede-0826-4c43-9f13-a386283f0e37' AND roaster_id IS NULL;

-- The Baked Bean → Nicholas (inferred from owner's BREW3D truck)
UPDATE shops SET roaster_id = 'b18c1162-3b4b-4040-a929-fa1df56d7d18' WHERE uuid = '21dbe611-eb35-4ebc-9c5d-1df995935e11' AND roaster_id IS NULL;
```

**Phase 2 count: 2 shops.**

---

## Phase 3 — Bucket B: create roaster, then assign

`/add-roaster` creates the record (looks up site/IG/bio, inserts) and auto-assigns to name-matching shops. Because most roaster names here do **not** match the shop name, run the explicit follow-up UPDATE after each create. UPDATEs resolve the new `roaster.id` by slug so they don't depend on a value we can't know in advance — **verify each generated slug** after creation and adjust if the skill chose a different one.

### 3a — External roasters (12)

| `/add-roaster` arg | likely slug | follow-up UPDATE (shop uuid) |
|---|---|---|
| Devoción | `devocion` | f3abaed1-1aef-4bfc-ace1-293f63ede876 (Anthos) |
| Intelligentsia | `intelligentsia` | 462343f3-68a0-4bfe-8b98-e5ea1c778a71 (Big Dog) |
| Ceremony Coffee Roasters | `ceremony-coffee-roasters` | 27a444fc-6558-4569-8e1e-b49914cb5e67 (Constellation) |
| La Colombe | `la-colombe` | ea241011-d492-4bdc-9846-71923c77aa33 (Coop De Ville) |
| Zeke's Coffee | `zekes-coffee` | 10eed196-e451-4b95-b008-15526b93f6e0 (Grim Wizard) |
| Elixr Coffee Roasters | `elixr-coffee-roasters` | dc439d15-23cf-4ae4-aeab-3f97167bc035 (Kaibur) |
| Crimson Cup | `crimson-cup` | 5640299d-ff60-4255-8eb0-3de231175af4 (kat's) |
| Little Wolf Coffee | `little-wolf-coffee` | c9992ead-9fba-47be-bb2a-89350639ae9c (Margaux) |
| Cafetano | `cafetano` | e7854328-05c9-4029-848f-6fd97596051e (Sidecar) |
| Pico Coffee Co. | `pico-coffee-co` | bc3aa7c5-fc61-48b9-9849-67e41d15b052 (Station No. 5) |
| Verve Coffee Roasters | `verve-coffee-roasters` | eb39b9e9-5c5a-4225-ac5c-d2af6f555300 + 100e145b-9291-4cae-ac51-59cfeb193ecb (Tazza D'Oro ×2) |
| Elmo Fired Beans | `elmo-fired-beans` | ea2257e2-b415-4f38-9c59-694a971f349a (Wunderbar) |

```sql
-- Run AFTER each /add-roaster create; one block per roaster. Example pattern:
UPDATE shops SET roaster_id = (SELECT id FROM roaster WHERE slug = 'devocion')
  WHERE uuid = 'f3abaed1-1aef-4bfc-ace1-293f63ede876' AND roaster_id IS NULL;
UPDATE shops SET roaster_id = (SELECT id FROM roaster WHERE slug = 'intelligentsia')
  WHERE uuid = '462343f3-68a0-4bfe-8b98-e5ea1c778a71' AND roaster_id IS NULL;
UPDATE shops SET roaster_id = (SELECT id FROM roaster WHERE slug = 'ceremony-coffee-roasters')
  WHERE uuid = '27a444fc-6558-4569-8e1e-b49914cb5e67' AND roaster_id IS NULL;
UPDATE shops SET roaster_id = (SELECT id FROM roaster WHERE slug = 'la-colombe')
  WHERE uuid = 'ea241011-d492-4bdc-9846-71923c77aa33' AND roaster_id IS NULL;
UPDATE shops SET roaster_id = (SELECT id FROM roaster WHERE slug = 'zekes-coffee')
  WHERE uuid = '10eed196-e451-4b95-b008-15526b93f6e0' AND roaster_id IS NULL;
UPDATE shops SET roaster_id = (SELECT id FROM roaster WHERE slug = 'elixr-coffee-roasters')
  WHERE uuid = 'dc439d15-23cf-4ae4-aeab-3f97167bc035' AND roaster_id IS NULL;
UPDATE shops SET roaster_id = (SELECT id FROM roaster WHERE slug = 'crimson-cup')
  WHERE uuid = '5640299d-ff60-4255-8eb0-3de231175af4' AND roaster_id IS NULL;
UPDATE shops SET roaster_id = (SELECT id FROM roaster WHERE slug = 'little-wolf-coffee')
  WHERE uuid = 'c9992ead-9fba-47be-bb2a-89350639ae9c' AND roaster_id IS NULL;
UPDATE shops SET roaster_id = (SELECT id FROM roaster WHERE slug = 'cafetano')
  WHERE uuid = 'e7854328-05c9-4029-848f-6fd97596051e' AND roaster_id IS NULL;
UPDATE shops SET roaster_id = (SELECT id FROM roaster WHERE slug = 'pico-coffee-co')
  WHERE uuid = 'bc3aa7c5-fc61-48b9-9849-67e41d15b052' AND roaster_id IS NULL;
UPDATE shops SET roaster_id = (SELECT id FROM roaster WHERE slug = 'verve-coffee-roasters')
  WHERE uuid IN ('eb39b9e9-5c5a-4225-ac5c-d2af6f555300','100e145b-9291-4cae-ac51-59cfeb193ecb') AND roaster_id IS NULL;
UPDATE shops SET roaster_id = (SELECT id FROM roaster WHERE slug = 'elmo-fired-beans')
  WHERE uuid = 'ea2257e2-b415-4f38-9c59-694a971f349a' AND roaster_id IS NULL;
```

### 3b — Self-roasters (11 roasters → 14 shops)

Shop roasts its own / sells an in-house label. Create a roaster record, then assign. For these the roaster name often ≈ shop name, so `/add-roaster`'s auto-assign may already cover the single-location ones — verify, then run the UPDATE only for any it missed (multi-location shops especially).

| `/add-roaster` arg | likely slug | follow-up UPDATE (shop uuid) |
|---|---|---|
| Arabica Robusta | `arabica-robusta` | 5b2a753e-94e5-48d0-9ecc-306d3921702f |
| Coffee8848 | `coffee8848` | 9f9661bc-5e27-4dc9-9b4e-709e402a52d4 (Cafe 8848) |
| Coffee Village | `coffee-village` | cb1eecf8-... + 8cda8aae-... (×2) |
| Generoasta | `generoasta` | e533bcd8-672e-4803-8f42-350924c42db8 |
| Thomas & Fisk | `thomas-and-fisk` | c5ad6db9-875a-4150-af0c-e7391a9a64fb (Hilltop) |
| Java Jeffrey | `java-jeffrey` | c6b82c97-8b2a-46fb-ac58-8200fbd96014 |
| Parlor Coffee (Mediterra) | `parlor-coffee` | 2debca4b-... + 9167d5fb-... + 88699b9c-... (Mediterra ×3) |
| Novaria | `novaria-coffee` | d278cff3-3cbc-4184-9973-5bc879eda844 |
| Rock 'n' Joe | `rock-n-joe` | c77638b2-f684-4013-be78-1d0b7660f46f |
| Rosa Roasting & Imports | `rosa-roasting` | 47083196-2301-4a52-82a4-e99f23a644ae (Rosaflorida) |
| Canary Coffee | `canary-coffee` | 56d6ad91-9c03-48c2-8c11-715d54019f49 (Black Canary) |

```sql
UPDATE shops SET roaster_id = (SELECT id FROM roaster WHERE slug = 'arabica-robusta')
  WHERE uuid = '5b2a753e-94e5-48d0-9ecc-306d3921702f' AND roaster_id IS NULL;
UPDATE shops SET roaster_id = (SELECT id FROM roaster WHERE slug = 'coffee8848')
  WHERE uuid = '9f9661bc-5e27-4dc9-9b4e-709e402a52d4' AND roaster_id IS NULL;
UPDATE shops SET roaster_id = (SELECT id FROM roaster WHERE slug = 'coffee-village')
  WHERE uuid IN ('cb1eecf8-cfcf-4704-98e7-96de4cb87591','8cda8aae-58a7-458b-ac12-fd99ae444c90') AND roaster_id IS NULL;
UPDATE shops SET roaster_id = (SELECT id FROM roaster WHERE slug = 'generoasta')
  WHERE uuid = 'e533bcd8-672e-4803-8f42-350924c42db8' AND roaster_id IS NULL;
UPDATE shops SET roaster_id = (SELECT id FROM roaster WHERE slug = 'thomas-and-fisk')
  WHERE uuid = 'c5ad6db9-875a-4150-af0c-e7391a9a64fb' AND roaster_id IS NULL;
UPDATE shops SET roaster_id = (SELECT id FROM roaster WHERE slug = 'java-jeffrey')
  WHERE uuid = 'c6b82c97-8b2a-46fb-ac58-8200fbd96014' AND roaster_id IS NULL;
UPDATE shops SET roaster_id = (SELECT id FROM roaster WHERE slug = 'parlor-coffee')
  WHERE uuid IN ('2debca4b-415f-4f23-b856-78097cd7a815','9167d5fb-b842-4f80-ba64-67e4e3ccc23a','88699b9c-7015-491d-b00e-d27545e51c08') AND roaster_id IS NULL;
UPDATE shops SET roaster_id = (SELECT id FROM roaster WHERE slug = 'novaria-coffee')
  WHERE uuid = 'd278cff3-3cbc-4184-9973-5bc879eda844' AND roaster_id IS NULL;
UPDATE shops SET roaster_id = (SELECT id FROM roaster WHERE slug = 'rock-n-joe')
  WHERE uuid = 'c77638b2-f684-4013-be78-1d0b7660f46f' AND roaster_id IS NULL;
UPDATE shops SET roaster_id = (SELECT id FROM roaster WHERE slug = 'rosa-roasting')
  WHERE uuid = '47083196-2301-4a52-82a4-e99f23a644ae' AND roaster_id IS NULL;
UPDATE shops SET roaster_id = (SELECT id FROM roaster WHERE slug = 'canary-coffee')
  WHERE uuid = '56d6ad91-9c03-48c2-8c11-715d54019f49' AND roaster_id IS NULL;
```

**Phase 3 count: 23 new roasters → 26 shops.**

> Black Canary: if you'd rather not create a "Canary Coffee" self-roaster record, the shop also features **Mechanic Coffee** (`62fdc95a-bdeb-44c4-a5e7-513b161e8b5f`) and **Dynamic Coffee Roasters** (`af2eea6c-4536-4858-a2bb-ff4281658f86`), both already in the table — either is a valid in-table fallback.

---

## No action — Buckets C and N

37 shops (bucket C) have no reliable/recent house-roaster evidence, and 0 are closed (N). Left `roaster_id IS NULL`. See findings doc for the full list. Notable: **Anchor & Anvil** (both locations) is a deliberate rotating multi-roaster bar — a single FK can't represent it honestly.

---

## Verification (run after each phase)

```sql
-- progress
SELECT count(*) FILTER (WHERE roaster_id IS NULL) AS still_null,
       count(*) FILTER (WHERE roaster_id IS NOT NULL) AS assigned
FROM shops;

-- confirm every newly-created bucket-B roaster resolved to a real id (no NULL assignments slipped through)
SELECT s.name, s.neighborhood, r.name AS roaster
FROM shops s JOIN roaster r ON r.id = s.roaster_id
WHERE s.uuid IN ( /* phase-3 uuids */ );
```

## Totals
- Phase 1 (apply now): **33** shops
- Phase 2 (confirm first): **2** shops
- Phase 3 (create + assign): **23** roasters → **26** shops
- **Max reachable: 61 of 98** shops backfilled. 37 remain NULL (bucket C).
