import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import FilterDropdown from "../components/FilterDropdown";
import InvoiceCard from "../components/InvoiceCard";
import InvoiceForm from "../components/InvoiceForm";
import IconPlus from "../components/icons/IconPlus";
import { useInvoices } from "../context/InvoiceContext";

export default function InvoiceListPage() {
  const { invoices, createInvoice } = useInvoices();
  const navigate = useNavigate();
  const [filters, setFilters] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const filtered =
    filters.length === 0
      ? invoices
      : invoices.filter((invoice) => filters.includes(invoice.status));

  const handleCreate = (data) => {
    createInvoice(data);
    setShowForm(false);
  };

  const label = () => {
    if (invoices.length === 0) return "No invoices";

    const count = filtered.length;

    return filters.length === 0
      ? `${count} invoice${count !== 1 ? "s" : ""}`
      : `There are ${count} ${filters.join("/")} invoice${count !== 1 ? "s" : ""}`;
  };

  return (
    <div className="list-page">
      <header className="list-header">
        <div className="list-title">
          <h1>Invoices</h1>
          <p>{label()}</p>
        </div>

        <div className="list-controls">
          <FilterDropdown selected={filters} onChange={setFilters} />
          <button
            className="btn btn-new"
            onClick={() => setShowForm(true)}
            aria-label="Create new invoice"
            type="button"
          >
            <span className="icon-circle" aria-hidden="true">
              <IconPlus />
            </span>
            New Invoice
          </button>
        </div>
      </header>

      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="cards" role="list">
          {filtered.map((invoice) => (
            <div key={invoice.id} role="listitem">
              <InvoiceCard
                invoice={invoice}
                onClick={() => navigate(`/invoices/${invoice.id}`)}
              />
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <InvoiceForm onSave={handleCreate} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}
