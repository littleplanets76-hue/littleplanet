import { FaExchangeAlt, FaFileInvoiceDollar, FaUndoAlt, FaUniversity } from "react-icons/fa";
import { withAuthPage } from "@/lib/withAuthPage";

export const getServerSideProps = withAuthPage({ path: "/transactions" });

const columns = ["Date", "Type", "Category", "Payment Mode", "Amount", "Reference", "Created By", "Notes"];

const sampleTransactions = [
  {
    date: "2026-05-22",
    type: "Admission fee received",
    category: "Admissions",
    paymentMode: "Cash",
    amount: 2000,
    reference: "ADM-1024-501",
    createdBy: "Admission Desk",
    notes: "Initial admission payment recorded.",
  },
  {
    date: "2026-05-22",
    type: "Fee received",
    category: "Fees",
    paymentMode: "UPI",
    amount: 5000,
    reference: "FEE-2205-78",
    createdBy: "Accountant",
    notes: "Monthly fee collection.",
  },
  {
    date: "2026-05-21",
    type: "Expense paid",
    category: "Office",
    paymentMode: "Bank Transfer",
    amount: 3200,
    reference: "EXP-4451",
    createdBy: "Admin",
    notes: "Stationery and office supplies.",
  },
];

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

export default function TransactionsPage() {
  return (
    <div className="p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Transactions</p>
              <h1 className="mt-2 text-3xl font-black text-slate-900">Money movement ledger</h1>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
                View fee receipts, admission fee receipts, expenses, payroll, refunds, and cash or bank transfers in one place.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <SummaryCard icon={FaFileInvoiceDollar} label="Fee received" value="₹ 12,000" />
              <SummaryCard icon={FaExchangeAlt} label="Transfers" value="₹ 4,800" />
              <SummaryCard icon={FaUndoAlt} label="Refunds" value="₹ 0" />
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5 md:px-8">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">Transaction register</h2>
                <p className="mt-1 text-sm text-slate-500">All accountant money movement in a single stream.</p>
              </div>
              <div className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Live schema ready
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead style={{ backgroundColor: "#8B1F1F" }}>
                <tr>
                  {columns.map((column) => (
                    <th key={column} className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-white">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sampleTransactions.map((row) => (
                  <tr key={`${row.reference}-${row.type}`} className="hover:bg-slate-50">
                    <td className="px-5 py-4 text-sm font-semibold text-slate-700">{row.date}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-slate-900">{row.type}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{row.category}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{row.paymentMode}</td>
                    <td className="px-5 py-4 text-sm font-bold text-emerald-700">{formatCurrency(row.amount)}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{row.reference}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{row.createdBy}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-black text-slate-900">{value}</p>
        </div>
        <span className="rounded-2xl bg-[#8B1F1F]/10 p-3 text-[#8B1F1F] shadow-sm">
          <Icon />
        </span>
      </div>
    </div>
  );
}
