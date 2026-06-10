import { useTraining } from "../context/TrainingContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function WorkoutModal() {
  const { selectedWorkout, setSelectedWorkout, workouts, paces } = useTraining();
  const workout = selectedWorkout && workouts ? workouts[selectedWorkout] : null;

  if (!workout) return null;

  const paceValue = workout.paceNote ? paces[workout.paceNote] : workout.paceNoteText;

  return (
    <Dialog open={!!selectedWorkout} onOpenChange={() => setSelectedWorkout(null)}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{workout.icon}</span>
            <DialogTitle className="text-lg">{workout.label}</DialogTitle>
          </div>
          <DialogDescription className="italic text-slate-500">
            {workout.tagline}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold text-slate-700 mb-1">What it is</h4>
            <p className="text-slate-600 leading-relaxed">{workout.whatItIs}</p>
          </div>

          {paceValue && (
            <div className="bg-blue-50 rounded-lg px-4 py-3">
              <p className="text-xs text-blue-500 font-semibold uppercase tracking-wide mb-1">
                Your target pace
              </p>
              <p className="text-blue-800 font-bold text-base">{paceValue}</p>
            </div>
          )}

          <div>
            <h4 className="font-semibold text-slate-700 mb-2">How to do it</h4>
            <ol className="list-decimal list-inside space-y-2 text-slate-600">
              {workout.howToDo.map((step, i) => (
                <li key={i} className="leading-relaxed">{step}</li>
              ))}
            </ol>
          </div>

          {workout.schedule && (
            <div className="bg-purple-50 rounded-lg px-4 py-3">
              <p className="text-xs text-purple-500 font-semibold uppercase tracking-wide mb-1">
                Schedule
              </p>
              <p className="text-purple-800 text-sm">{workout.schedule}</p>
            </div>
          )}

          {workout.commonMistakes && (
            <div className="bg-red-50 rounded-lg px-4 py-3">
              <p className="text-xs text-red-500 font-semibold uppercase tracking-wide mb-1">
                Common mistake
              </p>
              <p className="text-red-800 text-sm">{workout.commonMistakes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
