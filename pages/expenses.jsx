import { useMemo, useState } from "react";
import { FaReceipt, FaPlus, FaRupeeSign, FaTags, FaCalendarAlt } from "react-icons/fa";
import { withAuthPage } from "@/lib/withAuthPage";

export const getServerSideProps = withAuthPage({ path: "/expenses" });

const initialForm = {
  date: new Date().toISOString().slice(0, 10),
  title: "",
  category: "",
  amount: "",
  notes: "",
  receipt_file_name: "",
};

const defaultExpenses = [
  { id: 1, title: "Stationery purchase", category: "Office", date: "2026-05-17", amount: 4500, notes: "Books, paper, markers" },
  { id: 2, title: "Transport fuel", category: "Transport", date: "2026-05-16", amount: 3200, notes: "Bus fuel refill" },
  { id: 3, title: "Cleaning supplies", category: "Maintenance", date: "2026-05-15", amount: 1800, notes: "Cleaning materials" },
];

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

export default function ExpensesPage() {
  const [form, setForm] = useState(initialForm);
  const [expenses, setExpenses] = useState(defaultExpenses);

  const totalExpense = useMemo(
    () => expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [expenses]
  );

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleReceiptUpload(event) {
    const file = event.target.files?.[0];

    setForm((current) => ({
      ...current,
      receipt_file_name: file ? file.name : "",
    }));
  }

  function addExpense(event) {
    event.preventDefault();

    if (!form.title || !form.category || !form.amount) {
      return;
    }

    setExpenses((current) => [
      {
        id: Date.now(),
        title: form.title,
        category: form.category,
        date: form.date,
        amount: Number(form.amount),
        notes: form.notes,
          receipt_file_name: form.receipt_file_name,
      },
      ...current,
    ]);

    setForm(initialForm);
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Expenses Entry</p>
              <h1 className="mt-2 text-3xl font-black text-slate-900">Record school expenses</h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                Add daily expenses, review spend categories, and keep finance records organized for the accountant.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <StatCard icon={FaRupeeSign} label="Total spend" value={formatCurrency(totalExpense)} />
              <StatCard icon={FaReceipt} label="Entries" value={expenses.length} />
              <StatCard icon={FaTags} label="Categories" value={new Set(expenses.map((item) => item.category)).size} />
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <form onSubmit={addExpense} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="rounded-2xl bg-[#8B1F1F]/10 p-3 text-[#8B1F1F]"><FaPlus /></span>
              <div>
                <h2 className="text-xl font-black text-slate-900">New expense</h2>
                <p className="text-sm text-slate-500">Capture a fresh expense in seconds.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Date" icon={FaCalendarAlt}>
                <input name="date" type="date" value={form.date} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-900" />
              </Field>
              <Field label="Amount" icon={FaRupeeSign}>
                <input name="amount" type="number" min="0" value={form.amount} onChange={handleChange} placeholder="Amount" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-900" />
              </Field>
              <Field label="Title" icon={FaReceipt} className="sm:col-span-2">
                <input name="title" value={form.title} onChange={handleChange} placeholder="Expense title" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-900" />
              </Field>
              <Field label="Category" icon={FaTags}>
                <input name="category" value={form.category} onChange={handleChange} placeholder="Office, Transport..." className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-900" />
              </Field>
              <Field label="Notes" icon={FaReceipt} className="sm:col-span-2">
                <textarea name="notes" value={form.notes} onChange={handleChange} rows={4} placeholder="Optional notes" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-900" />
              </Field>
              <Field label="Upload Receipt / Invoice" icon={FaPlus} className="sm:col-span-2">
                <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-600">
                  <span>{form.receipt_file_name || "Choose receipt or invoice file"}</span>
                  <input type="file" accept="image/*,.pdf" onChange={handleReceiptUpload} className="hidden" />
                </label>
              </Field>
            </div>

            <button type="submit" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#8B1F1F] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#6f1818]">
              <FaPlus /> Save expense
            </button>
          </form>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Recent expenses</p>
                <h2 className="mt-2 text-xl font-black text-slate-900">Expense history</h2>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {expenses.map((item) => (
                <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-bold text-slate-900">{item.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{item.category} • {item.date}</p>
                    </div>
                    <p className="text-lg font-black text-slate-900">{formatCurrency(item.amount)}</p>
                  </div>
                  {item.notes ? <p className="mt-3 text-sm leading-6 text-slate-600">{item.notes}</p> : null}
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    {item.receipt_file_name || "No receipt uploaded"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-black text-slate-900">{value}</p>
        </div>
        <span className="rounded-2xl bg-white p-3 text-[#8B1F1F] shadow-sm">
          <Icon />
        </span>
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, className = "", children }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
        <Icon className="text-slate-300" />
        {label}
      </span>
      {children}
    </label>
  );
}
