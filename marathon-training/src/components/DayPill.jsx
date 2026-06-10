import { useTraining } from "../context/TrainingContext";

const TYPE_STYLES = {
  rest:        "bg-slate-100 text-slate-400 cursor-default",
  easy:        "bg-green-100  text-green-700  hover:bg-green-200  cursor-pointer",
  tempo:       "bg-orange-100 text-orange-700 hover:bg-orange-200 cursor-pointer",
  yasso:       "bg-purple-100 text-purple-700 hover:bg-purple-200 cursor-pointer",
  intervals:   "bg-purple-100 text-purple-700 hover:bg-purple-200 cursor-pointer",
  hills:       "bg-red-100    text-red-700    hover:bg-red-200    cursor-pointer",
  mileRepeats: "bg-violet-100 text-violet-700 hover:bg-violet-200 cursor-pointer",
  cross:       "bg-pink-100   text-pink-700   hover:bg-pink-200   cursor-pointer",
  long:        "bg-blue-100   text-blue-700   hover:bg-blue-200   cursor-pointer",
  race:        "bg-amber-100  text-amber-800  hover:bg-amber-200  cursor-pointer font-bold",
};

export default function DayPill({ dayData, speedWorkEnabled }) {
  const { setSelectedWorkout } = useTraining();

  if (!dayData) return <div />;

  const effective = (dayData.speedWork && !speedWorkEnabled)
    ? { type: dayData.altType, label: dayData.altLabel, miles: dayData.altMiles }
    : dayData;

  const style = TYPE_STYLES[effective.type] ?? TYPE_STYLES.easy;

  return (
    <button
      className={`rounded-md px-1 py-2 text-center text-[10px] sm:text-xs font-medium w-full leading-tight transition-colors ${style}`}
      onClick={() => effective.type !== "rest" && setSelectedWorkout(effective.type)}
      disabled={effective.type === "rest"}
      title={effective.label}
    >
      {effective.label}
    </button>
  );
}
