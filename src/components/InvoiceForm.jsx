import { useEffect, useRef, useState } from "react";
import IconTrash from "./icons/TrashIcon";
import { addDays, formatCurrency } from "../utility/helpers";
import { validateInvoice } from "../utility/validation";

const EMPTY_ITEM = { name: "", quantity: 1, price: 0 };

const DEFAULT_FORM = {
  clientName: "",
  clientEmail: "",
  clientAddress: {
    street: "",
    city: "",
    postCode: "",
    country: "",
  },
  senderAddress: {
    street: "19 Union Terrace",
    city: "London",
    postCode: "E1 3EZ",
    country: "United Kingdom",
  },
  paymentDue: "",
  paymentTerms: 30,
  description: "",
  status: "draft",
  items: [{ ...EMPTY_ITEM }],
};

export default function InvoiceForm({ invoice, onSave, onClose }) {
  const isEdit = Boolean(invoice);
  console.log("Rendering InvoiceForm", { invoice, isEdit });
  const [form, setForm] = useState(() =>
    isEdit
      ? { ...invoice, items: invoice.items.map((item) => ({ ...item })) }
      : { ...DEFAULT_FORM, items: [{ ...EMPTY_ITEM }] },
  );
  const [errors, setErrors] = useState({});
  const modalRef = useRef(null);
  const firstRef = useRef(null);

  useEffect(() => {
    firstRef.current?.focus();

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return undefined;

    const selector =
      'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';

    const handleTab = (event) => {
      if (event.key !== "Tab") return;

      const elements = [...modal.querySelectorAll(selector)].filter(
        (element) => !element.disabled,
      );

      if (elements.length === 0) return;

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    modal.addEventListener("keydown", handleTab);
    return () => modal.removeEventListener("keydown", handleTab);
  }, []);

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const setAddressField = (type, field, value) => {
    setForm((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }));
  };

  const setItemField = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { ...EMPTY_ITEM }],
    }));
  };

  const removeItem = (index) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleTerms = (event) => {
    const paymentTerms = parseInt(event.target.value, 10);
    const baseDate =
      form.createdAt || form.paymentDue || new Date().toISOString().split("T")[0];

    setForm((prev) => ({
      ...prev,
      paymentTerms,
      paymentDue: addDays(baseDate, paymentTerms),
    }));
  };

  const handleSaveDraft = () => onSave({ ...form, status: "draft" });

  const handleSubmit = () => {
    const data = { ...form, status: isEdit ? form.status : "pending" };
    const nextErrors = validateInvoice(data);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    onSave(data);
  };

  const errorFor = (field) => errors[field];
  const itemError = (index, field) => errors.itemErrors?.[index]?.[field];

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? `Edit Invoice #${invoice.id}` : "New Invoice"}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="modal" ref={modalRef}>
        <h2>
          {isEdit ? (
            <>
              Edit <span>#</span>
              {invoice.id}
            </>
          ) : (
            "New Invoice"
          )}
        </h2>

        <p className="section-title">Bill From</p>
        <div className="form-group">
          <label htmlFor="sa-street">Street Address</label>
          <input
            id="sa-street"
            ref={firstRef}
            value={form.senderAddress.street}
            onChange={(event) =>
              setAddressField("senderAddress", "street", event.target.value)
            }
          />
        </div>

        <div className="form-row col3">
          <div className="form-group">
            <label htmlFor="sa-city">City</label>
            <input
              id="sa-city"
              value={form.senderAddress.city}
              onChange={(event) =>
                setAddressField("senderAddress", "city", event.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="sa-post">Post Code</label>
            <input
              id="sa-post"
              value={form.senderAddress.postCode}
              onChange={(event) =>
                setAddressField("senderAddress", "postCode", event.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="sa-country">Country</label>
            <input
              id="sa-country"
              value={form.senderAddress.country}
              onChange={(event) =>
                setAddressField("senderAddress", "country", event.target.value)
              }
            />
          </div>
        </div>

        <p className="section-title" style={{ marginTop: 24 }}>
          Bill To
        </p>

        <div className={`form-group ${errorFor("clientName") ? "has-err" : ""}`}>
          <label htmlFor="cn">
            Client&apos;s Name
            {errorFor("clientName") && (
              <span className="ferr">{errorFor("clientName")}</span>
            )}
          </label>
          <input
            id="cn"
            value={form.clientName}
            onChange={(event) => setField("clientName", event.target.value)}
          />
        </div>

        <div className={`form-group ${errorFor("clientEmail") ? "has-err" : ""}`}>
          <label htmlFor="ce">
            Client&apos;s Email
            {errorFor("clientEmail") && (
              <span className="ferr">{errorFor("clientEmail")}</span>
            )}
          </label>
          <input
            id="ce"
            type="email"
            placeholder="e.g. email@example.com"
            value={form.clientEmail}
            onChange={(event) => setField("clientEmail", event.target.value)}
          />
        </div>

        <div
          className={`form-group ${errorFor("clientAddress.street") ? "has-err" : ""}`}
        >
          <label htmlFor="ca-street">Street Address</label>
          <input
            id="ca-street"
            value={form.clientAddress.street}
            onChange={(event) =>
              setAddressField("clientAddress", "street", event.target.value)
            }
          />
        </div>

        <div className="form-row col3">
          <div
            className={`form-group ${errorFor("clientAddress.city") ? "has-err" : ""}`}
          >
            <label htmlFor="ca-city">City</label>
            <input
              id="ca-city"
              value={form.clientAddress.city}
              onChange={(event) =>
                setAddressField("clientAddress", "city", event.target.value)
              }
            />
          </div>

          <div
            className={`form-group ${errorFor("clientAddress.postCode") ? "has-err" : ""}`}
          >
            <label htmlFor="ca-post">Post Code</label>
            <input
              id="ca-post"
              value={form.clientAddress.postCode}
              onChange={(event) =>
                setAddressField("clientAddress", "postCode", event.target.value)
              }
            />
          </div>

          <div
            className={`form-group ${errorFor("clientAddress.country") ? "has-err" : ""}`}
          >
            <label htmlFor="ca-country">Country</label>
            <input
              id="ca-country"
              value={form.clientAddress.country}
              onChange={(event) =>
                setAddressField("clientAddress", "country", event.target.value)
              }
            />
          </div>
        </div>

        <div className="form-row col2" style={{ marginTop: 8 }}>
          <div className={`form-group ${errorFor("paymentDue") ? "has-err" : ""}`}>
            <label htmlFor="due">
              Invoice Date
              {errorFor("paymentDue") && (
                <span className="ferr">{errorFor("paymentDue")}</span>
              )}
            </label>
            <input
              id="due"
              type="date"
              value={form.paymentDue}
              onChange={(event) => setField("paymentDue", event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="terms">Payment Terms</label>
            <select id="terms" value={form.paymentTerms} onChange={handleTerms}>
              {[1, 7, 14, 30].map((value) => (
                <option key={value} value={value}>
                  Net {value} Day{value > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={`form-group ${errorFor("description") ? "has-err" : ""}`}>
          <label htmlFor="desc">
            Project Description
            {errorFor("description") && (
              <span className="ferr">{errorFor("description")}</span>
            )}
          </label>
          <input
            id="desc"
            placeholder="e.g. Graphic Design Service"
            value={form.description}
            onChange={(event) => setField("description", event.target.value)}
          />
        </div>

        <p className="items-title">Item List</p>
        {errorFor("items") && <p className="items-err">{errorFor("items")}</p>}

        <div className="items-hdr">
          <span>Item Name</span>
          <span>Qty.</span>
          <span>Price</span>
          <span>Total</span>
          <span />
        </div>

        {form.items.map((item, index) => {
          const total =
            (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0);

          return (
            <div key={index} className="item-row-form">
              <div
                className={`form-group ${itemError(index, "name") ? "has-err" : ""}`}
                style={{ margin: 0 }}
              >
                <label htmlFor={`in-${index}`} className="sr-only">
                  Item name
                </label>
                <input
                  id={`in-${index}`}
                  value={item.name}
                  placeholder="Item name"
                  onChange={(event) =>
                    setItemField(index, "name", event.target.value)
                  }
                />
                {itemError(index, "name") && (
                  <span
                    style={{
                      color: "var(--red)",
                      fontSize: 10,
                      fontWeight: 600,
                    }}
                  >
                    {itemError(index, "name")}
                  </span>
                )}
              </div>

              <div
                className={`form-group ${itemError(index, "quantity") ? "has-err" : ""}`}
                style={{ margin: 0 }}
              >
                <label htmlFor={`iq-${index}`} className="sr-only">
                  Quantity
                </label>
                <input
                  id={`iq-${index}`}
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(event) =>
                    setItemField(index, "quantity", parseInt(event.target.value, 10) || "")
                  }
                />
              </div>

              <div
                className={`form-group ${itemError(index, "price") ? "has-err" : ""}`}
                style={{ margin: 0 }}
              >
                <label htmlFor={`ip-${index}`} className="sr-only">
                  Price
                </label>
                <input
                  id={`ip-${index}`}
                  type="number"
                  min={0}
                  step="0.01"
                  value={item.price}
                  onChange={(event) =>
                    setItemField(index, "price", parseFloat(event.target.value) || "")
                  }
                />
              </div>

              <span className="item-total-disp">{formatCurrency(total)}</span>

              <button
                type="button"
                className="del-btn"
                aria-label={`Remove ${item.name || "item"}`}
                onClick={() => removeItem(index)}
              >
                <IconTrash />
              </button>
            </div>
          );
        })}

        <button
          type="button"
          className="btn btn-secondary"
          style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
          onClick={addItem}
        >
          + Add New Item
        </button>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            {isEdit ? "Cancel" : "Discard"}
          </button>

          <div className="form-actions-right">
            {!isEdit && (
              <button type="button" className="btn btn-dark" onClick={handleSaveDraft}>
                Save as Draft
              </button>
            )}
            <button type="button" className="btn btn-purple" onClick={handleSubmit}>
              {isEdit ? "Save Changes" : "Save & Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
