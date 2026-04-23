import StatusBadge from "./StatusBadge";
import IconArrowRight from "./icons/ArrowRight";
import { formatCurrency, formatDate } from "../utility/helpers";

export default function InvoiceCard({ invoice, onClick }) {
  const handleKeyDown = (event) => {
    if ((event.key === "Enter" || event.key === " ") && onClick) {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className="card"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={`Invoice ${invoice.id} for ${invoice.clientName}`}
    >
      <span className="card-id">
        <span>#</span>
        {invoice.id}
      </span>
      <span className="card-due">Due {formatDate(invoice.paymentDue)}</span>
      <span className="card-client">{invoice.clientName}</span>
      <span className="card-total">{formatCurrency(invoice.total)}</span>
      <StatusBadge status={invoice.status} />
      <span className="card-arrow">
        <IconArrowRight />
      </span>

      <div className="card-mobile-view">
        <div className="cmv-top">
          <span className="card-id">
            <span>#</span>
            {invoice.id}
          </span>
          <span className="card-client">{invoice.clientName}</span>
        </div>

        <div className="cmv-bot">
          <div className="cmv-left">
            <span className="cmv-due">Due {formatDate(invoice.paymentDue)}</span>
            <span className="cmv-total">{formatCurrency(invoice.total)}</span>
          </div>
          <StatusBadge status={invoice.status} />
        </div>
      </div>
    </div>
  );
}
