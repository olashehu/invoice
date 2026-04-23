import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";
import InvoiceForm from "../components/InvoiceForm";
import StatusBadge from "../components/StatusBadge";
import { useInvoices } from "../context/InvoiceContext";
import { formatCurrency, formatDate } from "../utility/helpers";

function IconArrowLeft() {
  return (
    <svg width={7} height={10} viewBox="0 0 7 10" fill="none" aria-hidden="true">
      <path
        d="M6 1L1.5 5L6 9"
        stroke="#7c5dfa"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function DetailPage() {
  const { invoices, updateInvoice, deleteInvoice, markAsPaid } = useInvoices();
  const navigate = useNavigate();
  const { id: invoiceId } = useParams();
  const [showEdit, setShowEdit] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const invoice = invoices.find((item) => item.id === invoiceId);

  const handleBack = () => navigate("/");

  if (!invoice) {
    return (
      <div className="detail-page">
        <button className="back-btn" onClick={handleBack} type="button">
          <IconArrowLeft />
          Go Back
        </button>
        <p style={{ color: "var(--text-2)", fontWeight: 500 }}>
          Invoice not found.
        </p>
      </div>
    );
  }

  const handleUpdate = (data) => {
    updateInvoice(data);
    setShowEdit(false);
  };

  const handleDelete = () => {
    deleteInvoice(invoiceId);
    handleBack();
  };

  const actionButtons = (
    <>
      {invoice.status !== "paid" && (
        <button
          className="btn btn-secondary"
          onClick={() => setShowEdit(true)}
          type="button"
        >
          Edit
        </button>
      )}
      <button
        className="btn btn-danger"
        onClick={() => setShowConfirm(true)}
        type="button"
      >
        Delete
      </button>
      {invoice.status === "pending" && (
        <button
          className="btn btn-purple"
          onClick={() => markAsPaid(invoiceId)}
          type="button"
        >
          Mark as Paid
        </button>
      )}
    </>
  );

  return (
    <div className="detail-page">
      <button
        className="back-btn"
        onClick={handleBack}
        aria-label="Go back"
        type="button"
      >
        <IconArrowLeft />
        Go Back
      </button>

      <div className="toolbar">
        <div className="toolbar-left">
          <span className="toolbar-label">Status</span>
          <StatusBadge status={invoice.status} />
        </div>

        <div className="toolbar-actions">{actionButtons}</div>
      </div>

      <div className="detail-card">
        <div className="detail-top">
          <div>
            <p className="detail-invoice-id">
              <span>#</span>
              {invoice.id}
            </p>
            <p className="detail-desc">{invoice.description}</p>
          </div>

          <div className="detail-sender">
            {invoice.senderAddress?.street && (
              <p>{invoice.senderAddress.street}</p>
            )}
            {invoice.senderAddress?.city && <p>{invoice.senderAddress.city}</p>}
            {invoice.senderAddress?.postCode && (
              <p>{invoice.senderAddress.postCode}</p>
            )}
            {invoice.senderAddress?.country && (
              <p>{invoice.senderAddress.country}</p>
            )}
          </div>
        </div>

        <div className="detail-meta">
          <div className="meta-group">
            <label>Invoice Date</label>
            <p>{formatDate(invoice.createdAt)}</p>
            <label style={{ marginTop: 24, display: "block" }}>
              Payment Due
            </label>
            <p>{formatDate(invoice.paymentDue)}</p>
          </div>

          <div className="meta-group">
            <label>Bill To</label>
            <p>{invoice.clientName}</p>
            {invoice.clientAddress?.street && (
              <span className="addr">{invoice.clientAddress.street}</span>
            )}
            {invoice.clientAddress?.city && (
              <span className="addr">{invoice.clientAddress.city}</span>
            )}
            {invoice.clientAddress?.postCode && (
              <span className="addr">{invoice.clientAddress.postCode}</span>
            )}
            {invoice.clientAddress?.country && (
              <span className="addr">{invoice.clientAddress.country}</span>
            )}
          </div>

          <div className="meta-group">
            <label>Sent to</label>
            <p className="small">{invoice.clientEmail}</p>
          </div>
        </div>

        <div className="detail-items">
          <div className="items-table">
            <div className="items-head">
              <span>Item Name</span>
              <span>QTY.</span>
              <span>Price</span>
              <span>Total</span>
            </div>

            {invoice.items.map((item, index) => (
              <div key={index} className="item-row">
                <span className="item-name">{item.name}</span>
                <span className="item-num">{item.quantity}</span>
                <span className="item-num">{formatCurrency(item.price)}</span>
                <span className="item-num" style={{ color: "var(--text)" }}>
                  {formatCurrency(item.quantity * item.price)}
                </span>
              </div>
            ))}
          </div>

          <div className="items-total-bar">
            <span className="items-total-label">Amount Due</span>
            <span className="items-total-amt">
              {formatCurrency(invoice.total)}
            </span>
          </div>
        </div>

        {/* <div className="detail-card-actions">
          {actionButtons}
        </div> */}
      </div>
      <div className="detail-card-actions">{actionButtons}</div>

      {showEdit && (
        <InvoiceForm
          invoice={invoice}
          onSave={handleUpdate}
          onClose={() => setShowEdit(false)}
        />
      )}

      {showConfirm && (
        <ConfirmModal
          invoiceId={invoice.id}
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}
