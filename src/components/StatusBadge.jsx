export default function StatusBadge({ status }) {
  return (
    <span
      className={`badge badge-${status}`}
      aria-label={`Status: ${status}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
