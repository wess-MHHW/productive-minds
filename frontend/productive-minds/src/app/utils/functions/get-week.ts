export function getWeekInterval() {
  const today = new Date();
  const day = today.getDay();
  const daysToAdd = day === 0 ? 1 : (1 + 7 - day) % 8;
  const start = new Date();
  start.setDate(start.getDate() + daysToAdd);
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  return [today, start];
}
