export function validateInvoice(data) {
  const errors = {};

  if (!data.clientName?.trim()) errors.clientName = "Client name is required";
  if (!data.clientEmail?.trim()) {
    errors.clientEmail = "Client email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.clientEmail)) {
    errors.clientEmail = "Must be a valid email address";
  }

  if (!data.clientAddress?.street?.trim())
    errors["clientAddress.street"] = "Street is required";
  if (!data.clientAddress?.city?.trim())
    errors["clientAddress.city"] = "City is required";
  if (!data.clientAddress?.postCode?.trim())
    errors["clientAddress.postCode"] = "Post code is required";
  if (!data.clientAddress?.country?.trim())
    errors["clientAddress.country"] = "Country is required";

  if (!data.paymentDue) errors.paymentDue = "Payment due date is required";
  if (!data.description?.trim()) errors.description = "Description is required";

  if (!data.items || data.items.length === 0) {
    errors.items = "At least one item is required";
  } else {
    const itemErrors = [];
    data.items.forEach((item, idx) => {
      const ie = {};
      if (!item.name?.trim()) ie.name = "Item name is required";
      if (!item.quantity || item.quantity <= 0) ie.quantity = "Qty must be > 0";
      if (item.price === undefined || item.price === "" || item.price < 0)
        ie.price = "Price must be ≥ 0";
      if (Object.keys(ie).length > 0) itemErrors[idx] = ie;
    });
    if (itemErrors.length > 0) errors.itemErrors = itemErrors;
  }

  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}

// ===== VALIDATION =====
// export function validateInvoices(d) {
//   const e = {};
//   if (!d.clientName?.trim()) e.clientName = "Required";
//   if (!d.clientEmail?.trim()) e.clientEmail = "Required";
//   else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.clientEmail))
//     e.clientEmail = "Invalid email";
//   if (!d.clientAddress?.street?.trim()) e["ca.street"] = "Required";
//   if (!d.clientAddress?.city?.trim()) e["ca.city"] = "Required";
//   if (!d.clientAddress?.postCode?.trim()) e["ca.postCode"] = "Required";
//   if (!d.clientAddress?.country?.trim()) e["ca.country"] = "Required";
//   if (!d.paymentDue) e.paymentDue = "Required";
//   if (!d.description?.trim()) e.description = "Required";
//   if (!d.items || d.items.length === 0) {
//     e.items = "At least one item required";
//   } else {
//     const ie = [];
//     d.items.forEach((item, idx) => {
//       const r = {};
//       if (!item.name?.trim()) r.name = "Required";
//       if (!item.quantity || item.quantity <= 0) r.quantity = ">0";
//       if (item.price === undefined || item.price === "" || item.price < 0)
//         r.price = "≥0";
//       if (Object.keys(r).length) ie[idx] = r;
//     });
//     if (ie.length) e.itemErrors = ie;
//   }
//   return e;
// }
