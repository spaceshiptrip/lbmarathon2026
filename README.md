# Long Beach Marathon 2026 Training App

A fully interactive, mobile-first marathon training plan web app for the **2XU Long Beach Marathon on October 11, 2026**. Entirely static — no backend, no auth, no database, no paid services. Runs 100% in the browser.

---

## What it does

- **Live race countdown** — days, hours, minutes, seconds ticking down to race morning
- **Goal time picker** — select a finish time (4:00 to 5:30) or type a custom time in H:MM:SS format
- **Instant pace calculator** — every pace zone (race pace, easy, long run, tempo, intervals, Yasso 800 target) recalculates the moment the goal time changes
- **Speed work toggle** — goals under 4:45 show Yasso 800s, hill repeats, and intervals; goals 4:45 and above automatically swap those days for easy runs
- **18-week training schedule** — grouped by training phase (Base → Build → Peak → Taper → Race), current week auto-highlighted and expanded on load
- **Workout detail modal** — tap any workout pill to see what the workout is, how to do it, and your personal target pace for that session
- **Workout guide accordion** — always-visible reference at the bottom of the page covering every workout type with paces that update live
- **Week completion tracker** — mark weeks done within the session

---

## Project structure

```
lbmarathon2026/               ← git repo root
├── marathon-training/        ← the app (Vite project)
│   ├── public/
│   │   └── data/
│   │       ├── plan.json         ← 18-week schedule (edit here to change the plan)
│   │       └── workouts.json     ← all workout descriptions and how-to content
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/               ← shadcn auto-generated — do not edit
│   │   │   ├── layout/
│   │   │   │   ├── Header.jsx    ← sticky nav showing goal time + race pace
│   │   │   │   └── Footer.jsx    ← race info + official website link
│   │   │   ├── GoalSetter.jsx    ← goal time picker + live pace card grid
│   │   │   ├── WeeklySchedule.jsx ← all 18 weeks grouped by phase
│   │   │   ├── WeekCard.jsx      ← single collapsible week
│   │   │   ├── DayPill.jsx       ← colored pill for one day's workout
│   │   │   ├── WorkoutModal.jsx  ← dialog: tap a pill → full workout guide
│   │   │   ├── WorkoutGuide.jsx  ← accordion reference for all workout types
│   │   │   └── RaceCountdown.jsx ← live countdown to race day
│   │   ├── context/
│   │   │   └── TrainingContext.jsx ← single global state provider (goal time, completed weeks, modal state)
│   │   ├── data/
│   │   │   └── paceCalculator.js   ← pure pace math, no external dependencies
│   │   ├── hooks/
│   │   │   ├── useGoalTime.js      ← manages goal time string + derived paces
│   │   │   └── usePlanData.js      ← fetches plan.json + workouts.json at runtime
│   │   ├── lib/
│   │   │   └── utils.js            ← shadcn cn() helper
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css               ← Tailwind v4 + shadcn CSS variables + custom ocean/sand colors
│   ├── .nvmrc                  ← pins Node 22
│   ├── components.json         ← shadcn configuration
│   ├── jsconfig.json           ← path alias @ → src/ (required for shadcn)
│   ├── vite.config.js          ← Tailwind v4 plugin + @ alias
│   ├── postcss.config.js       ← empty (PostCSS not needed with Tailwind v4 Vite plugin)
│   └── package.json
├── marathon-training-app-spec (1).md  ← authoritative design spec (v1, no backend)
├── marathon-training-app-spec.md      ← earlier draft (superseded by the (1) version)
└── README.md                          ← this file
```

---

## Tech stack

| Layer | Choice | Version |
|---|---|---|
| Framework | React | 19 |
| Build tool | Vite | 8 |
| Styling | Tailwind CSS | 4 (via `@tailwindcss/vite` plugin) |
| UI components | shadcn/ui | 4 |
| Icons | lucide-react | latest |
| State | React useState / useContext | — |
| Deployment | GitHub Pages via gh-pages | 6 |
| Node | v22 LTS | `.nvmrc` pins it |

> **Note on Tailwind version:** The design spec was written for Tailwind v3, but the actual build uses Tailwind v4 with the official Vite plugin. The differences are invisible to component code — custom `ocean` and `sand` color tokens are defined in `src/index.css` via `@theme inline` instead of `tailwind.config.js`.

---

## Running locally

### Prerequisites

- [nvm](https://github.com/nvm-sh/nvm) (recommended) or Node 22 LTS installed directly
- npm 10+

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/spaceshiptrip/lbmarathon2026.git
cd lbmarathon2026/marathon-training

# 2. Use the correct Node version
nvm use       # reads .nvmrc and switches to Node 22

# 3. Install dependencies
npm install

# 4. Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173` (or the next available port if 5173 is in use — check terminal output).

### Other commands

```bash
npm run build     # production build → dist/
npm run preview   # serve the production build locally
npm run lint      # run ESLint
```

---

## How the data works

The training plan and all workout content are stored as plain JSON files in `public/data/`. Vite serves these as static assets — they are **not** bundled into the JavaScript. The app fetches them at startup using `usePlanData.js`.

This means you can **edit the training plan or workout descriptions without touching any React code** — just update the JSON files and restart the dev server.

### public/data/plan.json

Contains the full 18-week schedule. Top-level fields:

| Field | Description |
|---|---|
| `raceDate` | ISO datetime of race morning (used for the live countdown) |
| `startDate` | First day of week 1 (used to calculate the current week number) |
| `defaultGoalTime` | Pre-selected goal time on first load |
| `phases` | Map of phase keys to label, week numbers, and color |
| `weeks` | Array of 18 week objects |

Each week object contains a `days` map (mon–sun). Speed workout days carry extra fields for automatic substitution:

```json
{
  "type": "tempo",
  "label": "3 mi tempo",
  "miles": 3,
  "speedWork": true,
  "altLabel": "3 mi easy",
  "altType": "easy",
  "altMiles": 3
}
```

When the runner's goal time is 4:45 or slower, `DayPill.jsx` renders the `alt*` fields instead of the primary ones. The JSON always stores the speed version; the component decides what to show.

### public/data/workouts.json

Keyed by workout type (`easy`, `long`, `tempo`, `yasso`, `intervals`, `hills`, `mileRepeats`, `cross`, `rest`). Each entry contains:

| Field | Description |
|---|---|
| `label` | Display name |
| `icon` | Emoji shown in pill and modal header |
| `tagline` | One-liner shown in the accordion trigger |
| `whatItIs` | Paragraph explaining the workout |
| `howToDo` | Array of step strings |
| `paceNote` | Key into the `paces` object from `paceCalculator.js` — if set, shows the runner's live calculated pace |
| `paceNoteText` | Static fallback text if `paceNote` is null (e.g. "Effort-based, RPE 8/10") |
| `schedule` | Optional notes on when this workout appears in the plan |
| `commonMistakes` | Optional warning shown in a red callout |

---

## How pace calculation works

All paces are derived from a single goal time string in `src/data/paceCalculator.js`. Nothing is hardcoded.

| Pace zone | Formula |
|---|---|
| Race pace | `goalSeconds / 26.2` seconds per mile |
| Easy | race pace + 105 sec/mi |
| Long run | race pace + 75 sec/mi |
| Tempo | race pace − 25 sec/mi |
| Mile repeats | race pace − 45 sec/mi |
| Intervals (5K effort) | race pace − 67 sec/mi |
| Yasso 800 target | Goal H:MM → same digits as MM:SS per 800m (e.g. 4:30 marathon → 4:30 per 800m) |

Paces are based on McMillan Running / Daniels' Running Formula methodology.

Speed work is enabled when the goal time is under 4:45:00. At 4:45 and above, all speed workout days in the schedule display as easy runs instead.

---

## How the state flows

```
TrainingProvider (TrainingContext.jsx)
├── usePlanData()          → fetches plan.json + workouts.json once on mount
├── useGoalTime()          → manages goalTime string + memoized paces + speedWorkEnabled flag
├── completedWeeks (Set)   → which week numbers the runner has marked done
└── selectedWorkout        → workout type key for the open modal (null = modal closed)
```

All components read from `useTraining()`. No prop drilling anywhere. Components that need to open the modal call `setSelectedWorkout(type)`. `WorkoutModal` reads `selectedWorkout` and the `workouts` JSON from context to render.

---

## Editing the training plan

To change a workout in the schedule, edit `public/data/plan.json`. For example, to change week 5's Sunday long run from 9 miles to 10:

```json
"sun": { "type": "long", "label": "10 mi long run", "miles": 10 }
```

To add or change a workout description, edit `public/data/workouts.json`. Keys must match the `type` values used in `plan.json`.

Do not add new workout type keys to `plan.json` without also adding a matching entry to `workouts.json` — the modal and workout guide both look up content by key.

---

## Customizing the theme colors

The coastal `ocean` and `sand` color palettes are defined in `src/index.css` inside the `@theme inline` block:

```css
--color-ocean-500: #0077c2;
--color-sand-500: #d4a017;
/* etc. */
```

These become Tailwind utility classes (`text-ocean-600`, `bg-sand-100`, etc.) automatically. The race countdown uses `text-blue-600` for the numbers — swap to `text-ocean-600` if you want the branded blue.

---

## What's planned for v2

The Google Sheets training log integration is explicitly deferred to v2. When ready, the following will be added **without changing any existing components**:

- `src/hooks/useSheets.js` — Google Identity Services OAuth + Sheets API v4
- `src/components/RunLogger.jsx` — post-run form (effort, actual miles, conditions, notes)
- `src/components/TrainingLog.jsx` — displays logged runs + "Copy for Claude" button
- A "Log run" button added to `WeekCard.jsx`
- `TrainingContext.jsx` updated to expose the Sheets hook

The current architecture is specifically structured so this addition requires no restructuring — just new hooks and components layered on top.

---

## Deployment (GitHub Pages)

The app deploys automatically to GitHub Pages on every push to `main` via GitHub Actions (`.github/workflows/deploy.yml`).

Live URL: `https://spaceshiptrip.github.io/lbmarathon2026/`

### One-time GitHub setup

You only need to do this once per repo. After that, every push to `main` deploys automatically.

1. Go to **github.com/spaceshiptrip/lbmarathon2026 → Settings → Pages**
2. Under **Source**, select **GitHub Actions** (not "Deploy from a branch")
3. Save

That's it. The next push to `main` will trigger the workflow and publish the site.

### How the deployment works

The workflow (`.github/workflows/deploy.yml`) runs two jobs:

**build job:**
1. Checks out the repo
2. Sets up Node 22 (reads `marathon-training/.nvmrc`)
3. Runs `actions/configure-pages` — this outputs the repo's base path (`/lbmarathon2026`)
4. Runs `npm ci` inside `marathon-training/`
5. Runs `npm run build` with `VITE_BASE_URL=/lbmarathon2026/` so Vite sets the correct asset paths for GitHub Pages
6. Uploads `marathon-training/dist/` as a Pages artifact

**deploy job:**
1. Deploys the uploaded artifact directly to GitHub Pages via the Pages API (no `gh-pages` branch needed)

### Why `VITE_BASE_URL` matters

Locally, `vite.config.js` uses `base: '/'` so assets load from `/`. On GitHub Pages, the site is served under `/lbmarathon2026/`, so assets must load from `/lbmarathon2026/`. The `VITE_BASE_URL` environment variable controls this — it's only set during the CI build, so local development is unaffected.

The `usePlanData.js` hook uses `import.meta.env.BASE_URL` (which Vite sets automatically from the `base` config) when fetching the JSON data files, so `plan.json` and `workouts.json` also resolve correctly in both environments.

### Manual deploy trigger

You can trigger a deployment without pushing code: go to **Actions → Build and deploy to GitHub Pages → Run workflow**.
