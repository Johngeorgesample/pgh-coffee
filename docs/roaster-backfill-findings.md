# Roaster Backfill — Pass 1 Findings (read-only research)

**Scope:** the 98 shops with `roaster_id IS NULL`. Pass 1 = facts only. No DB writes were made; no UPDATE SQL or `/add-roaster` steps are included here — that is pass 2's job.

**Pipeline contract:** one row per shop, `uuid` carried verbatim (pass 2 joins on it). Bucket-A rows carry the existing `roaster.id` in the "primary roaster" notes. Bucket-B names are recorded only — **not created**.

## How this was produced
- **Step 0 (deterministic SQL):** 3 shops resolved with no web research — 2 via `company_id` link, 1 via shop-name = roaster-name self-match.
- **Steps 1–3 (web research):** remaining 95 shops split into 6 batches, one sub-agent each. Source trust order: shop's own site → shop Instagram/recent posts → recent local press. Third-party evidence required to be recent (last few years); stale claims → bucket C.
- **Step 4 (merge):** every bucket-B name re-checked against the full 30-row roaster table → **no new matches found**, so no B→A promotions. Bucket B consolidated by normalized roaster name (see bottom).

## Bucket counts
- **A** (matches existing roaster): 34
- **B** (real roaster, not yet a record — incl. self-roasters): 27
- **C** (inconclusive / stale / no house roaster): 37
- **N** (closed / not applicable): 0

---

## Bucket A — matches an existing roaster

| uuid | shop | neighborhood | proposed roaster(s) | primary roaster | bucket | source URL | source date | confidence | notes |
|---|---|---|---|---|---|---|---|---|---|
| d2aafc02-2f93-4e08-8651-34cfe925f9a6 | Commonplace Coffee | Shadyside | Commonplace Coffee | Commonplace Coffee | A | (company_id link) | n/a | high | roaster.id 5902c75b-a894-4390-9c6b-dc96afcd4132. Resolved in step 0 via shared company_id. |
| 2ee74f65-ff06-464c-90d3-ff928bd72988 | The Coffee Tree Roasters | O'Hara | The Coffee Tree Roasters | The Coffee Tree Roasters | A | (company_id link) | n/a | high | roaster.id 14f0ce88-b5c1-4185-97dd-7b5ed89dbd85. Resolved in step 0 via shared company_id. |
| 0960b600-b973-4859-82b9-e415c5bc6595 | Steel Cup Coffee Roasters | New Kensington | Steel Cup Coffee Roasters | Steel Cup Coffee Roasters | A | (name self-match) | n/a | high | roaster.id 7aa60f42-f740-4638-8085-55cca08e4dc8. Self-roasting café; step-0 name match, confirm. |
| a3dae785-5218-42c9-ac47-7421b079c4a9 | ABC Coffee Company | Aspinwall | Nicholas Coffee & Tea Co. | Nicholas Coffee & Tea Co. | A | https://aspinwallbeansncream.com/about/ | 2024 | high | roaster.id b18c1162-3b4b-4040-a929-fa1df56d7d18. Site: partners with Nicholas Coffee for freshly roasted coffee. |
| c1d93506-5250-4e6d-a0aa-ffad851fc379 | Biddle's Escape | Wilkinsburg | 19 Coffee (current); Commonplace (historical) | 19 Coffee | A | https://www.biddlesescape.com/our-products | 2025 | high | roaster.id feb064ee-9f9b-4afa-b985-c9390be074cb. Site: "toll roasted coffee from 19 Coffee Company." Old 2016 Commonplace claim superseded. |
| 1365441b-c275-4117-a2e5-10be619314a2 | Bunny Bakes | Squirrel Hill South | De Fer Coffee & Tea | De Fer Coffee & Tea | A | https://nextpittsburgh.com/eatdrink/bunny-bakes-serves-up-coffee-and-baked-goods-in-squirrel-hill/ | 2024 | high | roaster.id 6195523a-d783-4290-b93b-93e9a6c86a7c. "Coffees and teas supplied by De Fer." |
| 811d9be0-72d8-4297-90c7-66232e385f96 | Café 412 | West End | 19 Coffee | 19 Coffee | A | https://goodfoodpittsburgh.com/15-new-coffee-shops-to-try-right-now-in-pittsburgh/ | 2024 | high | roaster.id feb064ee-9f9b-4afa-b985-c9390be074cb. Features local micro-roastery 19 Coffee Company. |
| 1e1bdead-34b3-4411-a356-4e62add472dd | Caffe d'Amore | Upper Lawrenceville | Commonplace; Tanager; Deeper Roots | Commonplace Coffee (likely) | A | https://nextpittsburgh.com/current-features/caffe-damore-coffee-community-go-hand-hand/ | 2022-08-31 | med | roaster.id 5902c75b-a894-4390-9c6b-dc96afcd4132. Several micro-roasters; Commonplace likely primary — confirm. Tanager & Deeper Roots not in table. |
| 4f945fd9-faf1-49f1-933a-5acf5070447b | California Coffee Bar | Brighton Heights | 19 Coffee | 19 Coffee | A | https://www.instagram.com/californiacoffee.pgh/ | 2025–2026 | med | roaster.id feb064ee-9f9b-4afa-b985-c9390be074cb. Serves 19 Coffee per current listings + IG attribution. |
| 1ccd9edf-fb8a-4bad-850d-016d7f717178 | Cares CommuniTEA Cafe | Crawford-Roberts | The Coffee Tree Roasters | The Coffee Tree Roasters | A | https://nextpittsburgh.com/city-design/cares-communitea-cafe-now-open-in-the-hill-district/ | 2021 (café active per TribLive 2026-01) | med | roaster.id 14f0ce88-b5c1-4185-97dd-7b5ed89dbd85. Blends "ground daily by Coffee Tree Roasters." Founding-era source; confirm still current. |
| 2820333e-f739-49ce-b5b5-553308713893 | Delanie's Coffee | South Side Flats | Onyx Coffee Lab; Partners Coffee | Onyx Coffee Lab (likely) | A | https://www.delaniescoffee.com/ | 2026-06 | med | roaster.id 8e2dcce5-e71c-462b-9fca-6cab32361438. Two roasters; Onyx likely primary — confirm. Partners Coffee not in table. |
| 82252d12-3e03-4116-8d76-33b5849aea2b | Delanie's Coffee | Shadyside | Onyx Coffee Lab; Partners Coffee | Onyx Coffee Lab (likely) | A | https://www.delaniescoffee.com/ | 2026-06 | med | roaster.id 8e2dcce5-e71c-462b-9fca-6cab32361438. Same business as South Side row. |
| eb8724b6-9ddd-41b0-b082-39e496d92096 | Divvy Coffee & Buns | Central Oakland | Commonplace Coffee | Commonplace Coffee | A | https://www.axios.com/local/pittsburgh/2026/01/13/global-flavors-tucked-into-buns-at-divvy-in-oakland | 2026-01-13 | high | roaster.id 5902c75b-a894-4390-9c6b-dc96afcd4132. "Divvy brews coffee from Commonplace Coffee." |
| 60eb6a2b-b1f4-4079-aa19-1cbb7e234ec7 | Dragon's Roast Cafe | West View | Commonplace Coffee | Commonplace Coffee | A | https://www.pittsburghmagazine.com/go-on-an-epic-quest-at-dragons-roast-cafe/ | 2024-08 | high | roaster.id 5902c75b-a894-4390-9c6b-dc96afcd4132. Baristas "use Commonplace Coffee." Cafe inside Game Masters venue. |
| e7490bbf-ba3e-447c-b077-7a8927521075 | Everyday Cafe | Homewood South | Commonplace Coffee | Commonplace Coffee | A | https://www.yelp.com/biz/everyday-cafe-pittsburgh | 2026-06 | med | roaster.id 5902c75b-a894-4390-9c6b-dc96afcd4132. Site says "locally roasted"; recent reviews specify Commonplace. Not on shop's own site → med. |
| 37acab68-028f-4541-ab47-e9bb34e97e47 | Field Day | Lower Lawrenceville | KLVN Coffee Lab; Puff Coffee (Portland) | KLVN Coffee Lab | A | https://www.pittsburghmagazine.com/chef-joey-hilty-is-having-a-field-day-at-the-cafe-in-lawrenceville/ | 2025 | med | roaster.id eac42364-2974-4043-a8e7-70476b07dca6. Local KLVN + Portland's Puff; KLVN is house/local. Confirm primary. |
| 4c03a9b2-7d8d-4461-93ef-fa1cb9dee387 | Inkwell | Central Lawrenceville | De Fer Coffee & Tea | De Fer Coffee & Tea | A | https://www.yelp.com/biz/inkwell-coffee-shop-pittsburgh | 2026-06 | med | roaster.id 6195523a-d783-4290-b93b-93e9a6c86a7c. Multiple sources: "serves high-quality de Fer coffee." Not on shop's own site → med. |
| e7a22221-fff9-4ad3-97bd-639efbf81e51 | Ka-Fair | Morningside | Commonplace Coffee | Commonplace Coffee | A | https://madeinpgh.com/pittsburgh-food-drink/ka-fair-coffee/ | ~2022 | med | roaster.id 5902c75b-a894-4390-9c6b-dc96afcd4132. "Local roaster Commonplace Coffee provides Ka-Fair's beans." |
| 8579cede-0826-4c43-9f13-a386283f0e37 | Moonbeam Café | Oakmont | De Fer (house); Dark Moon Roasters (NV); Heart Roasters (Portland) | De Fer Coffee & Tea | A | https://triblive.com/local/valley-news-dispatch/welcoming-vibe-good-coffee-await-at-oakmonts-moonbeam-cafe/ | ~2020 | low | roaster.id 6195523a-d783-4290-b93b-93e9a6c86a7c. Rotating; house cited as De Fer. Source ~2020 (stale) + rotation → confirm. |
| 1f3c5279-f73b-4526-afbf-e1c809d4fa61 | Orbis Caffe | Mt. Lebanon | 19 Coffee (flagship); Onyx; Black & White; Intelligentsia | 19 Coffee | A | https://www.orbiscaffe.com/ | 2026 | med | roaster.id feb064ee-9f9b-4afa-b985-c9390be074cb. Rotates roasters; 19 Coffee "flagship since the beginning." Onyx also in table (8e2dcce5). Confirm primary. |
| 9ffac27f-91e7-4137-a494-67509300c204 | Potomac Station Coffeehouse | Dormont | 19 Coffee | 19 Coffee | A | https://nextpittsburgh.com/city-design/potomac-station-coffeehouse-coming-to-dormont/ | 2022 (reconfirmed 2026) | high | roaster.id feb064ee-9f9b-4afa-b985-c9390be074cb. "Partnership with 19 Coffee Company." |
| 580a1c6a-28d4-4f9a-a63f-6985ec0af1e9 | Spigolo | Edgewood | Redhawk Coffee Roasters | Redhawk Coffee Roasters | A | https://spigolopgh.com/ | 2026-06 | high | roaster.id bfd6b197-09fe-4fd8-9779-fbc0cbffb54c. "A selection of beans from Redhawk Coffee Roasters." |
| fc3df462-b25e-49da-9e52-84be9e9c913a | The Abbey | Central Lawrenceville | Commonplace; Tanager; Deeper Roots | Commonplace Coffee (likely) | A | https://goodfoodpittsburgh.com/the-abbey-on-butler-streets-opens-in-lawrenceville/ | ~2023 (reconfirmed 2026) | med | roaster.id 5902c75b-a894-4390-9c6b-dc96afcd4132. "Micro-roasters including Commonplace, Tanager, Deeper Roots." Commonplace likely primary — confirm. |
| 21dbe611-eb35-4ebc-9c5d-1df995935e11 | The Baked Bean | Mt. Lebanon | Nicholas Coffee & Tea Co. | Nicholas Coffee & Tea Co. (likely) | A | https://brew3dpgh.com/ | 2026-06 | low | roaster.id b18c1162-3b4b-4040-a929-fa1df56d7d18. Shop says "locally roasted"; co-owner's BREW3D truck serves Nicholas. Inference from sister business — confirm. |
| 3c4a5839-1c27-46e0-b88d-762b94630cc5 | The Garden Cafe | East Allegheny | La Prima Espresso | La Prima Espresso | A | https://gardencafepgh.com/ | 2026-06 | high | roaster.id 9567b077-d7e2-4fec-9218-115cda3b4fc4. "Beans sourced exclusively through La Prima Espresso's torrefazione in Manchester." |
| cdb1546e-35a0-4766-8fd1-0e955764910d | Tú y Yo Café | Sewickley | La Prima Espresso; rotating Guatemalan/Colombian | La Prima Espresso | A | https://www.pghcitypaper.com/food-drink/tu-y-yo-cafe-in-the-north-hills-brings-latin-american-coffee-culture-to-pittsburgh-20486119/ | ~2021 | med | roaster.id 9567b077-d7e2-4fec-9218-115cda3b4fc4. Espresso made with La Prima; Latin American single-origins supplemental. |
| e82fb8cf-8d59-4ad3-80ce-8beccd0a48e6 | Tú y Yo Café | Indiana Township | La Prima Espresso; rotating Guatemalan/Colombian | La Prima Espresso | A | https://www.pghcitypaper.com/food-drink/tu-y-yo-cafe-in-the-north-hills-brings-latin-american-coffee-culture-to-pittsburgh-20486119/ | ~2021 | med | roaster.id 9567b077-d7e2-4fec-9218-115cda3b4fc4. Same business as Sewickley row. |
| 2a330d8b-4c42-410d-ba69-0859889a6c8b | Uptown Coffee | Mt. Lebanon | La Prima (house); Redhawk; Commonplace; Nicholas | La Prima Espresso | A | https://www.observer-reporter.com/shl/2023/may/07/uptown-girl-nicole-simonian-takes-over-as-owner-of-beloved-mt-lebanon-coffee-shop/ | 2023-05-07 | med | roaster.id 9567b077-d7e2-4fec-9218-115cda3b4fc4. House roast (Moka Java/decaf Colombian) from La Prima; rotating Redhawk (bfd6b197) / Commonplace (5902c75b) / Nicholas (b18c1162) all in table. |
| 5cfeaaaf-3990-4c56-bfcb-032edaa7f58a | West View Brew | West View | Commonplace Coffee | Commonplace Coffee | A | https://www.westviewbrew.com/ | 2026 | high | roaster.id 5902c75b-a894-4390-9c6b-dc96afcd4132. Site: "we source all of our beans from ... Commonplace Coffee." |
| 99b375a1-5e0d-493e-afbf-4b356cf626b6 | White Whale Bookstore | Bloomfield | Commonplace Coffee | Commonplace Coffee | A | https://www.publishersweekly.com/pw/by-topic/industry-news/bookselling/article/87663-white-whale-bookstore-turns-five-expands.html | 2021-10-19 | high | roaster.id 5902c75b-a894-4390-9c6b-dc96afcd4132. Café launched with T.J. Fairchild, co-founder of Commonplace. |
| 605caff1-3f8e-4492-9668-00f3251a81f8 | Yinz Coffee | Central Northside | 19 Coffee | 19 Coffee | A | https://www.pghcitypaper.com/food-drink/new-yinz-coffee-shop-set-to-take-over-former-crazy-mocha-in-north-side-18678482/ | 2021 | med | roaster.id feb064ee-9f9b-4afa-b985-c9390be074cb. Chain sources from Baldwin-based 19 Coffee. One source mentions in-house blend — confirm. |
| eb5d9630-df29-47da-bb20-d5aef18af118 | Yinz Coffee | Downtown | 19 Coffee | 19 Coffee | A | (same chain source) | 2021 | med | roaster.id feb064ee-9f9b-4afa-b985-c9390be074cb. Same chain as above; confirm. |
| cf54c04f-2a40-4b96-a04d-69d2aac3022d | Yinz Coffee | North Oakland | 19 Coffee | 19 Coffee | A | (same chain source) | 2021 | med | roaster.id feb064ee-9f9b-4afa-b985-c9390be074cb. Same chain; confirm. |
| 00dba2e1-2ec2-4cfb-8b2a-d0b7b936fb63 | Yinz Coffee | Friendship | 19 Coffee | 19 Coffee | A | (same chain source) | 2021 | med | roaster.id feb064ee-9f9b-4afa-b985-c9390be074cb. Same chain; confirm. |
| 5c9daa19-2472-46c7-b06c-4730e25b6a42 | Yinz Coffee | South Shore | 19 Coffee | 19 Coffee | A | (same chain source) | 2021 | med | roaster.id feb064ee-9f9b-4afa-b985-c9390be074cb. Same chain (Station Square); confirm. |
| 0f4f5ebe-23ee-4216-b9ea-08eb81b06ad0 | Yinz Coffee | Downtown | 19 Coffee | 19 Coffee | A | (same chain source) | 2021 | med | roaster.id feb064ee-9f9b-4afa-b985-c9390be074cb. Same chain; confirm. |
| b0d2d4a0-8703-4cb4-9c47-24d080afb966 | Yinz Coffee | Downtown | 19 Coffee | 19 Coffee | A | (same chain source) | 2021 | med | roaster.id feb064ee-9f9b-4afa-b985-c9390be074cb. Same chain; confirm. |
| 3fa0ee94-e6cb-4b49-9520-88588c5a4c5f | Yinz Coffee | Bloomfield | 19 Coffee | 19 Coffee | A | (same chain source) | 2021 | med | roaster.id feb064ee-9f9b-4afa-b985-c9390be074cb. Same chain; confirm. |

---

## Bucket B — real roaster, not yet a record (record name only; do NOT create)

| uuid | shop | neighborhood | proposed roaster(s) | primary roaster | bucket | source URL | source date | confidence | notes |
|---|---|---|---|---|---|---|---|---|---|
| f3abaed1-1aef-4bfc-ace1-293f63ede876 | Anthos Bakery & Café | Castle Shannon | Devoción | Devoción | B | https://nextpittsburgh.com/latest-news/anthos-greek-bakery-and-cafe-is-blooming-in-castle-shannon/ | 2022 | med | Serves Brooklyn-based Devoción. Opening-era source; recheck currency. |
| 5b2a753e-94e5-48d0-9ecc-306d3921702f | Arabica Robusta | Homestead | Arabica Robusta ("Homestead blend") | Arabica Robusta | B | https://www.axios.com/local/pittsburgh/2025/09/23/arabica-robusta-coffee-homestead-pittsburgh | 2025-09-23 | med | **self-roaster.** Owners created own "Homestead blend." Self-roast inference. |
| 462343f3-68a0-4bfe-8b98-e5ea1c778a71 | Big Dog Coffee | South Side Flats | Intelligentsia | Intelligentsia | B | https://www.bigdogcoffeeshop.com/about | 2026 | high | "Proudly brew Intelligentsia Coffee ... rotating Intelligentsia Daily Brew." |
| 9f9661bc-5e27-4dc9-9b4e-709e402a52d4 | Cafe 8848 | Brentwood | Coffee8848 (Nepal-grown/roasted) | Coffee8848 | B | https://www.coffee8848.com/ | 2026 | med | **self-roaster.** Affiliated Coffee8848 sources/roasts 100% Nepali Arabica; cafe is its outlet. |
| cb1eecf8-cfcf-4704-98e7-96de4cb87591 | Coffee Village | Sewickley | Coffee Village (own roastery, Harmony) | Coffee Village | B | https://community.triblive.com/news/3959147 | 2026-01-16 | high | **self-roaster.** Own roastery in Harmony; roasts Coffee Village / Lady Blue / Crazy Mocha blends, wholesales to others. |
| 8cda8aae-58a7-458b-ac12-fd99ae444c90 | Coffee Village | Downtown | Coffee Village (own roastery, Harmony) | Coffee Village | B | https://community.triblive.com/news/3959147 | 2026-01-16 | high | **self-roaster.** Same business as Sewickley row. |
| 27a444fc-6558-4569-8e1e-b49914cb5e67 | Constellation Coffee | Central Lawrenceville | Ceremony Coffee Roasters | Ceremony Coffee Roasters | B | https://sprudge.com/the-coffee-lovers-guide-to-pittsburgh-86395.html | 2017 (open since 2013) | med | Served Ceremony (Annapolis MD) since 2013 open. No evidence of a switch; own site doesn't reconfirm. |
| ea241011-d492-4bdc-9846-71923c77aa33 | Coop De Ville | Strip District | La Colombe | La Colombe | B | https://coopdevillepgh.com/coffee-bar/ | 2026-06 | high | Own coffee-bar page states they serve La Colombe coffee and espresso. |
| e533bcd8-672e-4803-8f42-350924c42db8 | Generoasta Coffee & Cafe | Warrendale | Generoasta (self) | Generoasta | B | https://generoastacoffee.com/ | 2026-06 | high | **self-roaster.** House-roasts own beans (Celebes Kalossi, PNG, Kenya AA, Rwanda...). Name = "generous roaster." |
| 10eed196-e451-4b95-b008-15526b93f6e0 | Grim Wizard Coffee | Allentown | Zeke's Coffee (Baltimore) | Zeke's Coffee | B | https://nextpittsburgh.com/eatdrink/the-black-forge-name-is-ending-in-allentown-but-the-coffee-will-rock-on/ | 2024 | med | Heavy-metal cafe (former Black Forge Allentown); partners with Zeke's Coffee. Also custom band roasts. |
| c5ad6db9-875a-4150-af0c-e7391a9a64fb | Hilltop Coffee | Arlington | Thomas & Fisk, Ltd. (in-house affiliate) | Thomas & Fisk | B | https://www.hilltopcoffeepgh.com/our-story | 2026-06 | high | **self-roaster.** Roasted on-site under manager's Thomas & Fisk, Ltd. label. |
| c6b82c97-8b2a-46fb-ac58-8200fbd96014 | Java Jeffrey Coffee | West Mifflin | Java Jeffrey (self) | Java Jeffrey | B | https://www.javajeffrey.coffee/our-process | 2026-06 | high | **self-roaster.** Roasts own small-batch beans in Dravosburg. |
| dc439d15-23cf-4ae4-aeab-3f97167bc035 | Kaibur Coffee | Polish Hill | Elixr Coffee Roasters (Philadelphia) | Elixr Coffee Roasters | B | https://www.pghcitypaper.com/food-drink/kaibur-coffee-takes-over-former-lili-space-in-polish-hill-7260229/ | ~2023 | med | Sources beans from Elixr (Philadelphia). Own site doesn't name a roaster. |
| 5640299d-ff60-4255-8eb0-3de231175af4 | kat's coffeehouse | Treesdale | Crimson Cup (Columbus, OH) | Crimson Cup | B | https://www.crimsoncup.com/independent-coffee-shops/success-story-kats-coffeehouse-launches-in-gibsonia-pennsylvania | ~2024 | high | Launched via Crimson Cup's startup program; serves Crimson Cup. |
| c9992ead-9fba-47be-bb2a-89350639ae9c | Margaux | East Liberty | Little Wolf Coffee; Blanchard's (opening) | Little Wolf Coffee | B | https://dailycoffeenews.com/2022/07/13/margaux-gives-coffee-and-cocktails-a-go-in-pittsburgh/ | 2022-07-13 | low | Opened with Blanchard's (Richmond VA); later reviews note Little Wolf espresso. Current house roaster not firmly confirmed via shop's own channel. |
| 2debca4b-415f-4f23-b856-78097cd7a815 | Mediterra Cafe | Mt. Lebanon | Parlor Coffee (Mediterra's in-house label) | Parlor Coffee | B | https://goodfoodpittsburgh.com/mediterra-bakehouse-opening-their-first-cafe-sewickley/ | ~2018 | med | **self-roaster.** Mediterra roasts "Parlor Coffee" (in-house brand). Not the NYC "Parlor Coffee." |
| 9167d5fb-b842-4f80-ba64-67e4e3ccc23a | Mediterra Cafe | Upper Lawrenceville | Parlor Coffee (Mediterra's in-house label) | Parlor Coffee | B | https://goodfoodpittsburgh.com/mediterra-bakehouse-opening-their-first-cafe-sewickley/ | ~2018 | med | **self-roaster.** Same business. |
| 88699b9c-7015-491d-b00e-d27545e51c08 | Mediterra Cafe | Sewickley | Parlor Coffee (Mediterra's in-house label) | Parlor Coffee | B | https://goodfoodpittsburgh.com/mediterra-bakehouse-opening-their-first-cafe-sewickley/ | ~2018 | med | **self-roaster.** Same business. |
| d278cff3-3cbc-4184-9973-5bc879eda844 | Novaria Coffee Co. | Strip District | Novaria (Syrian specialty, self) | Novaria Coffee Co. | B | https://www.novariacoffee.com/ | 2026 | low | **self-roaster (inferred).** Syrian specialty shop that also supplies beans to other businesses; in-house roasting not independently confirmed. |
| c77638b2-f684-4013-be78-1d0b7660f46f | Rock 'n' Joe | Downtown | Rock 'n' Joe (self) | Rock 'n' Joe | B | https://www.rocknjoe.com/blank | 2026-06 | med | **self-roaster.** Pittsburgh-HQ specialty franchise; own house blends (Velvet Underground, Sledgehammer). |
| 47083196-2301-4a52-82a4-e99f23a644ae | Rosaflorida Coffee | Blawnox | Rosa Roasting & Imports (own Colombian beans) | Rosaflorida / Rosa Roasting | B | https://www.facebook.com/rosaroastingspecialtycoffee/ | 2026-03 | high | **self-roaster.** Beans from owner's family farm in Colombia, roasted locally (Rosa Roasting & Imports LLC). |
| e7854328-05c9-4029-848f-6fd97596051e | Sidecar Coffee and Bake Shop | North Oakland | Cafetano | Cafetano | B | https://sidecar412.com/about/ | 2026-06 | high | "We brew coffee and espresso with Cafetano beans." Older third-party "La Prima" claim is stale/superseded. |
| bc3aa7c5-fc61-48b9-9849-67e41d15b052 | Station No. 5 | Bradford Woods | Pico Coffee Co. (McCandless) | Pico Coffee Co. | B | https://triblive.com/local/history-community-combine-at-bradford-woods-coffee-shop/ | recent (TribLIVE feature) | med | "Work with a local roaster (Pico Coffee Co./McCandless)." |
| eb39b9e9-5c5a-4225-ac5c-d2af6f555300 | Tazza D'Oro | North Oakland | Verve Coffee Roasters (Santa Cruz CA); formerly Batdorf & Bronson | Verve Coffee Roasters | B | https://en.wikipedia.org/wiki/Tazza_d%27Oro_(Pittsburgh) | 2026-06 | med | "Current coffee roaster is Verve." |
| 100e145b-9291-4cae-ac51-59cfeb193ecb | Tazza D'Oro | Highland Park | Verve Coffee Roasters (Santa Cruz CA); formerly Batdorf & Bronson | Verve Coffee Roasters | B | https://en.wikipedia.org/wiki/Tazza_d%27Oro_(Pittsburgh) | 2026-06 | med | Same business as North Oakland row. |
| 56d6ad91-9c03-48c2-8c11-715d54019f49 | The Black Canary | Blawnox | Canary Coffee (own blends); Mechanic Coffee; Dynamic Coffee Roasters | Canary Coffee | B | https://theblackcanary.com/ | 2026-06 | med | **self-roaster.** House = own "Canary Coffee" blend. Also features Mechanic (in table 62fdc95a) & Dynamic (af2eea6c) — in-table fallbacks if house treated as third-party. |
| ea2257e2-b415-4f38-9c59-694a971f349a | Wunderbar Coffee and Bistro | Bellevue | Elmo Fired Beans | Elmo Fired Beans | B | https://www.wunderbarbellevue.com/ | 2026 | high | Own site: "Our coffee is by local roaster Elmo Fired Beans." |

### Bucket B consolidated — proposed new roasters → shops served (step 4.2)

**External / third-party roasters (real businesses, no record yet):**
- **Devoción** (Brooklyn NY) → Anthos Bakery & Café (Castle Shannon)
- **Intelligentsia** (Chicago IL) → Big Dog Coffee (South Side Flats)
- **Ceremony Coffee Roasters** (Annapolis MD) → Constellation Coffee (Central Lawrenceville)
- **La Colombe** (Philadelphia PA) → Coop De Ville (Strip District)
- **Zeke's Coffee** (Baltimore MD) → Grim Wizard Coffee (Allentown)
- **Elixr Coffee Roasters** (Philadelphia PA) → Kaibur Coffee (Polish Hill)
- **Crimson Cup** (Columbus OH) → kat's coffeehouse (Treesdale)
- **Little Wolf Coffee** (Ipswich MA) → Margaux (East Liberty) *(Blanchard's at opening)*
- **Cafetano** → Sidecar Coffee and Bake Shop (North Oakland)
- **Pico Coffee Co.** (McCandless PA) → Station No. 5 (Bradford Woods)
- **Verve Coffee Roasters** (Santa Cruz CA) → Tazza D'Oro (North Oakland; Highland Park)
- **Elmo Fired Beans** (local) → Wunderbar Coffee and Bistro (Bellevue)

**Self-roasters (shop roasts its own / own brand — no roaster record yet):**
- **Arabica Robusta** → Arabica Robusta (Homestead)
- **Coffee8848** → Cafe 8848 (Brentwood)
- **Coffee Village** → Coffee Village (Sewickley; Downtown)
- **Generoasta** → Generoasta Coffee & Cafe (Warrendale)
- **Thomas & Fisk, Ltd.** → Hilltop Coffee (Arlington)
- **Java Jeffrey** → Java Jeffrey Coffee (West Mifflin)
- **Parlor Coffee** (Mediterra's in-house label) → Mediterra Cafe (Mt. Lebanon; Upper Lawrenceville; Sewickley)
- **Novaria** → Novaria Coffee Co. (Strip District) *(self-roast inferred, unconfirmed)*
- **Rock 'n' Joe** → Rock 'n' Joe (Downtown)
- **Rosa Roasting & Imports** → Rosaflorida Coffee (Blawnox)
- **Canary Coffee** → The Black Canary (Blawnox)

---

## Bucket C — inconclusive / stale / no identifiable house roaster

| uuid | shop | neighborhood | proposed roaster(s) | primary roaster | bucket | source URL | source date | confidence | notes |
|---|---|---|---|---|---|---|---|---|---|
| 78e3178d-b181-4f7f-a719-84b1f5288395 | 61B Cafe | Regent Square | — | — | C | https://www.pghcitypaper.com/food-drink/regent-square-finally-gets-a-coffee-shop-1701041/ | n/a | low | Sister of 61C. Only generic "locally roasted"; no named roaster. |
| eebf617f-7996-4ada-84f4-601c60c7d667 | 61C Cafe | Squirrel Hill South | — | — | C | https://www.tripadvisor.com/Restaurant_Review-g53449-d400893-Reviews-61C_Cafe-Pittsburgh_Pennsylvania.html | n/a | low | No specific house roaster on site or press. |
| 25a6893e-901e-4578-aa40-aed0fddef009 | Adesso Cafe | Sewickley | — | — | C | https://adessocafe.com/ | 2025 | low | "Organic / single origin / fair trade" but no roaster named; self-roast unclear. |
| 405f02e5-1732-455e-8b27-097d211c7552 | Anchor & Anvil Coffee Bar | Coraopolis | De Fer; Madcap; Rothrock; ReAnimator (rotating) | — | C | https://www.pghcitypaper.com/food-drink/anchor-and-anvil-coffee-shop-opens-in-coraopolis-2763845/ | 2025 | med | Multi-roaster bar by design; true rotation, no single house roaster. De Fer (6195523a) is in table if a primary must be forced. |
| 2f989070-bc14-48a5-a54a-d470a734e94c | Anchor & Anvil Coffee Bar | Ben Avon | De Fer; Madcap; Rothrock; ReAnimator (rotating) | — | C | https://www.pghcitypaper.com/food-drink/anchor-and-anvil-coffee-shop-opens-in-coraopolis-2763845/ | 2025 | med | Same business as Coraopolis row. Rotating multi-roaster. |
| cf2150be-d6c5-4055-8c69-1537659a287f | Brother Andre's Cafe | Bellevue | Brother Andre's house blends (roaster undisclosed) | — | C | https://brotherandres.org/collections/coffee | 2026 | low | Sells own-branded blends; roaster behind them undisclosed. Nonprofit cafe. |
| 20c333e9-7123-4830-90be-9ea9a3f26b77 | Brother Andre's Cafe | Crawford-Roberts | Brother Andre's house blends (roaster undisclosed) | — | C | https://brotherandres.org/collections/coffee | 2026 | low | Same business as Bellevue row. |
| 49992cd6-88b6-4d99-8a8e-dc26ec31ff3e | Cafe Americano | Castle Shannon | unnamed local micro-roaster | — | C | https://cafeamericano.net/ | 2026 | low | "Partnered with a local micro-coffee roaster" — roaster never named. |
| e1ce31dd-2e6b-47a2-b976-1c3bd3dc9282 | Cafe Cravings Gourmet Coffee Shop | Mt. Washington | — | — | C | https://cafecravings412.wixsite.com/coffee | 2026-06 | low | No roaster named anywhere. |
| d26caad3-e37c-49c8-8d2d-3ad3985e5011 | Cafe Vivella | Ross | own-branded "Signature Blend" / Yirgacheffe / Turkish | — | C | https://www.vivella.cafe/ | 2026-06 | low | Sells own-labeled "freshly roasted" beans; no evidence of in-house roast and no named outside roaster. |
| 733450c5-affe-469c-958b-8257ccd0fe75 | Caffe' Nera | Coraopolis | — | — | C | https://www.facebook.com/CCDC247/posts/1267089755445136/ | 2026-04 | low | New family-owned café; no roaster named. |
| b4c73f50-bb0b-4f8a-b8e1-b89586e3f854 | Coffee, Etc. | Castle Shannon | — | — | C | https://coffee-etc.org/ | 2026-06 | low | "Finest beans" only; no named roaster. |
| fd273207-6c9e-4f4d-846f-1dadb0e3c882 | Cup-Ka-Joe | South Side Flats | — | — | C | https://www.cupkajoe.com/ | 2026-06 | low | No roaster named on site or any source. |
| aacf15ff-d39f-4ea2-88f3-3eff51ff2279 | Curbside on the Run | O'Hara | Commonplace; Kiva Han (2019 Blawnox-era) | — | C | https://triblive.com/local/valley-news-dispatch/blawnox-coffeehouse-combines-its-perk-with-fresh-foods/ | 2019-07-17 | low | Only source is 2019 + pre-move (former Blawnox location). Stale → current roaster unconfirmed. |
| fc45d9ba-5ba3-487b-89df-5ddcce84ab62 | Encanto Cafe | South Side Flats | Encanto Specialty Coffee (own Colombian, unconfirmed) | — | C | https://encanto.coffee/ | 2026-06 | low | Roaster "Encanto Specialty Coffee" (@encantopgh) exists, but confirmed link to this cafe (@encantopitt) not established. No website. |
| d05e91ff-ecbc-452e-9e5c-6c7eedae360b | Fig Tree Coffee | Crafton | — | — | C | https://www.figtreecoffeepgh.com/menu | 2026-06 | low | Emphasizes "local" but no roaster named. |
| 907b6cb7-62f3-4254-9288-ae2ffce736ea | Friendship Perk & Brew | Friendship | — | — | C | https://www.perkandbrew.net/ | 2026-06 | low | No roaster named on site or in 2017 PG coverage. |
| 5ac405ad-593f-475e-93df-e1f4397228a5 | Grand Brew | Mt. Washington | — | — | C | https://www.yelp.com/biz/grand-brew-pittsburgh | 2026-06 | low | Small cash-only shop; no roaster identified. No website. |
| ef8582fe-d566-4689-b4df-1fb35750814b | Happenstance Cafe | Lower Lawrenceville | — | — | C | https://happenstancecafe.com/ | 2026-06 | low | "Featuring local coffee" but no specific roaster. |
| 5aa1f459-30ec-4f29-9020-a3e0d448b07b | Haven Cafe | Bellevue | — | — | C | https://bellevuepa.us/haven-cafe-on-yajagoff-late-night/ | 2025 | low | Scratch-kitchen/mental-health cafe; no roaster named (not the separate "Haven Coffee Roasters"). |
| 966ee99e-c944-484b-93b2-7fc07f38cdfa | Hazelwood Cafe | Hazelwood | African single-origins (roaster unnamed) | — | C | https://www.post-gazette.com/life/food/2024/03/12/hazelwood-cafe-pittsburgh-coffee-shop-sba-microloan-barista-black-entrepreneurs/stories/202403050063 | 2024-03 | low | Sources African coffees; own roasting is a future goal. No current named house roaster. |
| 1d81118b-0fd8-49dd-adb4-5dc20d71e271 | Ineffable Cà Phê | North Point Breeze | buys dark-roast, grinds in-house w/ chicory | — | C | https://nextpittsburgh.com/eatdrink/ineffable-ca-phe-brings-vietnamese-tradition-relaxed-vibe-busy-penn-ave/ | 2017 | low | Vietnamese cafe; buys dark-roast beans, no named roaster. |
| 7f016adb-1a7b-4c0a-996a-31eb100c8f94 | LaBella Bean | Bridgeville | "locally crafted coffee" (unnamed) | — | C | https://labellabean.com/story | 2026 | low | Own site says only "locally crafted coffee." |
| 4d284626-e1e1-4922-b5ba-d3e369a6ef96 | Lucky Bug Coffee | McCandless | "roasted locally" (unnamed) | — | C | https://www.yelp.com/biz/lucky-bug-coffee-pittsburgh | 2026 | low | Sells beans; "roasted locally" but no specific roaster identified. |
| 9f2b01f1-33b2-45b8-b74d-be8179a11c9e | LV Coffee Project | East Liberty | Tolve's "Tonic Coffee" program (no roaster named) | — | C | https://tolve.co/coffee/ | 2026 | low | Tolve's coffee concept; own page names no roaster and doesn't state self-roasting. |
| f7231e8f-a690-429b-bfe8-981415bdb6b7 | Mel's Petit Café | Mt. Lebanon | — | — | C | https://goodfoodpittsburgh.com/mels-petit-cafe-now-open-in-mt-lebanon/ | 2020-10-28 | low | French crêperie; no roaster named. |
| e632b8d6-7a91-45e7-b2ad-36ca09039d5c | Origin Story Coffee | Downtown | — | — | C | https://www.pittsburghmagazine.com/coffee-shops-pittsburgh-2026/ | 2026 | low | New (opened late 2025) hero-themed café; no roaster named. |
| 2187d3f9-c039-4aac-b923-e9b9bdfd15a2 | Panaderia Jazmin | Mt. Lebanon | Mexican-inspired coffee (no roaster) | — | C | https://www.yelp.com/biz/panaderia-jazmin-pittsburgh | 2026 | low | Mexican bakery; serves coffee but no roaster identified. Primarily a panadería. |
| 21b4a96a-bc42-44cd-b3d2-1975812163f6 | Parisi Cafe | Swissvale | — | — | C | https://www.parisicafepittsburgh.com/ | 2026-06 | low | Italian cafe/market; no roaster named. ("Parisi Coffee" brand is an unrelated KC company.) |
| a58f4b75-2e06-463b-b3a6-fd9ac661699c | Queen Beans Cafe | Coraopolis | — | — | C | https://www.queenbeanscafe.com/ | 2026-06 | low | "Finely crafted coffees" but no roaster named; not a self-roaster. |
| ccd80d4e-d7d0-495b-adc1-f7a68114c461 | Roll Up Coffee Shop | Forest Hills | — | — | C | https://www.facebook.com/p/Roll-Up-Coffee-Shop-61558387910491/ | 2026-06 | low | Coffee + Hershey's ice cream shop; no roaster named. |
| 38ec3a31-a6e3-4cb8-b902-a97354a886a8 | Socotra Cafe and Grill | Brookline | traditional Yemeni coffee (no named roaster) | — | C | https://nextpittsburgh.com/eatdrink/new-pittsburgh-restaurants-to-try-this-spring-from-sushi-to-cuban/ | 2026 | low | Yemeni coffeehouse/grill; likely own-imported beans, unconfirmed. |
| 6e2659d0-623a-43b1-92e4-bd16467af9f0 | The Roaming Bean | Strip District | unnamed local roaster | — | C | https://madeinpgh.com/pittsburgh-food-drink/the-roaming-bean-coffee/ | 2026-03 | low | Multiple 2026 sources say "beans from one of the best local roasters" but none name it. |

---

## Bucket N — closed / not applicable

None. No shop in the worklist was found to be permanently closed or a non-coffee establishment. (Borderline cases — Panaderia Jazmin as a bakery, Socotra as a grill — still serve brewed coffee and are recorded as C, not N.)

---

## Flags for pass-2 / user attention
- **"Likely, confirm" A-rows** (primary inferred, not stated by shop): Caffe d'Amore, The Abbey (both rotate Commonplace/Tanager/Deeper Roots); The Baked Bean (Nicholas, inferred from sister business); Moonbeam (De Fer, ~2020 source + rotation); Orbis & Yinz (×8) (19 Coffee). Field Day & Delanie's have a named second roaster (Puff / Partners) — primary designation should be confirmed.
- **Anchor & Anvil** (both locations) is a deliberate rotating multi-roaster bar → bucket C; a single FK can't honestly represent it (user's call).
- **Bucket B never matched the existing table** after the orchestrator re-check — all 12 external roasters + 11 self-roasters are genuinely absent. Self-roasters (Parlor/Mediterra, Coffee Village, Canary/Black Canary, Rock 'n' Joe, etc.) would need a roaster record created before any FK exists.
- **Stale-source caution:** Constellation (Ceremony, 2017), Mediterra (Parlor, ~2018), Curbside (2019, pre-move) — recheck before relying on.
