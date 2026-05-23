import { useState, useEffect } from "react";
import { FaBalanceScale, FaCheckCircle, FaClock } from "react-icons/fa";
import { withAuthPage } from "@/lib/withAuthPage";

export const getServerSideProps = withAuthPage({ path: "/reconciliation" });

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

export default function ReconciliationPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/cash-bank");
        const json = await res.json();
        if (json.data) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch reconciliation data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (!data) {
    return <div className="p-8 text-center text-red-500">Failed to load reconciliation data</div>;
  }

  const { summary, today } = data;

  // School-specific reconciliation items
  const pendingItems = [
    { type: "UPI Collection", description: "Online fee collection - INR 5000", amount: 5000, issued_date: "2026-05-22", days_pending: 1, status: "Settlement pending" },
    { type: "UPI Collection", description: "Online admission fee - INR 8000", amount: 8000, issued_date: "2026-05-21", days_pending: 2, status: "Settlement pending" },
    { type: "Cash Deposit", description: "Cash deposited to bank - INR 25000", amount: 25000, issued_date: "2026-05-20", days_pending: 2, status: "Bank processing" },
    { type: "Pending Bill", description: "Vendor bill - Supplies & maintenance", amount: 3500, issued_date: "2026-05-15", days_pending: 8, status: "Payment due" },
    { type: "Pending Salary", description: "Staff salary - May month", amount: 65000, issued_date: "2026-05-25", days_pending: 0, status: "To be paid" },
  ];

  const upiPending = pendingItems
    .filter((i) => i.type === "UPI Collection")
    .reduce((sum, i) => sum + i.amount, 0);

  const depositsPending = pendingItems
    .filter((i) => i.type === "Cash Deposit")
    .reduce((sum, i) => sum + i.amount, 0);

  const billsPending = pendingItems
    .filter((i) => i.type === "Pending Bill")
    .reduce((sum, i) => sum + i.amount, 0);

  const salaryPending = pendingItems
    .filter((i) => i.type === "Pending Salary")
    .reduce((sum, i) => sum + i.amount, 0);

  const actualCash = summary.cashInHand;
  const actualBank = summary.bankBalance;
  const expectedTotal = summary.totalLiquid;

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">✓ Bank Reconciliation</h1>
          <p className="mt-2 text-slate-600 text-sm">Match cash in hand & bank balance with pending collections & payments</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-600">Cash in Hand</p>
            <p className="text-2xl font-black text-green-700 mt-2">{formatCurrency(actualCash)}</p>
            <p className="text-xs text-slate-600 mt-2">💵 Physical cash</p>
          </div>

          <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-600">Bank Balance</p>
            <p className="text-2xl font-black text-blue-700 mt-2">{formatCurrency(actualBank)}</p>
            <p className="text-xs text-slate-600 mt-2">🏦 Bank account</p>
          </div>

          <div className="rounded-2xl border-2 border-orange-200 bg-orange-50 p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-600">UPI Pending</p>
            <p className="text-2xl font-black text-orange-700 mt-2">{formatCurrency(upiPending)}</p>
            <p className="text-xs text-slate-600 mt-2">📱 Settlement pending</p>
          </div>

          <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-600">Expected Total</p>
            <p className="text-2xl font-black text-purple-700 mt-2">{formatCurrency(expectedTotal)}</p>
            <p className="text-xs text-slate-600 mt-2">💰 All liquid</p>
          </div>
        </div>

        {/* Reconciliation Math */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6">📊 Cash & Bank Reconciliation</h2>
            <div className="space-y-3">
              <div className="flex justify-between pb-3 border-b border-slate-200">
                <span className="text-slate-700 font-medium">Cash in Hand</span>
                <span className="font-bold text-slate-900">{formatCurrency(actualCash)}</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-slate-200">
                <span className="text-slate-700 font-medium">Add: Bank Balance</span>
                <span className="font-bold text-slate-900">+{formatCurrency(actualBank)}</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-slate-200">
                <span className="text-orange-700 font-medium">Add: UPI Pending Settlement</span>
                <span className="font-bold text-orange-700">+{formatCurrency(upiPending)}</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-slate-200">
                <span className="text-blue-700 font-medium">Add: Deposits in Bank</span>
                <span className="font-bold text-blue-700">+{formatCurrency(depositsPending)}</span>
              </div>
              <div className="flex justify-between bg-green-50 border-2 border-green-200 px-4 py-3 rounded-lg">
                <span className="font-bold text-green-900">Total Liquid Assets</span>
                <span className="font-bold text-lg text-green-900">{formatCurrency(actualCash + actualBank + upiPending + depositsPending)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6">⏳ Outstanding Obligations</h2>
            <div className="space-y-3">
              <div className="flex justify-between pb-3 border-b border-slate-200">
                <span className="text-slate-700 font-medium">Pending Bills/Expenses</span>
                <span className="font-bold text-red-700">−{formatCurrency(billsPending)}</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-slate-200">
                <span className="text-slate-700 font-medium">Pending Salary Payment</span>
                <span className="font-bold text-red-700">−{formatCurrency(salaryPending)}</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-slate-200">
                <span className="text-slate-700 font-medium">Total Obligations</span>
                <span className="font-bold text-slate-900">−{formatCurrency(billsPending + salaryPending)}</span>
              </div>
              <div className="flex justify-between bg-blue-50 border-2 border-blue-200 px-4 py-3 rounded-lg">
                <span className="font-bold text-blue-900">Net Cash Position</span>
                <span className="font-bold text-lg text-blue-900">{formatCurrency(actualCash + actualBank + upiPending + depositsPending - billsPending - salaryPending)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Items */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">📋 Pending Collections & Payments</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b-2 border-slate-200">
                  <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase text-xs tracking-[0.2em]">Type</th>
                  <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase text-xs tracking-[0.2em]">Description</th>
                  <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase text-xs tracking-[0.2em]">Date</th>
                  <th className="px-4 py-3 text-right font-bold text-slate-700 uppercase text-xs tracking-[0.2em]">Amount</th>
                  <th className="px-4 py-3 text-right font-bold text-slate-700 uppercase text-xs tracking-[0.2em]">Days Pending</th>
                  <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase text-xs tracking-[0.2em]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {pendingItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        item.type === "UPI Collection" 
                          ? "bg-orange-100 text-orange-700" 
                          : item.type === "Cash Deposit"
                          ? "bg-green-100 text-green-700"
                          : item.type === "Pending Bill"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{item.description}</td>
                    <td className="px-4 py-3 text-slate-600">{item.issued_date}</td>
                    <td className="px-4 py-3 text-right font-bold text-slate-900">{formatCurrency(item.amount)}</td>
                    <td className={`px-4 py-3 text-right font-bold ${
                      item.days_pending > 5 
                        ? "text-red-700" 
                        : item.days_pending > 2 
                        ? "text-orange-700" 
                        : "text-green-700"
                    }`}>
                      {item.days_pending === 0 ? "Today" : `${item.days_pending}d`}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Card */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-3">
                <FaBalanceScale className="text-blue-600 text-lg" />
              </div>
              <div>
                <p className="text-xs text-slate-600 font-medium">Total Pending Items</p>
                <p className="text-2xl font-bold text-slate-900">{pendingItems.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-orange-50 p-3">
                <FaClock className="text-orange-600 text-lg" />
              </div>
              <div>
                <p className="text-xs text-slate-600 font-medium">Oldest Pending</p>
                <p className="text-2xl font-bold text-slate-900">{Math.max(...pendingItems.map(i => i.days_pending))} days</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-50 p-3">
                <FaCheckCircle className="text-green-600 text-lg" />
              </div>
              <div>
                <p className="text-xs text-slate-600 font-medium">Net Position</p>
                <p className="text-2xl font-bold text-green-700">{formatCurrency(actualCash + actualBank + upiPending + depositsPending - billsPending - salaryPending)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
