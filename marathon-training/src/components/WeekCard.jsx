import { useState } from "react";
import { useTraining } from "../context/TrainingContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
          {open
            ? <ChevronUp className="w-4 h-4 text-slate-400" />
            : <ChevronDown className="w-4 h-4 text-slate-400" />
          }
        </div>
      </button>

      {open && (
        <CardContent className="pt-0 pb-4 px-4">
          <div className="grid grid-cols-7 gap-1 mb-3">
            {DAY_LABELS.map(d => (
              <p key={d} className="text-center text-[10px] text-slate-400 pb-1">{d}</p>
            ))}
            {DAY_KEYS.map(key => (
              <DayPill key={key} dayData={week.days[key]} speedWorkEnabled={speedWorkEnabled} />
            ))}
          </div>

          {week.note && (
            <p className="text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded px-3 py-2 mt-1">
              💡 {week.note}
            </p>
          )}

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
