-- Descriptions backfill for pgh.coffee
--
-- Generated for human review. Apply by hand (no migration framework in this repo).
-- All copy is third-person house style, rewritten from each row's own website /
-- Instagram / credible press. Keyed by primary key; trailing comment names the row.
--
-- Dollar-quoting ($d$...$d$) is used so apostrophes need no escaping.

-- ============================================================================
-- MIGRATION  (ships with the wiring PR; safe to run ahead of the data below)
-- ============================================================================

ALTER TABLE shops ADD COLUMN IF NOT EXISTS description text;

-- ============================================================================
-- COMPANIES
-- ============================================================================
-- 18 rows had no description. Existing third-person rows (Afters, BeanThru,
-- Commonplace, De Fer, Espresso a Mano, La Prima, Rock 'n' Joe, Tú y Yo) were
-- within house style and left untouched.

UPDATE companies SET description = $d$Brave Bean Coffee Company is a service-disabled veteran-owned coffee company based in Pitcairn, east of Pittsburgh. Founded by Air Force veteran Milo Speranzo with co-founder Ray Ramey, it roasts small-batch, ethically sourced coffee and directs a portion of proceeds to veteran charities.$d$ WHERE id = '77878cd4-273d-421d-b5d0-47c7180cffef'; -- Brave Bean Coffee Company

UPDATE companies SET description = $d$Brother Andre's Cafe is a faith-based social enterprise that provides meaningful employment to adults with intellectual and developmental disabilities. Operating under the Move A Mountain Missions ministry, it runs two Pittsburgh-area cafés — one downtown and one in Bellevue — pairing coffee and baked goods with a mission rooted in dignity through work.$d$ WHERE id = 'b435608a-74fa-4a64-9bdc-025ecef9b524'; -- Brother Andre's Cafe

UPDATE companies SET description = $d$COLOMBINO Coffee is a Pittsburgh company founded in 2020 by Sebastian Lloreda, importing green beans directly from small Colombian farms and roasting them in the South Hills. It is known for its direct-trade sourcing and a signature mocha that blends Colombian coffee and cacao.$d$ WHERE id = 'ab2524bd-ad30-4aa4-a534-30489a70f54c'; -- COLOMBINO Coffee

UPDATE companies SET description = $d$Convive Coffee is a Pittsburgh specialty coffee company operating multiple cafés alongside its own roastery. Known for a focus on quality and community, it also offers catering and mobile service from a vintage French coffee truck.$d$ WHERE id = '7e33f4fa-8483-4e82-8160-0c033fa5a295'; -- Convive Coffee

UPDATE companies SET description = $d$Delanie's Coffee is a specialty coffee shop on East Carson Street in Pittsburgh's South Side, housed in a historic building and long regarded as a neighborhood anchor. Co-owner Lavinia Ivanica took over the business in 2020. It brews beans from roasters including Onyx Coffee Lab and serves smoothies alongside espresso drinks.$d$ WHERE id = '35ac14e2-4eb6-4c91-952a-186e668d54bf'; -- Delanie's Coffee

UPDATE companies SET description = $d$Dynamic Coffee Roasters is a Pittsburgh coffee company founded by Andrew Delgado and Dylan Thomas, with deep roots in Honduran coffee farming. Working directly with growers, it prioritizes fair compensation and sustainable practices from farm to cup. Co-founder Andrew earned a 2025 StarChefs Rust Belt Rising Star award.$d$ WHERE id = 'fb3a074e-2955-4aa7-931c-87adb5507465'; -- Dynamic Coffee

UPDATE companies SET description = $d$Ineffable Cà Phê is a Vietnamese coffee shop in Pittsburgh's Lawrenceville neighborhood, opened in 2017 in a converted former motorcycle shop. It specializes in Vietnamese coffee, including cà phê sữa, and bánh mì sandwiches, with a menu drawn from the founder's heritage and memories of Vietnamese street food.$d$ WHERE id = '76e39c25-aa8a-4b66-8e49-a803d9184c35'; -- Ineffable Cà Phê

UPDATE companies SET description = $d$Mechanic Coffee is a Pittsburgh coffee roaster and café company with locations in Shadyside and Verona. It roasts its own single-origin and blended coffees and is known for its canned nitro cold brew, supported by wholesale and subscription programs.$d$ WHERE id = '97b9daa4-f6af-4d2f-a78c-f6b4a586890c'; -- Mechanic Coffee

UPDATE companies SET description = $d$Mediterra Cafe is a bakery, café, and artisan market with several locations across the Pittsburgh area, including Sewickley, Mt. Lebanon, Lawrenceville, and Cranberry. A companion to Mediterra Bakehouse, it pairs specialty coffee and artisan breads with curated cheeses, charcuterie, and imported specialty goods.$d$ WHERE id = 'c3bff338-c662-4baf-8432-4465a1b011a1'; -- Mediterra Cafe

UPDATE companies SET description = $d$Redhawk Coffee Roasters was founded in 2016 by husband-and-wife team Braden and Mary, starting as a coffee truck before growing into a Pittsburgh roastery with four café locations. The independent operation focuses on direct relationships with producers and a high attention to quality.$d$ WHERE id = 'b2a58d2c-916e-4897-a1cc-d19b05dcf3ec'; -- Redhawk Coffee Roasters

UPDATE companies SET description = $d$Rockin' Cat is a USDA Certified Organic, Fairtrade, and Carbon Neutral coffee company based in Bellevue, Pennsylvania. A certified Benefit Corporation, it roasts exclusively organic and fair-trade beans and uses fully compostable packaging as part of a commitment to transparent, sustainable practices.$d$ WHERE id = 'e66f5c0c-783e-4931-8711-f9df9529aba6'; -- Rockin' Cat

UPDATE companies SET description = $d$Ruckus Cafe blends coffee, food, music, and art across two Pittsburgh locations — one downtown on Liberty Avenue and one in Shaler. Beyond serving coffee, it functions as a community gathering space with gallery programming, live events, and support for local artists and musicians.$d$ WHERE id = '6ce24e15-c994-4e94-831d-73349e2db6ba'; -- Ruckus Cafe

UPDATE companies SET description = $d$Standing Wave Coffee is a family-run coffee company founded in 2020 by brothers Evan and Colin Frye, built around sustainable, eco-friendly practices. It has grown from an independent roastery into a brick-and-mortar café on Sarah Street in Pittsburgh's South Side.$d$ WHERE id = '1dad24f2-8d92-49e5-b031-5a5154514595'; -- Standing Wave Coffee

UPDATE companies SET description = $d$Tazza D'Oro is a specialty coffee café opened in 1999 by Amy Enrico in Pittsburgh's Highland Park neighborhood. Its name means "golden cup" in Italian, and it has long served as a community gathering place and host for local events in the East End.$d$ WHERE id = '140134e1-20a8-4af7-a8a7-4af45d0a6b02'; -- Tazza D'Oro

UPDATE companies SET description = $d$The Boredom Set is a Pittsburgh specialty coffee company co-founded by Q. Miller-Edwards and Jett Wasson, who learned to roast at Commonplace Coffee before launching the brand. It sources green coffee through small-volume direct relationships and operates cafés in Downtown and Shadyside.$d$ WHERE id = 'b9667143-a7a5-4131-ae6c-409d4f8651b6'; -- The Boredom Set

UPDATE companies SET description = $d$The Coffee Village is a Pittsburgh coffee company launched in December 2022, which bought and rebranded several shuttered Crazy Mocha locations. It operates cafés downtown — including on Liberty Avenue — along with Sewickley and Beaver, pairing specialty coffee with a focus on community and welcoming, art-filled spaces.$d$ WHERE id = '443e3277-d603-444d-a120-71609a0cbaa8'; -- The Coffee Village

UPDATE companies SET description = $d$Trace is a brewery and café on Main Street in Pittsburgh's Bloomfield neighborhood. Known for its house lager and rotating beers, the space doubles as a daytime café and community gathering spot, with rotating food-truck partners and a vocational brewing program.$d$ WHERE id = 'cafa0802-5ee6-4f8f-86a1-9684bf899481'; -- Trace

UPDATE companies SET description = $d$Yinz Coffee is a proudly local Pittsburgh coffee company founded in 2021 on the North Side. Leaning into Pittsburgh identity and dialect, it serves locally made products across its cafés and has grown quickly to roughly a dozen locations in neighborhoods around the city.$d$ WHERE id = 'eadf385b-a80b-4df2-9387-0db5d660c343'; -- Yinz Coffee

-- ============================================================================
-- ROASTERS
-- ============================================================================
-- Only objective violations rewritten: Commonplace (first-person, ~882 chars,
-- verbatim) and It's Still Coffee (first-person) recast to third person;
-- Mechanic Coffee (the lone NULL roaster row) given a description.

UPDATE roaster SET description = $d$Commonplace Coffee is a Pittsburgh specialty roaster founded in 2010, growing from a single Squirrel Hill location into one of the city's most recognized local coffee brands. It roasts its own coffee for cafés across several Pittsburgh neighborhoods and is known for a community-first approach and hands-on craft, including coffee classes and events.$d$ WHERE id = '5902c75b-a894-4390-9c6b-dc96afcd4132'; -- Commonplace Coffee

UPDATE roaster SET description = $d$It's Still Coffee is a specialty roaster built on the belief that any coffee can be a welcoming one. It pairs timeless, balanced profiles with innovative, boundary-pushing coffees while staying rooted in origin, treating each lot as a story shaped by place, people, and process.$d$ WHERE id = '82fad668-ab0e-47e8-86cd-112bc2ebdc6b'; -- It's Still Coffee

UPDATE roaster SET description = $d$Mechanic Coffee roasts its own single-origin and blended coffees for its Shadyside and Verona cafés in the Pittsburgh area, along with wholesale partners. It is known for its canned nitro cold brew and a rotating lineup of named blends.$d$ WHERE id = '62fdc95a-bdeb-44c4-a5e7-513b161e8b5f'; -- Mechanic Coffee


-- ============================================================================
-- SHOPS
-- ============================================================================

-- --- Shadyside (sample batch: 5 company-linked, 3 independent) ---

UPDATE shops SET description = $d$Commonplace Coffee's Shadyside café, on Walnut Street, pours the Pittsburgh roaster's own coffee. Founded in 2010 in Squirrel Hill, Commonplace has grown into one of the city's most recognized local brands, known for craft roasting and a community-first approach.$d$ WHERE uuid = 'd2aafc02-2f93-4e08-8651-34cfe925f9a6'; -- Commonplace Coffee / Shadyside

UPDATE shops SET description = $d$This Shadyside location of Delanie's Coffee sits on South Highland Avenue, an offshoot of the specialty shop that anchors East Carson Street on the South Side. It brews beans from roasters including Onyx Coffee Lab alongside espresso drinks and smoothies.$d$ WHERE uuid = '82252d12-3e03-4116-8d76-33b5849aea2b'; -- Delanie's Coffee / Shadyside

UPDATE shops SET description = $d$Mechanic Coffee's Shadyside café on Ellsworth Avenue is the roaster's neighborhood home, serving its house-roasted single-origins and blends. Mechanic roasts its own coffee and is known for canned nitro cold brew, with a second café in Verona.$d$ WHERE uuid = 'fd300a3a-1dbe-4543-b40d-d67271d79fbc'; -- Mechanic Coffee / Shadyside

UPDATE shops SET description = $d$The Boredom Set's Shadyside café on Walnut Street serves coffee roasted by the Pittsburgh company, which sources green beans through small-volume direct relationships with producers. Co-founded by Q. Miller-Edwards and Jett Wasson, the brand also operates a Downtown location.$d$ WHERE uuid = '28760e7d-5bbc-4ab5-8290-4fab1e6477e0'; -- The Boredom Set / Shadyside

UPDATE shops SET description = $d$The Coffee Tree Roasters' Walnut Street café is one of the Shadyside roots of a Pittsburgh institution founded in 1993. The certified woman-owned company roasts its own coffee and operates several cafés across the region.$d$ WHERE uuid = '7373f23d-b3ef-4af1-babd-299982f0f8d2'; -- The Coffee Tree Roasters / Shadyside

UPDATE shops SET description = $d$Centred Coffee & Wellness is an independent café on Centre Avenue, opened in 2020, that pairs specialty coffee with wellness-minded drinks. It pours coffee from Redstart Roasters, makes its alternative milks in-house from sprouted nuts, sweetens with natural options instead of refined sugar, and offers functional add-ins like collagen and mushrooms.$d$ WHERE uuid = 'c73c8cb1-22db-4202-a977-5829865f1a92'; -- Centred Coffee & Wellness / Shadyside

UPDATE shops SET description = $d$Jitters Cafe has been a Walnut Street fixture in Shadyside since 1996, a neighborhood institution focused on quality coffee and regulars over expansion. It serves single-origin and blended coffees and sells beans for home brewing.$d$ WHERE uuid = '09bb76b6-ce63-4a65-adbf-0a58657635da'; -- Jitters Cafe / Shadyside

UPDATE shops SET description = $d$Spot of Coffee is a small café tucked into an alley behind Kelly's Bar and Paris 66, opened by owner Nabeel Haque. It is known for inventive lattes — like a carrot cake latte with cream cheese cold foam — made with house-made syrups and quality ingredients, with no refined sugars and house-made alternative milks.$d$ WHERE uuid = '5b628bf2-8c54-4374-bdae-4762228ba1a2'; -- Spot of Coffee / Shadyside

-- --- Allegheny West ---
UPDATE shops SET description = $d$COLOMBINO Coffee's Allegheny West cafe sits on Western Avenue on Pittsburgh's North Side. COLOMBINO was founded in 2020 by Sebastian Lloreda, imports green beans directly from small Colombian farms, and roasts in the South Hills. It is known for direct-trade sourcing and a signature mocha that blends Colombian coffee and cacao.$d$ WHERE uuid = 'afee67b1-2e28-4793-9cbe-3565ccaf59b7'; -- COLOMBINO Coffee / Allegheny West

-- --- Allentown ---
UPDATE shops SET description = $d$Grim Wizard Coffee is a heavy metal-themed coffee shop in Allentown, billing itself as a temple of caffeinated alchemy and creative expression and an underground community space for alternative and counterculture patrons. It serves fair-trade coffee roasted in small batches, sourced from Baltimore-based Zeke's Coffee, alongside merchandise.$d$ WHERE uuid = '10eed196-e451-4b95-b008-15526b93f6e0'; -- Grim Wizard Coffee / Allentown

-- --- Arlington ---
UPDATE shops SET description = $d$Hilltop Coffee is a neighborhood cafe on Arlington Avenue in Pittsburgh's Arlington neighborhood. It serves espresso drinks and seasonal beverages, keeping early hours seven days a week, and sells retail coffee beans through partner roaster Thomas and Fisk.$d$ WHERE uuid = 'c5ad6db9-875a-4150-af0c-e7391a9a64fb'; -- Hilltop Coffee / Arlington

-- --- Aspinwall ---
UPDATE shops SET description = $d$ABC Coffee Company is a coffee shop on Brilliant Avenue in Aspinwall that has served the area for more than a decade. Alongside espresso drinks it scoops handmade ice cream from Dave and Andy's, the Oakland creamery making ice cream since 1983, and pours coffee from Pittsburgh's historic Nicholas Coffee & Tea Co.$d$ WHERE uuid = 'a3dae785-5218-42c9-ac47-7421b079c4a9'; -- ABC Coffee Company / Aspinwall
UPDATE shops SET description = $d$Vibrant Sunshine Juicery Cafe on Delafield Road in Aspinwall is a health-focused, plant-forward cafe known for cold-pressed juices and blended drinks made fresh daily from organic produce. It also serves house kombucha and coffee from Pittsburgh's Redhawk Coffee Roasters, and is home to Pittsburgh Juice Company's cold-press production.$d$ WHERE uuid = '65b27404-0fe9-4b25-8903-79a85fb50925'; -- Vibrant Sunshine Juicery Cafe / Aspinwall

-- --- Bellevue ---
UPDATE shops SET description = $d$BeanThru is a drive-thru-only coffee stop on Ohio River Boulevard in Bellevue. Known for its flavored lattes, it pours La Prima espresso for a quick caffeine fix without leaving the car.$d$ WHERE uuid = '36b189fc-87ee-4258-bd90-ba7bc545b8b6'; -- BeanThru / Bellevue
UPDATE shops SET description = $d$Brother Andre's Cafe operates a location on North Jackson Avenue in Bellevue. A faith-based social enterprise under the Move A Mountain Missions ministry, it provides meaningful employment to adults with intellectual and developmental disabilities, pairing coffee and baked goods with a mission rooted in dignity through work.$d$ WHERE uuid = 'cf2150be-d6c5-4055-8c69-1537659a287f'; -- Brother Andre's Cafe / Bellevue
UPDATE shops SET description = $d$Haven Cafe is a woman-owned cafe on North Balph Avenue in Bellevue, the passion project of longtime resident Danielle, who also runs an adjacent bookstore. Its scratch kitchen turns out comfort-food beverages, sandwiches, salads, soups, and sweets — including a well-known banana pudding — in a space built around community and mental health advocacy.$d$ WHERE uuid = '5aa1f459-30ec-4f29-9020-a3e0d448b07b'; -- Haven Cafe / Bellevue
UPDATE shops SET description = $d$Rockin' Cat is an organic coffee and tea company on Lincoln Avenue in Bellevue, a USDA Organic, Fairtrade, and Carbon Neutral certified B-Corp roaster. It serves fair-trade organic specialty coffees and teas and champions artists, designers, and sustainable business practices.$d$ WHERE uuid = 'd34f6f7b-1dfc-4eae-aae2-08c26d142791'; -- Rockin' Cat / Bellevue
UPDATE shops SET description = $d$Wunderbar Coffee and Bistro sits on Lincoln Avenue in downtown Bellevue, pairing Italian-inspired specialty coffee and tea with French-style crepes. The kitchen also turns out gourmet sandwiches, soups, and salads, emphasizing local ingredients including coffee from Elmo Fired Beans and buckwheat flour from Zanella Milling.$d$ WHERE uuid = 'ea2257e2-b415-4f38-9c59-694a971f349a'; -- Wunderbar Coffee and Bistro / Bellevue

-- --- Ben Avon ---
UPDATE shops SET description = $d$Anchor & Anvil Coffee Bar is a neighborhood coffee bar on Church Avenue in Ben Avon, established in 2009. It serves traditional espresso and tea plus signature drinks like the Smokestack Mocha, brewing beans from roasters including De Fer, Rothrock, and ReAnimator, and rounds out the menu with pastries, Oram's donuts, and Millie's ice cream.$d$ WHERE uuid = '2f989070-bc14-48a5-a54a-d470a734e94c'; -- Anchor & Anvil Coffee Bar / Ben Avon

-- --- Bethel Park ---
UPDATE shops SET description = $d$COLOMBINO Coffee's Bethel Park cafe sits on South Park Road in the South Hills, near where the company roasts its coffee. Founded in 2020 by Sebastian Lloreda, COLOMBINO imports green beans directly from small Colombian farms and is known for direct-trade sourcing and a signature mocha blending Colombian coffee and cacao.$d$ WHERE uuid = 'c963708a-c73d-4c94-98bf-03a691665df7'; -- COLOMBINO Coffee / Bethel Park
UPDATE shops SET description = $d$Reginald's Coffee is a roaster and cafe on South Park Road in Bethel Park that roasts its beans on-site, offering single-origin coffees such as Ethiopia Yirgacheffe and Guatemala Acodihue. It is known for Saturday donuts available by pre-order and ships its coffee nationwide, under the motto "Life is short, drink good coffee."$d$ WHERE uuid = 'c68064c0-074a-4d18-a4f0-e529c9b38f62'; -- Reginald's Coffee / Bethel Park

-- --- Blawnox ---
UPDATE shops SET description = $d$Rosaflorida Coffee is a small, welcoming cafe on Freeport Road in Blawnox run by Juan and his team. It serves espresso and lattes brewed from coffee sourced from Juan's father's farm in Colombia, alongside pastries.$d$ WHERE uuid = '47083196-2301-4a52-82a4-e99f23a644ae'; -- Rosaflorida Coffee / Blawnox
UPDATE shops SET description = $d$The Black Canary is a coffee and ice cream shop on Freeport Road in Blawnox built around the idea of "Coffee + Community." It sells its own roasted coffee blends, offers a monthly coffee subscription, and pairs drinks and frozen treats with merchandise and catering.$d$ WHERE uuid = '56d6ad91-9c03-48c2-8c11-715d54019f49'; -- The Black Canary / Blawnox

-- --- Bloomfield ---
UPDATE shops SET description = $d$Creative Chem Co is a cafe and coworking club on Friendship Avenue in Bloomfield, with a public ground-floor cafe and a members-only workspace upstairs offering hot desks, meeting rooms, and focus booths. It has partnered with Commonplace Coffee — the Pittsburgh roaster founded in 2010 — to serve its craft coffee, amid a vintage, plant-filled space.$d$ WHERE uuid = '77893b35-b573-4d1c-a8da-6d183c9d061c'; -- Creative Chem Co / Bloomfield
UPDATE shops SET description = $d$Trace Brewing is a Bloomfield brewery and cafe on Main Street that pairs its beer with coffee from the barista-owned Ghost Coffee Collab. The taproom doubles as a daytime cafe and neighborhood gathering spot.$d$ WHERE uuid = '417fe5ec-3eb0-436e-a5fa-3cf4c14ad1cf'; -- Trace Brewing / Bloomfield
UPDATE shops SET description = $d$White Whale Bookstore is Pittsburgh's family-owned independent bookstore on Liberty Avenue in Bloomfield, moved to the neighborhood in 2012 and operating under its current name and ownership since 2016. Alongside new and used books, it runs a cozy cafe serving coffee from Pittsburgh's Commonplace Coffee, plus teas and baked goods, and hosts author events.$d$ WHERE uuid = '99b375a1-5e0d-493e-afbf-4b356cf626b6'; -- White Whale Bookstore / Bloomfield
UPDATE shops SET description = $d$Yinz Coffee's Bloomfield cafe sits on Liberty Avenue. Founded on the North Side in 2021 with proudly-Pittsburgh branding, Yinz has grown to roughly a dozen locations and pours coffee from South Hills wholesale roaster 19 Coffee.$d$ WHERE uuid = '3fa0ee94-e6cb-4b49-9520-88588c5a4c5f'; -- Yinz Coffee / Bloomfield

-- --- Bluff ---
UPDATE shops SET description = $d$Trace Echo + Ghost Coffee is a coffee outpost on Forbes Avenue in the Bluff, tied to Bloomfield's Trace Brewing and built around the barista-owned Ghost Coffee Collab. It brings Ghost's specialty coffee to the Uptown/Duquesne University corridor.$d$ WHERE uuid = 'd255b83f-92b9-4813-8669-32b101c22670'; -- Trace Echo + Ghost Coffee / Bluff

-- --- Bradford Woods ---
UPDATE shops SET description = $d$Station No. 5 is a specialty coffee shop on Bradford Road in Bradford Woods that pairs its drinks with vintage and artisan goods. It sources from regional suppliers including McCandless roaster Pico Coffee Co., Marburger Dairy, and baked goods from The Munching Moose in Zelienople.$d$ WHERE uuid = 'bc3aa7c5-fc61-48b9-9849-67e41d15b052'; -- Station No. 5 / Bradford Woods

-- --- Brentwood ---
UPDATE shops SET description = $d$Cafe 8848 is a coffee shop in Brentwood Town Square on Brownsville Road, named for the height of Mount Everest in meters. It serves single-origin hand-poured coffees and a wide range of espresso and specialty drinks, alongside housemade pastries and desserts including the Pittsburgh-classic burnt almond torte.$d$ WHERE uuid = '9f9661bc-5e27-4dc9-9b4e-709e402a52d4'; -- Cafe 8848 / Brentwood

-- --- Bridgeville ---
UPDATE shops SET description = $d$LaBella Bean is a coffeehouse on Washington Avenue in Bridgeville with an Italian-influenced menu. Alongside drip coffee, espresso drinks, and tea, it serves house-made sandwiches on rustic Italian baguettes, paninis, salads, and breakfast pastries.$d$ WHERE uuid = '7f016adb-1a7b-4c0a-996a-31eb100c8f94'; -- LaBella Bean / Bridgeville

-- --- Brighton Heights ---
UPDATE shops SET description = $d$California Coffee Bar takes its name from its spot on California Avenue in Brighton Heights and is co-owned by Susie Lobdell and Sarah Mendak. Beyond roasted coffees and espresso, it serves custom teas, cold-press juices, smoothies, and light eats, with a downstairs styled like an '80s diner and a remote-worker-friendly cafe upstairs. It pours coffee from South Hills roaster 19 Coffee.$d$ WHERE uuid = '4f945fd9-faf1-49f1-933a-5acf5070447b'; -- California Coffee Bar / Brighton Heights

-- --- Brookline ---
UPDATE shops SET description = $d$802 Bean Company is a cozy neighborhood coffee shop on Brookline Boulevard, established in 2017, pouring La Prima coffee — the Pittsburgh Italian-style espresso roaster operating since 1988. Alongside espresso and lattes it offers baked goods, Madsen donuts, a back patio, and rotating local art.$d$ WHERE uuid = 'f4077fd3-3cc9-46cb-8f15-5036cb86308d'; -- 802 Bean Company / Brookline
UPDATE shops SET description = $d$Socotra Cafe and Grill is a Yemeni-style coffeehouse and grill on Brookline Boulevard, billed as one of the neighborhood's first Yemeni spots. It serves premium Yemeni coffee and tea — Adeni tea, spiced and pistachio lattes — alongside honey-drizzled pastries and a full kitchen of shawarma, falafel, and rice plates.$d$ WHERE uuid = '38ec3a31-a6e3-4cb8-b902-a97354a886a8'; -- Socotra Cafe and Grill / Brookline

-- --- Carnegie ---
UPDATE shops SET description = $d$Carnegie Coffee Company is an Italian-style espresso bar in downtown Carnegie, housed in a converted historic post office that Greg Romeo and Ashley Comer renovated and opened around 2013. It pours Lavazza espresso and Mighty Leaf teas, baking its pastries in-house daily and serving breakfast and lunch made to order.$d$ WHERE uuid = '22f12ab1-2698-4ec1-96d2-7d59e8e6134a'; -- Carnegie Coffee Company / Carnegie

-- --- Castle Shannon ---
UPDATE shops SET description = $d$Anthos Bakery & Café is a Greek bakery and cafe on Willow Avenue in Castle Shannon, opened in 2022 by a family who moved from Athens to Pittsburgh. Its name means "blossom" in Greek, and it pairs artisan breads and pastries with an all-day Greek menu spanning souvlaki, horiatiki salad, moussaka, and pastitsio.$d$ WHERE uuid = 'f3abaed1-1aef-4bfc-ace1-293f63ede876'; -- Anthos Bakery & Café / Castle Shannon
UPDATE shops SET description = $d$Cafe Americano is a cafe on Mt. Lebanon Boulevard in Castle Shannon known for its crepes alongside coffee, espresso drinks, and pastries such as almond croissants. It serves breakfast, brunch, and lunch in a casual, trendy setting and has been recognized as a neighborhood favorite.$d$ WHERE uuid = '49992cd6-88b6-4d99-8a8e-dc26ec31ff3e'; -- Cafe Americano / Castle Shannon
UPDATE shops SET description = $d$Coffee, Etc. is a family-owned coffee shop on Willow Avenue in Castle Shannon, established in 2017 and run by barista owners. Alongside lattes and breakfast, it operates a grab-and-go deli bar with sandwiches made from Boar's Head meats and cheeses, plus soups, parfaits, and gluten-free options.$d$ WHERE uuid = 'b4c73f50-bb0b-4f8a-b8e1-b89586e3f854'; -- Coffee, Etc. / Castle Shannon
UPDATE shops SET description = $d$Pour Johnny's is a specialty espresso and smoothie shop in Castle Shannon's Center 88 on Library Road, brewing beans from De Fer Coffee & Tea in the Strip District. The take-out and curbside operation also serves cold brew, teas, fresh-fruit smoothies, and signature "Quenchers," and runs a mobile coffee cart for events.$d$ WHERE uuid = 'bdacb04a-3889-416d-ba94-d860d3f0eaa8'; -- Pour Johnny's / Castle Shannon

-- --- Central Lawrenceville ---
UPDATE shops SET description = $d$Afters Cafe's Lawrenceville location sits on Butler Street, an outpost of the Squirrel Hill original known for specialty coffee paired with pastries. The cafe serves coffee from Pittsburgh wholesale roaster 19 Coffee.$d$ WHERE uuid = '501630ce-ce40-4935-85f7-cd8b32bc8d46'; -- Afters Cafe / Central Lawrenceville
UPDATE shops SET description = $d$Constellation Coffee is an espresso bar on Penn Avenue in Lawrenceville that has served fine coffee and tea since October 2013. It keeps up with progressive coffee techniques and offers limited indoor seating along with a garden area when weather permits, plus a back room available by reservation.$d$ WHERE uuid = '27a444fc-6558-4569-8e1e-b49914cb5e67'; -- Constellation Coffee / Central Lawrenceville
UPDATE shops SET description = $d$Convive Coffee's Lawrenceville cafe on Butler Street is part of the Pittsburgh specialty roaster's lineup, pouring house blends like the medium-roast Folksy and Revive espresso. The roastery name comes from a Latin word meaning to feast together, and Convive also runs a vintage French coffee truck for catering and events.$d$ WHERE uuid = '2282fe40-cd03-4dfd-8354-ef9c82343b9c'; -- Convive / Central Lawrenceville
UPDATE shops SET description = $d$Inkwell is a craft coffee shop on Butler Street in the heart of Lawrenceville, pouring De Fer coffee in lattes and cold brews. The cozy space features rotating local artwork and serves homemade small-batch baked goods alongside a limited menu of rustic sandwiches.$d$ WHERE uuid = '4c03a9b2-7d8d-4461-93ef-fa1cb9dee387'; -- Inkwell / Central Lawrenceville
UPDATE shops SET description = $d$Standing Wave Coffee, founded in 2020 by brothers Evan and Colin Frye, runs its Lawrenceville presence on Butler Street with a sustainability focus. The roaster names its coffees after whitewater rapids on the Youghiogheny River and pledges to reinvest 5% of profits into protecting local river ecosystems.$d$ WHERE uuid = '000dadc9-3ed2-4f9b-b3da-40ab69f8b678'; -- Standing Wave Coffee / Central Lawrenceville
UPDATE shops SET description = $d$The Abbey on Butler Street is a multi-room cafe and restaurant in Lawrenceville with distinct spaces including the Vesper Room, the Parlour Bar, and an arcade. It serves Pittsburgh-roasted Commonplace Coffee alongside a from-scratch food menu and an extensive cocktail list.$d$ WHERE uuid = 'fc3df462-b25e-49da-9e52-84be9e9c913a'; -- The Abbey / Central Lawrenceville

-- --- Central Northside ---
UPDATE shops SET description = $d$Yinz Coffee's original shop opened in 2021 on the North Side just off Federal Street at East North Avenue, leaning hard into Pittsburgh culture and dialect. The cafe serves hot and cold drinks, pastries, and Breadbox Sandwich & Sweet Shop items, and pours coffee from Pittsburgh roaster 19 Coffee.$d$ WHERE uuid = '605caff1-3f8e-4492-9668-00f3251a81f8'; -- Yinz Coffee / Central Northside

-- --- Central Oakland ---
UPDATE shops SET description = $d$Divvy Coffee & Buns is a coffee and bun cafe on Forbes Avenue in Oakland, pairing Pittsburgh-roasted Commonplace Coffee with globally inspired food. The menu draws on flavors and ingredients from around the world and includes gluten-free and vegan items.$d$ WHERE uuid = 'eb8724b6-9ddd-41b0-b082-39e496d92096'; -- Divvy Coffee & Buns / Central Oakland

-- --- Cheswick ---
UPDATE shops SET description = $d$Latte Lane Coffee Co. is a bright, modern coffee shop on Pittsburgh Street in Cheswick with both a drive-thru and a cafe. It serves creative lattes, seasonal specials, and signature cold foams alongside breakfast sandwiches, toasts, paninis, and baked goods, brewing La Prima Espresso coffee.$d$ WHERE uuid = 'fbb11b5e-4270-4064-96ed-2966ead6ac42'; -- Latte Lane Coffee Co. / Cheswick

-- --- Coraopolis ---
UPDATE shops SET description = $d$Anchor & Anvil Coffee Bar opened on 5th Avenue in Coraopolis in early 2017, serving coffee, espresso, and tea with signature drinks plus a light breakfast menu. It sources beans from roasters around Pittsburgh and beyond, and also offers ice cream and freshly made donuts.$d$ WHERE uuid = '405f02e5-1732-455e-8b27-097d211c7552'; -- Anchor & Anvil Coffee Bar / Coraopolis
UPDATE shops SET description = $d$Caffe' Nera is a family-owned cafe in the Coraopolis business district on 4th Avenue, serving espresso lattes, chai, cold brew, and matcha alongside fresh-baked goods. The menu also covers breakfast items, sandwiches, waffles, and desserts, and the seating area features a distinctive star ceiling.$d$ WHERE uuid = '733450c5-affe-469c-958b-8257ccd0fe75'; -- Caffe' Nera / Coraopolis
UPDATE shops SET description = $d$Queen Beans Cafe is an independently owned coffee shop on 5th Avenue in Coraopolis with a drive-through and a walk-up window. It serves crafted coffees, breakfast sandwiches, lunch options, and fresh-baked goods like cinnamon rolls and scones, and offers catering and a coffee cart for events.$d$ WHERE uuid = 'a58f4b75-2e06-463b-b3a6-fd9ac661699c'; -- Queen Beans Cafe / Coraopolis

-- --- Crafton ---
UPDATE shops SET description = $d$Fig Tree Coffee is a specialty coffee shop and espresso bar on Crafton Boulevard, aiming to bring quality local beverages, food, and a community gathering space to the Crafton area.$d$ WHERE uuid = 'd05e91ff-ecbc-452e-9e5c-6c7eedae360b'; -- Fig Tree Coffee / Crafton

-- --- Crawford-Roberts ---
UPDATE shops SET description = $d$Brother Andre's Cafe is a faith-based social enterprise on Washington Place that provides meaningful employment to adults with intellectual and developmental disabilities. Operating under Move A Mountain Missions, it serves espresso drinks, specialty coffee blends, and pastries, and a portion of proceeds supports the mission.$d$ WHERE uuid = '20c333e9-7123-4830-90be-9ea9a3f26b77'; -- Brother Andre's Cafe / Crawford-Roberts
UPDATE shops SET description = $d$CARES CommuniTEA Cafe opened on Centre Avenue in the Hill District in February 2021 in a former Crazy Mocha, as a social enterprise providing entrepreneurship and workforce experience to youth and young adults. It pours coffee ground daily from The Coffee Tree Roasters, with blends named after notable figures, and hosts community conversations, book clubs, and jazz events.$d$ WHERE uuid = '1ccd9edf-fb8a-4bad-850d-016d7f717178'; -- Cares CommuniTEA Cafe / Crawford-Roberts
UPDATE shops SET description = $d$This Redhawk Coffee cafe sits on Fifth Avenue near the Hill District, part of the Pittsburgh roaster founded in 2016 by Braden and Mary that began as a coffee truck. Redhawk roasts its own coffee built on direct producer relationships and now runs several cafes across the city.$d$ WHERE uuid = 'b323b2f8-9bdf-4ea9-91c5-12d86ed52e0d'; -- Redhawk Coffee / Crawford-Roberts

-- --- Dormont ---
UPDATE shops SET description = $d$Espresso a Mano is a Pittsburgh coffee company whose Dormont cafe sits on Potomac Avenue, one of three neighborhood locations alongside Lawrenceville and Squirrel Hill. The shop emphasizes careful coffee sourcing and serves espresso drinks and brewed coffee.$d$ WHERE uuid = '2555a2dd-5513-4560-85cc-9367d9cfa920'; -- Espresso A Mano / Dormont
UPDATE shops SET description = $d$Potomac Station Coffeehouse occupies a renovated storefront on Potomac Avenue in Dormont, by the light rail station at Potomac and Broadway, in a space that housed George the Tailor for more than 80 years. The cafe partners with Washington, PA roaster 19 Coffee and serves specialty lattes, teas, pastries, and grab-and-go bites.$d$ WHERE uuid = '9ffac27f-91e7-4137-a494-67509300c204'; -- Potomac Station Coffeehouse / Dormont

-- --- Downtown ---
UPDATE shops SET description = $d$The Coffee Village's Downtown cafe sits on Liberty Avenue, part of the operator that launched in December 2022 by buying and rebranding shuttered Crazy Mocha locations. It serves specialty arabica coffee, espresso drinks, and teas, with companion cafes in Sewickley and Beaver.$d$ WHERE uuid = '8cda8aae-58a7-458b-ac12-fd99ae444c90'; -- Coffee Village / Downtown
UPDATE shops SET description = $d$De Fer Coffee & Tea's Downtown cafe sits on Penn Avenue in the Cultural District. De Fer was founded in 2017 by Matt and Vanessa Marietti, is employee-owned, and roasts its own coffee, with six locations across the Pittsburgh area.$d$ WHERE uuid = '1dcb2e87-93a2-4203-b1a4-57318c6145f8'; -- De Fer Coffee & Tea / Downtown
UPDATE shops SET description = $d$Gasoline Street Coffee is a Downtown coffee shop on First Avenue, taking its name from the street, with a "building community one cup at a time" focus. It pours Pittsburgh-roasted Commonplace Coffee and offers espresso drinks and signature beverages.$d$ WHERE uuid = '04887aad-d383-4ad5-86d5-862564a1304a'; -- Gasoline Street Coffee / Downtown
UPDATE shops SET description = $d$La Prima Espresso's original cafe anchors the Strip District on Smallman Street, where Sam Patti founded the company in 1988. It brings the energy of an Italian-style espresso bar with authentic espresso, single-origin coffees, and house blends, roasting Italian-style coffee that it also distributes from its Manchester roastery.$d$ WHERE uuid = 'd9ce52d9-adfb-42ee-8034-40fbc00233ea'; -- La Prima / Downtown
UPDATE shops SET description = $d$Nicholas Coffee & Tea Co. has been a fixture of Market Square since 1957, family-run since 1919 and now into a fourth generation. The historic red-building coffee bar craft-roasts its own coffee and offers a wide range of blends, single origins, and teas, including its Centennial Blend.$d$ WHERE uuid = '85751c64-6daf-4353-a705-6373dad4970a'; -- Nicholas Coffee & Tea Co. / Downtown
UPDATE shops SET description = $d$Origin Story Coffee is a hero- and comic-themed cafe on Smithfield Street in Downtown Pittsburgh, where coffee meets storytelling. Owner Christian Watts relocated from Asheville, NC after Hurricane Helene flooding in 2024, opening with help from the Pittsburgh Downtown Partnership; the shop serves handcrafted espresso drinks and specialty lattes.$d$ WHERE uuid = 'e632b8d6-7a91-45e7-b2ad-36ca09039d5c'; -- Origin Story Coffee / Downtown
UPDATE shops SET description = $d$Rock 'n' Joe's Downtown location sits on Penn Avenue in the heart of the Cultural District, part of the rock 'n' roll-themed specialty coffee brand founded in 1993. The cozy shop pours handcrafted coffee drinks and offers seating across two floors.$d$ WHERE uuid = 'c77638b2-f684-4013-be78-1d0b7660f46f'; -- Rock 'n' Joe / Downtown
UPDATE shops SET description = $d$Ruckus Cafe brings coffee, food, and cultural programming to 625 Liberty Avenue in Downtown Pittsburgh, one of its two locations alongside Shaler. Beyond espresso and a kitchen menu, the venue doubles as a stage and gallery, hosting live music and rotating art and welcoming submissions from local artists and musicians. It pours coffee from Strip District roaster Allegheny Coffee & Tea Exchange.$d$ WHERE uuid = 'f3cea99c-c6b7-4b43-82af-a4ab8ac56e74'; -- Ruckus Cafe / Downtown
UPDATE shops SET description = $d$The Boredom Set is a specialty coffee company co-founded by Q. Miller-Edwards and Jett Wasson, sourcing its green coffee through small-volume direct relationships and roasting it for its own cafes. This Market Street location anchors the company's Downtown presence, a few blocks from Market Square, with a companion cafe in Shadyside.$d$ WHERE uuid = '8fcefd2c-bdef-424f-b834-914dfb9ce8f9'; -- The Boredom Set / Downtown
UPDATE shops SET description = $d$Yinz Coffee is a proudly-Pittsburgh chain founded on the North Side in 2021 that has since grown to roughly a dozen locations across the region. This cafe sits along Fort Duquesne Boulevard near the Cultural District riverfront in Downtown Pittsburgh, serving espresso drinks brewed with South Hills roaster 19 Coffee.$d$ WHERE uuid = '0f4f5ebe-23ee-4216-b9ea-08eb81b06ad0'; -- Yinz Coffee / Downtown (Fort Duquesne)
UPDATE shops SET description = $d$Yinz Coffee is a proudly-Pittsburgh chain founded on the North Side in 2021, now with around a dozen locations regionwide. This outpost sits on Grant Street in the heart of Downtown's government and business corridor, near the courthouse and city offices, pouring coffee from South Hills roaster 19 Coffee.$d$ WHERE uuid = 'eb5d9630-df29-47da-bb20-d5aef18af118'; -- Yinz Coffee / Downtown (Grant St)
UPDATE shops SET description = $d$Yinz Coffee is a proudly-Pittsburgh chain that started on the North Side in 2021 and has expanded to roughly a dozen locations. This Stanwix Street cafe serves the western edge of Downtown near Point State Park and Gateway Center, offering espresso drinks made with South Hills roaster 19 Coffee.$d$ WHERE uuid = 'b0d2d4a0-8703-4cb4-9c47-24d080afb966'; -- Yinz Coffee / Downtown (Stanwix)

-- --- East Allegheny ---
UPDATE shops SET description = $d$Annex began in 2018 when owners Jason and Lauren restored an 1860s building on East Ohio Street in Pittsburgh's Deutschtown, opening as a clothing and goods shop before adding an espresso bar. Annex Espresso & Goods now pours drip coffee, espresso, americanos, and cortados using Commonplace Coffee, pairing a curated retail space with a neighborhood coffee counter.$d$ WHERE uuid = '7873b791-9d26-4f90-beeb-909ed5fa749c'; -- Annex PGH / East Allegheny
UPDATE shops SET description = $d$Kinder Being Cafe operates inside Government Center, a record shop and bar on East Street on Pittsburgh's North Side. It serves traditional and inventive coffee drinks brewed with Espresso a Mano, along with tea, matcha, and locally made food, and keeps a free community resource corner stocked with supplies like Narcan. The space hosts evening events including craft fairs, art shows, and DJ sets.$d$ WHERE uuid = '4184cb89-be48-46a3-84e2-88a909a05af7'; -- Kinder Being Cafe / East Allegheny
UPDATE shops SET description = $d$The Garden Cafe is a neighborhood coffee shop on the North Side, serving the Spring Hill and Spring Garden communities with coffee and light fare. It brews beans exclusively from La Prima Espresso and rotates daily pastries from Driftwood Oven in Lawrenceville. A takeout window and patio supplement the limited indoor seating.$d$ WHERE uuid = '3c4a5839-1c27-46e0-b88d-762b94630cc5'; -- The Garden Cafe / East Allegheny

-- --- East Liberty ---
UPDATE shops SET description = $d$Dynamic Coffee: La Galeria is the East Liberty cafe of Dynamic Coffee Roasters, the Pittsburgh company founded by Andrew Delgado and Dylan Thomas with deep roots in Honduran coffee farming and direct grower relationships. On Penn Avenue, it serves the roaster's own coffee, the work of a team whose co-founder Andrew earned a 2025 StarChefs Rust Belt Rising Star award.$d$ WHERE uuid = 'fa42ce7e-6cca-4f61-930f-f3a52bd6e015'; -- Dynamic Coffee: La Galeria / East Liberty
UPDATE shops SET description = $d$LV Coffee Project is a coffee shop on South Highland Avenue in Pittsburgh's East Liberty, set in an adapted historic building with tall windows and long communal tables. It is known for inventive specialty drinks such as a black sesame latte and a honey saffron latte, paired with pastries like croissants and canelés.$d$ WHERE uuid = '9f2b01f1-33b2-45b8-b74d-be8179a11c9e'; -- LV Coffee Project / East Liberty
UPDATE shops SET description = $d$Margaux is a European-inspired cafe-bar at the corner of Penn and Highland Avenues in East Liberty. By day it serves specialty coffee, espresso drinks, and pastries including Liège waffles; in the evening it shifts into a cocktail bar with craft drinks, wine, and shareable plates like charcuterie and croquettes.$d$ WHERE uuid = 'c9992ead-9fba-47be-bb2a-89350639ae9c'; -- Margaux / East Liberty
UPDATE shops SET description = $d$Redstart Roasters is a specialty coffee roaster and cafe on North Euclid Avenue in East Liberty, roasting in small batches to order. It centers its identity on bird-friendly, sustainable sourcing, partnering with conservation-minded organizations and offering single-origin coffees from origins such as Nicaragua, Ethiopia, and Guatemala.$d$ WHERE uuid = '65a536eb-0d65-4e1b-ba65-5b96d66fbcca'; -- Redstart Roasters / East Liberty

-- --- Edgewood ---
UPDATE shops SET description = $d$Spigolo is a neighborhood coffeehouse on Edgewood Avenue, opened to give the area a walkable gathering spot near Regent Square. It serves espresso drinks, cold brew, and specialty beverages like chai and matcha, with vegan baked goods and a rotating food menu drawn from co-owner Jessica's restaurant background. The shop brews coffee from Pittsburgh's Redhawk Coffee Roasters.$d$ WHERE uuid = '580a1c6a-28d4-4f9a-a63f-6985ec0af1e9'; -- Spigolo / Edgewood

-- --- Forest Hills ---
UPDATE shops SET description = $d$Roll Up Coffee Shop is a small family-run spot on Greensburg Pike in Forest Hills, near the municipal building. Alongside coffee and cold brew, it serves fresh juices, smoothies, ice cream, and sweets, and runs a food truck with a rotating menu outside the shop several days a week.$d$ WHERE uuid = 'ccd80d4e-d7d0-495b-adc1-f7a68114c461'; -- Roll Up Coffee Shop / Forest Hills

-- --- Friendship ---
UPDATE shops SET description = $d$Friendship Perk & Brew is a veteran-owned cafe and restaurant on South Pacific Avenue in Pittsburgh's East End, open since 2017. It pairs specialty coffee and hand-steamed espresso drinks with a breakfast and lunch menu featuring house-roasted meats and family-recipe Italian wedding soup, positioning itself as a neighborhood gathering place.$d$ WHERE uuid = '907b6cb7-62f3-4254-9288-ae2ffce736ea'; -- Friendship Perk & Brew / Friendship
UPDATE shops SET description = $d$Yinz Coffee is a proudly-Pittsburgh chain founded on the North Side in 2021, now with around a dozen locations across the region. This cafe sits on Baum Boulevard at the edge of Friendship and Shadyside, serving espresso drinks brewed with South Hills roaster 19 Coffee.$d$ WHERE uuid = '00dba2e1-2ec2-4cfb-8b2a-d0b7b936fb63'; -- Yinz Coffee / Friendship

-- --- Garfield ---
UPDATE shops SET description = $d$This Commonplace Coffee cafe sits on Penn Avenue in Garfield, part of the Pittsburgh roaster founded in 2010 in Squirrel Hill. Community-first and built around craft roasting, Commonplace runs neighborhood cafes across the city and serves its own coffee at each, including this one along the Penn Avenue arts corridor.$d$ WHERE uuid = 'e9918192-81cf-4ef2-a8c9-32aa81eeb30b'; -- Commonplace Coffee / Garfield
UPDATE shops SET description = $d$The Soft Spot is a sober, sapphic cafe on Penn Avenue in Garfield, opened in 2025 by married couple Samm and Aerin Adams-Fuchs as an accessibility-focused gathering space for the queer community. It offers a wide range of coffee and tea drinks brewed with La Prima Espresso, plus non-alcoholic options, co-working areas, games, and a curated bookshelf, hosting events from poetry readings to arm-wrestling tournaments.$d$ WHERE uuid = 'b697ecd5-1778-4043-a4b9-5cf6c59ab345'; -- The Soft Spot / Garfield

-- --- Hazelwood ---
UPDATE shops SET description = $d$Hazelwood Cafe is a Black-owned coffee shop on Second Avenue, opened in 2022 by Dasawn Gray, who grew up in the neighborhood. It highlights coffees from Ethiopia, Kenya, Uganda, and other African countries alongside teas, pastries, and breakfast and lunch sandwiches, with African-inspired colors and patterns setting the tone for a community-focused gathering space.$d$ WHERE uuid = '966ee99e-c944-484b-93b2-7fc07f38cdfa'; -- Hazelwood Cafe / Hazelwood

-- --- Highland Park ---
UPDATE shops SET description = $d$Tazza D'Oro is the Highland Park coffee shop opened in 1999 by Amy Enrico, and the original of its two locations. Set near the entrance to Highland Park, it has long served as a community hub for the neighborhood, pairing espresso drinks and pastries with a gathering-place atmosphere.$d$ WHERE uuid = '100e145b-9291-4cae-ac51-59cfeb193ecb'; -- Tazza D'Oro / Highland Park

-- --- Homestead ---
UPDATE shops SET description = $d$Arabica Robusta is a community coffee house on East 8th Avenue in Homestead, opened by a local couple as a gathering space in their hometown. It serves gourmet coffee including a signature Homestead Blend, with latte art and a warm, welcoming interior built around the idea that coffee brings neighbors together.$d$ WHERE uuid = '5b2a753e-94e5-48d0-9ecc-306d3921702f'; -- Arabica Robusta / Homestead

-- --- Homewood South ---
UPDATE shops SET description = $d$Everyday Cafe is a coffee shop on North Homewood Avenue in Homewood, serving the neighborhood as a community gathering spot. It brews coffee from Commonplace Coffee, the Pittsburgh roaster founded in 2010, alongside a menu of espresso drinks and light fare.$d$ WHERE uuid = 'e7490bbf-ba3e-447c-b077-7a8927521075'; -- Everyday Cafe / Homewood South

-- --- Indiana Township ---
UPDATE shops SET description = $d$Tú y Yo Café is a family-run Venezuelan and Latin American café known for arepas and empanadas, opened in 2019 in Indiana Township. This Harts Run Road location in Glenshaw is one of its two Allegheny County cafés, pairing its food menu with coffee from La Prima Espresso.$d$ WHERE uuid = 'e82fb8cf-8d59-4ad3-80ce-8beccd0a48e6'; -- Tú y Yo Café / Indiana Township

-- --- Larimer ---
UPDATE shops SET description = $d$KLVN Coffee Lab is a design-driven specialty roaster and cafe on Hamilton Avenue in Pittsburgh's Larimer neighborhood. It roasts single-origin coffees and a signature espresso blend, serving them in a cafe known for its considered visual identity while also running a wholesale program for partner businesses.$d$ WHERE uuid = 'e3bd219a-c907-4b6c-9a78-d4c177bc7e1a'; -- KLVN Coffee Lab / Larimer

-- --- Lower Lawrenceville ---
UPDATE shops SET description = $d$Espresso a Mano is a Lawrenceville espresso bar on Butler Street, founded in 2009 and a longtime fixture of the neighborhood's coffee scene. Focused on carefully pulled espresso drinks, it has roasted its own coffee since 2021.$d$ WHERE uuid = 'f53cfca8-a38f-4992-b4f9-69f31753e225'; -- Espresso A Mano / Lower Lawrenceville
UPDATE shops SET description = $d$Field Day is a coworking clubhouse on Butler Street in the heart of Lawrenceville, with a ground-floor Lobby Bar open to the public. The bar serves specialty coffee, brewed with Larimer roaster KLVN Coffee Lab, alongside cocktails, craft beer, and snacks, and the building's rooftop deck hosts events.$d$ WHERE uuid = '37acab68-028f-4541-ab47-e9bb34e97e47'; -- Field Day / Lower Lawrenceville
UPDATE shops SET description = $d$Happenstance Cafe is a cafe and taproom on Penn Avenue in Lawrenceville, near Arsenal Park and Doughboy Square. Its menu runs from breakfast tacos and baked goods in the morning to charcuterie, salads, and sandwiches later in the day. A family-friendly space with a patio, it rotates local artists on its gallery wall and donates a share of monthly profits to a featured nonprofit.$d$ WHERE uuid = 'ef8582fe-d566-4689-b4df-1fb35750814b'; -- Happenstance Cafe / Lower Lawrenceville
UPDATE shops SET description = $d$Ineffable Cà Phê is a Vietnamese coffee shop on Penn Avenue in Lawrenceville, opened in 2017 in a converted former motorcycle shop. It specializes in Vietnamese coffee, including cà phê sữa, and bánh mì sandwiches, with a menu rooted in the founder's heritage. The shop also serves coffee from Pittsburgh roaster Commonplace Coffee.$d$ WHERE uuid = '6124790f-99a9-4da3-93ca-03a1e41cc667'; -- Ineffable Cà Phê / Lower Lawrenceville

-- --- McCandless ---
UPDATE shops SET description = $d$Commonplace Coffee is a Pittsburgh roaster founded in 2010 in Squirrel Hill, known for its craft roasting and community-first approach. This McCandless cafe on Cumberland Road brings that house-roasted coffee and a neighborhood gathering spot to the North Hills.$d$ WHERE uuid = '7b7dc43e-799b-4f0e-9447-6e0c750df1e9'; -- Commonplace Coffee / McCandless
UPDATE shops SET description = $d$Convive is a Pittsburgh specialty roaster that runs several cafes alongside its own roastery and a vintage French coffee truck for catering. Its Providence Boulevard cafe in McCandless serves Convive's house-roasted coffee in the North Hills.$d$ WHERE uuid = 'a4cdffe0-797a-4957-8d71-a6304ad28d3d'; -- Convive / McCandless
UPDATE shops SET description = $d$Lucky Bug Coffee is a small cafe on the upstairs level at 820 W Ingomar Road in McCandless. It serves espresso drinks, iced coffee, milk tea and a rotating selection of pastries, including hand pies. There is no indoor seating, though a few chairs on the porch offer a spot to sit outside.$d$ WHERE uuid = '4d284626-e1e1-4922-b5ba-d3e369a6ef96'; -- Lucky Bug Coffee / McCandless

-- --- Mexican War Streets ---
UPDATE shops SET description = $d$Commonplace Coffee is a Pittsburgh roaster founded in 2010 in Squirrel Hill, built around craft roasting and a community-first ethos. This North Side cafe on Buena Vista Street pours its house-roasted coffee in the heart of the Mexican War Streets.$d$ WHERE uuid = '6f7bc2f3-7c85-40c6-aa94-1fccb56dbf35'; -- Commonplace Coffee / Mexican War Streets

-- --- Millvale ---
UPDATE shops SET description = $d$Compass Point Coffee is a roaster and cafe on Evergreen Avenue in Millvale, where it roasts its own beans and serves them on-site. The cafe pairs its coffee with a relaxed neighborhood setting.$d$ WHERE uuid = '1d1581c4-829f-4e10-8d2f-5604a4b6278a'; -- Compass Point Coffee / Millvale
UPDATE shops SET description = $d$Lemon Tree PGH is a coffee shop and customizable breakfast sandwich cafe in Millvale, operating out of the Millvale Food + Energy Hub on East Sherman Street. It serves certified organic coffee roasted by Steel Cup Coffee Roasters, along with breakfast sandwiches and pastries, with a focus on affordability, inclusivity and sustainability.$d$ WHERE uuid = '6633a312-467b-4303-a804-73e80b874814'; -- Lemon Tree PGH / Millvale

-- --- Morningside ---
UPDATE shops SET description = $d$Ka-Fair is a coffee shop and cakery on Chislett Street in Morningside; "ka-fair" means coffee in Thai. It serves coffee roasted by Pittsburgh's Commonplace Coffee, sometimes presented black in wooden bowls, alongside pastries and cakes in a relaxed setting.$d$ WHERE uuid = 'e7a22221-fff9-4ad3-97bd-639efbf81e51'; -- Ka-Fair / Morningside

-- --- Mt. Lebanon ---
UPDATE shops SET description = $d$Mediterra Cafe is a bakery, cafe and artisan market, a companion to Mediterra Bakehouse with locations around the region. Its Mt. Lebanon spot on Beverly Road brings fresh-baked breads, pastries and coffee to the Beverly Road business district.$d$ WHERE uuid = '2debca4b-415f-4f23-b856-78097cd7a815'; -- Mediterra Cafe / Mt. Lebanon
UPDATE shops SET description = $d$Mel's Petit Cafe is a French-style creperie on Cochran Road in Mt. Lebanon, opened by Burgundy, France native Mel Streitmatter. Alongside espresso, lattes and other coffee drinks, it serves made-to-order sweet crepes and savory galettes, plus house-made syrups.$d$ WHERE uuid = 'f7231e8f-a690-429b-bfe8-981415bdb6b7'; -- Mel's Petit Café / Mt. Lebanon
UPDATE shops SET description = $d$Needle & Bean is a coffee shop and record store on Castle Shannon Boulevard in Mt. Lebanon. It serves organic, fair-trade coffee from Arkansas roaster Onyx Coffee Lab and partners with nearby Potomac Bakery for pastries, while selling vinyl with an emphasis on local bands.$d$ WHERE uuid = '71aec598-cb06-4502-850e-f2ba3e79d06d'; -- Needle & Bean / Mt. Lebanon
UPDATE shops SET description = $d$Orbis Caffe is a European-style coffee house on Washington Road in Mt. Lebanon, opened in 2011 in the former Aldo Coffee Company space. It rotates its coffees regularly, with Pittsburgh's 19 Coffee a longtime flagship, and rounds out the menu with grab-and-go food.$d$ WHERE uuid = '1f3c5279-f73b-4526-afbf-e1c809d4fa61'; -- Orbis Caffe / Mt. Lebanon
UPDATE shops SET description = $d$Panaderia Jazmin is an authentic Mexican bakery and cafe on Beverly Road in Mt. Lebanon, run by Jose Flores and Jazmin Hernandez, whose family runs a bakery near Mexico City. It offers conchas, churros and other pan dulce alongside breakfast and lunch dishes and fresh drinks.$d$ WHERE uuid = '2187d3f9-c039-4aac-b923-e9b9bdfd15a2'; -- Panaderia Jazmin / Mt. Lebanon
UPDATE shops SET description = $d$The Baked Bean is a coffee shop and bakery on Broadmoor Avenue in Mt. Lebanon's Sunset Hills, opened in 2026 in the former Mojoe Coffee House space. It serves drip coffee and espresso drinks plus signature lattes, alongside cupcakes, cookies, croissants and other fresh-baked goods.$d$ WHERE uuid = '21dbe611-eb35-4ebc-9c5d-1df995935e11'; -- The Baked Bean / Mt. Lebanon
UPDATE shops SET description = $d$Uptown Coffee is a longtime coffee shop, bakery and cafe on Washington Road in Mt. Lebanon, originally opened in 1995. It uses La Prima for its espresso and house roast and rotates selections from other local Pittsburgh roasters, with homemade baked goods rounding out the menu.$d$ WHERE uuid = '2a330d8b-4c42-410d-ba69-0859889a6c8b'; -- Uptown Coffee / Mt. Lebanon

-- --- Mt. Washington ---
UPDATE shops SET description = $d$Cafe Cravings is a gourmet coffee shop on Bigham Street in Mt. Washington, a longtime neighborhood fixture decorated with local artwork. It serves coffee and specialty drinks alongside breakfast sandwiches, hot paninis and deli sandwiches, plus freshly baked pastries.$d$ WHERE uuid = 'e1ce31dd-2e6b-47a2-b976-1c3bd3dc9282'; -- Cafe Cravings Gourmet Coffee Shop / Mt. Washington
UPDATE shops SET description = $d$Grand Brew is a coffee shop on Shiloh Street in Mt. Washington, known for its cozy atmosphere of vintage collectibles and retro decor. It serves espresso drinks, chai lattes and a multi-ingredient hot chocolate in a welcoming neighborhood setting.$d$ WHERE uuid = '5ac405ad-593f-475e-93df-e1f4397228a5'; -- Grand Brew / Mt. Washington

-- --- New Kensington ---
UPDATE shops SET description = $d$Steel Cup Coffee Roasters is a roaster and cafe on 10th Street in New Kensington, operating as a Pennsylvania Certified Organic roasting facility. It sources Fair Trade and USDA Certified Organic coffees and serves its house-roasted beans in a cozy storefront.$d$ WHERE uuid = '0960b600-b973-4859-82b9-e415c5bc6595'; -- Steel Cup Coffee Roasters / New Kensington

-- --- North Oakland ---
UPDATE shops SET description = $d$Sidecar is an independent coffee shop and bake shop on North Craig Street in North Oakland, located next to Butterjoint. It serves coffee from La Prima alongside in-house breakfast sandwiches, hand pies, cakes and pies, including signature cinnamon rolls.$d$ WHERE uuid = 'e7854328-05c9-4029-848f-6fd97596051e'; -- Sidecar Coffee and Bake Shop / North Oakland
UPDATE shops SET description = $d$Tazza D'Oro was opened in 1999 by Amy Enrico in Highland Park and has grown into a Pittsburgh coffee hub. This North Oakland location on Lytton Avenue, near the Oaklander Hotel, serves the cafe's coffee and pastries to students and professionals around the university district.$d$ WHERE uuid = 'eb39b9e9-5c5a-4225-ac5c-d2af6f555300'; -- Tazza D'Oro / North Oakland
UPDATE shops SET description = $d$Yinz Coffee is a proudly-Pittsburgh chain founded in 2021 on the North Side, now with roughly a dozen locations serving 19 Coffee. Its North Oakland cafe on Forbes Avenue brings that local branding and coffee to the heart of the university district.$d$ WHERE uuid = 'cf54c04f-2a40-4b96-a04d-69d2aac3022d'; -- Yinz Coffee / North Oakland

-- --- North Point Breeze ---
UPDATE shops SET description = $d$Commonplace Coffee is a Pittsburgh roaster founded in 2010 in Squirrel Hill, with craft roasting and a community focus at its core. Its North Point Breeze cafe on Thomas Boulevard serves the company's house-roasted coffee as a neighborhood gathering spot.$d$ WHERE uuid = '72f3e54c-bf20-48fe-adf2-df796c6f73bc'; -- Commonplace Coffee / North Point Breeze
UPDATE shops SET description = $d$Ineffable Cà Phê serves Vietnamese coffee and bánh mì, having started in 2017 in a converted Lawrenceville motorcycle shop. This North Point Breeze location on Thomas Boulevard sits in the historic Apollo building alongside Enson Market, with a bright space serving Vietnamese coffee, bánh mì and more.$d$ WHERE uuid = '1d81118b-0fd8-49dd-adb4-5dc20d71e271'; -- Ineffable Cà Phê / North Point Breeze

-- --- North Shore ---
UPDATE shops SET description = $d$Brave Bean Coffee Company is a service-disabled veteran-owned roaster based in Pitcairn, founded by Milo Speranzo and Ray Ramey, with small-batch, ethically sourced coffee and a commitment to veteran charities. This North Shore spot on East General Robinson Street brings its coffee to the riverfront district.$d$ WHERE uuid = '92899a5d-5ba3-4b78-94cd-62c55a0a9ba6'; -- Brave Bean Coffee Company / North Shore
UPDATE shops SET description = $d$Convive is a Pittsburgh specialty roaster with several cafes, its own roastery and a vintage French coffee truck for catering. Its North Shore cafe on North Shore Drive serves Convive's house-roasted coffee near the riverfront.$d$ WHERE uuid = '969a2db5-d63e-4d0d-8b85-0430d15baa02'; -- Convive / North Shore

-- --- Oakmont ---
UPDATE shops SET description = $d$Moonbeam Cafe is a coffee shop on Allegheny River Boulevard in Oakmont, opened by Oakmont resident Nina Komaniak. It serves Roman Italian-style espresso drinks and specialty beverages with coffee sourced from small family-owned farms, alongside locally made Italian and French pastries.$d$ WHERE uuid = '8579cede-0826-4c43-9f13-a386283f0e37'; -- Moonbeam Café / Oakmont

-- --- O'Hara ---
UPDATE shops SET description = $d$Curbside on the Run is a takeout coffee and fresh-foods spot on Powers Run Road in O'Hara Township, a longtime fixture that relocated from Blawnox. Beyond drip coffee and lattes, it offers a daily-changing breakfast menu, and the shop is takeout only with no indoor seating.$d$ WHERE uuid = 'aacf15ff-d39f-4ea2-88f3-3eff51ff2279'; -- Curbside on the Run / O'Hara
UPDATE shops SET description = $d$The Coffee Tree Roasters is a Pittsburgh hometown coffee roaster and cafe, and this O'Hara location sits on Fox Chapel Road. It roasts and serves a wide assortment of specialty coffees alongside a full menu of breakfast and dessert options.$d$ WHERE uuid = '2ee74f65-ff06-464c-90d3-ff928bd72988'; -- The Coffee Tree Roasters / O'Hara

-- --- Pitcairn ---
UPDATE shops SET description = $d$Brave Bean Coffee Company is a service-disabled veteran-owned roaster founded by Milo Speranzo and Ray Ramey, with small-batch, ethically sourced coffee and support for veteran charities. Its home is here on Broadway Boulevard in Pitcairn, where it roasts and serves its coffee.$d$ WHERE uuid = 'bc5151d5-d721-4334-a1b4-f91cfb2fdf20'; -- Brave Bean Coffee Company / Pitcairn

-- --- Pleasant Hills ---
UPDATE shops SET description = $d$The Coffee Tree Roasters is a Pittsburgh roaster founded in 1993 that roasts its own coffee and operates several cafes across the region. The Pleasant Hills location on Old Clairton Road brings the woman-owned company's house-roasted beans and espresso drinks to the city's southern suburbs.$d$ WHERE uuid = 'f8430fe3-6cab-4f88-bb04-abccb6e99cfd'; -- The Coffee Tree Roasters / Pleasant Hills

-- --- Polish Hill ---
UPDATE shops SET description = $d$Kaibur Coffee is a neighborhood cafe on Dobson Street in Polish Hill serving coffee alongside a food menu of breakfast sandwiches, toast, BLTs, and banh mi. The kitchen leans plant-forward, offering vegan versions of most items and rotating food and pastry specials.$d$ WHERE uuid = 'dc439d15-23cf-4ae4-aeab-3f97167bc035'; -- Kaibur Coffee / Polish Hill

-- --- Regent Square ---
UPDATE shops SET description = $d$61B Cafe is a Regent Square coffee shop on S Braddock Avenue, opened in 2013 in the former Katerbean space and named for the local bus route. It serves espresso drinks, smoothies, and fresh-baked pastries with both indoor and outdoor seating, and has long operated as a cash-only neighborhood gathering spot.$d$ WHERE uuid = '78e3178d-b181-4f7f-a719-84b1f5288395'; -- 61B Cafe / Regent Square

-- --- Ross ---
UPDATE shops SET description = $d$Cafe Vivella is a Turkish cafe on Babcock Boulevard in Ross Township, known for homemade cakes and boutique desserts displayed under glass domes. The menu pairs artisan coffee, including Turkish coffee, with Mediterranean panini, Turkish breakfast plates, and a popular pistachio croissant.$d$ WHERE uuid = 'd26caad3-e37c-49c8-8d2d-3ad3985e5011'; -- Cafe Vivella / Ross

-- --- Sewickley ---
UPDATE shops SET description = $d$Adesso Cafe is a Sewickley coffee shop on Walnut Street, opened in 2015 by Frank DeLuca and Patrick Mendicino. It serves freshly crafted coffee and espresso alongside pastries, homemade salads, and sandwiches made daily with seasonal ingredients, and offers small-batch roasts of its own.$d$ WHERE uuid = '25a6893e-901e-4578-aa40-aed0fddef009'; -- Adesso Cafe / Sewickley
UPDATE shops SET description = $d$Coffee Village brought a cafe to Walnut Street in Sewickley as part of the operator launched in December 2022, which rebranded several shuttered Crazy Mocha locations into shops Downtown, in Sewickley, and in Beaver. This Sewickley spot anchors the company's presence in the walkable village.$d$ WHERE uuid = 'cb1eecf8-cfcf-4704-98e7-96de4cb87591'; -- Coffee Village / Sewickley
UPDATE shops SET description = $d$Mediterra Cafe is the Sewickley outpost of the bakery, cafe, and artisan market concept that serves as a companion to Mediterra Bakehouse. On Beaver Street, it pairs espresso drinks with fresh-baked breads and pastries, joining the company's other locations in Mt. Lebanon, Lawrenceville, and Cranberry.$d$ WHERE uuid = '88699b9c-7015-491d-b00e-d27545e51c08'; -- Mediterra Cafe / Sewickley
UPDATE shops SET description = $d$Press House Coffee is a Sewickley craft roaster on Broad Street, serving roasted-to-order coffee from house staples like Tavern, Better, Early Bird, and Green Dragon. The cafe pours espresso and brewed coffee, runs subscription programs, and operates an upstairs event space and a mobile espresso bar.$d$ WHERE uuid = '23cab98e-9178-47cc-93f9-fddb843caa98'; -- Press House Coffee / Sewickley
UPDATE shops SET description = $d$Tú y Yo Café is a family-run Venezuelan and Latin American cafe whose Sewickley location sits on Division Street, serving arepas, empanadas, artisan breads, and Latin sweets. The cafe pours La Prima espresso alongside specialties like Venezuelan hot chocolate, one of two Allegheny County locations for the family that opened in 2019.$d$ WHERE uuid = 'cdb1546e-35a0-4766-8fd1-0e955764910d'; -- Tú y Yo Café / Sewickley

-- --- Shaler ---
UPDATE shops SET description = $d$BeanThru is a drive-thru-only coffee stand on William Flinn Highway in Glenshaw, built for quick stops in Shaler. It specializes in flavored lattes and pours La Prima espresso, serving customers without ever leaving their cars.$d$ WHERE uuid = 'c67a73ea-ecda-43a7-b733-cb7a4d113079'; -- BeanThru / Shaler
UPDATE shops SET description = $d$Ruckus Cafe opened on Babcock Boulevard in Shaler in 2021, founded by Christine Rauktis and Daryl Kuczynski as a hub for coffee, food, music, and art. The Shaler cafe serves breakfast and lunch fare, pours Allegheny Coffee & Tea Exchange coffee, and hosts events from music workshops to gallery programming.$d$ WHERE uuid = '067b38c5-2dfb-48e8-a28b-789c56919c7e'; -- Ruckus Cafe / Shaler

-- --- Sharpsburg ---
UPDATE shops SET description = $d$Redhawk Coffee Roasters operates a cafe on N Canal Street in Sharpsburg. Founded in 2016 by Braden and Mary, the roaster started as a coffee truck and now runs four cafes built on direct producer relationships and its own roasting.$d$ WHERE uuid = '47606588-f3a0-4456-a1e8-567f76f07697'; -- Redhawk Coffee / Sharpsburg

-- --- South Oakland ---
UPDATE shops SET description = $d$De Fer Coffee & Tea's South Oakland cafe sits in an office building on Technology Drive near the Hot Metal Bridge, with indoor and outdoor seating. Founded in 2017 by Matt and Vanessa Marietti, the employee-owned company roasts in house and pours a full coffee and tea menu alongside paninis, smoothies, and pastries across its six Pittsburgh locations.$d$ WHERE uuid = '2240c7ab-ca63-48ae-9c66-80fa9f00914b'; -- De Fer Coffee & Tea / South Oakland

-- --- South Point Breeze ---
UPDATE shops SET description = $d$Rockin' Cat is a certified organic, Fairtrade, and carbon-neutral B-Corp on Reynolds Street in Point Breeze. Its whole-bean coffee is roasted in Bellevue, and the cafe serves organic coffee and tea drinks in compostable cups alongside house-made vegan baked goods, with a fireplace and seating built for studying and gathering.$d$ WHERE uuid = 'b96f50e5-c4bd-45dd-bf9d-69220da252bf'; -- Rockin' Cat / South Point Breeze

-- --- South Shore ---
UPDATE shops SET description = $d$Yinz Coffee brings its proudly-Pittsburgh branding to Station Square on W Station Square Drive along the South Shore. Founded in 2021 on the North Side and now roughly a dozen locations strong, the company pours 19 Coffee at this riverfront stop near the Mon.$d$ WHERE uuid = '5c9daa19-2472-46c7-b06c-4730e25b6a42'; -- Yinz Coffee / South Shore

-- --- South Side Flats ---
UPDATE shops SET description = $d$Big Dog Coffee occupies a historic 1889 building on Sarah Street in the South Side, originally built as a bakery by Franz Kohler. Run by the Ivanov family since 2008, the restored space serves as a neighborhood coffee shop with high-quality coffee and food in a living-room atmosphere.$d$ WHERE uuid = '462343f3-68a0-4bfe-8b98-e5ea1c778a71'; -- Big Dog Coffee / South Side Flats
UPDATE shops SET description = $d$Club Cafe is a South Side music venue and cafe on S 12th Street where live performances anchor the room. Its coffee comes from Ghost Coffee Collab, a barista-owned project tied to Trace, served alongside the venue's food and drink menu.$d$ WHERE uuid = '6c86a48c-64a1-4af0-9038-b0cee1accd74'; -- Club Cafe / South Side Flats
UPDATE shops SET description = $d$Commonplace Coffee's SouthSide Works cafe sits along the Monongahela riverfront on S 27th Street, sharing space with The Speckled Egg. The Pittsburgh roaster, founded in 2010 in Squirrel Hill, pours its house-roasted coffee here alongside handcrafted breakfast sandwiches made with its riverside partner.$d$ WHERE uuid = '981c527b-d8ab-458d-9877-24c7ef44b166'; -- Commonplace Coffee / South Side Flats
UPDATE shops SET description = $d$Cup-Ka-Joe is a South Side coffee shop on S 27th Street set in a converted former service station, with garage-style doors rolled up in warmer months. It pours affordable coffee and offers a large parking lot, outdoor patio seating, and a dog-friendly, work-friendly atmosphere.$d$ WHERE uuid = 'fd273207-6c9e-4f4d-846f-1dadb0e3c882'; -- Cup-Ka-Joe / South Side Flats
UPDATE shops SET description = $d$Delanie's Coffee is a South Side specialty shop on E Carson Street, where co-owner Lavinia Ivanica took over in 2020. The cafe pours Onyx Coffee Lab and serves espresso and brewed coffee from its historic Carson Street storefront.$d$ WHERE uuid = '2820333e-f739-49ce-b5b5-553308713893'; -- Delanie's Coffee / South Side Flats
UPDATE shops SET description = $d$Dynamic Coffee Roasters operates on McKean Street in the South Side, founded by Andrew Delgado and Dylan Thomas on direct relationships with Honduran producers. Andrew was named a 2025 StarChefs Rust Belt Rising Star, and the shop serves the company's own roasted coffee.$d$ WHERE uuid = 'a74e9a25-469b-456b-8c39-a6ae09a58715'; -- Dynamic Coffee Roasters / South Side Flats
UPDATE shops SET description = $d$Encanto Cafe is a Colombian cafe and bakery on S 10th Street in the South Side, serving empanadas, arepas, and Colombian drinks including coffee and hot chocolate. The shop also pours non-Colombian beverages and offers fresh-baked goods daily.$d$ WHERE uuid = 'fc45d9ba-5ba3-487b-89df-5ddcce84ab62'; -- Encanto Cafe / South Side Flats
UPDATE shops SET description = $d$Standing Wave Coffee was founded in 2020 by brothers Evan and Colin Frye, with its cafe on Sarah Street in the South Side. Built around a sustainability focus, the shop roasts and serves its own coffee.$d$ WHERE uuid = '04e0cb0f-9a07-4e72-a498-41724d67c9c6'; -- Standing Wave Coffee / South Side Flats

-- --- Squirrel Hill North ---
UPDATE shops SET description = $d$Commonplace Coffee's Squirrel Hill cafe sits on Forbes Avenue, near where the Pittsburgh roaster was founded in 2010. Community-first and craft-focused, it pours Commonplace's own house-roasted coffee in the heart of the neighborhood's business district.$d$ WHERE uuid = 'a0153d7d-a55f-4d72-aa53-286eba2342f0'; -- Commonplace Coffee / Squirrel Hill North
UPDATE shops SET description = $d$Espresso a Mano's Squirrel Hill location operates inside Five Points Artisan Bakeshop on Wilkins Avenue. Founded by Matt Gebis, who opened the original Lawrenceville shop in 2009 after years at La Prima, the company has roasted its own coffee since 2021 and pairs espresso here with the bakeshop's fresh goods.$d$ WHERE uuid = '4869fda8-8118-4e48-9c13-4a7975785f5b'; -- Espresso A Mano / Squirrel Hill North
UPDATE shops SET description = $d$Pre Amp Coffee Studio opened in late 2025 on Forbes Avenue in Squirrel Hill, pairing specialty coffee with a vinyl listening-bar concept. The narrow, high-ceilinged room spins records throughout the day and pours Passenger Coffee, the Lancaster, Pennsylvania roaster, from a Modbar espresso bar.$d$ WHERE uuid = '2667ebe8-e116-4bf4-a01d-827b84826c5a'; -- Pre Amp Coffee Studio / Squirrel Hill North

-- --- Squirrel Hill South ---
UPDATE shops SET description = $d$61C Cafe has been a fixture on Murray Avenue in Squirrel Hill since 1994, named for the bus route that runs out front. The unpretentious neighborhood spot is known for quality coffee, a strong tea selection, and fresh-baked pastries like croissants and cinnamon rolls, with a big front window and an outdoor patio.$d$ WHERE uuid = 'eebf617f-7996-4ada-84f4-601c60c7d667'; -- 61C Cafe / Squirrel Hill South
UPDATE shops SET description = $d$Afters Cafe is a recent addition to Murray Avenue in Squirrel Hill, founded by Ryan and Joe as a community-minded space open late into the evening. It pours coffee from Pennsylvania-based 19 Coffee alongside espresso drinks and locally sourced Mediterranean treats and pastries.$d$ WHERE uuid = '5074d415-1368-4d09-bbe2-bf00e842a030'; -- Afters Cafe / Squirrel Hill South
UPDATE shops SET description = $d$Bunny Bakes is an inclusive bakery and cafe on Murray Avenue in Squirrel Hill, run by The Friendship Circle of Pittsburgh as a training and employment program for adults with disabilities. Its fully kosher kitchen turns out house-made baked goods and specialty coffee drinks, with gluten-free and dairy-free options, in a space designed for sensory accessibility. It serves De Fer Coffee & Tea.$d$ WHERE uuid = '1365441b-c275-4117-a2e5-10be619314a2'; -- Bunny Bakes / Squirrel Hill South

-- --- Strip District ---
UPDATE shops SET description = $d$Allegheny Coffee & Tea Exchange roasts specialty coffee in small batches and curates teas from around the world at its longtime Penn Avenue shop in the Strip District. Coffee and tea are sold by the cup or by the pound, in store and shipped nationwide. Six rotating taps pour nitrogen-infused cold brew, available by the cup or in growlers to go.$d$ WHERE uuid = 'f9c9b8b9-cdc3-4fe0-bc0c-d74b267d5f2f'; -- Allegheny Coffee & Tea Exchange / Strip District
UPDATE shops SET description = $d$Coop De Ville is an entertainment venue and restaurant on Smallman Street in the Strip District, part of Richard DeShantz Restaurant Group. Alongside food, drinks, and games like pinball and duckpin bowling, it runs a coffee bar pouring La Colombe coffee.$d$ WHERE uuid = 'ea241011-d492-4bdc-9846-71923c77aa33'; -- Coop De Ville / Strip District
UPDATE shops SET description = $d$De Fer Coffee & Tea is a Pittsburgh roaster founded in 2017 by Matt and Vanessa Marietti and now employee-owned, with coffee roasted in house. Its Smallman Street cafe sits at the heart of the Strip District, serving the company's espresso, drip, and tea.$d$ WHERE uuid = 'a2073115-c84e-422e-97eb-9d87fdceecf4'; -- De Fer Coffee & Tea / Strip District
UPDATE shops SET description = $d$James Cafe is a bright cafe on Smallman Street in the Strip District, drawing on European style for its everyday gatherings. It serves Passenger Coffee as espresso, drip, and rotating pour overs, alongside Bellocq teas. House-made grab-and-go salads, sandwiches, and small bites round out the menu.$d$ WHERE uuid = '2d44ec5c-da94-4577-aa05-7aca62751f99'; -- James Cafe / Strip District
UPDATE shops SET description = $d$La Prima Espresso Co. was founded in 1988 by Sam Patti and roasts Italian-style espresso at its Manchester roastery. Its 21st Street location anchors the company in the Strip District, the neighborhood that has been home to La Prima's flagship since the start.$d$ WHERE uuid = '5d3e9ef9-8e82-4230-8e7d-4eb718263809'; -- La Prima / Strip District
UPDATE shops SET description = $d$Novaria Coffee Co. is a specialty Syrian coffee shop on Penn Avenue in the Strip District. Its traditional Syrian coffee blends coffee, cardamom, and water, served on a gold tray with a small sweet to pour yourself. The menu also spans Japanese-style cold brew, pour-overs, and lattes.$d$ WHERE uuid = 'd278cff3-3cbc-4184-9973-5bc879eda844'; -- Novaria Coffee Co. / Strip District
UPDATE shops SET description = $d$Prestogeorge Coffee & Tea has roasted coffee on Penn Avenue in the Strip District since 1958, with beans roasted in store. Beyond coffee, it stocks more than 300 loose-leaf teas, making it a longtime fixture of the neighborhood's market district.$d$ WHERE uuid = '3d159551-183a-464f-8baa-f52dc779f57e'; -- Prestogeorge Coffee & Tea / Strip District
UPDATE shops SET description = $d$The Roaming Bean began as a mobile coffee operation popping up at events before opening a permanent cafe on Smallman Street in the Strip District in early 2026. The plant-filled space is known for signature lattes topped with flavored cold foam, in flavors like cookie butter, tiramisu, and honey lavender, plus baked goods. The truck still runs events alongside the cafe.$d$ WHERE uuid = '6e2659d0-623a-43b1-92e4-bd16467af9f0'; -- The Roaming Bean / Strip District

-- --- Swissvale ---
UPDATE shops SET description = $d$Parisi Cafe is a casual, family-friendly cafe on Harrison Avenue in Swissvale, near Edgewood Towne Centre. It serves coffee and espresso drinks alongside Italian fare and baked goods such as croissants, banana bread, and cookies, with carryout ordering available.$d$ WHERE uuid = '21b4a96a-bc42-44cd-b3d2-1975812163f6'; -- Parisi Cafe / Swissvale

-- --- Treesdale ---
UPDATE shops SET description = $d$Kat's Coffeehouse is a family-owned, cat-themed coffee shop on Warrendale Road in Gibsonia, open since 2023. It serves espresso drinks, mochas, and lattes along with locally sourced pastries, subs, and ice cream, plus gluten-free and dairy-free options. A drive-thru window and free Wi-Fi round out the spot.$d$ WHERE uuid = '5640299d-ff60-4255-8eb0-3de231175af4'; -- kat's coffeehouse / Treesdale

-- --- Troy Hill ---
UPDATE shops SET description = $d$De Fer Coffee & Tea is a Pittsburgh roaster founded in 2017 by Matt and Vanessa Marietti and now employee-owned, roasting its coffee in house. This location sits on Rialto Street in Troy Hill, serving the company's espresso, drip, and tea.$d$ WHERE uuid = 'c7fa5e06-0e4f-452a-904d-10430167f212'; -- De Fer Coffee & Tea / Troy Hill

-- --- Upper Lawrenceville ---
UPDATE shops SET description = $d$Caffe d'Amore is an independent coffee shop on Butler Street in Upper Lawrenceville, open since 2015. It pours beans from micro-roasters including Commonplace, Tanager, and Deeper Roots, paired with locally sourced milk and handcrafted syrups. The menu also features pastries, soups, bagels, and signature drinks like the lavender and black pepper cardamom lattes.$d$ WHERE uuid = '1e1bdead-34b3-4411-a356-4e62add472dd'; -- Caffe d'Amore / Upper Lawrenceville
UPDATE shops SET description = $d$Mediterra Cafe is a bakery, cafe, and artisan market and a companion to Mediterra Bakehouse. Its Butler Street location brings fresh-baked breads, espresso, and a curated market to Upper Lawrenceville.$d$ WHERE uuid = '9167d5fb-b842-4f80-ba64-67e4e3ccc23a'; -- Mediterra Cafe / Upper Lawrenceville
UPDATE shops SET description = $d$The Butterwood Bake Consortium is a dessert bakery on Butler Street in Upper Lawrenceville, specializing in cakes, pies, cobblers, brownies, and puddings, with vegan options and organic ingredients. It serves coffee from KLVN Coffee Lab, the design-driven Larimer roaster.$d$ WHERE uuid = '9dc258b3-0926-417e-b5c7-c9ad8711ab80'; -- The Butterwood Bake Consortium / Upper Lawrenceville

-- --- Verona ---
UPDATE shops SET description = $d$Mechanic Coffee is a Pittsburgh roaster with cafes in Shadyside and Verona, known for its canned nitro cold brew. The Verona cafe sits on East Railroad Avenue, serving the company's own roasted coffee.$d$ WHERE uuid = 'c8b321a5-1798-4e0d-b6ec-897f374afbc4'; -- Mechanic Coffee / Verona

-- --- Warrendale ---
UPDATE shops SET description = $d$Generoasta Coffee is a locally owned cafe at Warrendale Village, established in 2013 and known for handcrafted espresso drinks, creative food, and a friendly community vibe. The menu spans coffee, smoothies, desserts, and wine, with karaoke and live music on select nights.$d$ WHERE uuid = 'e533bcd8-672e-4803-8f42-350924c42db8'; -- Generoasta Coffee & Cafe / Warrendale

-- --- West End ---
UPDATE shops SET description = $d$Café 412 is a casual coffee shop on South Main Street in Pittsburgh's West End, owned by Westwood residents. It pours locally roasted coffee from 19 Coffee, a local micro-roastery, alongside homemade sandwiches, weekend brunch, and pastries, with indoor and outdoor seating.$d$ WHERE uuid = '811d9be0-72d8-4297-90c7-66232e385f96'; -- Café 412 / West End

-- --- West Mifflin ---
UPDATE shops SET description = $d$Java Jeffrey Coffee is a small-batch roastery and to-go cafe on Bettis Road in Dravosburg. The owner roasts original coffees in a small commercial space, serving drip and espresso to order with beans available for shipping and free delivery in Pittsburgh.$d$ WHERE uuid = 'c6b82c97-8b2a-46fb-ac58-8200fbd96014'; -- Java Jeffrey Coffee / West Mifflin

-- --- West Oakland ---
UPDATE shops SET description = $d$La Prima Espresso Co. was founded in 1988 by Sam Patti and roasts Italian-style espresso at its Manchester roastery. This location brings La Prima's espresso to Fifth Avenue in West Oakland, near the university campuses.$d$ WHERE uuid = '9c962818-d901-4fea-9570-54fa213e2cdd'; -- La Prima / West Oakland
UPDATE shops SET description = $d$Redhawk Coffee Roasters was founded in 2016 by Braden and Mary, starting as a coffee truck before growing into four cafes. Its Meyran Avenue spot in West Oakland serves the company's own roasted coffee near the Oakland campuses.$d$ WHERE uuid = '8587f0e6-776c-421f-a8f9-e83b7b5c4c4b'; -- Redhawk Coffee / West Oakland

-- --- West View ---
UPDATE shops SET description = $d$Dragon's Roast Cafe is a coffee and pastry shop inside Game Masters, a board game and hobby store on Perry Highway in West View. Baristas use Commonplace Coffee for cold brew, espresso, and specialty drinks like the Fiery Red Dragon, a latte with a hint of hot honey. Billed as Pittsburgh's first board gaming cafe, it offers access to a library of more than 1,000 games.$d$ WHERE uuid = '60eb6a2b-b1f4-4079-aa19-1cbb7e234ec7'; -- Dragon's Roast Cafe / West View
UPDATE shops SET description = $d$West View Brew is a community-focused neighborhood coffee shop on Perry Highway in West View. It sources its coffee from Pittsburgh roaster Commonplace Coffee and serves espresso drinks, matcha, boba, and dirty sodas, plus breakfast wraps and scratch-made bakery items.$d$ WHERE uuid = '5cfeaaaf-3990-4c56-bfcb-032edaa7f58a'; -- West View Brew / West View

-- --- Wexford ---
UPDATE shops SET description = $d$Café Conmigo is a coffee and tea house on North Meadow Drive in Wexford, set in a plant-filled space that doubles as a community gathering spot. It serves Commonplace Coffee and Tupelo teas, and stocks local products from area makers including Mediterra Bakehouse and Leona's Ice Cream.$d$ WHERE uuid = '1f0d5952-f984-4fac-a34a-a347d2f8d038'; -- Cafe Conmigo / Wexford

-- --- Wilkinsburg ---
UPDATE shops SET description = $d$Biddle's Escape is an eclectic coffee and tea house on a residential corner in Regent Square, housed in a purple and yellow building. It pours specialty coffee, cold brew, and more than 100 full-leaf teas with house-made syrups and light bites, and serves 19 Coffee. Globally themed decor reflects owner Joe Davis's travels, and food trucks visit out front on Wednesday evenings.$d$ WHERE uuid = 'c1d93506-5250-4e6d-a0aa-ffad851fc379'; -- Biddle's Escape / Wilkinsburg

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Coverage: total rows vs. still-missing descriptions per table.
SELECT 'companies' t, count(*) total, count(*) FILTER (WHERE description IS NULL OR description='') missing FROM companies
UNION ALL SELECT 'roaster', count(*), count(*) FILTER (WHERE description IS NULL OR description='') FROM roaster
UNION ALL SELECT 'shops', count(*), count(*) FILTER (WHERE description IS NULL OR description='') FROM shops;

-- First-person leakage (should return no rows).
SELECT 'companies' t, name FROM companies WHERE description ~* '\m(we|our|us)\M'
UNION ALL SELECT 'roaster', name FROM roaster WHERE description ~* '\m(we|our|us)\M'
UNION ALL SELECT 'shops', name FROM shops WHERE description ~* '\m(we|our|us)\M';

-- Length outliers (should return no rows).
SELECT 'companies' t, name, length(description) FROM companies WHERE length(description) > 450
UNION ALL SELECT 'roaster', name, length(description) FROM roaster WHERE length(description) > 450
UNION ALL SELECT 'shops', name, length(description) FROM shops WHERE length(description) > 450;

-- ============================================================================
-- NEEDS MANUAL RESEARCH  (shops left NULL — no findable source)
-- ============================================================================
