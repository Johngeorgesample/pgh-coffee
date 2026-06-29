# pgh.coffee — mobile

A thin native (Expo / React Native) shell that loads [pgh.coffee](https://pgh.coffee)
in a WebView and wraps it with native behavior: offline screen, pull-to-refresh,
hardware-back navigation, system handling of external/`mailto:`/`tel:`/maps
links, a native splash screen, and push-notification registration.

The website itself remains the Next.js app in the repo root. This project does
**not** reimplement any screens — it points at the live site.

## Run locally

```bash
cd mobile
npm install            # already done if you just generated this
npx expo start         # press i (iOS sim) / a (Android emulator)
```

> Push notifications and the production splash behavior require a **development
> build**, not Expo Go (Expo Go dropped remote-push support in SDK 53). See below.

## What's wired up

- **`App.tsx`** — the WebView shell and all native behaviors.
- **`src/notifications.ts`** — best-effort Expo push-token registration. It's a
  no-op until (1) you run on a real device in a dev/prod build and (2) you set a
  real EAS `projectId`. Delivering pushes also needs a backend that stores the
  token and calls Expo's push API.
- **`app.json`** — app name, icons, splash, bundle id `coffee.pgh.app`. Change
  the bundle identifier / Android package if you want a different one.
- **`eas.json`** — `development`, `preview`, and `production` build profiles.

## Building for the stores (EAS)

These steps need **your** accounts — I can't do them from here.

1. **Apple Developer Program** membership ($99/yr) and a **Google Play
   Developer** account ($25 one-time) if you want Android too.
2. Install the CLI and log in:
   ```bash
   npm i -g eas-cli
   eas login
   ```
3. Link the project (this fills in the real `projectId`, replacing the
   `REPLACE_WITH_EAS_PROJECT_ID` placeholder in `app.json`):
   ```bash
   cd mobile
   eas init
   ```
4. Build:
   ```bash
   eas build --platform ios          # produces an .ipa in the cloud
   eas build --platform android       # produces an .aab
   ```
5. Submit:
   ```bash
   eas submit --platform ios
   eas submit --platform android
   ```

## App Store Connect checklist (manual)

Before Apple will review the build you also need:

- An **App Store Connect** app record (name, bundle id `coffee.pgh.app`).
- **Screenshots** for required device sizes (6.7" iPhone at minimum).
- A **privacy policy URL** and the App Privacy "nutrition label" answers.
- App category, description, keywords, support URL.

## ⚠️ Guideline 4.2 risk

Apple rejects apps that are "just a repackaged website" with no native value.
This shell adds offline handling, native navigation/link handling, splash, and
push scaffolding to reduce that risk — but acceptance is **not** guaranteed. The
strongest mitigation is shipping *working* push notifications (e.g. new-shop or
event alerts), which requires the backend piece described above.

## ⚠️ Google sign-in will not work in the wrapper

The site offers **email/password** (works fine in-app) **and Google OAuth**.
Google OAuth is a problem here for two reasons:

1. Google blocks OAuth inside embedded WebViews (`disallowed_useragent`), and
   this shell routes off-domain URLs (`accounts.google.com`) to the system
   browser — so the redirect back to `/auth/callback` lands in Safari, not the
   app, and the session never returns to the WebView.
2. Apple guideline **4.8**: if you offer a third-party login (Google) you must
   also offer an equivalent privacy-focused option (Sign in with Apple) — or
   Apple may reject the build.

Pragmatic options: hide the Google button in the native build (e.g. detect the
`pgh.coffee-app` user-agent on the web side), rely on email/password, or invest
in native auth (`expo-auth-session`), which moves this past the thin-shell model.
Reviewers **do** test login, so don't ship with a Google button that dead-ends.

## Verify the map before investing further

The whole site is Mapbox GL JS (WebGL) inside the WebView. Confirm the map pans
and renders acceptably in the **iOS Simulator / a real device** early — if it's
janky in WKWebView, that's a blocker independent of App Store review.
