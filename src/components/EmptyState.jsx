import EmptyIcon from "./icons/EmptyIcon";

export default function EmptyState() {
  return (
    <div className="empty">
      <EmptyIcon />
      <h2>There is nothing here</h2>
      <p>
        Create an invoice by clicking the New Invoice button
        and get started
      </p>
    </div>
  );
}
