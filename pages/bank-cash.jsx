import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/reportDataUtils";
import { withAuthPage } from "@/lib/withAuthPage";

export const getServerSideProps = withAuthPage({ path: "/bank-cash" });

function CashBankDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("today");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/cash-bank");
        const json = await res.json();
        if (json.data) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch cash/bank data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!data) {
    return <div className="p-8 text-center text-red-500">Failed to load data</div>;
  }

  const { summary, today, collectionsBreakdown, monthlyTrend } = data;

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">💰 Cash & Bank Dashboard</h1>
          <p className="mt-2 text-slate-600 text-sm">Daily cash position, collections breakdown & monthly trends</p>
        </div>

        {/* Summary Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-5 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-600">Cash in Hand</p>
            <p className="text-2xl font-black text-green-700 mt-2">{formatCurrency(summary.cashInHand)}</p>
            <p className="text-xs text-slate-600 mt-2">🏧 Physical</p>
          </div>

          <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-600">Bank Balance</p>
            <p className="text-2xl font-black text-blue-700 mt-2">{formatCurrency(summary.bankBalance)}</p>
            <p className="text-xs text-slate-600 mt-2">🏦 Bank</p>
          </div>

          <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-5 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-600">Total Liquid</p>
            <p className="text-2xl font-black text-purple-700 mt-2">{formatCurrency(summary.totalLiquid)}</p>
            <p className="text-xs text-slate-600 mt-2">💵 Combined</p>
          </div>

          <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-5 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-600">UPI Pending</p>
            <p className="text-2xl font-black text-red-700 mt-2">{formatCurrency(summary.upiPending)}</p>
            <p className="text-xs text-slate-600 mt-2">📱 In Transit</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
          <div className="flex border-b border-slate-200 overflow-x-auto">
            {[
              { id: "today", label: "📅 Today" },
              { id: "collections", label: "💳 Collections" },
              { id: "monthly", label: "📈 Monthly" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-center font-medium text-sm whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "text-slate-900 border-b-2 border-slate-900 bg-slate-50 font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Today's Position */}
            {activeTab === "today" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600">Opening</p>
                    <p className="text-xl font-black text-blue-900 mt-2">{formatCurrency(today.openingBalance)}</p>
                  </div>
                  <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600">Receipts</p>
                    <p className="text-xl font-black text-green-900 mt-2">
                      {formatCurrency(today.feeCollections + today.otherIncome)}
                    </p>
                  </div>
                  <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600">Payments</p>
                    <p className="text-xl font-black text-red-900 mt-2">
                      {formatCurrency(today.expenses + today.salaryPaid)}
                    </p>
                  </div>
                  <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600">Closing</p>
                    <p className="text-xl font-black text-purple-900 mt-2">{formatCurrency(today.closingBalance)}</p>
                  </div>
                </div>

                {/* Detailed Cashbook */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-x-auto">
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-slate-200">
                      <tr className="bg-slate-50 hover:bg-slate-100">
                        <td className="px-4 py-3 font-semibold text-slate-800">Opening Balance</td>
                        <td className="px-4 py-3 text-right font-bold text-blue-700">{formatCurrency(today.openingBalance)}</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-700">Fee Collections</td>
                        <td className="px-4 py-3 text-right text-green-700 font-semibold">+{formatCurrency(today.feeCollections)}</td>
                      </tr>
                      <tr className="bg-slate-50 hover:bg-slate-100">
                        <td className="px-4 py-3 text-slate-700">Other Income</td>
                        <td className="px-4 py-3 text-right text-green-700 font-semibold">+{formatCurrency(today.otherIncome)}</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-700">Expenses</td>
                        <td className="px-4 py-3 text-right text-red-700 font-semibold">−{formatCurrency(today.expenses)}</td>
                      </tr>
                      <tr className="bg-slate-50 hover:bg-slate-100">
                        <td className="px-4 py-3 text-slate-700">Salary Paid</td>
                        <td className="px-4 py-3 text-right text-red-700 font-semibold">−{formatCurrency(today.salaryPaid)}</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-700">Bank Deposit</td>
                        <td className="px-4 py-3 text-right text-slate-700 font-semibold">−{formatCurrency(today.cashDeposit)}</td>
                      </tr>
                      <tr className="bg-slate-50 hover:bg-slate-100">
                        <td className="px-4 py-3 text-slate-700">Bank Withdrawal</td>
                        <td className="px-4 py-3 text-right text-slate-700 font-semibold">+{formatCurrency(today.cashWithdrawal)}</td>
                      </tr>
                      <tr className="bg-purple-50 border-t-2 border-purple-200">
                        <td className="px-4 py-3 font-bold text-purple-900">Closing Balance</td>
                        <td className="px-4 py-3 text-right font-bold text-lg text-purple-900">{formatCurrency(today.closingBalance)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Collections */}
            {activeTab === "collections" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-5">
                  <p className="text-sm font-bold text-slate-700 uppercase">Cash Receipts</p>
                  <p className="text-2xl font-black text-green-700 mt-3">{collectionsBreakdown.cash}</p>
                  <p className="text-xs text-slate-600 mt-2">Transactions</p>
                </div>
                <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5">
                  <p className="text-sm font-bold text-slate-700 uppercase">Online/UPI</p>
                  <p className="text-2xl font-black text-blue-700 mt-3">{collectionsBreakdown.upi}</p>
                  <p className="text-xs text-slate-600 mt-2">Transactions</p>
                </div>

              </div>
            )}

            {/* Monthly */}
            {activeTab === "monthly" && (
              <div className="bg-white border-2 border-slate-200 rounded-2xl overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b-2 border-slate-200">
                      <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase text-xs tracking-[0.2em]">Month</th>
                      <th className="px-4 py-3 text-right font-bold text-slate-700 uppercase text-xs tracking-[0.2em]">Opening</th>
                      <th className="px-4 py-3 text-right font-bold text-slate-700 uppercase text-xs tracking-[0.2em]">Deposits</th>
                      <th className="px-4 py-3 text-right font-bold text-slate-700 uppercase text-xs tracking-[0.2em]">Withdrawals</th>
                      <th className="px-4 py-3 text-right font-bold text-slate-700 uppercase text-xs tracking-[0.2em]">Closing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {monthlyTrend.map((month, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-bold text-slate-900">{month.month}</td>
                        <td className="px-4 py-3 text-right font-bold text-slate-900">
                          {formatCurrency(month.opening)}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-green-700">
                          +{formatCurrency(month.deposits)}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-red-700">
                          −{formatCurrency(month.withdrawals)}
                        </td>
                        <td className="px-4 py-3 text-right font-black text-purple-700">
                          {formatCurrency(month.closing)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CashBankDashboard;
