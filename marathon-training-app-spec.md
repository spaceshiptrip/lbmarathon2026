# Long Beach Marathon Training App — Build Specification

## Project overview

Build a fully interactive, mobile-first marathon training plan web app for a female beginner runner targeting the **2XU Long Beach Marathon on October 11, 2026**. The app lives entirely in the browser (no backend, no auth, no database). It is deployed as a static site to **GitHub Pages** via the `gh-pages` npm package.

The runner is in her early 20s, fit from yoga and strength training, limited time, and targeting a **4:30 finish** (adjustable). She needs an easy-to-reference weekly schedule, educational content on every workout type, and dynamic paces that recalculate when she changes her goal time.

---

## Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | React 18 | Functional components, hooks only |
| Build tool | Vite 5 | `npm create vite@latest` with react template |
| Styling | Tailwind CSS v3 | Install via `npm install -D tailwindcss postcss autoprefixer` |
| UI components | shadcn/ui | Init with `npx shadcn@latest init` after Tailwind |
| Icons | lucide-react | Already included with shadcn |
| Routing | None | Single-page app, section-based scrolling |
| State | React useState / useContext | No external state library needed |
| Deployment | GitHub Pages | `npm install -D gh-pages`, add `homepage` to package.json |
| Node version | 20 LTS | Use nvm: `nvm install 20 && nvm use 20` |

---

## Project setup — exact commands in order

```bash
# 1. Create project
npm create vite@latest marathon-training -- --template react
cd marathon-training

# 2. Install Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 3. Install shadcn dependencies first
npm install

# 4. Init shadcn (accept all defaults, use "slate" base color, CSS variables: yes)
npx shadcn@latest init

# 5. Add shadcn components used in this app
npx shadcn@latest add card
npx shadcn@latest add badge
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add tabs
npx shadcn@latest add slider
npx shadcn@latest add select
npx shadcn@latest add tooltip
npx shadcn@latest add progress
npx shadcn@latest add accordion
npx shadcn@latest add separator

# 6. Install lucide-react (may already be present)
npm install lucide-react

# 7. Install gh-pages for deployment
npm install -D gh-pages

# 8. Start dev server
npm run dev
```

---

## Tailwind config

Replace `tailwind.config.js` with:

```js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Long Beach / coastal theme
        ocean: {
          50:  "#e6f4fb",
          100: "#b3ddf5",
          200: "#80c7ef",
          300: "#4db1e9",
          400: "#1a9ae3",
          500: "#0077c2",
          600: "#005f9a",
          700: "#004772",
          800: "#002f4b",
          900: "#001824",
        },
        sand: {
          50:  "#fdf9f0",
          100: "#f9eed8",
          200: "#f3ddb2",
          300: "#edcc8b",
          400: "#e7bb65",
          500: "#d4a017",
          600: "#a87d12",
          700: "#7c5b0d",
          800: "#513a08",
          900: "#251a03",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

---

## vite.config.js — for GitHub Pages

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/marathon-training/', // must match your GitHub repo name
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

---

## package.json additions

Add these fields to `package.json`:

```json
{
  "homepage": "https://YOUR_GITHUB_USERNAME.github.io/marathon-training",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

---

## File/folder structure

```
marathon-training/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── ui/                        # shadcn auto-generated components (do not edit)
│   │   ├── layout/
│   │   │   ├── Header.jsx             # sticky top nav with goal time display
│   │   │   └── Footer.jsx             # race countdown + links
│   │   ├── GoalSetter.jsx             # goal time input + pace calculator hero section
│   │   ├── WeeklySchedule.jsx         # full 18-week schedule table
│   │   ├── WeekCard.jsx               # single week card (collapsible)
│   │   ├── DayPill.jsx                # colored pill for each day's workout
│   │   ├── WorkoutModal.jsx           # dialog with full workout description + how-to
│   │   ├── PaceChart.jsx              # visual pace reference card
│   │   ├── WorkoutGuide.jsx           # accordion reference for all workout types
│   │   ├── RaceCountdown.jsx          # live days-to-race countdown
│   │   └── ProgressTracker.jsx        # optional: checkmark completed weeks
│   ├── data/
│   │   ├── trainingPlan.js            # all 18 weeks of workout data
│   │   ├── workoutDescriptions.js     # full text for every workout type
│   │   └── paceCalculator.js          # pure functions for pace math
│   ├── hooks/
│   │   └── useGoalTime.js             # custom hook: manages goal time + derived paces
│   ├── context/
│   │   └── TrainingContext.jsx        # global state: goal time, completed weeks, view mode
│   ├── lib/
│   │   └── utils.js                   # shadcn cn() helper (auto-generated)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css                      # Tailwind directives + CSS variables
└── index.html
```

---

## Data layer

### src/data/paceCalculator.js

This is the most important pure-logic file. All pace math lives here.

```js
/**
 * Convert "H:MM:SS" or "M:SS" string to total seconds
 */
export function timeToSeconds(timeStr) {
  const parts = timeStr.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 0;
}

/**
 * Convert total seconds to "H:MM:SS" string
 */
export function secondsToTime(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.round(totalSeconds % 60);
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * Convert seconds per mile to "M:SS/mi" string
 */
export function secondsToMinPerMile(secsPerMile) {
  const m = Math.floor(secsPerMile / 60);
  const s = Math.round(secsPerMile % 60);
  return `${m}:${String(s).padStart(2, "0")}/mi`;
}

/**
 * Given a marathon goal time string "H:MM:SS", return all training paces.
 * Based on McMillan Running / Daniels' Running Formula methodology.
 *
 * Rules applied:
 *   - Goal pace (race pace):   goalSeconds / 26.2  per mile
 *   - Easy / recovery:         goal pace + 90–120 sec/mi (use +105 midpoint)
 *   - Long run:                goal pace + 60–90 sec/mi  (use +75 midpoint)
 *   - Tempo (threshold):       goal pace - 20–30 sec/mi  (use -25 midpoint)
 *   - Yasso 800 target:        goal time hours/mins → same number in min:sec
 *                              e.g. 4:30 marathon → 4:30 per 800m repeat
 *   - Mile repeats:            goal pace - 45 sec/mi
 *   - 5K pace (intervals):     goal pace - 60–75 sec/mi (use -67)
 *   - Hill repeats:            effort-based (no pace target — rate of perceived exertion 8/10)
 */
export function calculatePaces(goalTimeStr) {
  const goalSecs = timeToSeconds(goalTimeStr);
  const goalPacePerMile = goalSecs / 26.2; // seconds per mile

  const easyPace      = goalPacePerMile + 105;
  const longRunPace   = goalPacePerMile + 75;
  const tempoPace     = goalPacePerMile - 25;
  const mileRepeatPace = goalPacePerMile - 45;
  const intervalPace  = goalPacePerMile - 67; // ~5K effort

  // Yasso 800: goal H:MM:SS → take hours + minutes as MM:SS per 800m
  const goalHours   = Math.floor(goalSecs / 3600);
  const goalMinutes = Math.floor((goalSecs % 3600) / 60);
  const yassoTarget = `${goalHours}:${String(goalMinutes).padStart(2, "0")} per 800m`;

  // Recovery jog between 800m intervals: yassoTarget × 1.0 (same time jogging)
  const yassoRecovery = `Same as rep time (jog recovery)`;

  return {
    goalTime:       goalTimeStr,
    goalPace:       secondsToMinPerMile(goalPacePerMile),
    easyPace:       secondsToMinPerMile(easyPace),
    longRunPace:    secondsToMinPerMile(longRunPace),
    tempoPace:      secondsToMinPerMile(tempoPace),
    mileRepeatPace: secondsToMinPerMile(mileRepeatPace),
    intervalPace:   secondsToMinPerMile(intervalPace),
    yassoTarget,
    yassoRecovery,
  };
}

/**
 * Determine if a goal time warrants adding speed workouts.
 * Sub-4:45 → include Yasso 800s, hill repeats, mile repeats.
 * 4:45 and above → tempo and easy runs only (protect the beginner).
 */
export function shouldIncludeSpeedWork(goalTimeStr) {
  const secs = timeToSeconds(goalTimeStr);
  return secs < timeToSeconds("4:45:00");
}
```

---

### src/data/workoutDescriptions.js

Full educational content for every workout type. This powers the modal that appears when a runner taps any workout pill.

```js
export const WORKOUT_TYPES = {
  easy: {
    label: "Easy run",
    color: "green",
    tagline: "The foundation of all your training.",
    whatItIs: `An easy run is a slow, conversational-pace run where you could comfortably hold a full conversation without gasping. It feels almost too easy — that's correct. Easy runs build aerobic base, improve fat metabolism, strengthen connective tissue, and aid recovery.`,
    howToDo: [
      "Run slow enough that you can say 5–6 words without pausing to breathe.",
      "If you have a heart rate monitor, stay in Zone 2 (roughly 60–70% of max HR).",
      "Don't worry about pace. Run by feel or HR, not speed.",
      "Walk breaks are fine, especially in the first 4 weeks.",
    ],
    paceNote: "easyPace",
    commonMistakes: "Going too fast is the #1 beginner mistake. If you're huffing after a sentence, slow down.",
    icon: "🟢",
  },

  long: {
    label: "Long run",
    color: "blue",
    tagline: "The most important workout of the week.",
    whatItIs: `The long run builds the endurance and mental resilience required to cover 26.2 miles. It trains your body to burn fat efficiently, stress-tests your legs, and lets you practice nutrition/hydration strategies. Missing a long run is the one thing most likely to leave you undertrained.`,
    howToDo: [
      "Run 60–90 seconds per mile slower than your goal race pace.",
      "Start with a 5-minute walk warm-up. End with a 5-minute walk cool-down.",
      "Use a run/walk strategy if needed: 9 min run / 1 min walk works great for beginners.",
      "Bring water or plan your route around water fountains.",
      "Practice your race-day nutrition: take a gel or chew every 45 min on runs over 10 miles.",
      "Do this on Sunday (as planned) — your body needs Monday off to recover.",
    ],
    paceNote: "longRunPace",
    commonMistakes: "Running too fast on long runs leads to injury and excessive fatigue. Slow is the goal.",
    icon: "🔵",
  },

  tempo: {
    label: "Tempo run",
    color: "orange",
    tagline: "Comfortably hard. Builds your lactate threshold.",
    whatItIs: `A tempo run is run at "threshold pace" — the fastest pace you can sustain for about an hour. It's harder than easy but not a sprint. Physiologically, it trains your body to clear lactate faster, which lets you sustain a faster pace on race day. Also called a "threshold run."`,
    howToDo: [
      "Warm up with 10 min of easy running first.",
      "Run at tempo pace — you should be able to say 2–3 words but not hold a conversation.",
      "Maintain this effort for the prescribed distance (usually 2–4 miles).",
      "Cool down with 10 min easy running.",
      "Total session time including warm-up/cool-down is about 40–50 min.",
    ],
    paceNote: "tempoPace",
    commonMistakes: "Tempo pace is NOT a sprint. If you're dying after 1 mile, you started too fast.",
    icon: "🟠",
  },

  yasso: {
    label: "Yasso 800s",
    color: "purple",
    tagline: "The classic marathon speed predictor workout.",
    whatItIs: `Yasso 800s, named for Bart Yasso of Runner's World, are 800-meter (half-mile) repeats. The magic: if you can run 10 × 800m with your goal time in minutes:seconds, you're fit enough to run the marathon in that time in hours:minutes. (e.g., goal of 4:30 marathon → run 800s in 4:30 each.)`,
    howToDo: [
      "Warm up with 10–15 min easy running.",
      "Run 800m (2 laps of a track, or 0.5 miles on GPS) at your Yasso target pace.",
      "Jog easy for the SAME amount of time as your 800m rep (recovery jog).",
      "Repeat for the prescribed number of reps (start with 4–5, build to 8–10 by peak).",
      "Cool down with 10 min easy running.",
      "A track is ideal but any flat surface works with GPS.",
    ],
    paceNote: "yassoTarget",
    schedule: "Introduced in week 7. Start with 4×800m. Build by 1 rep every 2–3 weeks. Peak at 10×800m in week 14.",
    commonMistakes: "Don't skip the recovery jog — it's as important as the rep. Running it too fast defeats the purpose.",
    icon: "🟣",
  },

  intervals: {
    label: "Intervals / 800m repeats",
    color: "purple",
    tagline: "Short, fast efforts that build speed and VO2 max.",
    whatItIs: `Interval training alternates fast-effort running with recovery jogs. For marathon training, 800m repeats at roughly 5K effort are the most common. They improve your cardiovascular ceiling (VO2 max), which makes every other pace feel easier. They're also mentally toughening.`,
    howToDo: [
      "Warm up with 10–15 min easy running + 4 × 20-second strides.",
      "Run each 800m repeat at your interval (5K) pace — controlled hard effort.",
      "Recover with a 400m (0.25 mi) easy jog between reps.",
      "Cool down 10 min easy.",
      "If doing Yasso 800s, follow the Yasso protocol instead (recovery = same time as rep).",
    ],
    paceNote: "intervalPace",
    commonMistakes: "Going all-out on rep 1 and dying by rep 4. Even effort across all reps is the goal.",
    icon: "🟣",
  },

  hills: {
    label: "Hill repeats",
    color: "red",
    tagline: "Nature's strength training for runners.",
    whatItIs: `Hill repeats build leg strength, improve running economy, and add intensity without the joint stress of track intervals. They're especially useful for a beginner because they force proper running form (high knees, arm drive, forward lean) naturally. Long Beach has a flat course but hills in training make flat race day feel easy.`,
    howToDo: [
      "Find a hill with a 4–6% grade, about 200–400m long.",
      "Warm up with 10–15 min easy flat running.",
      "Run uphill HARD at a 5K effort (about 85–90% max HR). Pump your arms.",
      "Walk or jog very slowly back down — this is full recovery.",
      "Start with 4–6 repeats. Build to 8–10 over several weeks.",
      "Cool down with 10 min easy flat running.",
      "If no hills nearby, use a treadmill set to 5–6% incline.",
    ],
    paceNote: null,
    paceNoteText: "Effort-based, not pace-based. Aim for RPE 8/10 on the uphill. Pace is irrelevant on hills.",
    schedule: "Introduced in week 9 as an occasional swap for intervals. Typically every 3rd speed session.",
    commonMistakes: "Running the downhill fast. Downhill recovery is essential — your quads will thank you.",
    icon: "🔴",
  },

  mileRepeats: {
    label: "Mile repeats",
    color: "purple",
    tagline: "Longer intervals that build race-pace stamina.",
    whatItIs: `Mile repeats (1600m) are a longer interval format that bridges the gap between tempo running and short track intervals. They're more specific to marathon training than 800s because they require you to sustain a harder effort over a longer distance — just like race day.`,
    howToDo: [
      "Warm up with 15 min easy running.",
      "Run each mile repeat at mile-repeat pace (slightly faster than tempo, slower than 5K pace).",
      "Recover with a 2–3 min easy jog or walk between reps.",
      "Start with 3 repeats, build to 5.",
      "Cool down with 10–15 min easy running.",
    ],
    paceNote: "mileRepeatPace",
    schedule: "Optional swap for Yasso 800s in weeks 12–15 for variety.",
    commonMistakes: "Mile repeats aren't all-out sprints. Think 'controlled fast.'",
    icon: "🟣",
  },

  cross: {
    label: "Cross-training",
    color: "pink",
    tagline: "Aerobic fitness without the pounding.",
    whatItIs: `Cross-training (XT) gives your running muscles a break while maintaining cardiovascular fitness. For a runner who already does yoga and strength work, this slot is flexible. Great options: cycling (outdoor or spin), swimming, elliptical, yoga flow, or pool running.`,
    howToDo: [
      "Choose any non-impact or low-impact cardio activity.",
      "Keep intensity moderate — this is not a hard day.",
      "Duration: 30–50 minutes is plenty.",
      "Yoga counts — especially hip openers, hamstring work, and hip flexor stretches, which directly benefit running.",
      "Strength training: keep it upper-body focused during peak training weeks. Lower body: reduce volume (fewer sets, no heavy squats or lunges) from week 10 onward.",
    ],
    paceNote: null,
    paceNoteText: "No pace. Keep effort easy. Heart rate ~60% of max.",
    icon: "🩷",
  },

  rest: {
    label: "Rest day",
    color: "gray",
    tagline: "This is when you actually get stronger.",
    whatItIs: `Rest days are not wasted training days — they are mandatory adaptation days. Running breaks down muscle tissue; rest is when your body repairs it stronger. Skipping rest days leads to overtraining, injury, and burnout. Monday is always rest in this plan.`,
    howToDo: [
      "Do nothing strenuous.",
      "Light walking (under 30 min) is fine.",
      "Foam rolling, stretching, and mobility work are great on rest days.",
      "Eat and sleep well — this is when gains happen.",
    ],
    paceNote: null,
    paceNoteText: "No running. Optional gentle mobility.",
    icon: "⬜",
  },
};
```

---

### src/data/trainingPlan.js

Full 18-week plan data structure. Each week contains 7 days. Each workout day has a type key (maps to `WORKOUT_TYPES`), a label, mileage, and optional notes.

```js
/**
 * Training plan for Long Beach Marathon, October 11, 2026.
 * Start date: June 9, 2026.
 *
 * Day order: Mon (rest), Tue, Wed, Thu, Fri (rest), Sat, Sun (long)
 *
 * Workout types: "rest" | "easy" | "tempo" | "yasso" | "intervals" | "hills" | "mileRepeats" | "cross" | "long" | "race"
 *
 * speedWorkEnabled: if the runner's goal time is sub-4:45, speed workouts (yasso, intervals, hills)
 * are shown. Otherwise they are replaced with an easy run of similar mileage.
 *
 * Structure per day:
 * {
 *   type: string,
 *   label: string,       // display text e.g. "5 mi easy"
 *   miles: number,       // used for total calculation
 *   speedWork: boolean,  // true = this day is replaced if speed work disabled
 *   altLabel: string,    // alternative label if speedWork is disabled
 *   altType: string,     // alternative type if speedWork is disabled
 *   altMiles: number,    // alternative mileage if speedWork is disabled
 *   note: string,        // optional per-day tip
 * }
 */

export const RACE_DATE = new Date("2026-10-11T05:30:00");

export const PLAN = [
  // ─── BASE PHASE (Weeks 1–4) ──────────────────────────────
  {
    week: 1,
    phase: "base",
    dates: "Jun 9–15",
    days: {
      mon: { type: "rest",  label: "Rest",          miles: 0 },
      tue: { type: "easy",  label: "3 mi easy",     miles: 3 },
      wed: { type: "cross", label: "XT / yoga",     miles: 0 },
      thu: { type: "easy",  label: "3 mi easy",     miles: 3 },
      fri: { type: "rest",  label: "Rest",          miles: 0 },
      sat: { type: "easy",  label: "3 mi easy",     miles: 3 },
      sun: { type: "long",  label: "5 mi long run", miles: 5 },
    },
    totalMiles: 14,
    note: "First week! Don't worry about pace. Just move. Walk breaks are encouraged.",
  },
  {
    week: 2,
    phase: "base",
    dates: "Jun 16–22",
    days: {
      mon: { type: "rest",  label: "Rest",          miles: 0 },
      tue: { type: "easy",  label: "3 mi easy",     miles: 3 },
      wed: { type: "cross", label: "XT / yoga",     miles: 0 },
      thu: { type: "easy",  label: "3 mi easy",     miles: 3 },
      fri: { type: "rest",  label: "Rest",          miles: 0 },
      sat: { type: "easy",  label: "3 mi easy",     miles: 3 },
      sun: { type: "long",  label: "6 mi long run", miles: 6 },
    },
    totalMiles: 15,
    note: "If Sunday feels hard, slow down. You should finish feeling like you could do 2 more miles.",
  },
  {
    week: 3,
    phase: "base",
    dates: "Jun 23–29",
    days: {
      mon: { type: "rest",  label: "Rest",          miles: 0 },
      tue: { type: "easy",  label: "4 mi easy",     miles: 4 },
      wed: { type: "cross", label: "XT / yoga",     miles: 0 },
      thu: { type: "easy",  label: "4 mi easy",     miles: 4 },
      fri: { type: "rest",  label: "Rest",          miles: 0 },
      sat: { type: "easy",  label: "3 mi easy",     miles: 3 },
      sun: { type: "long",  label: "7 mi long run", miles: 7 },
    },
    totalMiles: 18,
    note: "Get proper running shoes this week if you haven't already.",
  },
  {
    week: 4,
    phase: "base",
    dates: "Jun 30–Jul 6",
    days: {
      mon: { type: "rest",  label: "Rest",          miles: 0 },
      tue: { type: "easy",  label: "3 mi easy",     miles: 3 },
      wed: { type: "cross", label: "XT / yoga",     miles: 0 },
      thu: { type: "easy",  label: "3 mi easy",     miles: 3 },
      fri: { type: "rest",  label: "Rest",          miles: 0 },
      sat: { type: "easy",  label: "3 mi easy",     miles: 3 },
      sun: { type: "long",  label: "8 mi long run", miles: 8 },
    },
    totalMiles: 17,
    note: "Cutback week — volume drops slightly. Your body needs this.",
  },

  // ─── BUILD PHASE (Weeks 5–8) ──────────────────────────────
  {
    week: 5,
    phase: "build",
    dates: "Jul 7–13",
    days: {
      mon: { type: "rest",  label: "Rest",          miles: 0 },
      tue: { type: "easy",  label: "4 mi easy",     miles: 4 },
      wed: { type: "tempo", label: "3 mi tempo",    miles: 3, speedWork: true, altLabel: "3 mi easy", altType: "easy", altMiles: 3 },
      thu: { type: "easy",  label: "4 mi easy",     miles: 4 },
      fri: { type: "rest",  label: "Rest",          miles: 0 },
      sat: { type: "easy",  label: "3 mi easy",     miles: 3 },
      sun: { type: "long",  label: "9 mi long run", miles: 9 },
    },
    totalMiles: 23,
    note: "First tempo run! Warm up 10 min easy, run 3 miles at tempo pace, cool down 10 min easy.",
  },
  {
    week: 6,
    phase: "build",
    dates: "Jul 14–20",
    days: {
      mon: { type: "rest",  label: "Rest",          miles: 0 },
      tue: { type: "easy",  label: "4 mi easy",     miles: 4 },
      wed: { type: "tempo", label: "3 mi tempo",    miles: 3, speedWork: true, altLabel: "3 mi easy", altType: "easy", altMiles: 3 },
      thu: { type: "easy",  label: "4 mi easy",     miles: 4 },
      fri: { type: "rest",  label: "Rest",          miles: 0 },
      sat: { type: "easy",  label: "4 mi easy",     miles: 4 },
      sun: { type: "long",  label: "10 mi long run", miles: 10 },
    },
    totalMiles: 25,
    note: "Double digits on Sunday! Practice fueling: one gel at mile 5.",
  },
  {
    week: 7,
    phase: "build",
    dates: "Jul 21–27",
    days: {
      mon: { type: "rest",     label: "Rest",              miles: 0 },
      tue: { type: "easy",     label: "5 mi easy",         miles: 5 },
      wed: { type: "yasso",    label: "4×800m Yasso",      miles: 4, speedWork: true, altLabel: "3 mi easy", altType: "easy", altMiles: 3 },
      thu: { type: "easy",     label: "4 mi easy",         miles: 4 },
      fri: { type: "rest",     label: "Rest",              miles: 0 },
      sat: { type: "easy",     label: "4 mi easy",         miles: 4 },
      sun: { type: "long",     label: "11 mi long run",    miles: 11 },
    },
    totalMiles: 28,
    note: "First Yasso 800s! A track is ideal. 4 reps with equal-time recovery jog.",
  },
  {
    week: 8,
    phase: "build",
    dates: "Jul 28–Aug 3",
    days: {
      mon: { type: "rest",  label: "Rest",           miles: 0 },
      tue: { type: "easy",  label: "4 mi easy",      miles: 4 },
      wed: { type: "tempo", label: "3 mi tempo",     miles: 3, speedWork: true, altLabel: "3 mi easy", altType: "easy", altMiles: 3 },
      thu: { type: "easy",  label: "4 mi easy",      miles: 4 },
      fri: { type: "rest",  label: "Rest",           miles: 0 },
      sat: { type: "easy",  label: "3 mi easy",      miles: 3 },
      sun: { type: "long",  label: "12 mi long run", miles: 12 },
    },
    totalMiles: 26,
    note: "Cutback week. Tempo Wednesday, but volume is intentionally lower.",
  },

  // ─── PEAK PHASE (Weeks 9–15) ──────────────────────────────
  {
    week: 9,
    phase: "peak",
    dates: "Aug 4–10",
    days: {
      mon: { type: "rest",     label: "Rest",              miles: 0 },
      tue: { type: "easy",     label: "5 mi easy",         miles: 5 },
      wed: { type: "yasso",    label: "5×800m Yasso",      miles: 5, speedWork: true, altLabel: "4 mi easy", altType: "easy", altMiles: 4 },
      thu: { type: "easy",     label: "5 mi easy",         miles: 5 },
      fri: { type: "rest",     label: "Rest",              miles: 0 },
      sat: { type: "easy",     label: "4 mi easy",         miles: 4 },
      sun: { type: "long",     label: "14 mi long run",    miles: 14 },
    },
    totalMiles: 33,
    note: "Start fueling every 40–45 min on the long run. Practice the brand/type you'll use on race day.",
  },
  {
    week: 10,
    phase: "peak",
    dates: "Aug 11–17",
    days: {
      mon: { type: "rest",  label: "Rest",           miles: 0 },
      tue: { type: "easy",  label: "5 mi easy",      miles: 5 },
      wed: { type: "tempo", label: "4 mi tempo",     miles: 4, speedWork: true, altLabel: "4 mi easy", altType: "easy", altMiles: 4 },
      thu: { type: "easy",  label: "5 mi easy",      miles: 5 },
      fri: { type: "rest",  label: "Rest",           miles: 0 },
      sat: { type: "easy",  label: "4 mi easy",      miles: 4 },
      sun: { type: "long",  label: "15 mi long run", miles: 15 },
    },
    totalMiles: 33,
    note: "Tempo: warm up 1 mi, run 4 mi at tempo pace, cool down 1 mi.",
  },
  {
    week: 11,
    phase: "peak",
    dates: "Aug 18–24",
    days: {
      mon: { type: "rest",     label: "Rest",              miles: 0 },
      tue: { type: "easy",     label: "5 mi easy",         miles: 5 },
      wed: { type: "hills",    label: "Hill repeats 6×",   miles: 4, speedWork: true, altLabel: "4 mi easy", altType: "easy", altMiles: 4 },
      thu: { type: "easy",     label: "5 mi easy",         miles: 5 },
      fri: { type: "rest",     label: "Rest",              miles: 0 },
      sat: { type: "easy",     label: "4 mi easy",         miles: 4 },
      sun: { type: "long",     label: "16 mi long run",    miles: 16 },
    },
    totalMiles: 34,
    note: "Hill repeats: find a 200–400m hill. 6 hard uphill efforts, walk/jog back down.",
  },
  {
    week: 12,
    phase: "peak",
    dates: "Aug 25–31",
    days: {
      mon: { type: "rest",     label: "Rest",              miles: 0 },
      tue: { type: "easy",     label: "5 mi easy",         miles: 5 },
      wed: { type: "yasso",    label: "7×800m Yasso",      miles: 6, speedWork: true, altLabel: "4 mi easy", altType: "easy", altMiles: 4 },
      thu: { type: "easy",     label: "5 mi easy",         miles: 5 },
      fri: { type: "rest",     label: "Rest",              miles: 0 },
      sat: { type: "easy",     label: "4 mi easy",         miles: 4 },
      sun: { type: "long",     label: "18 mi long run",    miles: 18 },
    },
    totalMiles: 38,
    note: "18 miles! This is a milestone. Run easy, fuel well, stay hydrated.",
  },
  {
    week: 13,
    phase: "peak",
    dates: "Sep 1–7",
    days: {
      mon: { type: "rest",  label: "Rest",           miles: 0 },
      tue: { type: "easy",  label: "5 mi easy",      miles: 5 },
      wed: { type: "tempo", label: "4 mi tempo",     miles: 4, speedWork: true, altLabel: "4 mi easy", altType: "easy", altMiles: 4 },
      thu: { type: "easy",  label: "5 mi easy",      miles: 5 },
      fri: { type: "rest",  label: "Rest",           miles: 0 },
      sat: { type: "easy",  label: "4 mi easy",      miles: 4 },
      sun: { type: "long",  label: "20 mi long run", miles: 20 },
    },
    totalMiles: 38,
    note: "First 20-miler! This is the peak of your training. Run 90 sec/mi slower than goal pace.",
  },
  {
    week: 14,
    phase: "peak",
    dates: "Sep 8–14",
    days: {
      mon: { type: "rest",     label: "Rest",              miles: 0 },
      tue: { type: "easy",     label: "5 mi easy",         miles: 5 },
      wed: { type: "yasso",    label: "10×800m Yasso",     miles: 8, speedWork: true, altLabel: "5 mi easy", altType: "easy", altMiles: 5 },
      thu: { type: "easy",     label: "5 mi easy",         miles: 5 },
      fri: { type: "rest",     label: "Rest",              miles: 0 },
      sat: { type: "easy",     label: "4 mi easy",         miles: 4 },
      sun: { type: "long",     label: "20 mi long run",    miles: 20 },
    },
    totalMiles: 42,
    note: "10×800m Yasso is the gold standard fitness test. Completing it = ready to race.",
  },
  {
    week: 15,
    phase: "peak",
    dates: "Sep 15–21",
    days: {
      mon: { type: "rest",  label: "Rest",           miles: 0 },
      tue: { type: "easy",  label: "5 mi easy",      miles: 5 },
      wed: { type: "tempo", label: "4 mi tempo",     miles: 4, speedWork: true, altLabel: "4 mi easy", altType: "easy", altMiles: 4 },
      thu: { type: "easy",  label: "5 mi easy",      miles: 5 },
      fri: { type: "rest",  label: "Rest",           miles: 0 },
      sat: { type: "easy",  label: "4 mi easy",      miles: 4 },
      sun: { type: "long",  label: "18 mi long run", miles: 18 },
    },
    totalMiles: 36,
    note: "Begin taper. Volume drops. Trust the process — you've done the work.",
  },

  // ─── TAPER PHASE (Weeks 16–18) ──────────────────────────────
  {
    week: 16,
    phase: "taper",
    dates: "Sep 22–28",
    days: {
      mon: { type: "rest",  label: "Rest",           miles: 0 },
      tue: { type: "easy",  label: "4 mi easy",      miles: 4 },
      wed: { type: "tempo", label: "3 mi tempo",     miles: 3, speedWork: true, altLabel: "3 mi easy", altType: "easy", altMiles: 3 },
      thu: { type: "easy",  label: "4 mi easy",      miles: 4 },
      fri: { type: "rest",  label: "Rest",           miles: 0 },
      sat: { type: "easy",  label: "3 mi easy",      miles: 3 },
      sun: { type: "long",  label: "14 mi long run", miles: 14 },
    },
    totalMiles: 28,
    note: "Taper week 1. Feel free to feel antsy — that's good. Your legs are loading energy.",
  },
  {
    week: 17,
    phase: "taper",
    dates: "Sep 29–Oct 5",
    days: {
      mon: { type: "rest",  label: "Rest",          miles: 0 },
      tue: { type: "easy",  label: "3 mi easy",     miles: 3 },
      wed: { type: "tempo", label: "2 mi tempo",    miles: 2, speedWork: true, altLabel: "2 mi easy", altType: "easy", altMiles: 2 },
      thu: { type: "easy",  label: "3 mi easy",     miles: 3 },
      fri: { type: "rest",  label: "Rest",          miles: 0 },
      sat: { type: "easy",  label: "2 mi easy",     miles: 2 },
      sun: { type: "long",  label: "10 mi easy",    miles: 10 },
    },
    totalMiles: 20,
    note: "Final sharpener week. Easy and relaxed. Carb-load planning begins Friday.",
  },
  {
    week: 18,
    phase: "race",
    dates: "Oct 6–11",
    days: {
      mon: { type: "rest",  label: "Rest",            miles: 0 },
      tue: { type: "easy",  label: "3 mi easy",       miles: 3 },
      wed: { type: "cross", label: "XT / yoga",       miles: 0 },
      thu: { type: "easy",  label: "2 mi easy",       miles: 2 },
      fri: { type: "rest",  label: "Rest + expo",     miles: 0 },
      sat: { type: "easy",  label: "2 mi shakeout",   miles: 2 },
      sun: { type: "race",  label: "🏁 RACE DAY",     miles: 26.2 },
    },
    totalMiles: 33.2,
    note: "Race week. Sleep. Hydrate. Eat carbs. Don't try anything new. Trust your training.",
  },
];

export const PHASES = {
  base:  { label: "Base",  weeks: [1,2,3,4],                color: "green"  },
  build: { label: "Build", weeks: [5,6,7,8],                color: "amber"  },
  peak:  { label: "Peak",  weeks: [9,10,11,12,13,14,15],    color: "blue"   },
  taper: { label: "Taper", weeks: [16,17],                  color: "purple" },
  race:  { label: "Race",  weeks: [18],                     color: "orange" },
};
```

---

### src/hooks/useGoalTime.js

```js
import { useState, useMemo } from "react";
import { calculatePaces, shouldIncludeSpeedWork } from "../data/paceCalculator";

const DEFAULT_GOAL = "4:30:00";

export function useGoalTime() {
  const [goalTime, setGoalTime] = useState(DEFAULT_GOAL);

  const paces = useMemo(() => calculatePaces(goalTime), [goalTime]);
  const speedWorkEnabled = useMemo(() => shouldIncludeSpeedWork(goalTime), [goalTime]);

  return { goalTime, setGoalTime, paces, speedWorkEnabled };
}
```

---

### src/context/TrainingContext.jsx

```jsx
import { createContext, useContext, useState } from "react";
import { useGoalTime } from "../hooks/useGoalTime";

const TrainingContext = createContext(null);

export function TrainingProvider({ children }) {
  const { goalTime, setGoalTime, paces, speedWorkEnabled } = useGoalTime();
  const [completedWeeks, setCompletedWeeks] = useState(new Set());
  const [selectedWorkout, setSelectedWorkout] = useState(null); // for modal

  function toggleWeekComplete(weekNum) {
    setCompletedWeeks(prev => {
      const next = new Set(prev);
      next.has(weekNum) ? next.delete(weekNum) : next.add(weekNum);
      return next;
    });
  }

  return (
    <TrainingContext.Provider value={{
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

## Component specifications

### App.jsx

```jsx
import { TrainingProvider } from "./context/TrainingContext";
import Header from "./components/layout/Header";
import GoalSetter from "./components/GoalSetter";
import RaceCountdown from "./components/RaceCountdown";
import WeeklySchedule from "./components/WeeklySchedule";
import WorkoutGuide from "./components/WorkoutGuide";
import WorkoutModal from "./components/WorkoutModal";
import Footer from "./components/layout/Footer";

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

### GoalSetter.jsx — IMPORTANT COMPONENT

This is the hero interactive section. It must:
- Show a time input (preselected to 4:30:00) that the user can change
- Offer quick-select buttons: 4:00, 4:15, 4:30, 4:45, 5:00
- Dynamically show a pace card that updates all 5–6 pace zones
- Show a note if speed work is enabled vs disabled

```jsx
import { useTraining } from "../context/TrainingContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const QUICK_TIMES = ["4:00:00", "4:15:00", "4:30:00", "4:45:00", "5:00:00", "5:30:00"];

export default function GoalSetter() {
  const { goalTime, setGoalTime, paces, speedWorkEnabled } = useTraining();

  return (
    <section id="goal">
      <h2 className="text-2xl font-semibold mb-4">Your goal time</h2>
      {/* Quick select buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {QUICK_TIMES.map(t => (
          <Button
            key={t}
            variant={goalTime === t ? "default" : "outline"}
            onClick={() => setGoalTime(t)}
            className="text-sm"
          >
            {t.replace(":00", "")}
          </Button>
        ))}
      </div>

      {/* Custom time input */}
      <div className="flex items-center gap-3 mb-6">
        <label className="text-sm text-slate-600">Custom time (H:MM:SS)</label>
        <input
          type="text"
          value={goalTime}
          onChange={e => setGoalTime(e.target.value)}
          placeholder="4:30:00"
          className="border rounded px-3 py-1 w-28 text-sm"
        />
      </div>

      {/* Pace card grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "Race pace", value: paces.goalPace, color: "blue" },
          { label: "Easy runs", value: paces.easyPace, color: "green" },
          { label: "Long runs", value: paces.longRunPace, color: "sky" },
          { label: "Tempo", value: paces.tempoPace, color: "orange" },
          { label: "Intervals (5K)", value: paces.intervalPace, color: "purple" },
          { label: "Yasso 800 target", value: paces.yassoTarget, color: "violet" },
        ].map(({ label, value, color }) => (
          <Card key={label} className="text-center py-3 px-2">
            <p className="text-xs text-slate-500 mb-1">{label}</p>
            <p className={`text-lg font-semibold text-${color}-600`}>{value}</p>
          </Card>
        ))}
      </div>

      {/* Speed work toggle note */}
      <div className="mt-4">
        {speedWorkEnabled ? (
          <Badge variant="default" className="bg-purple-600">
            ⚡ Speed workouts enabled (Yasso 800s, hills, intervals)
          </Badge>
        ) : (
          <Badge variant="secondary">
            Easy plan — no speed workouts (set goal under 4:45 to enable)
          </Badge>
        )}
      </div>
    </section>
  );
}
```

---

### WeeklySchedule.jsx

Renders all 18 weeks grouped by phase. Each week is a `WeekCard`. Has a "jump to current week" button that scrolls to the active week based on today's date.

Key logic:
- Calculate current week number from `new Date()` vs start date June 9, 2026
- Highlight the current week with a colored border
- Each week is initially collapsed, current week is expanded by default

```jsx
import { useRef, useEffect } from "react";
import { PLAN, PHASES } from "../data/trainingPlan";
import WeekCard from "./WeekCard";
import { Button } from "@/components/ui/button";

function getCurrentWeek() {
  const start = new Date("2026-06-09");
  const now = new Date();
  const diffMs = now - start;
  const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
  return Math.min(Math.max(diffWeeks + 1, 1), 18);
}

export default function WeeklySchedule() {
  const currentWeek = getCurrentWeek();
  const currentRef = useRef(null);

  const phases = Object.entries(PHASES);

  return (
    <section id="schedule">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">18-Week Training Schedule</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => currentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
        >
          Jump to week {currentWeek}
        </Button>
      </div>

      {phases.map(([phaseKey, phase]) => (
        <div key={phaseKey} className="mb-8">
          <h3 className="text-lg font-medium text-slate-500 uppercase tracking-wide mb-3">
            {phase.label} Phase — Weeks {phase.weeks[0]}–{phase.weeks[phase.weeks.length - 1]}
          </h3>
          <div className="space-y-3">
            {PLAN.filter(w => phase.weeks.includes(w.week)).map(week => (
              <div
                key={week.week}
                ref={week.week === currentWeek ? currentRef : null}
              >
                <WeekCard
                  week={week}
                  isCurrentWeek={week.week === currentWeek}
                  defaultOpen={week.week === currentWeek}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
```

---

### WeekCard.jsx

A collapsible card for one week. Shows the 7-day grid. Tapping a workout pill opens the WorkoutModal.

```jsx
import { useState } from "react";
import { useTraining } from "../context/TrainingContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import DayPill from "./DayPill";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_KEYS   = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export default function WeekCard({ week, isCurrentWeek, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const { completedWeeks, toggleWeekComplete, speedWorkEnabled } = useTraining();
  const isComplete = completedWeeks.has(week.week);

  return (
    <Card className={`border ${isCurrentWeek ? "border-blue-400 shadow-md" : "border-slate-200"}`}>
      {/* Header row */}
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-500">Week {week.week}</span>
          <span className="text-sm text-slate-400">{week.dates}</span>
          {isCurrentWeek && <Badge className="bg-blue-600 text-white text-xs">This week</Badge>}
          {isComplete && <CheckCircle2 className="w-4 h-4 text-green-500" />}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400">{week.totalMiles} mi</span>
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded day grid */}
      {open && (
        <CardContent className="pt-0 pb-4">
          <div className="grid grid-cols-7 gap-1 mb-3">
            {DAY_LABELS.map(d => (
              <div key={d} className="text-center text-xs text-slate-400 pb-1">{d}</div>
            ))}
            {DAY_KEYS.map(key => (
              <DayPill key={key} dayData={week.days[key]} speedWorkEnabled={speedWorkEnabled} />
            ))}
          </div>
          {week.note && (
            <p className="text-xs text-slate-500 bg-slate-50 rounded px-3 py-2 mt-2">
              💡 {week.note}
            </p>
          )}
          <button
            onClick={() => toggleWeekComplete(week.week)}
            className="text-xs text-slate-400 hover:text-green-600 mt-2 underline"
          >
            {isComplete ? "Mark incomplete" : "Mark week complete ✓"}
          </button>
        </CardContent>
      )}
    </Card>
  );
}
```

---

### DayPill.jsx

Renders one day's workout as a colored pill. Tapping it fires `setSelectedWorkout` to open the modal.

```jsx
import { useTraining } from "../context/TrainingContext";

const TYPE_STYLES = {
  rest:        "bg-slate-100 text-slate-400",
  easy:        "bg-green-100 text-green-700 cursor-pointer hover:bg-green-200",
  tempo:       "bg-orange-100 text-orange-700 cursor-pointer hover:bg-orange-200",
  yasso:       "bg-purple-100 text-purple-700 cursor-pointer hover:bg-purple-200",
  intervals:   "bg-purple-100 text-purple-700 cursor-pointer hover:bg-purple-200",
  hills:       "bg-red-100 text-red-700 cursor-pointer hover:bg-red-200",
  mileRepeats: "bg-violet-100 text-violet-700 cursor-pointer hover:bg-violet-200",
  cross:       "bg-pink-100 text-pink-700 cursor-pointer hover:bg-pink-200",
  long:        "bg-blue-100 text-blue-700 cursor-pointer hover:bg-blue-200",
  race:        "bg-amber-100 text-amber-800 cursor-pointer hover:bg-amber-200 font-bold",
};

export default function DayPill({ dayData, speedWorkEnabled }) {
  const { setSelectedWorkout } = useTraining();

  if (!dayData) return <div />;

  // If this is a speed workout day but speed work is disabled, swap to alt
  const isSpeedWorkDay = dayData.speedWork;
  const effectiveData = (isSpeedWorkDay && !speedWorkEnabled)
    ? { ...dayData, type: dayData.altType, label: dayData.altLabel, miles: dayData.altMiles }
    : dayData;

  const style = TYPE_STYLES[effectiveData.type] || TYPE_STYLES.easy;

  return (
    <button
      className={`rounded-md px-1 py-2 text-center text-xs font-medium w-full leading-tight ${style}`}
      onClick={() => effectiveData.type !== "rest" && setSelectedWorkout(effectiveData.type)}
      disabled={effectiveData.type === "rest"}
    >
      {effectiveData.label}
    </button>
  );
}
```

---

### WorkoutModal.jsx

Opens a full-screen dialog when a workout pill is tapped. Shows:
- Workout name and tagline
- What it is (paragraph)
- How to do it (numbered list)
- Your target pace (pulled from paces context)
- Common mistakes section

```jsx
import { useTraining } from "../context/TrainingContext";
import { WORKOUT_TYPES } from "../data/workoutDescriptions";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export default function WorkoutModal() {
  const { selectedWorkout, setSelectedWorkout, paces } = useTraining();
  const workout = selectedWorkout ? WORKOUT_TYPES[selectedWorkout] : null;

  if (!workout) return null;

  const paceValue = workout.paceNote ? paces[workout.paceNote] : workout.paceNoteText;

  return (
    <Dialog open={!!selectedWorkout} onOpenChange={() => setSelectedWorkout(null)}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{workout.icon}</span>
            <DialogTitle>{workout.label}</DialogTitle>
          </div>
          <DialogDescription className="text-slate-500 italic">{workout.tagline}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          {/* What it is */}
          <div>
            <h4 className="font-semibold text-slate-700 mb-1">What it is</h4>
            <p className="text-slate-600 leading-relaxed">{workout.whatItIs}</p>
          </div>

          {/* Target pace */}
          {paceValue && (
            <div className="bg-blue-50 rounded-lg px-4 py-3">
              <p className="text-xs text-blue-500 font-medium uppercase tracking-wide mb-1">Your target pace</p>
              <p className="text-blue-800 font-semibold text-base">{paceValue}</p>
            </div>
          )}

          {/* How to do it */}
          <div>
            <h4 className="font-semibold text-slate-700 mb-2">How to do it</h4>
            <ol className="list-decimal list-inside space-y-2 text-slate-600">
              {workout.howToDo.map((step, i) => (
                <li key={i} className="leading-relaxed">{step}</li>
              ))}
            </ol>
          </div>

          {/* Schedule note */}
          {workout.schedule && (
            <div className="bg-purple-50 rounded-lg px-4 py-3">
              <p className="text-xs text-purple-500 font-medium uppercase tracking-wide mb-1">Schedule</p>
              <p className="text-purple-800 text-sm">{workout.schedule}</p>
            </div>
          )}

          {/* Common mistakes */}
          {workout.commonMistakes && (
            <div className="bg-red-50 rounded-lg px-4 py-3">
              <p className="text-xs text-red-500 font-medium uppercase tracking-wide mb-1">Common mistake</p>
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

### RaceCountdown.jsx

Live countdown to race day. Updates every second.

```jsx
import { useState, useEffect } from "react";
import { RACE_DATE } from "../data/trainingPlan";

export default function RaceCountdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    const now = new Date();
    const diff = RACE_DATE - now;
    if (diff <= 0) return null;
    return {
      days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours:   Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) return <p className="text-center text-slate-500">Race day! Good luck! 🏁</p>;

  return (
    <div className="text-center py-4">
      <p className="text-sm text-slate-500 mb-2 uppercase tracking-widest">2XU Long Beach Marathon — October 11, 2026</p>
      <div className="flex justify-center gap-4">
        {[["Days", timeLeft.days], ["Hours", timeLeft.hours], ["Min", timeLeft.minutes], ["Sec", timeLeft.seconds]].map(([label, val]) => (
          <div key={label} className="flex flex-col items-center">
            <span className="text-3xl font-bold text-ocean-600">{String(val).padStart(2, "0")}</span>
            <span className="text-xs text-slate-400 uppercase tracking-wide">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### WorkoutGuide.jsx

An accordion reference section at the bottom of the page. Shows every workout type with its full description. No modal needed — it's all inline. Good for pre-run reference.

```jsx
import { useTraining } from "../context/TrainingContext";
import { WORKOUT_TYPES } from "../data/workoutDescriptions";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger
} from "@/components/ui/accordion";

const GUIDE_ORDER = ["easy", "long", "tempo", "yasso", "intervals", "hills", "cross", "rest"];

export default function WorkoutGuide() {
  const { paces } = useTraining();

  return (
    <section id="guide" className="pb-16">
      <h2 className="text-2xl font-semibold mb-4">Workout guide</h2>
      <p className="text-slate-500 text-sm mb-6">
        Tap any workout type to learn what it is, how to do it, and your personal target pace.
        Paces update automatically when you change your goal time.
      </p>

      <Accordion type="multiple" className="w-full space-y-2">
        {GUIDE_ORDER.map(key => {
          const w = WORKOUT_TYPES[key];
          const paceValue = w.paceNote ? paces[w.paceNote] : w.paceNoteText;
          return (
            <AccordionItem key={key} value={key} className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium">
                <span className="flex items-center gap-2">
                  <span>{w.icon}</span>
                  <span>{w.label}</span>
                  <span className="text-xs text-slate-400 font-normal">— {w.tagline}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-slate-600 space-y-3">
                <p>{w.whatItIs}</p>
                {paceValue && (
                  <div className="bg-blue-50 text-blue-800 rounded px-3 py-2 font-semibold text-sm">
                    Your pace: {paceValue}
                  </div>
                )}
                <ul className="list-disc list-inside space-y-1">
                  {w.howToDo.map((step, i) => <li key={i}>{step}</li>)}
                </ul>
                {w.commonMistakes && (
                  <p className="text-red-600 text-xs bg-red-50 rounded px-3 py-2">
                    ⚠️ {w.commonMistakes}
                  </p>
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

### Header.jsx

```jsx
import { useTraining } from "../../context/TrainingContext";

export default function Header() {
  const { goalTime, paces } = useTraining();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-slate-800">Long Beach Marathon 2026</h1>
          <p className="text-xs text-slate-400">October 11 · Goal: {goalTime} · Race pace: {paces.goalPace}</p>
        </div>
        <nav className="hidden sm:flex gap-4 text-sm text-slate-500">
          <a href="#goal" className="hover:text-slate-800">Goal</a>
          <a href="#schedule" className="hover:text-slate-800">Schedule</a>
          <a href="#guide" className="hover:text-slate-800">Guide</a>
        </nav>
      </div>
    </header>
  );
}
```

---

### Footer.jsx

```jsx
export default function Footer() {
  return (
    <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400">
      <p>Long Beach Marathon · October 11, 2026 · 5:30am start · Shoreline Drive, Long Beach CA</p>
      <p className="mt-1">
        <a href="https://www.runlongbeach.com/marathon" target="_blank" rel="noreferrer" className="underline hover:text-slate-600">
          Official race website
        </a>
      </p>
    </footer>
  );
}
```

---

## index.css (Tailwind + CSS vars)

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

## GitHub Pages deployment

### Step 1 — Create GitHub repo
Create a new repo named `marathon-training` on GitHub. Push your code.

### Step 2 — package.json (final version)
```json
{
  "name": "marathon-training",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "homepage": "https://YOUR_USERNAME.github.io/marathon-training",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### Step 3 — Deploy
```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/marathon-training.git
git push -u origin main

npm run deploy
```

### Step 4 — Enable Pages in GitHub
Go to repo → Settings → Pages → Source: "Deploy from a branch" → Branch: `gh-pages` → `/root`.

Site will be live at `https://YOUR_USERNAME.github.io/marathon-training` in ~2 minutes.

---

## Build order for Claude Code

When prompting Claude Code to build this, follow this order to avoid import errors:

1. Project scaffolding (Vite + Tailwind + shadcn)
2. `src/lib/utils.js` (shadcn helper — auto-generated, verify exists)
3. `src/data/paceCalculator.js`
4. `src/data/workoutDescriptions.js`
5. `src/data/trainingPlan.js`
6. `src/hooks/useGoalTime.js`
7. `src/context/TrainingContext.jsx`
8. `src/components/layout/Header.jsx`
9. `src/components/layout/Footer.jsx`
10. `src/components/RaceCountdown.jsx`
11. `src/components/DayPill.jsx`
12. `src/components/WorkoutModal.jsx`
13. `src/components/WeekCard.jsx`
14. `src/components/WeeklySchedule.jsx`
15. `src/components/GoalSetter.jsx`
16. `src/components/WorkoutGuide.jsx`
17. `src/App.jsx`
18. `src/main.jsx`
19. `src/index.css`
20. `vite.config.js` (add base + path alias)
21. `tailwind.config.js` (full version above)
22. `package.json` (add homepage + deploy scripts)

---

## Key behaviors to verify after build

- [ ] Changing goal time updates ALL pace values in GoalSetter, WorkoutModal, and WorkoutGuide instantly
- [ ] Goals under 4:45 show speed workouts (Yasso 800s, hills, intervals); 4:45+ shows easy runs instead
- [ ] Tapping any workout pill opens the modal with correct pace for the current goal
- [ ] "Jump to current week" button scrolls correctly (June 9 = week 1 start)
- [ ] Current week is auto-expanded and highlighted with a blue border
- [ ] Race countdown ticks live every second
- [ ] Site deploys correctly via `npm run deploy` with the correct base URL in vite.config.js
- [ ] Mobile layout: 7-day grid doesn't overflow on 375px viewport (use `text-[10px]` on pills if needed)

---

## Notes for Claude Code

- All data is static — no API calls, no backend, no auth
- Every pace is derived from the single `goalTime` string — never hardcode pace values
- Speed workout substitution logic lives in `DayPill.jsx` — the `PLAN` data always contains the speed version, the component decides whether to display it
- The `useTraining()` hook is the single source of truth for all state — don't use local useState for anything that needs to be shared
- shadcn components are in `src/components/ui/` — do not modify them
- Tailwind classes for custom ocean/sand colors only work if `tailwind.config.js` extends the theme correctly
- Run `npm run dev` and verify in browser before deploying
