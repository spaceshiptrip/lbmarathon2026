import { useState, useEffect } from "react";

export function usePlanData() {
  const [plan,     setPlan]     = useState(null);
  const [workouts, setWorkouts] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    Promise.all([
      fetch(`${base}data/plan.json`).then(r => {
        if (!r.ok) throw new Error("plan.json not found");
        return r.json();
      }),
      fetch(`${base}data/workouts.json`).then(r => {
        if (!r.ok) throw new Error("workouts.json not found");
        return r.json();
      }),
    ])
      .then(([planData, workoutData]) => {
        setPlan(planData);
        setWorkouts(workoutData);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { plan, workouts, loading, error };
}
