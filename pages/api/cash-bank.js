import { Pool } from "pg";
import {
  dummyDailyCashbook,
  dummyTransactions,
  dummyMonthlyData,
  dummyFeePayments,
} from "@/lib/dummyData";

const pool =
  global.pgPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
  });

if (!global.pgPool) global.pgPool = pool;

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ success: false, error: "Method not allowed" });
    }

    // For now, return dummy data as database schema may not have these tables
    const today = dummyDailyCashbook[0]; // Today's entry
    const totalFeeCollections = dummyFeePayments.reduce(
      (sum, p) => sum + p.paid_amount,
      0
    );
    const upiCollections = dummyFeePayments.filter(
      (p) => p.payment_mode === "Online"
    ).length;
    const checkCollections = dummyFeePayments.filter(
      (p) => p.payment_mode === "Check"
    ).length;
    const cashCollections = dummyFeePayments.filter(
      (p) => p.payment_mode === "Cash"
    ).length;

    // Calculate balances
    const cashBalance = today.closingBalance * 0.4; // 40% in hand
    const bankBalance = today.closingBalance * 0.6; // 60% in bank
    const upiPending = 125000; // Sample UPI pending
    const checksPending = 85000; // Sample checks pending

    // Monthly summary
    const monthlyStats = dummyMonthlyData.map((m) => ({
      month: m.month,
      openingBalance: m.bankBalance - (m.feeCollection + m.otherIncome - m.expenses - m.salary),
      closing: m.bankBalance,
      deposits: m.feeCollection + m.otherIncome,
      withdrawals: m.expenses + m.salary,
    }));

    // Recent transactions (for reconciliation)
    const recentTransactions = dummyTransactions.slice(0, 15);

    // Uncleared items
    const unclearedItems = [
      { type: "Check", ref_no: "CHK001234", amount: 45000, issued_date: "2024-05-20", days_pending: 3 },
      { type: "Check", ref_no: "CHK001235", amount: 40000, issued_date: "2024-05-19", days_pending: 4 },
      { type: "UPI Transfer", ref_no: "UPI20240518001", amount: 35000, issued_date: "2024-05-18", days_pending: 5 },
      { type: "UPI Transfer", ref_no: "UPI20240517001", amount: 45000, issued_date: "2024-05-17", days_pending: 6 },
    ];

    return res.status(200).json({
      success: true,
      data: {
        // Summary Cards
        summary: {
          cashInHand: cashBalance,
          bankBalance: bankBalance,
          totalLiquid: cashBalance + bankBalance,
          upiPending,
          checksPending,
        },

        // Today's summary
        today: {
          date: new Date().toISOString().split("T")[0],
          openingBalance: today.openingBalance,
          feeCollections: today.feeCollection,
          otherIncome: today.otherIncome,
          expenses: today.expenses,
          salaryPaid: today.salaryPaid,
          cashDeposit: today.bankDeposit,
          cashWithdrawal: today.bankWithdrawal,
          closingBalance: today.closingBalance,
        },

        // Collections breakdown
        collectionsBreakdown: {
          cash: dummyFeePayments.filter((p) => p.payment_mode === "Cash").length,
          upi: upiCollections,
          check: checkCollections,
          totalAmount: totalFeeCollections,
        },

        // Monthly trend
        monthlyTrend: monthlyStats,

        // Recent transactions
        recentTransactions,

        // Uncleared items for reconciliation
        unclearedItems,

        // Reconciliation summary
        reconciliation: {
          bookBalance: today.closingBalance,
          bankBalance: bankBalance,
          checksInTransit: unclearedItems
            .filter((i) => i.type === "Check")
            .reduce((sum, i) => sum + i.amount, 0),
          depositsInTransit: unclearedItems
            .filter((i) => i.type === "UPI Transfer")
            .reduce((sum, i) => sum + i.amount, 0),
          reconcileBalance:
            today.closingBalance -
            unclearedItems
              .filter((i) => i.type === "Check")
              .reduce((sum, i) => sum + i.amount, 0) +
            unclearedItems
              .filter((i) => i.type === "UPI Transfer")
              .reduce((sum, i) => sum + i.amount, 0),
        },
      },
    });
  } catch (err) {
    console.error("Cash/Bank API Error:", err);
    // Return dummy data for demo
    const today = dummyDailyCashbook[0];
    const totalFeeCollections = dummyFeePayments.reduce(
      (sum, p) => sum + p.paid_amount,
      0
    );
    const upiCollections = dummyFeePayments.filter(
      (p) => p.payment_mode === "Online"
    ).length;
    const checkCollections = dummyFeePayments.filter(
      (p) => p.payment_mode === "Check"
    ).length;

    const cashBalance = today.closingBalance * 0.4;
    const bankBalance = today.closingBalance * 0.6;

    const monthlyStats = dummyMonthlyData.map((m) => ({
      month: m.month,
      opening: m.bankBalance - (m.feeCollection + m.otherIncome - m.expenses - m.salary),
      closing: m.bankBalance,
      deposits: m.feeCollection + m.otherIncome,
      withdrawals: m.expenses + m.salary,
    }));

    const unclearedItems = [
      { type: "Check", ref_no: "CHK001234", amount: 45000, issued_date: "2024-05-20", days_pending: 3 },
      { type: "Check", ref_no: "CHK001235", amount: 40000, issued_date: "2024-05-19", days_pending: 4 },
      { type: "UPI Transfer", ref_no: "UPI20240518001", amount: 35000, issued_date: "2024-05-18", days_pending: 5 },
    ];

    return res.status(200).json({
      success: true,
      isDemo: true,
      data: {
        summary: {
          cashInHand: cashBalance,
          bankBalance: bankBalance,
          totalLiquid: cashBalance + bankBalance,
          upiPending: 125000,
          checksPending: 85000,
        },
        today: {
          date: new Date().toISOString().split("T")[0],
          openingBalance: today.openingBalance,
          feeCollections: today.feeCollection,
          otherIncome: today.otherIncome,
          expenses: today.expenses,
          salaryPaid: today.salaryPaid,
          cashDeposit: today.bankDeposit,
          cashWithdrawal: today.bankWithdrawal,
          closingBalance: today.closingBalance,
        },
        collectionsBreakdown: {
          cash: dummyFeePayments.filter((p) => p.payment_mode === "Cash").length,
          upi: upiCollections,
          check: checkCollections,
          totalAmount: totalFeeCollections,
        },
        monthlyTrend: monthlyStats,
        recentTransactions: dummyTransactions.slice(0, 15),
        unclearedItems,
        reconciliation: {
          bookBalance: today.closingBalance,
          bankBalance,
          checksInTransit: 85000,
          depositsInTransit: 125000,
          reconcileBalance: today.closingBalance - 85000 + 125000,
        },
      },
    });
  }
}
