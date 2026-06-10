import { useState, useMemo } from "react";
import { calculatePaces, shouldIncludeSpeedWork } from "../data/paceCalculator";

export function useGoalTime(defaultGoal = "4:30:00") {
  const [goalTime, setGoalTime] = useState(defaultGoal);
  const paces            = useMemo(() => calculatePaces(goalTime), [goalTime]);
  const speedWorkEnabled = useMemo(() => shouldIncludeSpeedWork(goalTime), [goalTime]);
  return { goalTime, setGoalTime, paces, speedWorkEnabled };
}
