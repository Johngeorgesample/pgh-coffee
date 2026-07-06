# Passport bets — execution, failure modes, and the shop-partnership engine

Companion to `passport-directions.md`. That doc mapped the directions; this one
goes deep on the bets that matter, and treats **shop partnerships as the spine**
rather than a footnote. For each bet: how it's actually built and operated, where
it breaks, and how it creates or strengthens a relationship with a shop.

The hard truth that shapes everything: **an independent Pittsburgh coffee shop is
time-poor, app-skeptical, owner-operated, and low-margin.** Any partnership that
asks them to install software, manage a dashboard, or do recurring work will
mostly fail. So the through-line is a *partnership ladder* whose first rungs cost
the shop nothing and where you earn each step up.

---

## Bet A — Challenges / crawls (the partnership vehicle)

### What it is
A challenge = a `curated_list` of shops + a completion goal measured against the
user's `visits`. "Strip District Crawl — visit all 8." Completion yields a stamp.

### Execution
- **Data:** reuse `curated_lists` (already lists-of-shops). Add a challenge flag,
  optional date window (for seasonal), and a reward descriptor. Progress is a
  set-intersection of the user's `visits` with the list's shop UUIDs — the same
  count math the trimmed progress endpoint did, scoped to a list.
- **Authoring:** v1 is hand-authored by you (one curated list). No shop input
  needed to launch — this is critical, it means you can run challenges *before*
  any shop says yes.
- **Lifecycle:** draft → live (optionally dated) → completed-per-user. A seasonal
  challenge auto-expires; an evergreen crawl doesn't.
- **Surfacing:** a challenges tab in the passport, plus a card on shops that
  belong to an active challenge ("Part of the Strip District Crawl — 3/8 done").

### Failure modes
- **Cold start / ghost town.** A challenge with no participants is worse than
  none — it signals a dead product. *Mitigation:* launch one, hand-picked,
  promoted through the existing Reddit/newsletter motion; don't ship an empty
  "challenges" surface with nothing live.
- **Re-marking, not visiting.** Users tick shops they'd already been to and the
  challenge drives zero new foot traffic — which kills the partnership value.
  *Mitigation:* favor challenges that mix familiar + unfamiliar shops; track
  new-to-user completions separately from backfilled ones.
- **Curation burden.** Hand-authoring lists doesn't scale and goes stale (a shop
  closes, the crawl breaks). *Mitigation:* keep the set small and dated; wire
  closures from Bet B's liveness signal back into challenge validity.
- **Gaming.** If a challenge has a real reward, armchair completion is trivial
  (see Bet D / the verification fork). Keep rewards soft until verified.
- **Geography excludes.** A "visit all of Lawrenceville" challenge is hostile to
  someone in the South Hills with a car-free week. *Mitigation:* multiple
  parallel challenges across neighborhoods; never one mandatory global ladder.

### Partnership leverage — this is the strongest vehicle
- **Zero-ask inclusion.** You can put a shop in a crawl without asking; it's
  editorial, like a "best of" list. That's the no-friction first touch.
- **Co-branded crawl.** A neighborhood business association or a roaster
  co-promotes "their" crawl. The shop's ask is near zero (maybe a window sticker);
  the value is curated discovery traffic.
- **Sponsored challenge.** A roaster funds "visit all 9 cafés pouring our beans"
  with a real reward. `roasterRef` already links shops to roasters, so the list
  builds itself. This is where a challenge becomes revenue.
- **The pitch to a shop:** "We're running a Strip District crawl; you're in it at
  no cost, and we'll show you how many passport-holders visited you during it —
  and how many were first-timers." You give before you ask. (Mind the claim tiers
  below: "visited during the crawl" is honest; "we drove the visit" is not, yet.)

### Consent & opt-out (don't skip this in a small scene)
Editorial inclusion (a "best-of" crawl) needs no permission. **Commercial/
sponsored inclusion does** — putting a shop into a *paid* roaster trail without a
yes is a different posture than curation, and it can sour a fragile relationship.
Two boundaries: (a) sponsored/monetized placement requires the shop's consent;
(b) any shop can opt out of passport volume entirely — a tiny owner-operated
café that can't absorb a crawl-day rush is a real case, and forcing traffic on
them is the opposite of a partnership. Also remember curation *is* favoritism in
a small market: shops you leave out of a crawl notice, so keep parallel crawls
broad and rotate inclusion.

---

## Bet B — Post-visit confirm card (the relationship opener)

### What it is
When a user marks a visit, they're physically there *now* — the best possible
moment to collect ground truth: "Still open? Hours right? Add a photo?"

### Execution
- **Trigger:** fires on a successful POST `/api/visits`, as a lightweight card
  (not a blocking modal — one optional tap each).
- **Plumbing:** the receiving endpoints already exist — `report`,
  `report-amenities`, `hours`, and photo paths. The card is a thin client over
  primitives the product already has.
- **Throttle:** ask at most one thing per visit, and don't re-ask a user about a
  shop they just confirmed. Rotate the prompt (hours this time, photo next).
- **Moderation:** user-submitted photos/edits flow into the existing moderation
  path, not straight to live.

### Failure modes
- **Prompt fatigue → abandonment.** Turning a one-tap delight into a chore makes
  people stop marking visits at all — poisoning the core loop to feed a secondary
  one. *Mitigation:* opt-in tone, skippable, capped frequency; the stamp succeeds
  with or without the answer.
- **Garbage / malicious data.** "Confirmed open" from someone who wasn't there,
  or a bad photo. *Mitigation:* moderation queue; weight confirmations by
  corroboration (N independent recent visits agreeing), not a single tap.
- **Liveness false-negatives.** "No visits in 3 months" flags a fine shop in a
  low-traffic neighborhood as maybe-closed. *Mitigation:* treat low-visit as a
  *prompt to verify*, never as auto-delisting.
- **Privacy creep.** Logging precise presence + timestamps is sensitive data.
  *Mitigation:* store the confirmation, not a movement history; never expose it.

### Partnership leverage — this is your *unfair* opener
- **"We keep your listing accurate, for free."** The single most credible thing
  you can offer a skeptical owner: their hours/photos/amenities stay correct
  because real visitors maintain them. No dashboard, no work.
- **Closes the hours-freshness loop.** Shop hours are a refreshable Google cache
  with a 30-day ToS limit (`project_shop_hours`); visitor confirmations are
  first-party ground truth without that constraint — and a reason a shop trusts
  the listing enough to engage further.
- **It earns the right to Bet C.** You show up to a shop already having improved
  their presence. That's a warm open, not a cold pitch.

### But why does the *user* tap "confirm"?
The shop and the product both win from this card — the user, by default, gets
nothing, and altruism doesn't scale. Give them a reason: progress toward the
visit being "verified" on their own passport, a tiny contribution streak, or
simply the satisfaction of a more complete personal record. Without a user-side
payoff the confirm card decays to noise. This is a specific instance of the
binding constraint in the cross-cutting section: the whole engine is gated on
users *wanting* to keep engaging.

---

## Bet C — Claimed profiles + foot-traffic insight (the relationship container)

### What it is
Let an owner claim their listing and see passport activity ("X passport-holders
visited this month"); in return they keep their info current and can post
events/updates.

### Execution
- **Claim flow:** verify ownership (email at domain, or a code to the shop phone).
  This is the highest-friction piece — keep it humane and assisted.
- **Reuse:** the `updates`/`events` infrastructure already lets shops publish; a
  claimed profile is mostly a permissions layer plus a read-only insight panel.
- **Insight panel:** aggregate visit counts over time for *their* shop, with
  neighborhood benchmarks. Built from `visits` joined to the shop — no new
  primitive.

### Failure modes
- **Empty dashboard.** Before scale, "3 visits this month" is embarrassing and
  churns the owner immediately. *Mitigation:* don't launch claims until a shop's
  numbers are non-trivial; lead with the free-accuracy value, not the counts.
- **Claim verification abuse.** Someone claims a shop that isn't theirs.
  *Mitigation:* assisted verification; low volume early means you can do it by
  hand.
- **Owner churn / abandonment.** Owner claims, never returns, info rots anyway —
  now with a false "claimed = trusted" badge. *Mitigation:* claiming shouldn't
  *replace* the Bet B crowd-maintenance; it layers on it.
- **Vanity-metric trap.** Visit counts that don't prove *incremental* traffic
  (see attribution below) invite "this app does nothing for me." *Mitigation:*
  frame as presence/reach, not as attributed sales, until you can prove more.

### Partnership leverage
- **This is the container** the other bets pay into: the place a shop sees what
  the passport does for them and the channel through which you propose crawls,
  perks, and sponsorships.
- **Two-way data contribution:** a claimed owner maintaining their own hours/
  events is supply-side ground truth that improves the product for everyone.

---

## Bet D — Verified presence & loyalty (the high rung — handle with care)

### What it is
Hard rewards tied to stamps: "10th stamp = free drip," sponsored-challenge prizes,
a passport-holder discount honored at the register.

### Execution & the verification fork
Self-reported stamps are fine for *soft* perks. The moment a real reward rides on
a stamp, trust-based marking gets gamed, and you must choose a proof mechanism:
- **Geofence-on-mark** — block/flag stamps placed far from the shop. Cheap-ish,
  defeatable, GPS is noisy indoors.
- **QR at the register** — strong proof, but requires shop hardware/behavior and
  staff buy-in. Highest friction, highest trust.
- **Receipt scan** — strong, annoying, and ties you to POS variety.

There is no free verified-presence; pick the friction you can live with.

### Failure modes
- **Fraud undermines the partner relationship.** A shop gives away product for
  fake stamps once and never trusts you again. This failure is *relationship-
  fatal*, not just a bug. *Mitigation:* don't offer hard rewards on trust-based
  marks — full stop.
- **Staff-side breakage.** A barista who doesn't know about the perk, or finds it
  annoying at a rush, kills the experience and embarrasses the user. *Mitigation:*
  dead-simple redemption (show screen, staff taps nothing) and shop-side
  enablement before launch.
- **Promotional-law exposure.** Prizes/sweepstakes for completing challenges can
  trigger promotion regulations, especially anything randomized. *Mitigation:*
  prefer *guaranteed* "complete → reward" structures over chance-based draws; get
  a real review before any prize of value.
- **Margin reality.** Indie shops can't afford generous giveaways. Keep partner
  cost tiny (a first-visit discount, not free drinks for life).

### Partnership leverage
- The most lucrative rung *and* the most dangerous. It only works once Bets A–C
  have built trust, volume, and (if needed) verification. Don't lead with it.

---

## The partnership ladder (the synthesis)

Sequence shop relationships from zero-effort to high-commitment. Earn each rung.

| Rung | Shop effort | What they get | What you need first |
|------|-------------|---------------|---------------------|
| 0. Listed | none | accurate free listing + discovery | nothing |
| 1. Maintained | none | listing stays correct via visitors (Bet B) | the confirm card |
| 2. Featured | ~none | inclusion in a crawl/challenge (Bet A) | one live challenge |
| 3. Claimed | low | visit insight, post events/updates (Bet C) | non-trivial visit counts |
| 4. Perk | medium | trial traffic via a passport discount | redemption flow |
| 5. Sponsored/loyalty | high | attributed traffic, funded challenges (Bet D) | verification + scale |

**The cardinal rule: give before you ask.** By the time you propose rung 3+, you
should already have improved their listing (rung 1) and sent them crawl traffic
(rung 2). You walk in having helped, not selling.

### How to actually bootstrap this (Pittsburgh, indie, no scale yet)
- **Lighthouse partners.** Pick 3–5 friendly, well-run shops. Hand-build one
  neighborhood crawl that includes them. Print a window sticker: "Pittsburgh
  Coffee Passport — stamp your visit here." No tech on their end.
- **Measure qualitatively first.** You won't have statistically clean attribution
  early; "we sent 40 marked visits and here are three people who said they came
  because of the crawl" is a believable, honest story.
- **Use roasters as the wedge.** A roaster touches many cafés and has a marketing
  motive; a roaster-sponsored trail (rung 5) recruits multiple shops through one
  relationship instead of door-to-door.

---

## The cross-cutting failure surfaces (true of every bet)

1. **Three claim tiers — never blur them.** Most partnership failures here are
   one overclaim. Be precise about what the signal supports:
   - **Presence** — "this user was here." *Asserted* on a trust-based tap;
     *proven* with geofence/QR/receipt (Bet D). Verification upgrades presence.
   - **Visited-during-crawl** — "this user marked your shop during the campaign
     window." Honest correlation; safe to report; what you sell early.
   - **Incremental** — "the passport *caused* a visit that wouldn't have
     happened." This is the one shops actually want, and **verification does not
     give it to you** — a verified stamp from a regular is presence without
     incrementality. Incrementality needs a control/holdout (e.g. compare
     crawl-shop traffic against similar non-crawl shops), which is genuinely hard
     and currently unbuilt. *Cheap proxy:* new-to-user completions (someone who'd
     never marked that shop before) is a believable directional signal — promote
     it, but don't dress it up as proof. *Stance:* sell presence and crawl-window
     correlation honestly; never say "drove" or "sent your way" until you have a
     control.
2. **Cold-start everywhere.** Challenges need users; claimed profiles need visit
   volume; partnerships need a track record. Sequence so each bet ships only when
   the prior one has produced the input it needs (see directions doc §6).
3. **User retention is the binding constraint (not a side risk).** Every rung of
   the ladder is gated on sustained visit volume, and that input is *user-side* —
   the weakest link in the whole chain is whether people keep marking, not whether
   shops say yes. Stamps, challenges, and badges are fun once; durable retention
   has to come from genuine discovery (going somewhere good you hadn't been), not
   the mechanic. If the underlying shop recommendations are weak, no game
   mechanic saves it — and the partnership engine quietly assumes this input it
   doesn't control. Treat user retention as the project's true gating metric.
4. **Ops burden becomes the bottleneck.** Curating lists, verifying claims,
   moderating photos, honoring perks — all manual early. That's fine at lighthouse
   scale and fatal if you productize before you can automate. Grow partner count
   deliberately.
5. **Trust is the whole asset.** One fraud incident, one shop embarrassed by a
   dead dashboard, one wrong "we'll send you traffic" promise — and the
   relationship is gone and word travels in a small local scene. Under-promise to
   shops; the passport's credibility with the supply side is harder to rebuild
   than any feature.

---

## Bottom line

The partnership engine isn't a feature you ship; it's a *ladder you climb with
each shop*, and the passport's job is to generate the proof you climb on:
accurate listings (Bet B) → curated discovery traffic (Bet A) → a place to show
the shop what you did for them (Bet C) → and only then, funded/verified rewards
(Bet D). Every rung is gated by trust you have to earn first, and every bet's
worst failure mode is the same one: claiming more to a shop than the
self-reported signal can honestly support.
