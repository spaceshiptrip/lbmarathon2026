import { useTraining } from "../context/TrainingContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const GUIDE_ORDER = ["easy", "long", "tempo", "yasso", "intervals", "hills", "cross", "rest"];

export default function WorkoutGuide() {
  const { workouts, paces, dataLoading } = useTraining();

  if (dataLoading || !workouts) return null;

  return (
    <section id="guide" className="pb-16">
      <h2 className="text-2xl font-semibold mb-2">Workout guide</h2>
      <p className="text-sm text-slate-500 mb-6">
        Tap any type to see what it is, how to do it, and your personal target pace.
        Paces update automatically when you change your goal time above.
      </p>

      <Accordion type="multiple" className="space-y-2">
        {GUIDE_ORDER.filter(k => workouts[k]).map(key => {
          const w = workouts[key];
          const paceValue = w.paceNote ? paces[w.paceNote] : w.paceNoteText;
          return (
            <AccordionItem key={key} value={key} className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                <span className="flex items-center gap-2 text-left">
                  <span>{w.icon}</span>
                  <span>{w.label}</span>
                  <span className="hidden sm:inline text-xs text-slate-400 font-normal">
                    — {w.tagline}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-slate-600 space-y-3 pb-4">
                <p className="leading-relaxed">{w.whatItIs}</p>
                {paceValue && (
                  <div className="bg-blue-50 text-blue-800 rounded px-3 py-2 font-semibold text-sm">
                    Your pace: {paceValue}
                  </div>
                )}
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  {w.howToDo.map((step, i) => <li key={i}>{step}</li>)}
                </ul>
                {w.commonMistakes && (
                  <div className="bg-red-50 text-red-700 rounded px-3 py-2 text-xs">
                    ⚠️ {w.commonMistakes}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </section>
  );
}
