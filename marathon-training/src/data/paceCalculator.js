export function timeToSeconds(timeStr) {
  const parts = timeStr.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 0;
}

export function secondsToMinPerMile(secsPerMile) {
  const m = Math.floor(secsPerMile / 60);
  const s = Math.round(secsPerMile % 60);
  return `${m}:${String(s).padStart(2, "0")}/mi`;
}

export function calculatePaces(goalTimeStr) {
  const goalSecs        = timeToSeconds(goalTimeStr);
  const goalPacePerMile = goalSecs / 26.2;
  const goalHours       = Math.floor(goalSecs / 3600);
  const goalMinutes     = Math.floor((goalSecs % 3600) / 60);

  return {
    goalTime:       goalTimeStr,
    goalPace:       secondsToMinPerMile(goalPacePerMile),
    easyPace:       secondsToMinPerMile(goalPacePerMile + 105),
    longRunPace:    secondsToMinPerMile(goalPacePerMile + 75),
    tempoPace:      secondsToMinPerMile(goalPacePerMile - 25),
    mileRepeatPace: secondsToMinPerMile(goalPacePerMile - 45),
    intervalPace:   secondsToMinPerMile(goalPacePerMile - 67),
    yassoTarget:    `${goalHours}:${String(goalMinutes).padStart(2, "0")} per 800m`,
    yassoRecovery:  "Same duration as rep (easy jog)",
  };
}

export function shouldIncludeSpeedWork(goalTimeStr) {
  return timeToSeconds(goalTimeStr) < timeToSeconds("4:45:00");
}
