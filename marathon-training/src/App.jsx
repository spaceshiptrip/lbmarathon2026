import { TrainingProvider } from "./context/TrainingContext";
import Header        from "./components/layout/Header";
import Footer        from "./components/layout/Footer";
import RaceCountdown from "./components/RaceCountdown";
import GoalSetter    from "./components/GoalSetter";
import WeeklySchedule from "./components/WeeklySchedule";
import WorkoutGuide  from "./components/WorkoutGuide";
import WorkoutModal  from "./components/WorkoutModal";

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
