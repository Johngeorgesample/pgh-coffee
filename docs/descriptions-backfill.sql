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
