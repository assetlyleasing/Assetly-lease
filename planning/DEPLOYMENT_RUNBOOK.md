# Deployment runbook — Firebase, new GitHub repo, Vercel, domain

Owner-executed checklist. `gh`, the Vercel CLI, and the Firebase CLI all need an interactive browser
login that can't be completed from this environment, so every step below is something you run
yourself; nothing here happens automatically. Work through it in order — Firebase first, since it
also resolves the Phase 3 blocker `OD-05` in `planning/SOURCE_OF_TRUTH.md` §25.

This track runs in parallel with the app code work (Phase 9 and later) — it doesn't block it, and
nothing in the app repo needs to change until you've done step 1.

---

## 1. Firebase project setup

Resolves `OD-05` (Firebase project/env). Also raises `OD-06` (admin auth method) as a decision you
make here — the recommendation below is a default, not a requirement.

### 1.1 Create the project

1. Go to [console.firebase.google.com](https://console.firebase.google.com) → **Add project**.
2. Name it (e.g. `assetly-leasing`) — Firebase auto-generates a project ID from this; note the ID,
   you'll see it again but don't need to memorise it.
3. On the Google Analytics prompt, **turn it off**. `SOURCE_OF_TRUTH.md` §24 lists "No analytics
   initially" as an explicit non-goal — skipping it here avoids creating an unused Analytics property.
4. Click **Create project** and wait for it to finish provisioning (~30s).

### 1.2 Enable Firestore

1. Left sidebar → **Build → Firestore Database → Create database**.
2. Pick a location close to the Bengaluru office — `asia-south1` (Mumbai) is the nearest region.
   **This cannot be changed later without recreating the database**, so get it right now.
3. Choose **Production mode** (locked, deny-by-default), not test mode. This matches the repo's own
   `firestore.rules`, which is a deny-all skeleton until Phase 3 (`TRUST-004`) writes the real rules —
   picking production mode means the console's default already agrees with the repo, and there's
   nothing further to deploy right now.

### 1.3 Enable Storage

1. Left sidebar → **Build → Storage → Get started**.
2. Same production-mode choice, and the **same region** you picked for Firestore (keeps everything in
   one region, avoiding cross-region latency/cost later). `storage.rules` in the repo is likewise a
   deny-all skeleton until Phase 3.

### 1.4 Enable Authentication, and create your own admin login

1. Left sidebar → **Build → Authentication → Get started**.
2. **Sign-in method** tab → enable **Email/Password**. **Decision point (`OD-06`)**: this is the
   simplest option to operate for a single-admin panel and is the default recommendation; Google
   Sign-In is the alternative if you'd rather not manage a separate password — either works with the
   existing `lib/firebase/` code path.
3. **Users** tab → **Add user** → enter the email and password *you* want to log into `app/admin`
   with. Nothing else creates this account for you — Phase 3 builds the login screen that checks
   against whatever user you create here, so this step is what actually gives you admin access later.

### 1.5 Register a Web app (browser config)

1. Click the gear icon next to "Project Overview" (top-left) → **Project settings**, or find "Add an
   app to get started" on the project's home page → click the **`</>`** (Web) icon.
2. Give it a nickname (e.g. `assetly-web`) — no need to check the Firebase Hosting box, the site
   deploys through Vercel, not Firebase Hosting.
3. Register the app. Firebase shows a `firebaseConfig` object — copy each value into `.env.local`
   (see 1.7):

   | Firebase console value | `.env.local` variable |
   |---|---|
   | `apiKey` | `NEXT_PUBLIC_FIREBASE_API_KEY` |
   | `authDomain` | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` |
   | `projectId` | `NEXT_PUBLIC_FIREBASE_PROJECT_ID` |
   | `storageBucket` | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` |
   | `messagingSenderId` | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` |
   | `appId` | `NEXT_PUBLIC_FIREBASE_APP_ID` |

### 1.6 Generate the Admin SDK service account (server-only secret)

1. Project settings (same gear icon) → **Service accounts** tab → Firebase Admin SDK panel is
   already selected → **Generate new private key** → confirm. This downloads a JSON file.
2. Open that file and map its fields into `.env.local`:

   | JSON field | `.env.local` variable |
   |---|---|
   | `project_id` | `FIREBASE_ADMIN_PROJECT_ID` |
   | `client_email` | `FIREBASE_ADMIN_CLIENT_EMAIL` |
   | `private_key` | `FIREBASE_ADMIN_PRIVATE_KEY` — paste exactly as the JSON has it, `\n` escapes and all, as one single-line value |

   `FIREBASE_ADMIN_STORAGE_BUCKET` is the same bucket name as
   `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` — the Storage page shows it as `gs://<bucket>`; use just
   `<bucket>`, without the `gs://` prefix.
3. **Delete the downloaded JSON file once you've copied its values** (or move it somewhere outside
   the repo and outside any synced folder) — it's a live credential and must never be committed or
   left in a Downloads folder.

### 1.7 Fill in `.env.local`

1. From the repo root: `cp .env.local.example .env.local`.
2. Paste in all ten values from 1.5 and 1.6.
3. Confirm it's gitignored — `git status` should **not** list `.env.local`. Never commit this file.
4. Restart the dev server (`npm run dev`) so Next.js picks up the new environment variables. There's
   nothing on-page yet that reads Firestore/Storage/Auth (Phase 3 builds that), so success here just
   means the app still loads with no console errors — `lib/firebase/client.ts` and `admin.ts` will
   now initialise instead of staying inert, which is what unblocks Phase 3 (`OD-05`) for a future
   cycle.

You'll also need to add these same ten values to the Vercel project's Environment Variables in step 3
below, so the deployed site has them too — `.env.local` only covers local dev.

## 2. New GitHub repo

Per your instruction: the existing `origin` (`github.com/sujeth-dev/Assetly`) keeps receiving normal
pushes through the rest of this work cycle. This step creates the *new* repo now, but the actual
migration push happens later, once this cycle's major changes (Phase 9 and the Hero plate fix) have
landed on `origin`.

1. ✅ Done — `assetlyleasing/Assetly-lease` created on GitHub and added locally as the `fresh` remote
   (`git remote add fresh https://github.com/assetlyleasing/Assetly-lease.git`). Nothing has been
   pushed to it yet.
2. ✅ Done — `fresh/main` matches `origin/main` as of the Phase 9 commit
   (`64f6025`). `origin` remains where day-to-day work continues to push; `fresh` is a snapshot target,
   not an ongoing second remote to push every commit to unless the owner asks otherwise.

## 3. New Vercel project

✅ Done — owner completed Vercel project setup and login directly; not run through this environment.
The environment variables named in this step were added later, in step 5 — which is where the one
genuine trap in this runbook lives.

## 4. Domain connection — assetly.lease

✅ Done — owner is connecting `assetly.lease` manually outside this workflow.

<details>
<summary>Original step-by-step (kept for reference)</summary>

1. `vercel login` from the repo root — this opens a browser for the OAuth flow. (The Vercel CLI is
   already installed in this environment at v50.17.1, just not logged in.)
2. Import the **new** GitHub repo from step 2 as a new Vercel project — either via the Vercel
   dashboard ("Add New… → Project" → select the repo) or `vercel link` after login. Framework preset
   should auto-detect as Next.js.
3. In the new project's Settings → Environment Variables, add all ten Firebase values from step 1
   (the six `NEXT_PUBLIC_FIREBASE_*` and four `FIREBASE_ADMIN_*` variables), scoped to Production
   (and Preview, if you want preview deployments to also talk to Firebase).
4. Trigger a deploy (push to the repo, or "Redeploy" in the dashboard) and confirm the build succeeds.

Domain connection steps (originally step 4):

1. In the Vercel project's Settings → Domains, add `assetly.lease` (and `www.assetly.lease` if you
   want the `www` variant too — Vercel can redirect one to the other).
2. Vercel will show the DNS records it needs. There are two ways to point the domain at it — which
   one applies depends on your registrar, so confirm the registrar name before doing this step and
   the exact record values can be filled in against it:
   - **Nameserver delegation** (simplest if you're comfortable letting Vercel manage all DNS for the
     domain): point the domain's nameservers at the ones Vercel provides.
   - **A/CNAME records at the current registrar** (keeps DNS management where it is): add the A
     record (apex domain) and CNAME record (`www`) Vercel displays, in the registrar's DNS panel.
3. Wait for DNS propagation (Vercel's dashboard shows when the domain is verified — usually minutes
   to a few hours depending on the registrar's TTL) and confirm `https://assetly.lease` resolves to
   the deployed site with a valid certificate (Vercel issues this automatically once DNS verifies).

</details>

## 5. Production environment variables, and the redeploy that must follow

✅ Done — the six `NEXT_PUBLIC_FIREBASE_*` values are set on the Vercel project for Production and
Preview, `assetly.lease` is listed under Firebase Authentication → Settings → Authorized domains, and
admin sign-in is confirmed working on the live site. This is the point at which `/admin` became
genuinely usable in production rather than only against a local dev server.

**The trap, recorded because it cost a debugging cycle.** `NEXT_PUBLIC_*` values are compiled into the
JavaScript bundle at *build* time; they are not read at runtime. Adding them in Vercel's settings
therefore changes nothing about an already-built deployment — the live site keeps serving a bundle
with an empty config until it is rebuilt. Any future change to a `NEXT_PUBLIC_*` variable needs a
redeploy (Deployments → latest → `⋯` → Redeploy, "Use existing Build Cache" unchecked) before it has
any effect.

The symptom is specific enough to diagnose from the message alone: `/admin/login` shows
**"Sign-in is not available right now."** That string is emitted from exactly one place —
`lib/firebase/auth.ts`, when `isFirebaseConfigured()` is false because a `NEXT_PUBLIC_FIREBASE_*`
value is absent from the bundle. It is never a wrong password (that reads "Incorrect email or
password.") and never an unauthorized domain (that falls through to "Sign-in failed. Try again."), so
it points straight at configuration rather than credentials.

To tell whether a given deployment has the config, without needing to sign in: fetch
`/admin/login`, pull the `/_next/static/**.js` chunk URLs out of the HTML, and grep them for
`firebaseapp.com`. Present means the config is baked in; absent means a rebuild is still pending.

The four server-side `FIREBASE_ADMIN_*` values are deliberately **not** set on Vercel. Nothing in the
shipped app reads them — `lib/firebase/admin.ts` has no consumers anywhere in `app/`, `components/`
or `lib/` — so this is not a gap today, but it becomes one the moment any server-side code touches
Firebase.

---

## After this runbook

Steps 1–5 are all complete: Firebase is live (`OD-05` resolved; `OD-06` resolved as Email/Password,
`DEC-057`), both remotes carry the code, the Vercel project is deployed, `assetly.lease` is connected,
and the production admin panel has been signed into successfully — the owner ran steps 3, 4 and 5
directly rather than through this environment. None of this requires further app code changes — it's
infrastructure state, not something `PROGRESS.md`'s phase tracking needs to reflect beyond what's
noted here.

The deployment is now fully exercised end to end: public site, Trusted By reading live Firestore, and
authenticated admin writes. The remaining infrastructure item is the unset `FIREBASE_ADMIN_*` group
described in step 5, which no shipped code depends on yet.
