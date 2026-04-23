export function generateId() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  const first = letters[Math.floor(Math.random() * letters.length)];
  const second = letters[Math.floor(Math.random() * letters.length)];
  const numbers = Array.from(
    { length: 4 },
    () => digits[Math.floor(Math.random() * digits.length)],
  ).join("");

  return `${first}${second}${numbers}`;
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount || 0);
}

export function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function addDays(dateString, days) {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

export function calcTotal(items) {
  return (items || []).reduce(
    (s, i) => s + (parseFloat(i.quantity) || 0) * (parseFloat(i.price) || 0),
    0,
  );
}
