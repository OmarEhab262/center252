export function formatArabicDate(date) {
  return new Intl.DateTimeFormat("ar-EG-u-nu-arab", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatArabicDay(date) {
  return new Intl.DateTimeFormat("ar-EG", {
    weekday: "long",
  }).format(date);
}
