export function isDateIn(input: Date, reference: Date) {
  let date = new Date(input);
  return (
    date.getFullYear() === reference.getFullYear() &&
    date.getMonth() === reference.getMonth() &&
    date.getDate() === reference.getDate()
  );
}
