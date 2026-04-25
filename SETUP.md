# Athlete OS — Setup & Deployment Guide

## What you have
- `src/` — Full React app (player view + coach dashboard)
- `supabase_schema.sql` — Database schema
- `.env.example` — Environment variables template

---

## Step 1: Create Your Supabase Project (5 min)

1. Go to https://supabase.com and sign up (free)
2. Click **"New Project"**
3. Name it `athlete-os`, choose a region close to you
4. Wait ~2 min for it to provision

---

## Step 2: Run the Database Schema (2 min)

1. In your Supabase dashboard → click **"SQL Editor"**
2. Click **"New Query"**
3. Open `supabase_schema.sql` from this folder
4. Paste the entire contents into the SQL editor
5. Click **"Run"**
6. You should see "Success" — all tables are created

---

## Step 3: Get Your API Keys (1 min)

1. In Supabase → **Settings** → **API**
2. Copy:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon / public key** (long string starting with `eyJ...`)

---

## Step 4: Configure Environment Variables (1 min)

1. In this project folder, copy `.env.example` to `.env`:
   ```
   cp .env.example .env
   ```
2. Open `.env` and fill in your values:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...your-key-here
   ```

---

## Step 5: Install & Run Locally (2 min)

Make sure you have Node.js installed (https://nodejs.org — get LTS version).

```bash
cd athlete-os
npm install
npm run dev
```

Open http://localhost:5173 — you should see the Athlete OS login screen.

---

## Step 6: Create Your Team

1. Click **"Create New Team"**
2. Enter your team name (e.g. "FC Warriors U21")
3. You'll receive:
   - **Player Code** (5 characters) — share this with all players
   - **Coach Code** (COACH-XXXX) — keep this private
4. Click "Enter Coach Dashboard"

---

## Step 7: Share With Players

Give every player:
1. The link to your deployed app (or your local IP if on same network)
2. The **Player Code**
3. Instructions: "Go to the link, click Player Login, enter the team code, create your profile with a 4-digit PIN"

---

## Deploy Online (Free — Vercel)

To make it accessible from any device/phone:

1. Push this folder to a GitHub repo
2. Go to https://vercel.com and sign up
3. Click **"New Project"** → import your GitHub repo
4. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your anon key
5. Click **"Deploy"**
6. You'll get a URL like `https://athlete-os-xyz.vercel.app`
7. Share that URL with your team

Total deploy time: ~5 minutes.

---

## How It Works

### For Players
- Open the app → Player Login → enter team code + name + PIN
- First visit: complete 60-second onboarding (position, gym focus, body goal)
- Everything adapts: training plan, sprint protocol, nutrition targets, game tracking stats
- Weekly check-in every Sunday → system auto-adjusts calories + volume

### For Coaches
- Open the app → Coach Dashboard → enter coach code
- See all players sorted by Superhuman Score
- Filter by position, flagged players, injured players
- Expand any player to see: score breakdown, game stats, check-in trends, nutrition
- Assign weekly focus + coach note per player — appears in their app instantly
- Dashboard auto-refreshes every 30 seconds

---

## Position-Adaptive Features

| Position | Sprint Protocol | Game Stats | Score Logic |
|----------|----------------|------------|-------------|
| Striker | Acceleration + repeat sprint | Goals, shots, presses | Press win % + shot accuracy |
| Winger | Max velocity + short bursts | Chances, crosses, dribbles | Dribble success + chances |
| Central Mid | Tempo endurance | Passes, distance, chances | Pass accuracy |
| Defensive Mid | Explosive bursts + endurance | Tackles, interceptions | Duel win % |
| Centre Back | Power + 5-20m bursts | Tackles, clearances, aerials | Aerial + tackle rate |
| Full Back | Flank repeat speed | Tackles, crosses, distance | Distance + crosses |
| Goalkeeper | Reaction + lateral power | Saves, conceded, distribution | Save percentage |

---

## Architecture Notes (Cloud Upgrade Path)

The Supabase layer in `src/lib/supabase.js` is fully abstracted.
All data operations go through named functions — no direct DB calls in components.

When ready to add features:
- **Real-time coach dashboard**: Replace `setInterval(loadData, 30000)` with `supabase.channel()` subscriptions
- **Push notifications**: Add Supabase Edge Functions + web push
- **Email accounts**: Replace PIN auth with `supabase.auth.signInWithOtp()`
- **File uploads**: Add profile photos via Supabase Storage

---

## Troubleshooting

**"Missing Supabase env vars"** → Check your `.env` file has the correct values and no extra spaces

**Player can't log in** → Make sure name matches exactly (case-insensitive) and PIN is 4 digits

**Coach sees no players** → Players need to complete onboarding first. Check team code is correct.

**Data not syncing** → Check Supabase is online at status.supabase.com
