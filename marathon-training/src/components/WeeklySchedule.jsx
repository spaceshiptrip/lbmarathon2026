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

  useEffect(() => {
    if (!dataLoading && currentRef.current) {
      setTimeout(() => currentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
    }
  }, [dataLoading]);

  if (dataLoading) return <p className="text-slate-400 text-sm">Loading schedule...</p>;
  if (!plan)       return <p className="text-red-500 text-sm">Could not load plan data.</p>;

  const phaseEntries = Object.entries(plan.phases);

  return (
    <section id="schedule">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">18-Week Schedule</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => currentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
        >
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
