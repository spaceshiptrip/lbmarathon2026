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

  if (!plan) return null;

  if (!timeLeft) {
    return <p className="text-center text-slate-500 py-4">Race day! Good luck! 🏁</p>;
  }

  return (
    <div className="text-center py-4">
      <p className="text-xs text-slate-400 mb-3 uppercase tracking-widest">
        2XU Long Beach Marathon — October 11, 2026
      </p>
      <div className="flex justify-center gap-6">
        {[
          ["Days",  timeLeft.days],
          ["Hours", timeLeft.hours],
          ["Min",   timeLeft.minutes],
          ["Sec",   timeLeft.seconds],
        ].map(([label, val]) => (
          <div key={label} className="flex flex-col items-center">
            <span className="text-4xl font-bold text-blue-600 tabular-nums">
              {String(val).padStart(2, "0")}
            </span>
            <span className="text-xs text-slate-400 uppercase tracking-wide mt-1">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
