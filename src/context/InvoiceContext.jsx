/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useEffect } from "react";
import { calcTotal, generateId } from "../utility/helpers";
import { SAMPLE } from "../data/sampleData";

export const InvoiceContext = createContext();

function invoiceReducer(state, action) {
  switch (action.type) {
    case "LOAD":
      return action.payload;
    case "CREATE":
      return [...state, action.payload];
    case "UPDATE":
      return state.map((inv) =>
        inv.id === action.payload.id ? action.payload : inv,
      );
    case "DELETE":
      return state.filter((inv) => inv.id !== action.payload);
    case "MARK_PAID":
      return state.map((inv) =>
        inv.id === action.payload ? { ...inv, status: "paid" } : inv,
      );
    default:
      return state;
  }
}

function getInitialInvoices() {
  const stored = localStorage.getItem("invoices");

  if (!stored) {
    return SAMPLE;
  }

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : SAMPLE;
  } catch {
    return SAMPLE;
  }
}

export default function InvoiceProvider({ children }) {
  const [invoices, dispatch] = useReducer(invoiceReducer, undefined, getInitialInvoices);

  useEffect(() => {
    localStorage.setItem("invoices", JSON.stringify(invoices));
  }, [invoices]);

  const createInvoice = (data) => {
    const invoice = {
      ...data,
      id: String(generateId()),
      createdAt: new Date().toISOString().split("T")[0],
      total: calcTotal(data.items),
    };
    dispatch({ type: "CREATE", payload: invoice });
    return invoice;
  };

  const updateInvoice = (data) => {
    const updated = {
      ...data,
      total: calcTotal(data.items),
    };
    dispatch({ type: "UPDATE", payload: updated });
  };

  const deleteInvoice = (id) => dispatch({ type: "DELETE", payload: id });

  const markAsPaid = (id) => dispatch({ type: "MARK_PAID", payload: id });

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        createInvoice,
        updateInvoice,
        deleteInvoice,
        markAsPaid,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoices() {
  const ctx = useContext(InvoiceContext);
  if (!ctx) throw new Error("useInvoices must be used within InvoiceProvider");
  return ctx;
}
