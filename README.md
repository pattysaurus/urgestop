# UrgeStop

A CBT + DBT-based addiction recovery web app powered by Next.js and Claude AI.

---

## Quick Start (5 steps)

### 1. Install dependencies
```bash
npm install
```

### 2. Add your API keys
Open `.env.local` and replace the placeholder values with your real keys:
- **Anthropic key** → https://console.anthropic.com → API Keys
- **Supabase keys** → https://supabase.com → your project → Settings → API

### 3. Set up the database
- Go to https://supabase.com → your project → SQL Editor → New Query
- Paste the contents of `database-setup.sql` and click Run

### 4. Run the app
```bash
npm run dev
```

### 5. Open in browser
```
http://localhost:3000
```

---

## File Structure

```
urgestop/
├── .env.local                        ← Your API keys (never commit this)
├── database-setup.sql                ← Run once in Supabase SQL Editor
├── src/
│   ├── app/
│   │   ├── layout.tsx                ← Root layout
│   │   ├── page.tsx                  ← Entry point
│   │   ├── globals.css               ← Global styles
│   │   └── api/
│   │       └── coach/
│   │           └── route.ts          ← Claude AI coach API (server-side)
│   ├── components/
│   │   ├── UrgeStop.tsx              ← Main app with all tabs
│   │   └── GroundingExercise.tsx     ← 5-4-3-2-1 + distraction game
│   └── lib/
│       └── supabase.ts               ← Supabase client
```

---

## Features

- 🌊 **Urge Button** — launches grounding exercise or distraction game
- 🏅 **Sobriety Tracker** — days, hours, money saved, milestones
- 📓 **Trigger Journal** — Where/Who/Why logging with AI pattern insight
- ☀️ **Daily Pledges** — morning check-in and evening reflection (CBT/DBT)
- 🤖 **AI Recovery Coach** — live Claude-powered chat with crisis detection
- 🆘 **Crisis Protocol** — always-visible hotline overlay (988, SAMHSA, etc.)

---

## Notes

- The `days` variable in `UrgeStop.tsx` is hardcoded to `47` for demo purposes. Connect it to `profiles.sobriety_start_date` in Supabase for real data.
- The AI Coach API key lives server-side only in `route.ts` — it is never exposed to the browser.
- All journal content should be encrypted client-side before saving to Supabase (see `narrative_encrypted` column).
# urgestop
