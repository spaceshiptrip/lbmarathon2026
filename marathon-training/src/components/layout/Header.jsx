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
