# Passport — strategic directions

Research on where to take the visited passport, rooted in the **high-value user
actions** it can drive. Grounded in what the product already has: shops (with
neighborhood, company, roaster, amenities, hours, photos, geo), companies
(multi-location brands), roasters (with in-house flag), events (tied to shop and
roaster, dated), updates/news, **curated lists** (lists of shops), and the two
user-state primitives — favorites and visits.

The current passport is the minimal slice (mark visited → see them on a list).
This doc is about what it should grow into. The phased epic (#295) covers the
near-term mechanics; this is the wider map.

---

## 1. The one insight that should drive everything

A favorite is a *wish*. A visit is an **asserted physical-presence signal** — the
user is telling you they were standing inside a specific shop. It's self-reported
(a button tap, trusted, not yet proven — see the verification fork in §4), but
nothing else in the product produces even that, and it's *upgradable*: the same
mechanic with geofence/QR/receipt becomes proof. It is the passport's only truly
differentiated asset, and almost every high-value direction below is a way to
cash it in:

- **Presence → ground truth.** The moment of a visit is the highest-quality
  moment to collect data (is it still open? are the hours right? got a photo?).
  This holds even for self-reported visits — the user is there as they tap.
- **Presence → foot traffic, attributable.** A stamp is a user asserting they
  walked in. Trust-based, it's a soft co-marketing signal; verified (§4), it
  becomes provable foot traffic. Either way it's the thing shops and roasters
  will eventually pay attention to — once there's a base of stamps to point at.
- **Presence → identity.** "I've done 47 PGH shops" is a status claim people
  want to make. That's the acquisition engine.

Everything that follows is organized around *which high-value action it drives*,
not around features for their own sake.

---

## 2. The high-value actions to optimize for

| # | Action | Why it's high-value |
|---|--------|---------------------|
| A1 | **Mark a visit** | The core loop; also produces the presence signal |
| A2 | **Convert anon → account** | Turns a casual marker into a retained user |
| A3 | **Return & keep marking** | Retention; a passport that's abandoned is dead |
| A4 | **Go to a *new* shop** | The product's real-world reason to exist = partner value |
| A5 | **Contribute ground-truth data** | Confirm hours/amenities/photos/"still open" |
| A6 | **Share / invite** | Acquisition, organic distribution |
| A7 | **Shop/roaster engagement** | Claim profiles, events, deals — the supply side |

Note A4 vs A1: re-marking shops you already know is engagement but creates no new
value. The high-leverage version pushes you toward shops you *haven't* been to.
Several directions below are specifically about that.

---

## 3. Feature directions

### Tier 1 — Make the passport worth filling (drives A1, A3, A6)
These are mostly in epic #295 already; called out because nothing else matters if
the core artifact isn't emotionally worth completing.

- **Fill in the map.** Light up visited pins on the discovery map. The map
  filling in is the screenshot moment and what makes "passport" literal. (#295)
- **Neighborhood "turf" progress.** "5 of 7 in Lawrenceville." Pittsburgh
  neighborhood identity is tribal — clearing your own turf is more motivating
  than a global count. Data's largely there (`neighborhood` on every shop). (#295)
- **Shareable passport / "Pittsburgh Coffee Wrapped."** OG image + public,
  opt-in passport page. Double duty: retention *and* the acquisition flywheel
  into the Reddit/newsletter motion. A year-in-review variant is a once-a-year
  re-engagement spike. (#295, ties to existing dynamic-OG issue #77)

### Tier 1.5 — Activation (drives A2)
The source plan called this "the single highest-leverage UX detail," and it's the
one thing standing between a casual marker and a retained account.

- **Signup backfill — first-run "which of these have you been to?"** A fresh
  0/150 passport is homework, not a reward. A one-screen checklist that lands a
  new user at 12/150 converts the cold start from chore into recognition. It's
  also the natural conversion moment for anonymous → account: the anon marks
  carry in, the checklist tops them up. (#295, sub-issue #299)

### Tier 2 — Challenges / quests (drives A4 discovery + A3 retention + A7)
**This is the highest-leverage net-new direction, because the primitive already
exists.** `curated_lists` are already lists-of-shops with a title/description.
A challenge is just a curated list + a completion goal measured against visits.

- **"Crawl" challenges.** "Strip District Crawl — visit all 8." "First-timer's
  Pittsburgh 10." Completion = a special stamp. Reuses `curated_lists` + `visits`
  almost entirely; the new work is the progress calc and a completion state.
- **Roaster trails.** "You've been to 4 of 9 shops pouring [Roaster]." The
  `roasterRef` join already exists. Naturally co-brandable with the roaster.
- **Multi-location runs.** "Visit all 3 [Company] locations." `company` is on
  every shop.
- **Seasonal / event challenges.** The `events` table is dated and tied to shops
  and roasters — a "Coffee Week passport" is a time-boxed curated list with a
  reward. Recurring seasonal events become recurring re-engagement.

Why this tier matters: challenges are the mechanism that converts A1 (re-marking
the familiar) into A4 (going somewhere new), which is the only thing that creates
real-world value a shop would care about.

### Tier 3 — The verified-presence data flywheel (drives A5 — the unique wedge)
When a user marks a visit, they are physically there *right now*. That is the
single best moment to ask for ground truth, and the product already has the
endpoints to receive it (`report`, `report-amenities`, `hours`, photo paths).

- **Post-visit confirm card.** After a stamp: "Quick — is this place still here?
  Hours right? Add a photo?" One tap each. This is the cheapest, highest-quality
  data-collection channel the product will ever have.
- **Close the hours-freshness loop.** Shop hours are a refreshable Google cache
  with a 30-day ToS limit (see `project_shop_hours`). A visitor confirming
  "open now, the posted hours are right/wrong" is first-party ground truth that
  doesn't carry that constraint.
- **"Still open?" canary.** Closures are the worst data-quality failure for a
  discovery map. Recent visits are a passive liveness signal; a shop with zero
  visits in N months + a user report is a strong "verify this" flag.

Strategic point: this flywheel makes the passport *pay for itself* — engagement
that simultaneously improves the core dataset for every non-passport user too.

### Tier 4 — Retention mechanics (drives A3)
- **"New near you, unvisited."** Diff the user's visits against shops near their
  usual area → "3 shops on your blocks you haven't stamped." Pushes A4.
- **Gentle cadence, not streaks.** Coffee is habitual; a punishing daily streak
  is wrong for this. "You haven't added a stamp in a while — 4 new shops opened"
  is better than a broken-streak guilt mechanic.
- **Milestones as moments.** First stamp, neighborhood cleared, 25/50/100 —
  computed off existing data, no achievements engine. (#295)

---

## 4. Partnership opportunities with shops & roasters (drives A4, A7, revenue)

These are sequenced *after* a user base exists — a partner pitch needs stamps to
point at. But this is where the passport stops being a feature and becomes a
two-sided asset.

This is a proven pattern, not a guess: **Untappd** is the direct analog — a
check-in passport for beer that monetizes via venue/brewery partnerships,
sponsored badges, and foot-traffic analytics. **Beli** does the same for
restaurants. The models below are the local-coffee instantiation of mechanics
those products already run at scale.

- **Claimed shop profiles.** Let owners claim their listing (the `updates`/
  `events` infrastructure already lets shops publish). Hook: "X passport-holders
  have visited you this month." Gets owners to keep their own hours/amenities/
  photos current — supply-side data contribution.
- **Sponsored challenges.** A roaster funds a "try all our cafes" trail with a
  real reward (bag of beans, free pour). The challenge primitive (Tier 2) is the
  delivery mechanism; the roaster gets attributed foot traffic.
- **Passport-exclusive perks.** "Show your stamp for 10% off your first visit."
  Drives A4 to shops that opt in; the shop gets measurable trial.
- **New-shop launches.** "First 50 passport-holders to visit get a founding
  stamp." A built-in launch-day foot-traffic engine for a new opening.
- **Aggregate, anonymized foot-traffic insight.** "This neighborhood saw 1,200
  passport visits last month." A reason for shops to care about being well-
  represented in the data — and a potential paid tier — without exposing any
  individual user.

### The verification fork (decide before any hard reward)
Self-reported visits are fine for personal tracking and soft perks. The moment a
real reward rides on a stamp (free product, loyalty count), trust-based marking
gets gamed. If partnerships go that direction you need **proof of presence** —
geofence-on-mark, a QR at the register, or receipt scan. That's a real build and
a real fork: keep stamps trust-based and lean (personal passport + soft co-
marketing), or invest in verification to unlock loyalty-grade partnerships. Don't
promise a partner "verified visits" while the system trusts a button tap.

---

## 5. Guardrails

- **Anonymous-first.** Marking is a low-commitment gesture; don't gate it behind
  signup (#295). It's also the top of the A2 funnel.
- **Privacy on anything public.** A public/shareable passport must be opt-in and
  PII-free (count + map, not a log of where someone is each morning — that's a
  safety issue, not just a preference).
- **Hold the social-graph line.** Friends, feeds, leaderboards, public profiles,
  crowd ratings, paid passport are explicitly out of scope (BLIND_SPOTS #4). The
  partnerships above are deliberately *shop↔user*, not *user↔user* — they get the
  two-sided value without becoming a social network.
- **Don't rebuild favorites.** Visited (presence) and favorited (intent) are
  different signals; resist merging them.

---

## 6. Recommended sequence

1. **Finish the emotional core** (map fill-in + share). Without this the passport
   isn't worth filling, and every later mechanic compounds on it. (#295)
2. **Ship challenges on `curated_lists`.** Cheapest net-new high-value direction;
   converts re-marking into real discovery (A4). Start with one hand-authored
   crawl to validate.
3. **Add the post-visit confirm card.** Turns engagement into ground truth (A5);
   makes the passport improve the whole product. Pairs naturally with #2.
4. **Then approach shops** — claimed profiles, foot-traffic insight, sponsored
   challenges. This needs the user base from 1–2 and the data story from 3 to be
   a credible pitch. Decide the verification fork before promising anything
   reward-backed.

The throughline: build the artifact people want to complete (1), point that
desire at new shops (2), harvest the presence signal into better data (3), then
sell the proven foot traffic back to the supply side (4).
