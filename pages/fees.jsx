import { useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { withAuthPage } from "@/lib/withAuthPage";

export const getServerSideProps = withAuthPage({ path: "/fees" });

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function StatusBadge({ status }) {
  const styles = {
    Paid: "bg-green-100 text-green-700",
    Partial: "bg-yellow-100 text-yellow-700",
    Pending: "bg-red-100 text-red-700",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${styles[status] || "bg-slate-100 text-slate-700"}`}>
      {status}
    </span>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
      <path d="M12.04 2C6.51 2 2.02 6.46 2.02 11.95c0 1.95.58 3.86 1.68 5.49L2 22l4.71-1.66a10.08 10.08 0 0 0 5.33 1.51h.01c5.53 0 10.02-4.46 10.02-9.95C22.07 6.46 17.57 2 12.04 2zm0 18.13a8.15 8.15 0 0 1-4.16-1.14l-.3-.17-2.8.98.94-2.73-.19-.28a8.05 8.05 0 0 1-1.25-4.3c0-4.44 3.64-8.05 8.12-8.05 4.47 0 8.11 3.61 8.11 8.05 0 4.44-3.64 8.04-8.11 8.04zm4.72-5.72c-.26-.13-1.54-.75-1.78-.84-.24-.09-.41-.13-.58.13-.17.26-.67.84-.82 1.01-.15.17-.3.19-.56.06-.26-.13-1.1-.4-2.1-1.26-.78-.69-1.3-1.53-1.46-1.79-.15-.26-.02-.41.11-.54.12-.12.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.07-.13-.58-1.4-.8-1.92-.21-.5-.43-.43-.58-.44h-.49c-.17 0-.45.06-.69.32-.24.26-.91.89-.91 2.17 0 1.27.93 2.5 1.06 2.67.13.17 1.84 2.81 4.46 3.94.62.27 1.1.43 1.48.55.62.19 1.18.16 1.63.1.5-.08 1.54-.63 1.76-1.24.22-.61.22-1.14.15-1.24-.06-.1-.24-.17-.5-.3z" />
    </svg>
  );
}

function normalizePhoneNumber(value) {
  return String(value || "").replace(/\D/g, "");
}

export default function FeesPage() {
  const [rows, setRows] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [monthly, setMonthly] = useState([]);
  const [entries, setEntries] = useState([]);
  const [entryForm, setEntryForm] = useState({
    admission_id: "",
    student_name: "",
    amount: "",
    payment_mode: "Cash",
    receipt_no: "",
    receipt_file_name: "",
    notes: "",
  });
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [autoNotify, setAutoNotify] = useState(true);

  async function fetchFees() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (month) params.set("month", month);

      const res = await fetch(`/api/fees?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setRows(data.records || []);
        setMetrics(data.metrics || {});
        setMonthly(data.monthly || []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFees();
  }, [month]);

  useEffect(() => {
    if (!autoNotify) {
      return;
    }

    setSelectedIds(
      rows
        .filter((item) => Number(item.balance_amount || 0) > 0 && normalizePhoneNumber(item.father_mobile))
        .map((item) => item.admission_id)
    );
  }, [autoNotify, rows]);

  const maxMonthly = useMemo(
    () => Math.max(...monthly.map((m) => Number(m.collected || 0)), 1),
    [monthly]
  );

  const dueRows = useMemo(
    () => rows.filter((item) => Number(item.balance_amount || 0) > 0 && normalizePhoneNumber(item.father_mobile)),
    [rows]
  );

  const selectedRows = useMemo(
    () => rows.filter((item) => selectedIds.includes(item.admission_id) && normalizePhoneNumber(item.father_mobile)),
    [rows, selectedIds]
  );

  const allSelectableIds = useMemo(() => dueRows.map((item) => item.admission_id), [dueRows]);
  const isAllSelected = allSelectableIds.length > 0 && allSelectableIds.every((id) => selectedIds.includes(id));
  const isIndeterminate = selectedIds.length > 0 && !isAllSelected;

  function toggleAllSelection() {
    setSelectedIds((current) => {
      if (isAllSelected) {
        return current.filter((id) => !allSelectableIds.includes(id));
      }

      return Array.from(new Set([...current, ...allSelectableIds]));
    });
  }

  function toggleRowSelection(item) {
    if (!normalizePhoneNumber(item.father_mobile)) {
      return;
    }

    setSelectedIds((current) =>
      current.includes(item.admission_id)
        ? current.filter((id) => id !== item.admission_id)
        : [...current, item.admission_id]
    );
  }

  function buildWhatsAppMessage(item) {
    return `Dear Parent, this is a reminder that your child's school fee balance is pending for ${month || "this month"}.\n\nStudent: ${item.student_name || "-"}\nClass: ${item.class || "-"}\nBalance: ${formatCurrency(item.balance_amount)}\n\nPlease clear the dues at the earliest. Thank you.`;
  }

  function openWhatsApp(item) {
    const phone = normalizePhoneNumber(item.father_mobile);
    if (!phone) return;

    const text = encodeURIComponent(buildWhatsAppMessage(item));
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank", "noopener,noreferrer");
  }

  function openBulkWhatsApp() {
    selectedRows.forEach((item) => {
      openWhatsApp(item);
    });
  }

  function handleEntryChange(event) {
    const { name, value } = event.target;
    setEntryForm((current) => ({ ...current, [name]: value }));
  }

  function handleReceiptUpload(event) {
    const file = event.target.files?.[0];

    setEntryForm((current) => ({
      ...current,
      receipt_file_name: file ? file.name : "",
    }));
  }

  function saveFeeEntry(event) {
    event.preventDefault();

    if (!entryForm.student_name || !entryForm.amount) {
      return;
    }

    setEntries((current) => [
      {
        id: Date.now(),
        ...entryForm,
        amount: Number(entryForm.amount || 0),
        date: new Date().toISOString().slice(0, 10),
      },
      ...current,
    ]);

    setEntryForm({
      admission_id: "",
      student_name: "",
      amount: "",
      payment_mode: "Cash",
      receipt_no: "",
      receipt_file_name: "",
      notes: "",
    });
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Fees</h1>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Track total fees, collections, pending balances, and student-wise fee status.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={autoNotify}
                  onChange={(e) => setAutoNotify(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-green-600 focus:ring-green-500"
                />
                Auto notify due parents
              </label>

              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-slate-900"
              />
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total Fees</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">{formatCurrency(metrics.totalFees)}</h2>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total Collected</p>
            <h2 className="mt-3 text-3xl font-bold text-green-700">{formatCurrency(metrics.totalCollected)}</h2>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Pending Fees</p>
            <h2 className="mt-3 text-3xl font-bold text-red-700">{formatCurrency(metrics.pendingFees)}</h2>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Today's Collection</p>
            <h2 className="mt-3 text-3xl font-bold text-blue-700">{formatCurrency(metrics.todayCollection)}</h2>
          </div>
        </div>

        <section className="mb-6 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Fee Entry</p>
              <h2 className="mt-2 text-2xl font-black text-slate-900">Collect fee payment</h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                Record a fee collection, attach the receipt, and keep the accountant entry point in one place.
              </p>
            </div>

            <div className="rounded-3xl bg-slate-50 px-5 py-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">Latest entry mode</p>
              <p className="mt-1">Use receipt upload for collected payments and track the receipt number for audit.</p>
            </div>
          </div>

          <form onSubmit={saveFeeEntry} className="mt-6 grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 md:grid-cols-2 xl:grid-cols-3">
            <input
              name="admission_id"
              value={entryForm.admission_id}
              onChange={handleEntryChange}
              placeholder="Admission #"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-900"
            />
            <input
              name="student_name"
              value={entryForm.student_name}
              onChange={handleEntryChange}
              placeholder="Student name"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-900"
            />
            <input
              name="amount"
              type="number"
              value={entryForm.amount}
              onChange={handleEntryChange}
              placeholder="Amount collected"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-900"
            />
            <select
              name="payment_mode"
              value={entryForm.payment_mode}
              onChange={handleEntryChange}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-900"
            >
              <option>Cash</option>
              <option>UPI</option>
              <option>Bank Transfer</option>
              <option>Cheque</option>
            </select>
            <input
              name="receipt_no"
              value={entryForm.receipt_no}
              onChange={handleEntryChange}
              placeholder="Receipt number"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-900"
            />
            <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-600">
              <span>{entryForm.receipt_file_name || "Upload receipt"}</span>
              <input type="file" accept="image/*,.pdf" onChange={handleReceiptUpload} className="hidden" />
            </label>
            <textarea
              name="notes"
              value={entryForm.notes}
              onChange={handleEntryChange}
              rows={3}
              placeholder="Notes"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-900 md:col-span-2 xl:col-span-3"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#8B1F1F] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#6f1818] md:col-span-2 xl:col-span-3"
            >
              <FaPlus /> Save fee entry
            </button>
          </form>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {entries.slice(0, 3).map((entry) => (
              <div key={entry.id} className="rounded-3xl border border-slate-200 bg-white p-4">
                <p className="font-bold text-slate-900">{entry.student_name}</p>
                <p className="mt-1 text-sm text-slate-500">{entry.payment_mode} • {entry.date}</p>
                <p className="mt-3 text-lg font-black text-slate-900">{formatCurrency(entry.amount)}</p>
                <div className="mt-3 space-y-1 text-sm text-slate-500">
                  <p>Receipt: {entry.receipt_no || "-"}</p>
                  <p>File: {entry.receipt_file_name || "-"}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mb-6 rounded-[1.75rem] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Monthly Collection</h2>

          <div className="mt-6 space-y-4">
            {monthly.map((item) => (
              <div key={item.month_label}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-semibold text-slate-700">{item.month_label}</span>
                  <span className="font-bold text-slate-900">{formatCurrency(item.collected)}</span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{ width: `${Math.max(8, (Number(item.collected || 0) / maxMonthly) * 100)}%` }}
                  />
                </div>
              </div>
            ))}

            {monthly.length === 0 && (
              <p className="text-sm text-slate-500">No monthly collection data available.</p>
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-[1.75rem] bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Student Fee Ledger</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Fee amount comes from admissions table and paid amount comes from fee_payments.
                </p>
              </div>

              <div className="flex flex-col gap-3 lg:w-136">
                <p className="text-sm leading-6 text-slate-600">
                  WhatsApp reminders will use the default fee-balance template.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={(node) => {
                        if (node) node.indeterminate = isIndeterminate;
                      }}
                      onChange={toggleAllSelection}
                      className="h-4 w-4 rounded border-slate-300 text-green-600"
                    />
                    Select all due parents
                  </label>

                  <button
                    type="button"
                    onClick={openBulkWhatsApp}
                    disabled={selectedRows.length === 0}
                    className="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <WhatsAppIcon />
                    Notify selected parents ({selectedRows.length})
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead style={{ backgroundColor: "#8B1F1F" }}>
                <tr>
                  {[
                    "Select",
                    "Student",
                    "Class",
                    "Parent",
                    "Total Fee",
                    "Paid",
                    "Balance",
                    "Status",
                    "Action",
                  ].map((h) => (
                    <th key={h} className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-white">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {rows.map((item) => {
                  const hasPhone = Boolean(normalizePhoneNumber(item.father_mobile));

                  return (
                    <tr key={item.admission_id} className="hover:bg-slate-50">
                      <td className="px-5 py-4 align-top">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item.admission_id)}
                          onChange={() => toggleRowSelection(item)}
                          disabled={!hasPhone}
                          className="h-4 w-4 rounded border-slate-300 text-green-600 disabled:cursor-not-allowed disabled:opacity-40"
                        />
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">{item.student_name}</p>
                        <p className="text-sm text-slate-500">Admission #{item.admission_id}</p>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-700">{item.class || "-"}</td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-slate-900">{item.father_name || "-"}</p>
                        <p className="text-sm text-slate-500">{item.father_mobile || "-"}</p>
                      </td>

                      <td className="px-5 py-4 text-sm font-bold text-slate-900">{formatCurrency(item.total_fee)}</td>
                      <td className="px-5 py-4 text-sm font-bold text-green-700">{formatCurrency(item.paid_amount)}</td>
                      <td className="px-5 py-4 text-sm font-bold text-red-700">{formatCurrency(item.balance_amount)}</td>

                      <td className="px-5 py-4">
                        <StatusBadge status={item.payment_status} />
                      </td>

                      <td className="px-5 py-4 align-top">
                        <button
                          type="button"
                          onClick={() => openWhatsApp(item)}
                          disabled={!hasPhone}
                          className="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                          <WhatsAppIcon />
                          WhatsApp
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {loading && (
              <div className="p-10 text-center text-sm font-semibold text-slate-500">
                Loading fees...
              </div>
            )}

            {!loading && rows.length === 0 && (
              <div className="p-10 text-center text-sm text-slate-500">
                No fee records found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
