export default function DateDisplay({ className = "" }) {
  const now = new Date();
  const weekday = now.toLocaleDateString("en-US", { weekday: "long" });
  const month = now.toLocaleDateString("en-US", { month: "short" });
  const day = now.toLocaleDateString("en-US", { day: "2-digit" });
  const year = now.toLocaleDateString("en-US", { year: "numeric" });
  const date = `${month}. ${day}, ${year}`;
  return (
    <div className={`date-display ${className}`.trim()}>
      <span className="date-day">{weekday}</span>
      <span className="date-date">{date}</span>
    </div>
  );
}
