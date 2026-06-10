import { useTraining } from "../context/TrainingContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const QUICK_TIMES = ["4:00:00", "4:15:00", "4:30:00", "4:45:00", "5:00:00", "5:30:00"];

const PACE_CARDS = [
  { key: "goalPace",      label: "Race pace",        colorClass: "text-blue-600"   },
  { key: "easyPace",      label: "Easy runs",        colorClass: "text-green-600"  },
  { key: "longRunPace",   label: "Long runs",        colorClass: "text-sky-600"    },
  { key: "tempoPace",     label: "Tempo",            colorClass: "text-orange-600" },
  { key: "intervalPace",  label: "Intervals (5K)",   colorClass: "text-purple-600" },
  { key: "yassoTarget",   label: "Yasso 800 target", colorClass: "text-violet-600" },
];

export default function GoalSetter() {
  const { goalTime, setGoalTime, paces, speedWorkEnabled } = useTraining();

  return (
    <section id="goal">
      <h2 className="text-2xl font-semibold mb-4">Your goal time</h2>

      <div className="flex flex-wrap gap-2 mb-4">
        {QUICK_TIMES.map(t => (
          <Button
            key={t}
            variant={goalTime === t ? "default" : "outline"}
            size="sm"
            onClick={() => setGoalTime(t)}
          >
            {t.slice(0, -3)}
          </Button>
        ))}
      </div>

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
          className="border border-slate-200 rounded px-3 py-1 w-28 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        {PACE_CARDS.map(({ key, label, colorClass }) => (
          <Card key={key} className="text-center py-4 px-2">
            <p className="text-xs text-slate-500 mb-1">{label}</p>
            <p className={`text-lg font-semibold ${colorClass}`}>{paces[key]}</p>
          </Card>
        ))}
      </div>

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
