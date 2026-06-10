import { createContext, useContext, useState } from "react";
import { useGoalTime } from "../hooks/useGoalTime";
import { usePlanData } from "../hooks/usePlanData";

const TrainingContext = createContext(null);

export function TrainingProvider({ children }) {
  const { plan, workouts, loading: dataLoading, error: dataError } = usePlanData();
  const { goalTime, setGoalTime, paces, speedWorkEnabled } = useGoalTime(
    plan?.defaultGoalTime ?? "4:30:00"
  );
  const [completedWeeks,  setCompletedWeeks]  = useState(new Set());
  const [selectedWorkout, setSelectedWorkout] = useState(null);

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
