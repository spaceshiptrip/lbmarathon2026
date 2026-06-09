# Long Beach Marathon Training App — Build Specification (v1 — no backend)

## Project overview

Build a fully interactive, mobile-first marathon training plan web app for a female beginner
runner targeting the **2XU Long Beach Marathon on October 11, 2026**. The app is entirely
static — no backend, no auth, no database, no paid services. Deployed to **GitHub Pages** for free.

The runner is in her early 20s, fit from yoga and strength training, limited time, targeting a
**4:30 finish** (adjustable). She needs an easy-to-reference weekly schedule, educational content
on every workout type, and dynamic paces that recalculate when she changes her goal time.

> **v2 note:** A Google Sheets training log backend is planned for v2. The architecture here is
> designed so that adding it later requires no restructuring — just new hooks and components.

---

## Cost policy — ZERO COST

| Service | Cost |
|---|---|
| GitHub Pages | Free |
| React / Vite / Tailwind / shadcn | Free (open source) |
| nvm + Node 20 LTS | Free |

---

## Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | React 18 | Functional components, hooks only |
| Build tool | Vite 5 | `npm create vite@latest` with react template |
| Styling | Tailwind CSS v3 | `npm install -D tailwindcss postcss autoprefixer` |
| UI components | shadcn/ui | `npx shadcn@latest init` after Tailwind |
| Icons | lucide-react | Included with shadcn |
| Routing | None | Single-page app, hash anchor scrolling |
| State | React useState / useContext | No external state library needed |
| Data files | JSON in `public/data/` | Fetched at runtime, NOT bundled |
| Deployment | GitHub Pages + gh-pages | `npm run deploy` |
| Node version | 20 LTS | `nvm install 20 && nvm use 20` |

---

## Project setup — exact commands in order

```bash
# 0. Correct Node version
nvm install 20
nvm use 20

# 1. Create project
npm create vite@latest marathon-training -- --template react
cd marathon-training

# 2. Install Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 3. Install base deps
npm install

# 4. Init shadcn (choose: slate base color, CSS variables: yes)
npx shadcn@latest init

# 5. Add shadcn components
npx shadcn@latest add card badge button dialog tabs slider select tooltip progress accordion separator

# 6. lucide-react (may already be present after shadcn)
npm install lucide-react

# 7. gh-pages for deployment
npm install -D gh-pages

# 8. Verify dev server works
npm run dev
```

---

## vite.config.js

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/marathon-training/',  // must match your GitHub repo name exactly
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
})
```

---

## tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ocean: {
          50:  "#e6f4fb", 100: "#b3ddf5", 200: "#80c7ef", 300: "#4db1e9",
          400: "#1a9ae3", 500: "#0077c2", 600: "#005f9a", 700: "#004772",
          800: "#002f4b", 900: "#001824",
        },
        sand: {
          50:  "#fdf9f0", 100: "#f9eed8", 200: "#f3ddb2", 300: "#edcc8b",
          400: "#e7bb65", 500: "#d4a017", 600: "#a87d12", 700: "#7c5b0d",
          800: "#513a08", 900: "#251a03",
        },
      },
      fontFamily: { sans: ["Inter", "ui-sans-serif", "system-ui"] },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

---

## package.json (final shape)

```json
{
  "name": "marathon-training",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "homepage": "https://YOUR_GITHUB_USERNAME.github.io/marathon-training",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

Replace `YOUR_GITHUB_USERNAME` with the actual GitHub username before deploying.

---

## File / folder structure

```
marathon-training/
├── public/
│   ├── data/
│   │   ├── plan.json           ← 18-week schedule (edit here to change the plan)
│   │   └── workouts.json       ← all workout descriptions + how-to content
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── ui/                 ← shadcn auto-generated — DO NOT EDIT
│   │   ├── layout/
│   │   │   ├── Header.jsx      ← sticky nav showing goal time + race pace
│   │   │   └── Footer.jsx      ← race info + official website link
│   │   ├── GoalSetter.jsx      ← goal time picker + live pace card grid
│   │   ├── WeeklySchedule.jsx  ← all 18 weeks grouped by phase
│   │   ├── WeekCard.jsx        ← single collapsible week
│   │   ├── DayPill.jsx         ← colored pill for one day's workout
│   │   ├── WorkoutModal.jsx    ← dialog: tap a pill → full workout guide
│   │   ├── WorkoutGuide.jsx    ← accordion reference for all workout types
│   │   └── RaceCountdown.jsx   ← live seconds countdown to race day
│   ├── data/
│   │   └── paceCalculator.js   ← pure pace math, no JSON dependency
│   ├── hooks/
│   │   ├── usePlanData.js      ← fetches + caches plan.json + workouts.json
│   │   └── useGoalTime.js      ← manages goal time string + derived paces
│   ├── context/
│   │   └── TrainingContext.jsx ← single global state provider
│   ├── lib/
│   │   └── utils.js            ← shadcn cn() helper (auto-generated)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css               ← Tailwind directives + shadcn CSS variables
└── index.html
```

---

## Data files

### Why JSON in public/data/ instead of JS imports

- Edit the training plan or workout descriptions without touching any React component
- Vite does not bundle files in `public/` — they are served as-is, same as a CDN
- The fetch URL uses `import.meta.env.BASE_URL` so it works both in dev and on GitHub Pages
- In v2, these files could come from an API instead with zero component changes

---

### public/data/plan.json

Full 18-week plan. This is the only place workout data lives.

```json
{
  "raceDate": "2026-10-11T05:30:00",
  "startDate": "2026-06-09",
  "defaultGoalTime": "4:30:00",
  "phases": {
    "base":  { "label": "Base",  "weeks": [1,2,3,4],             "color": "green"  },
    "build": { "label": "Build", "weeks": [5,6,7,8],             "color": "amber"  },
    "peak":  { "label": "Peak",  "weeks": [9,10,11,12,13,14,15], "color": "blue"   },
    "taper": { "label": "Taper", "weeks": [16,17],               "color": "purple" },
    "race":  { "label": "Race",  "weeks": [18],                  "color": "orange" }
  },
  "weeks": [
    {
      "week": 1, "phase": "base", "dates": "Jun 9–15", "totalMiles": 14,
      "note": "First week! Don't worry about pace. Just move. Walk breaks are encouraged.",
      "days": {
        "mon": { "type": "rest",  "label": "Rest",          "miles": 0 },
        "tue": { "type": "easy",  "label": "3 mi easy",     "miles": 3 },
        "wed": { "type": "cross", "label": "XT / yoga",     "miles": 0 },
        "thu": { "type": "easy",  "label": "3 mi easy",     "miles": 3 },
        "fri": { "type": "rest",  "label": "Rest",          "miles": 0 },
        "sat": { "type": "easy",  "label": "3 mi easy",     "miles": 3 },
        "sun": { "type": "long",  "label": "5 mi long run", "miles": 5 }
      }
    },
    {
      "week": 2, "phase": "base", "dates": "Jun 16–22", "totalMiles": 15,
      "note": "If Sunday feels hard, slow down. Finish feeling like you could do 2 more miles.",
      "days": {
        "mon": { "type": "rest",  "label": "Rest",          "miles": 0 },
        "tue": { "type": "easy",  "label": "3 mi easy",     "miles": 3 },
        "wed": { "type": "cross", "label": "XT / yoga",     "miles": 0 },
        "thu": { "type": "easy",  "label": "3 mi easy",     "miles": 3 },
        "fri": { "type": "rest",  "label": "Rest",          "miles": 0 },
        "sat": { "type": "easy",  "label": "3 mi easy",     "miles": 3 },
        "sun": { "type": "long",  "label": "6 mi long run", "miles": 6 }
      }
    },
    {
      "week": 3, "phase": "base", "dates": "Jun 23–29", "totalMiles": 18,
      "note": "Get proper running shoes this week if you haven't already.",
      "days": {
        "mon": { "type": "rest",  "label": "Rest",          "miles": 0 },
        "tue": { "type": "easy",  "label": "4 mi easy",     "miles": 4 },
        "wed": { "type": "cross", "label": "XT / yoga",     "miles": 0 },
        "thu": { "type": "easy",  "label": "4 mi easy",     "miles": 4 },
        "fri": { "type": "rest",  "label": "Rest",          "miles": 0 },
        "sat": { "type": "easy",  "label": "3 mi easy",     "miles": 3 },
        "sun": { "type": "long",  "label": "7 mi long run", "miles": 7 }
      }
    },
    {
      "week": 4, "phase": "base", "dates": "Jun 30–Jul 6", "totalMiles": 17,
      "note": "Cutback week — volume drops slightly. Your body needs this.",
      "days": {
        "mon": { "type": "rest",  "label": "Rest",          "miles": 0 },
        "tue": { "type": "easy",  "label": "3 mi easy",     "miles": 3 },
        "wed": { "type": "cross", "label": "XT / yoga",     "miles": 0 },
        "thu": { "type": "easy",  "label": "3 mi easy",     "miles": 3 },
        "fri": { "type": "rest",  "label": "Rest",          "miles": 0 },
        "sat": { "type": "easy",  "label": "3 mi easy",     "miles": 3 },
        "sun": { "type": "long",  "label": "8 mi long run", "miles": 8 }
      }
    },
    {
      "week": 5, "phase": "build", "dates": "Jul 7–13", "totalMiles": 23,
      "note": "First tempo run! Warm up 10 min easy, run 3 miles at tempo pace, cool down 10 min.",
      "days": {
        "mon": { "type": "rest",  "label": "Rest",          "miles": 0 },
        "tue": { "type": "easy",  "label": "4 mi easy",     "miles": 4 },
        "wed": { "type": "tempo", "label": "3 mi tempo",    "miles": 3, "speedWork": true, "altLabel": "3 mi easy", "altType": "easy", "altMiles": 3 },
        "thu": { "type": "easy",  "label": "4 mi easy",     "miles": 4 },
        "fri": { "type": "rest",  "label": "Rest",          "miles": 0 },
        "sat": { "type": "easy",  "label": "3 mi easy",     "miles": 3 },
        "sun": { "type": "long",  "label": "9 mi long run", "miles": 9 }
      }
    },
    {
      "week": 6, "phase": "build", "dates": "Jul 14–20", "totalMiles": 25,
      "note": "Double digits on Sunday! Practice fueling: one gel at mile 5.",
      "days": {
        "mon": { "type": "rest",  "label": "Rest",            "miles": 0 },
        "tue": { "type": "easy",  "label": "4 mi easy",       "miles": 4 },
        "wed": { "type": "tempo", "label": "3 mi tempo",      "miles": 3, "speedWork": true, "altLabel": "3 mi easy", "altType": "easy", "altMiles": 3 },
        "thu": { "type": "easy",  "label": "4 mi easy",       "miles": 4 },
        "fri": { "type": "rest",  "label": "Rest",            "miles": 0 },
        "sat": { "type": "easy",  "label": "4 mi easy",       "miles": 4 },
        "sun": { "type": "long",  "label": "10 mi long run",  "miles": 10 }
      }
    },
    {
      "week": 7, "phase": "build", "dates": "Jul 21–27", "totalMiles": 28,
      "note": "First Yasso 800s! A track is ideal. 4 reps with equal-time recovery jog.",
      "days": {
        "mon": { "type": "rest",  "label": "Rest",            "miles": 0 },
        "tue": { "type": "easy",  "label": "5 mi easy",       "miles": 5 },
        "wed": { "type": "yasso", "label": "4×800m Yasso",    "miles": 4, "speedWork": true, "altLabel": "3 mi easy", "altType": "easy", "altMiles": 3 },
        "thu": { "type": "easy",  "label": "4 mi easy",       "miles": 4 },
        "fri": { "type": "rest",  "label": "Rest",            "miles": 0 },
        "sat": { "type": "easy",  "label": "4 mi easy",       "miles": 4 },
        "sun": { "type": "long",  "label": "11 mi long run",  "miles": 11 }
      }
    },
    {
      "week": 8, "phase": "build", "dates": "Jul 28–Aug 3", "totalMiles": 26,
      "note": "Cutback week. Tempo Wednesday, but volume is intentionally lower.",
      "days": {
        "mon": { "type": "rest",  "label": "Rest",            "miles": 0 },
        "tue": { "type": "easy",  "label": "4 mi easy",       "miles": 4 },
        "wed": { "type": "tempo", "label": "3 mi tempo",      "miles": 3, "speedWork": true, "altLabel": "3 mi easy", "altType": "easy", "altMiles": 3 },
        "thu": { "type": "easy",  "label": "4 mi easy",       "miles": 4 },
        "fri": { "type": "rest",  "label": "Rest",            "miles": 0 },
        "sat": { "type": "easy",  "label": "3 mi easy",       "miles": 3 },
        "sun": { "type": "long",  "label": "12 mi long run",  "miles": 12 }
      }
    },
    {
      "week": 9, "phase": "peak", "dates": "Aug 4–10", "totalMiles": 33,
      "note": "Start fueling every 40–45 min on long runs. Practice the brand you'll use race day.",
      "days": {
        "mon": { "type": "rest",  "label": "Rest",            "miles": 0 },
        "tue": { "type": "easy",  "label": "5 mi easy",       "miles": 5 },
        "wed": { "type": "yasso", "label": "5×800m Yasso",    "miles": 5, "speedWork": true, "altLabel": "4 mi easy", "altType": "easy", "altMiles": 4 },
        "thu": { "type": "easy",  "label": "5 mi easy",       "miles": 5 },
        "fri": { "type": "rest",  "label": "Rest",            "miles": 0 },
        "sat": { "type": "easy",  "label": "4 mi easy",       "miles": 4 },
        "sun": { "type": "long",  "label": "14 mi long run",  "miles": 14 }
      }
    },
    {
      "week": 10, "phase": "peak", "dates": "Aug 11–17", "totalMiles": 33,
      "note": "Tempo: warm up 1 mi, run 4 mi at tempo pace, cool down 1 mi.",
      "days": {
        "mon": { "type": "rest",  "label": "Rest",            "miles": 0 },
        "tue": { "type": "easy",  "label": "5 mi easy",       "miles": 5 },
        "wed": { "type": "tempo", "label": "4 mi tempo",      "miles": 4, "speedWork": true, "altLabel": "4 mi easy", "altType": "easy", "altMiles": 4 },
        "thu": { "type": "easy",  "label": "5 mi easy",       "miles": 5 },
        "fri": { "type": "rest",  "label": "Rest",            "miles": 0 },
        "sat": { "type": "easy",  "label": "4 mi easy",       "miles": 4 },
        "sun": { "type": "long",  "label": "15 mi long run",  "miles": 15 }
      }
    },
    {
      "week": 11, "phase": "peak", "dates": "Aug 18–24", "totalMiles": 34,
      "note": "Hill repeats: find a 200–400m hill. 6 hard uphill efforts, walk/jog back down.",
      "days": {
        "mon": { "type": "rest",  "label": "Rest",             "miles": 0 },
        "tue": { "type": "easy",  "label": "5 mi easy",        "miles": 5 },
        "wed": { "type": "hills", "label": "Hill repeats 6×",  "miles": 4, "speedWork": true, "altLabel": "4 mi easy", "altType": "easy", "altMiles": 4 },
        "thu": { "type": "easy",  "label": "5 mi easy",        "miles": 5 },
        "fri": { "type": "rest",  "label": "Rest",             "miles": 0 },
        "sat": { "type": "easy",  "label": "4 mi easy",        "miles": 4 },
        "sun": { "type": "long",  "label": "16 mi long run",   "miles": 16 }
      }
    },
    {
      "week": 12, "phase": "peak", "dates": "Aug 25–31", "totalMiles": 38,
      "note": "18 miles! This is a milestone. Run easy, fuel well, stay hydrated.",
      "days": {
        "mon": { "type": "rest",  "label": "Rest",            "miles": 0 },
        "tue": { "type": "easy",  "label": "5 mi easy",       "miles": 5 },
        "wed": { "type": "yasso", "label": "7×800m Yasso",    "miles": 6, "speedWork": true, "altLabel": "4 mi easy", "altType": "easy", "altMiles": 4 },
        "thu": { "type": "easy",  "label": "5 mi easy",       "miles": 5 },
        "fri": { "type": "rest",  "label": "Rest",            "miles": 0 },
        "sat": { "type": "easy",  "label": "4 mi easy",       "miles": 4 },
        "sun": { "type": "long",  "label": "18 mi long run",  "miles": 18 }
      }
    },
    {
      "week": 13, "phase": "peak", "dates": "Sep 1–7", "totalMiles": 38,
      "note": "First 20-miler! The peak of your training. Run 90 sec/mi slower than goal pace.",
      "days": {
        "mon": { "type": "rest",  "label": "Rest",            "miles": 0 },
        "tue": { "type": "easy",  "label": "5 mi easy",       "miles": 5 },
        "wed": { "type": "tempo", "label": "4 mi tempo",      "miles": 4, "speedWork": true, "altLabel": "4 mi easy", "altType": "easy", "altMiles": 4 },
        "thu": { "type": "easy",  "label": "5 mi easy",       "miles": 5 },
        "fri": { "type": "rest",  "label": "Rest",            "miles": 0 },
        "sat": { "type": "easy",  "label": "4 mi easy",       "miles": 4 },
        "sun": { "type": "long",  "label": "20 mi long run",  "miles": 20 }
      }
    },
    {
      "week": 14, "phase": "peak", "dates": "Sep 8–14", "totalMiles": 42,
      "note": "10×800m Yasso is the gold standard fitness test. Completing it = ready to race.",
      "days": {
        "mon": { "type": "rest",  "label": "Rest",            "miles": 0 },
        "tue": { "type": "easy",  "label": "5 mi easy",       "miles": 5 },
        "wed": { "type": "yasso", "label": "10×800m Yasso",   "miles": 8, "speedWork": true, "altLabel": "5 mi easy", "altType": "easy", "altMiles": 5 },
        "thu": { "type": "easy",  "label": "5 mi easy",       "miles": 5 },
        "fri": { "type": "rest",  "label": "Rest",            "miles": 0 },
        "sat": { "type": "easy",  "label": "4 mi easy",       "miles": 4 },
        "sun": { "type": "long",  "label": "20 mi long run",  "miles": 20 }
      }
    },
    {
      "week": 15, "phase": "peak", "dates": "Sep 15–21", "totalMiles": 36,
      "note": "Begin taper. Volume drops. Trust the process — you've done the work.",
      "days": {
        "mon": { "type": "rest",  "label": "Rest",            "miles": 0 },
        "tue": { "type": "easy",  "label": "5 mi easy",       "miles": 5 },
        "wed": { "type": "tempo", "label": "4 mi tempo",      "miles": 4, "speedWork": true, "altLabel": "4 mi easy", "altType": "easy", "altMiles": 4 },
        "thu": { "type": "easy",  "label": "5 mi easy",       "miles": 5 },
        "fri": { "type": "rest",  "label": "Rest",            "miles": 0 },
        "sat": { "type": "easy",  "label": "4 mi easy",       "miles": 4 },
        "sun": { "type": "long",  "label": "18 mi long run",  "miles": 18 }
      }
    },
    {
      "week": 16, "phase": "taper", "dates": "Sep 22–28", "totalMiles": 28,
      "note": "Taper week 1. Feel antsy — that's good. Your legs are loading energy.",
      "days": {
        "mon": { "type": "rest",  "label": "Rest",            "miles": 0 },
        "tue": { "type": "easy",  "label": "4 mi easy",       "miles": 4 },
        "wed": { "type": "tempo", "label": "3 mi tempo",      "miles": 3, "speedWork": true, "altLabel": "3 mi easy", "altType": "easy", "altMiles": 3 },
        "thu": { "type": "easy",  "label": "4 mi easy",       "miles": 4 },
        "fri": { "type": "rest",  "label": "Rest",            "miles": 0 },
        "sat": { "type": "easy",  "label": "3 mi easy",       "miles": 3 },
        "sun": { "type": "long",  "label": "14 mi long run",  "miles": 14 }
      }
    },
    {
      "week": 17, "phase": "taper", "dates": "Sep 29–Oct 5", "totalMiles": 20,
      "note": "Final sharpener week. Easy and relaxed. Carb-load planning begins Friday.",
      "days": {
        "mon": { "type": "rest",  "label": "Rest",          "miles": 0 },
        "tue": { "type": "easy",  "label": "3 mi easy",     "miles": 3 },
        "wed": { "type": "tempo", "label": "2 mi tempo",    "miles": 2, "speedWork": true, "altLabel": "2 mi easy", "altType": "easy", "altMiles": 2 },
        "thu": { "type": "easy",  "label": "3 mi easy",     "miles": 3 },
        "fri": { "type": "rest",  "label": "Rest",          "miles": 0 },
        "sat": { "type": "easy",  "label": "2 mi easy",     "miles": 2 },
        "sun": { "type": "long",  "label": "10 mi easy",    "miles": 10 }
      }
    },
    {
      "week": 18, "phase": "race", "dates": "Oct 6–11", "totalMiles": 33.2,
      "note": "Race week. Sleep. Hydrate. Eat carbs. Don't try anything new. Trust your training.",
      "days": {
        "mon": { "type": "rest",  "label": "Rest",           "miles": 0 },
        "tue": { "type": "easy",  "label": "3 mi easy",      "miles": 3 },
        "wed": { "type": "cross", "label": "XT / yoga",      "miles": 0 },
        "thu": { "type": "easy",  "label": "2 mi easy",      "miles": 2 },
        "fri": { "type": "rest",  "label": "Rest + expo",    "miles": 0 },
        "sat": { "type": "easy",  "label": "2 mi shakeout",  "miles": 2 },
        "sun": { "type": "race",  "label": "🏁 RACE DAY",    "miles": 26.2 }
      }
    }
  ]
}
```

---

### public/data/workouts.json

All educational content. Edit this file to update descriptions without touching React code.

```json
{
  "easy": {
    "label": "Easy run", "color": "green", "icon": "🟢",
    "tagline": "The foundation of all your training.",
    "whatItIs": "An easy run is a slow, conversational-pace run where you could comfortably hold a full conversation without gasping. It feels almost too easy — that's correct. Easy runs build aerobic base, improve fat metabolism, strengthen connective tissue, and aid recovery.",
    "howToDo": [
      "Run slow enough that you can say 5–6 words without pausing to breathe.",
      "If you have a heart rate monitor, stay in Zone 2 (roughly 60–70% of max HR).",
      "Don't worry about pace. Run by feel or HR, not by speed.",
      "Walk breaks are fine, especially in the first 4 weeks."
    ],
    "paceNote": "easyPace",
    "commonMistakes": "Going too fast is the #1 beginner mistake. If you're huffing after a sentence, slow down."
  },
  "long": {
    "label": "Long run", "color": "blue", "icon": "🔵",
    "tagline": "The most important workout of the week.",
    "whatItIs": "The long run builds the endurance and mental resilience required to cover 26.2 miles. It trains your body to burn fat efficiently, stress-tests your legs, and lets you practice nutrition and hydration strategies. Missing a long run is the one thing most likely to leave you undertrained.",
    "howToDo": [
      "Run 60–90 seconds per mile slower than your goal race pace.",
      "Start with a 5-minute walk warm-up. End with a 5-minute walk cool-down.",
      "Use a run/walk strategy if needed: 9 min run / 1 min walk works great for beginners.",
      "Bring water or plan your route around water fountains.",
      "Practice race-day nutrition: take a gel or chew every 45 min on runs over 10 miles.",
      "Do this on Sunday — your body needs Monday off to recover."
    ],
    "paceNote": "longRunPace",
    "commonMistakes": "Running too fast on long runs leads to injury and excessive fatigue. Slow is the goal."
  },
  "tempo": {
    "label": "Tempo run", "color": "orange", "icon": "🟠",
    "tagline": "Comfortably hard. Builds your lactate threshold.",
    "whatItIs": "A tempo run is run at threshold pace — the fastest pace you can sustain for about an hour. It's harder than easy but not a sprint. Physiologically, it trains your body to clear lactate faster, which lets you sustain a faster pace on race day. Also called a threshold run.",
    "howToDo": [
      "Warm up with 10 min of easy running first.",
      "Run at tempo pace — you should be able to say 2–3 words but not hold a conversation.",
      "Maintain this effort for the prescribed distance (usually 2–4 miles).",
      "Cool down with 10 min easy running.",
      "Total session including warm-up/cool-down is about 40–50 min."
    ],
    "paceNote": "tempoPace",
    "commonMistakes": "Tempo pace is NOT a sprint. If you're dying after 1 mile, you started too fast."
  },
  "yasso": {
    "label": "Yasso 800s", "color": "purple", "icon": "🟣",
    "tagline": "The classic marathon speed predictor workout.",
    "whatItIs": "Yasso 800s, named for Bart Yasso of Runner's World, are 800-meter (half-mile) repeats. The magic: if you can run 10 × 800m with your goal time in minutes:seconds, you're fit enough to run the marathon in that time in hours:minutes. A 4:30 goal means running 800s in 4:30 each.",
    "howToDo": [
      "Warm up with 10–15 min easy running.",
      "Run 800m (2 laps of a track, or 0.5 miles on GPS) at your Yasso target pace.",
      "Jog easy for the SAME amount of time as your 800m rep — this is the recovery.",
      "Repeat for the prescribed number of reps (start with 4–5, build to 10 by week 14).",
      "Cool down with 10 min easy running.",
      "A track is ideal but any flat surface works with GPS."
    ],
    "paceNote": "yassoTarget",
    "schedule": "Introduced week 7 with 4×800m. Build by 1 rep every 2–3 weeks. Peak 10×800m in week 14.",
    "commonMistakes": "Don't skip the recovery jog — it's as important as the rep itself. Running it too fast defeats the purpose."
  },
  "intervals": {
    "label": "Intervals / 800m repeats", "color": "purple", "icon": "🟣",
    "tagline": "Short, fast efforts that build speed and VO2 max.",
    "whatItIs": "Interval training alternates fast-effort running with recovery jogs. For marathon training, 800m repeats at roughly 5K effort are the most common. They improve your cardiovascular ceiling (VO2 max), which makes every other pace feel easier.",
    "howToDo": [
      "Warm up with 10–15 min easy running + 4 × 20-second strides.",
      "Run each 800m repeat at your interval (5K) pace — controlled hard effort.",
      "Recover with a 400m (0.25 mi) easy jog between reps.",
      "Cool down 10 min easy."
    ],
    "paceNote": "intervalPace",
    "commonMistakes": "Going all-out on rep 1 and dying by rep 4. Even effort across all reps is the goal."
  },
  "hills": {
    "label": "Hill repeats", "color": "red", "icon": "🔴",
    "tagline": "Nature's strength training for runners.",
    "whatItIs": "Hill repeats build leg strength, improve running economy, and add intensity without the joint stress of track intervals. They force proper running form naturally — high knees, arm drive, forward lean. Long Beach is flat, but hills in training make flat race day feel easy.",
    "howToDo": [
      "Find a hill with a 4–6% grade, about 200–400m long.",
      "Warm up with 10–15 min easy flat running.",
      "Run uphill HARD at a 5K effort (about 85–90% max HR). Pump your arms.",
      "Walk or jog very slowly back down — this is full recovery.",
      "Start with 4–6 repeats. Build to 8–10 over several weeks.",
      "Cool down with 10 min easy flat running.",
      "No hills nearby? Use a treadmill set to 5–6% incline."
    ],
    "paceNote": null,
    "paceNoteText": "Effort-based, not pace-based. Aim for RPE 8/10 on the uphill. Pace is irrelevant on hills.",
    "schedule": "Introduced week 11 as an occasional swap for intervals.",
    "commonMistakes": "Running the downhill fast. Downhill recovery is essential — your quads will thank you."
  },
  "mileRepeats": {
    "label": "Mile repeats", "color": "purple", "icon": "🟣",
    "tagline": "Longer intervals that build race-pace stamina.",
    "whatItIs": "Mile repeats (1600m) bridge the gap between tempo running and short track intervals. They're more specific to marathon training because they require sustaining a harder effort over a longer distance — closer to race conditions.",
    "howToDo": [
      "Warm up with 15 min easy running.",
      "Run each mile at mile-repeat pace — slightly faster than tempo, slower than 5K pace.",
      "Recover with a 2–3 min easy jog or walk between reps.",
      "Start with 3 repeats, build to 5.",
      "Cool down with 10–15 min easy running."
    ],
    "paceNote": "mileRepeatPace",
    "schedule": "Optional swap for Yasso 800s in weeks 12–15 for variety.",
    "commonMistakes": "Mile repeats aren't all-out sprints. Think 'controlled fast.'"
  },
  "cross": {
    "label": "Cross-training", "color": "pink", "icon": "🩷",
    "tagline": "Aerobic fitness without the pounding.",
    "whatItIs": "Cross-training (XT) gives your running muscles a break while maintaining cardiovascular fitness. For a runner who already does yoga and strength work, this slot is very flexible. Good options: cycling, swimming, elliptical, yoga flow, or pool running.",
    "howToDo": [
      "Choose any non-impact or low-impact cardio activity.",
      "Keep intensity moderate — this is not a hard day.",
      "Duration: 30–50 minutes is plenty.",
      "Yoga counts — especially hip openers, hamstring work, and hip flexor stretches, which directly benefit running.",
      "Strength training: reduce lower body volume (fewer sets, no heavy squats or lunges) from week 10 onward."
    ],
    "paceNote": null,
    "paceNoteText": "No pace target. Keep effort easy — heart rate around 60% of max."
  },
  "rest": {
    "label": "Rest day", "color": "gray", "icon": "⬜",
    "tagline": "This is when you actually get stronger.",
    "whatItIs": "Rest days are mandatory adaptation days, not wasted training days. Running breaks down muscle tissue; rest is when your body repairs it stronger. Skipping rest days is the fastest route to overtraining, injury, and burnout. Monday is always rest in this plan.",
    "howToDo": [
      "Do nothing strenuous.",
      "Light walking (under 30 min) is fine.",
      "Foam rolling, stretching, and mobility work are great on rest days.",
      "Eat well and sleep — this is when the gains happen."
    ],
    "paceNote": null,
    "paceNoteText": "No running. Optional gentle mobility only."
  }
}
```

---

## src/data/paceCalculator.js

Pure functions only. No JSON imports. All pace math derived from a single goal time string.
Based on McMillan Running / Daniels' Running Formula methodology.

```js
/**
 * Convert "H:MM:SS" or "M:SS" string → total seconds
 */
export function timeToSeconds(timeStr) {
  const parts = timeStr.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 0;
}

/**
 * Convert total seconds → "H:MM:SS"
 */
export function secondsToTime(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.round(totalSeconds % 60);
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * Convert seconds per mile → "M:SS/mi"
 */
export function secondsToMinPerMile(secsPerMile) {
  const m = Math.floor(secsPerMile / 60);
  const s = Math.round(secsPerMile % 60);
  return `${m}:${String(s).padStart(2, "0")}/mi`;
}

/**
 * Given a marathon goal time "H:MM:SS", return all training paces.
 *
 *   easy:        goal pace + 105 sec/mi   (conversational, Zone 2)
 *   long:        goal pace + 75 sec/mi    (easy but sustained)
 *   tempo:       goal pace - 25 sec/mi    (comfortably hard, threshold)
 *   mileRepeat:  goal pace - 45 sec/mi    (controlled fast)
 *   interval:    goal pace - 67 sec/mi    (~5K effort)
 *   yasso:       goal H:MM → same digits as MM:SS per 800m
 *                e.g. 4:30 marathon goal → 4:30 per 800m repeat
 */
export function calculatePaces(goalTimeStr) {
  const goalSecs        = timeToSeconds(goalTimeStr);
  const goalPacePerMile = goalSecs / 26.2;
  const goalHours       = Math.floor(goalSecs / 3600);
  const goalMinutes     = Math.floor((goalSecs % 3600) / 60);

  return {
    goalTime:       goalTimeStr,
    goalPace:       secondsToMinPerMile(goalPacePerMile),
    easyPace:       secondsToMinPerMile(goalPacePerMile + 105),
    longRunPace:    secondsToMinPerMile(goalPacePerMile + 75),
    tempoPace:      secondsToMinPerMile(goalPacePerMile - 25),
    mileRepeatPace: secondsToMinPerMile(goalPacePerMile - 45),
    intervalPace:   secondsToMinPerMile(goalPacePerMile - 67),
    yassoTarget:    `${goalHours}:${String(goalMinutes).padStart(2, "0")} per 800m`,
    yassoRecovery:  "Same duration as rep (easy jog)",
  };
}

/**
 * Sub-4:45 → show Yasso 800s, hill repeats, intervals.
 * 4:45 and slower → replace all speed work with easy runs.
 */
export function shouldIncludeSpeedWork(goalTimeStr) {
  return timeToSeconds(goalTimeStr) < timeToSeconds("4:45:00");
}
```

---

## src/hooks/usePlanData.js

Fetches both JSON files once on mount. Respects the Vite base path so it works on
both `localhost:5173` (dev) and `username.github.io/marathon-training` (prod).

```js
import { useState, useEffect } from "react";

export function usePlanData() {
  const [plan,     setPlan]     = useState(null);
  const [workouts, setWorkouts] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    const base = import.meta.env.BASE_URL; // "/marathon-training/" in prod, "/" in dev
    Promise.all([
      fetch(`${base}data/plan.json`).then(r => { if (!r.ok) throw new Error("plan.json not found"); return r.json(); }),
      fetch(`${base}data/workouts.json`).then(r => { if (!r.ok) throw new Error("workouts.json not found"); return r.json(); }),
    ])
      .then(([planData, workoutData]) => { setPlan(planData); setWorkouts(workoutData); })
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { plan, workouts, loading, error };
}
```

---

## src/hooks/useGoalTime.js

```js
import { useState, useMemo } from "react";
import { calculatePaces, shouldIncludeSpeedWork } from "../data/paceCalculator";

export function useGoalTime(defaultGoal = "4:30:00") {
  const [goalTime, setGoalTime] = useState(defaultGoal);
  const paces            = useMemo(() => calculatePaces(goalTime), [goalTime]);
  const speedWorkEnabled = useMemo(() => shouldIncludeSpeedWork(goalTime), [goalTime]);
  return { goalTime, setGoalTime, paces, speedWorkEnabled };
}
```

---

## src/context/TrainingContext.jsx

```jsx
import { createContext, useContext, useState } from "react";
import { useGoalTime } from "../hooks/useGoalTime";
import { usePlanData } from "../hooks/usePlanData";

const TrainingContext = createContext(null);

export function TrainingProvider({ children }) {
  const { plan, workouts, loading: dataLoading, error: dataError } = usePlanData();
  const { goalTime, setGoalTime, paces, speedWorkEnabled } = useGoalTime(
    plan?.defaultGoalTime ?? "4:30:00"
  );
  const [completedWeeks,   setCompletedWeeks]  = useState(new Set());
  const [selectedWorkout,  setSelectedWorkout] = useState(null);

  function toggleWeekComplete(weekNum) {
    setCompletedWeeks(prev => {
      const next = new Set(prev);
      next.has(weekNum) ? next.delete(weekNum) : next.add(weekNum);
      return next;
    });
  }

  return (
    <TrainingContext.Provider value={{
      plan, workouts, dataLoading, dataError,
      goalTime, setGoalTime, paces, speedWorkEnabled,
      completedWeeks, toggleWeekComplete,
      selectedWorkout, setSelectedWorkout,
    }}>
      {children}
    </TrainingContext.Provider>
  );
}

export function useTraining() {
  const ctx = useContext(TrainingContext);
  if (!ctx) throw new Error("useTraining must be used inside TrainingProvider");
  return ctx;
}
```

---

## src/App.jsx

```jsx
import { TrainingProvider } from "./context/TrainingContext";
import Header        from "./components/layout/Header";
import Footer        from "./components/layout/Footer";
import RaceCountdown from "./components/RaceCountdown";
import GoalSetter    from "./components/GoalSetter";
import WeeklySchedule from "./components/WeeklySchedule";
import WorkoutGuide  from "./components/WorkoutGuide";
import WorkoutModal  from "./components/WorkoutModal";

export default function App() {
  return (
    <TrainingProvider>
      <div className="min-h-screen bg-slate-50 font-sans">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8 space-y-12">
          <RaceCountdown />
          <GoalSetter />
          <WeeklySchedule />
          <WorkoutGuide />
        </main>
        <Footer />
        <WorkoutModal />
      </div>
    </TrainingProvider>
  );
}
```

---

## Component specifications

### src/components/layout/Header.jsx

Sticky top bar. Shows current goal time and derived race pace. Updates live as goal changes.

```jsx
import { useTraining } from "../../context/TrainingContext";

export default function Header() {
  const { goalTime, paces } = useTraining();
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-slate-800">Long Beach Marathon 2026</h1>
          <p className="text-xs text-slate-400">
            October 11 · Goal: {goalTime} · Race pace: {paces.goalPace}
          </p>
        </div>
        <nav className="hidden sm:flex gap-4 text-sm text-slate-500">
          <a href="#goal"     className="hover:text-slate-800">Goal</a>
          <a href="#schedule" className="hover:text-slate-800">Schedule</a>
          <a href="#guide"    className="hover:text-slate-800">Guide</a>
        </nav>
      </div>
    </header>
  );
}
```

---

### src/components/layout/Footer.jsx

```jsx
export default function Footer() {
  return (
    <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400">
      <p>2XU Long Beach Marathon · October 11, 2026 · 5:30am · Shoreline Drive, Long Beach CA</p>
      <p className="mt-1">
        <a href="https://www.runlongbeach.com/marathon" target="_blank" rel="noreferrer"
           className="underline hover:text-slate-600">
          Official race website ↗
        </a>
      </p>
    </footer>
  );
}
```

---

### src/components/RaceCountdown.jsx

Live countdown that ticks every second via setInterval. Reads raceDate from plan.json via context.

```jsx
import { useState, useEffect } from "react";
import { useTraining } from "../context/TrainingContext";

export default function RaceCountdown() {
  const { plan } = useTraining();
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!plan) return;
    const raceDate = new Date(plan.raceDate);

    function getTimeLeft() {
      const diff = raceDate - new Date();
      if (diff <= 0) return null;
      return {
        days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours:   Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      };
    }

    setTimeLeft(getTimeLeft());
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [plan]);

  if (!timeLeft) return (
    <p className="text-center text-slate-500 py-4">Race day! Good luck! 🏁</p>
  );

  return (
    <div className="text-center py-4">
      <p className="text-xs text-slate-400 mb-3 uppercase tracking-widest">
        2XU Long Beach Marathon — October 11, 2026
      </p>
      <div className="flex justify-center gap-6">
        {[["Days", timeLeft.days], ["Hours", timeLeft.hours], ["Min", timeLeft.minutes], ["Sec", timeLeft.seconds]].map(([label, val]) => (
          <div key={label} className="flex flex-col items-center">
            <span className="text-4xl font-bold text-ocean-600 tabular-nums">
              {String(val).padStart(2, "0")}
            </span>
            <span className="text-xs text-slate-400 uppercase tracking-wide mt-1">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### src/components/GoalSetter.jsx

Hero interactive section. Quick-select buttons for common goal times, plus a custom text input.
Pace card grid updates instantly on every change.

```jsx
import { useTraining } from "../context/TrainingContext";
import { Card }   from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge }  from "@/components/ui/badge";

const QUICK_TIMES = ["4:00:00", "4:15:00", "4:30:00", "4:45:00", "5:00:00", "5:30:00"];

const PACE_CARDS = [
  { key: "goalPace",      label: "Race pace",       colorClass: "text-blue-600"   },
  { key: "easyPace",      label: "Easy runs",       colorClass: "text-green-600"  },
  { key: "longRunPace",   label: "Long runs",       colorClass: "text-sky-600"    },
  { key: "tempoPace",     label: "Tempo",           colorClass: "text-orange-600" },
  { key: "intervalPace",  label: "Intervals (5K)",  colorClass: "text-purple-600" },
  { key: "yassoTarget",   label: "Yasso 800 target", colorClass: "text-violet-600" },
];

export default function GoalSetter() {
  const { goalTime, setGoalTime, paces, speedWorkEnabled } = useTraining();

  return (
    <section id="goal">
      <h2 className="text-2xl font-semibold mb-4">Your goal time</h2>

      {/* Quick-select buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {QUICK_TIMES.map(t => (
          <Button
            key={t}
            variant={goalTime === t ? "default" : "outline"}
            size="sm"
            onClick={() => setGoalTime(t)}
          >
            {t.slice(0, -3)} {/* strips trailing :00 → "4:30" */}
          </Button>
        ))}
      </div>

      {/* Custom time input */}
      <div className="flex items-center gap-3 mb-6">
        <label className="text-sm text-slate-600" htmlFor="custom-time">
          Custom (H:MM:SS)
        </label>
        <input
          id="custom-time"
          type="text"
          value={goalTime}
          onChange={e => setGoalTime(e.target.value)}
          placeholder="4:30:00"
          className="border rounded px-3 py-1 w-28 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Live pace grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        {PACE_CARDS.map(({ key, label, colorClass }) => (
          <Card key={key} className="text-center py-4 px-2">
            <p className="text-xs text-slate-500 mb-1">{label}</p>
            <p className={`text-lg font-semibold ${colorClass}`}>{paces[key]}</p>
          </Card>
        ))}
      </div>

      {/* Speed work indicator */}
      {speedWorkEnabled ? (
        <Badge className="bg-purple-600 text-white">
          ⚡ Speed workouts on (Yasso 800s, hills, intervals)
        </Badge>
      ) : (
        <Badge variant="secondary">
          Easy plan — set goal under 4:45 to enable speed workouts
        </Badge>
      )}
    </section>
  );
}
```

---

### src/components/WeeklySchedule.jsx

Renders all weeks grouped by training phase. Auto-scrolls to the current week on load.
"Jump to this week" button re-triggers the scroll.

```jsx
import { useRef, useEffect } from "react";
import { useTraining } from "../context/TrainingContext";
import WeekCard from "./WeekCard";
import { Button } from "@/components/ui/button";

function getCurrentWeekNum(startDateStr) {
  const start = new Date(startDateStr);
  const now   = new Date();
  const diff  = Math.floor((now - start) / (7 * 24 * 60 * 60 * 1000));
  return Math.min(Math.max(diff + 1, 1), 18);
}

export default function WeeklySchedule() {
  const { plan, dataLoading } = useTraining();
  const currentRef = useRef(null);

  const currentWeek = plan ? getCurrentWeekNum(plan.startDate) : 1;

  // Scroll to current week after data loads
  useEffect(() => {
    if (!dataLoading && currentRef.current) {
      setTimeout(() => currentRef.current.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
    }
  }, [dataLoading]);

  if (dataLoading) return <p className="text-slate-400 text-sm">Loading schedule...</p>;
  if (!plan)       return <p className="text-red-500 text-sm">Could not load plan.json</p>;

  const phaseEntries = Object.entries(plan.phases);

  return (
    <section id="schedule">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">18-Week Schedule</h2>
        <Button variant="outline" size="sm"
          onClick={() => currentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}>
          Jump to week {currentWeek}
        </Button>
      </div>

      {phaseEntries.map(([phaseKey, phase]) => {
        const phaseWeeks = plan.weeks.filter(w => phase.weeks.includes(w.week));
        return (
          <div key={phaseKey} className="mb-8">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-3">
              {phase.label} Phase — Weeks {phase.weeks[0]}–{phase.weeks[phase.weeks.length - 1]}
            </h3>
            <div className="space-y-2">
              {phaseWeeks.map(week => (
                <div key={week.week} ref={week.week === currentWeek ? currentRef : null}>
                  <WeekCard
                    week={week}
                    isCurrentWeek={week.week === currentWeek}
                    defaultOpen={week.week === currentWeek}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
```

---

### src/components/WeekCard.jsx

Collapsible card for one week. Shows the 7-day pill grid when open.
Includes a "mark complete" toggle and a "log run" stub (no-op in v1, hooked up in v2).

```jsx
import { useState } from "react";
import { useTraining } from "../context/TrainingContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge }             from "@/components/ui/badge";
import { ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import DayPill from "./DayPill";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_KEYS   = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export default function WeekCard({ week, isCurrentWeek, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  const { completedWeeks, toggleWeekComplete, speedWorkEnabled } = useTraining();
  const isComplete = completedWeeks.has(week.week);

  return (
    <Card className={`border ${isCurrentWeek ? "border-blue-400 shadow-md" : "border-slate-200"}`}>
      {/* Collapse toggle header */}
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 rounded-t-lg"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-slate-600">Week {week.week}</span>
          <span className="text-xs text-slate-400">{week.dates}</span>
          {isCurrentWeek && (
            <Badge className="bg-blue-600 text-white text-xs px-2">This week</Badge>
          )}
          {isComplete && <CheckCircle2 className="w-4 h-4 text-green-500" />}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">{week.totalMiles} mi</span>
          {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </button>

      {open && (
        <CardContent className="pt-0 pb-4 px-4">
          {/* 7-day grid */}
          <div className="grid grid-cols-7 gap-1 mb-3">
            {DAY_LABELS.map(d => (
              <p key={d} className="text-center text-[10px] text-slate-400 pb-1">{d}</p>
            ))}
            {DAY_KEYS.map(key => (
              <DayPill key={key} dayData={week.days[key]} speedWorkEnabled={speedWorkEnabled} />
            ))}
          </div>

          {/* Week coaching note */}
          {week.note && (
            <p className="text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded px-3 py-2 mt-1">
              💡 {week.note}
            </p>
          )}

          {/* Mark complete */}
          <button
            onClick={() => toggleWeekComplete(week.week)}
            className="text-xs text-slate-400 hover:text-green-600 mt-3 underline underline-offset-2"
          >
            {isComplete ? "✓ Completed — mark incomplete" : "Mark week complete"}
          </button>
        </CardContent>
      )}
    </Card>
  );
}
```

---

### src/components/DayPill.jsx

Colored pill for a single day. Tapping opens WorkoutModal via context.
Handles the speed-work substitution: if `speedWork: true` and `speedWorkEnabled` is false,
shows the alt (easy) version instead.

```jsx
import { useTraining } from "../context/TrainingContext";

const TYPE_STYLES = {
  rest:        "bg-slate-100 text-slate-400 cursor-default",
  easy:        "bg-green-100  text-green-700  hover:bg-green-200  cursor-pointer",
  tempo:       "bg-orange-100 text-orange-700 hover:bg-orange-200 cursor-pointer",
  yasso:       "bg-purple-100 text-purple-700 hover:bg-purple-200 cursor-pointer",
  intervals:   "bg-purple-100 text-purple-700 hover:bg-purple-200 cursor-pointer",
  hills:       "bg-red-100    text-red-700    hover:bg-red-200    cursor-pointer",
  mileRepeats: "bg-violet-100 text-violet-700 hover:bg-violet-200 cursor-pointer",
  cross:       "bg-pink-100   text-pink-700   hover:bg-pink-200   cursor-pointer",
  long:        "bg-blue-100   text-blue-700   hover:bg-blue-200   cursor-pointer",
  race:        "bg-amber-100  text-amber-800  hover:bg-amber-200  cursor-pointer font-bold",
};

export default function DayPill({ dayData, speedWorkEnabled }) {
  const { setSelectedWorkout } = useTraining();

  if (!dayData) return <div />;

  // Swap speed workout for easy run if speed work is disabled
  const effective = (dayData.speedWork && !speedWorkEnabled)
    ? { type: dayData.altType, label: dayData.altLabel, miles: dayData.altMiles }
    : dayData;

  const style = TYPE_STYLES[effective.type] ?? TYPE_STYLES.easy;

  function handleClick() {
    if (effective.type !== "rest") setSelectedWorkout(effective.type);
  }

  return (
    <button
      className={`rounded-md px-1 py-2 text-center text-[10px] sm:text-xs font-medium w-full leading-tight transition-colors ${style}`}
      onClick={handleClick}
      disabled={effective.type === "rest"}
      title={effective.label}
    >
      {effective.label}
    </button>
  );
}
```

---

### src/components/WorkoutModal.jsx

Dialog that opens when a workout pill is tapped. Pulls workout content from `workouts` JSON
(via context). Shows: tagline, what it is, target pace (live from paces), how-to steps,
schedule note, common mistakes.

```jsx
import { useTraining } from "../context/TrainingContext";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";

export default function WorkoutModal() {
  const { selectedWorkout, setSelectedWorkout, workouts, paces } = useTraining();
  const workout = selectedWorkout && workouts ? workouts[selectedWorkout] : null;

  if (!workout) return null;

  const paceValue = workout.paceNote ? paces[workout.paceNote] : workout.paceNoteText;

  return (
    <Dialog open={!!selectedWorkout} onOpenChange={() => setSelectedWorkout(null)}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{workout.icon}</span>
            <DialogTitle className="text-lg">{workout.label}</DialogTitle>
          </div>
          <DialogDescription className="italic text-slate-500">
            {workout.tagline}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm">

          <div>
            <h4 className="font-semibold text-slate-700 mb-1">What it is</h4>
            <p className="text-slate-600 leading-relaxed">{workout.whatItIs}</p>
          </div>

          {paceValue && (
            <div className="bg-blue-50 rounded-lg px-4 py-3">
              <p className="text-xs text-blue-500 font-semibold uppercase tracking-wide mb-1">
                Your target pace
              </p>
              <p className="text-blue-800 font-bold text-base">{paceValue}</p>
            </div>
          )}

          <div>
            <h4 className="font-semibold text-slate-700 mb-2">How to do it</h4>
            <ol className="list-decimal list-inside space-y-2 text-slate-600">
              {workout.howToDo.map((step, i) => (
                <li key={i} className="leading-relaxed">{step}</li>
              ))}
            </ol>
          </div>

          {workout.schedule && (
            <div className="bg-purple-50 rounded-lg px-4 py-3">
              <p className="text-xs text-purple-500 font-semibold uppercase tracking-wide mb-1">
                Schedule
              </p>
              <p className="text-purple-800 text-sm">{workout.schedule}</p>
            </div>
          )}

          {workout.commonMistakes && (
            <div className="bg-red-50 rounded-lg px-4 py-3">
              <p className="text-xs text-red-500 font-semibold uppercase tracking-wide mb-1">
                Common mistake
              </p>
              <p className="text-red-800 text-sm">{workout.commonMistakes}</p>
            </div>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
}
```

---

### src/components/WorkoutGuide.jsx

Always-visible accordion reference at the bottom of the page. Same content as the modal
but readable without tapping. Paces update live as goal time changes.

```jsx
import { useTraining } from "../context/TrainingContext";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

const GUIDE_ORDER = ["easy", "long", "tempo", "yasso", "intervals", "hills", "cross", "rest"];

export default function WorkoutGuide() {
  const { workouts, paces, dataLoading } = useTraining();

  if (dataLoading || !workouts) return null;

  return (
    <section id="guide" className="pb-16">
      <h2 className="text-2xl font-semibold mb-2">Workout guide</h2>
      <p className="text-sm text-slate-500 mb-6">
        Tap any type to see what it is, how to do it, and your personal target pace.
        Paces update automatically when you change your goal time above.
      </p>

      <Accordion type="multiple" className="space-y-2">
        {GUIDE_ORDER.filter(k => workouts[k]).map(key => {
          const w = workouts[key];
          const paceValue = w.paceNote ? paces[w.paceNote] : w.paceNoteText;
          return (
            <AccordionItem key={key} value={key} className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                <span className="flex items-center gap-2 text-left">
                  <span>{w.icon}</span>
                  <span>{w.label}</span>
                  <span className="hidden sm:inline text-xs text-slate-400 font-normal">
                    — {w.tagline}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-slate-600 space-y-3 pb-4">
                <p className="leading-relaxed">{w.whatItIs}</p>
                {paceValue && (
                  <div className="bg-blue-50 text-blue-800 rounded px-3 py-2 font-semibold text-sm">
                    Your pace: {paceValue}
                  </div>
                )}
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  {w.howToDo.map((step, i) => <li key={i}>{step}</li>)}
                </ul>
                {w.commonMistakes && (
                  <div className="bg-red-50 text-red-700 rounded px-3 py-2 text-xs">
                    ⚠️ {w.commonMistakes}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </section>
  );
}
```

---

## src/index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.3% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.3% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }
}

@layer base {
  * { @apply border-border; }
  body { @apply bg-background text-foreground; }
}

html { scroll-behavior: smooth; }
```

---

## Deployment — GitHub Pages

```bash
# One-time: create GitHub repo named "marathon-training", then:
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/marathon-training.git
git push -u origin main

# Deploy (runs build first via predeploy)
npm run deploy
```

Then: GitHub repo → Settings → Pages → Source: `gh-pages` branch → `/root`.

Live at `https://YOUR_USERNAME.github.io/marathon-training` in ~2 min.

For future deploys: just `npm run deploy` again.

---

## Build order for Claude Code

Build files in this exact sequence to avoid broken imports:

1.  Run all setup commands (Vite, Tailwind, shadcn, shadcn components, gh-pages)
2.  `public/data/plan.json`
3.  `public/data/workouts.json`
4.  `src/lib/utils.js` — verify shadcn created this; if not, create it manually:
    ```js
    import { clsx } from "clsx"; import { twMerge } from "tailwind-merge";
    export function cn(...inputs) { return twMerge(clsx(inputs)); }
    ```
5.  `src/data/paceCalculator.js`
6.  `src/hooks/usePlanData.js`
7.  `src/hooks/useGoalTime.js`
8.  `src/context/TrainingContext.jsx`
9.  `src/components/layout/Header.jsx`
10. `src/components/layout/Footer.jsx`
11. `src/components/RaceCountdown.jsx`
12. `src/components/DayPill.jsx`
13. `src/components/WorkoutModal.jsx`
14. `src/components/WeekCard.jsx`
15. `src/components/WeeklySchedule.jsx`
16. `src/components/GoalSetter.jsx`
17. `src/components/WorkoutGuide.jsx`
18. `src/App.jsx`
19. `src/main.jsx`
20. `src/index.css`
21. `vite.config.js`
22. `tailwind.config.js`
23. `package.json` — add homepage + deploy scripts

---

## Verification checklist

- [ ] `npm run dev` starts without errors
- [ ] `public/data/plan.json` fetches correctly — check Network tab, should be 200
- [ ] `public/data/workouts.json` fetches correctly
- [ ] Changing goal time (quick buttons or custom input) updates ALL pace values instantly
- [ ] Goals < 4:45 show speed workouts (Yasso, hills); goals ≥ 4:45 show easy runs instead
- [ ] Tapping any workout pill opens WorkoutModal with correct pace for current goal
- [ ] "Jump to week N" button scrolls to the correct week card
- [ ] Current week auto-expanded and has blue border
- [ ] Race countdown ticks live (seconds increment)
- [ ] "Mark week complete" toggle works and persists within the session
- [ ] WorkoutGuide accordion opens/closes correctly
- [ ] Mobile (375px): 7-day pill grid is readable, no horizontal overflow
- [ ] `npm run deploy` builds and deploys without error
- [ ] Deployed site loads at `https://USERNAME.github.io/marathon-training`
- [ ] Deployed site fetches JSON correctly (check Network tab — paths should include /marathon-training/)

---

## Notes for Claude Code

- `public/data/` files are static assets, NOT JS modules. Always fetch them, never `import` them.
- `import.meta.env.BASE_URL` in `usePlanData.js` is critical — it equals `/` in dev and
  `/marathon-training/` on GitHub Pages. Without it, JSON fetches 404 in production.
- All pace values must derive from `calculatePaces(goalTime)` — never hardcode a pace string.
- Speed workout substitution happens in `DayPill.jsx` at render time. The JSON always stores
  the speed version; the component decides whether to show it based on `speedWorkEnabled`.
- `useTraining()` is the only way components access shared state — no prop drilling.
- shadcn components live in `src/components/ui/` — do not modify them.
- The `tailwind.config.js` ocean/sand color classes (e.g. `text-ocean-600`) only work if the
  theme extension is in place. Verify before using those classes.
- Do not add any paid services, serverless functions, or environment variables — v1 is 100%
  static with zero configuration required to run.

---

## v2 upgrade path (for future reference)

When ready to add the Google Sheets training log, the following will be added with
**zero changes to existing components**:

- `src/hooks/useSheets.js` — Google Identity Services OAuth + Sheets API v4 read/write
- `src/components/RunLogger.jsx` — post-run form modal (effort, actual miles, heat, notes)
- `src/components/TrainingLog.jsx` — displays logged runs + "Copy for Claude" button
- `TrainingContext.jsx` — add `sheets` from `useSheets()` to the context value
- `WeekCard.jsx` — add a "Log run" button that opens `RunLogger`
- `App.jsx` — add `<TrainingLog />` section
- Google Cloud setup (free): OAuth client ID + API key + runner's own Sheet
