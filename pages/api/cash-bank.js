import { Pool } from "pg";
import { createPoolOptions } from "@/lib/postgresConfig";

const pool =
  global.pgPool ||
  new Pool(createPoolOptions({
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
  }));

if (!global.pgPool) global.pgPool = pool;

function toNumber(value) {
  return Number(value || 0);
}

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ success: false, error: "Method not allowed" });
    }

    const [todayResult, breakdownResult, monthlyResult, recentResult] = await Promise.all([
      pool.query(`
        SELECT
          COALESCE((SELECT SUM(amount_paid) FROM public.fee_payments WHERE payment_date = CURRENT_DATE), 0)::numeric AS fee_collections,
          COALESCE((SELECT SUM(amount) FROM public.expenses WHERE date = CURRENT_DATE), 0)::numeric AS expenses,
          COALESCE((
            SELECT SUM(net_salary)
            FROM public.payroll
            WHERE payment_status = 'PAID' AND payment_date = CURRENT_DATE
          ), 0)::numeric AS salary_paid,
          COALESCE((SELECT SUM(amount_paid) FROM public.fee_payments), 0)::numeric AS total_collections,
          COALESCE((SELECT SUM(amount) FROM public.expenses), 0)::numeric AS total_expenses,
          COALESCE((SELECT SUM(net_salary) FROM public.payroll WHERE payment_status = 'PAID'), 0)::numeric AS total_salary_paid
      `),
      pool.query(`
        SELECT
          COALESCE(NULLIF(LOWER(TRIM(payment_mode)), ''), 'unknown') AS mode,
          COUNT(*)::int AS count,
          COALESCE(SUM(amount_paid), 0)::numeric AS amount
        FROM public.fee_payments
        GROUP BY COALESCE(NULLIF(LOWER(TRIM(payment_mode)), ''), 'unknown')
      `),
      pool.query(`
        SELECT
          TO_CHAR(month_key, 'Mon YYYY') AS month,
          TO_CHAR(month_key, 'YYYY-MM') AS month_key,
          COALESCE(SUM(collections), 0)::numeric AS deposits,
          COALESCE(SUM(outflows), 0)::numeric AS withdrawals,
          COALESCE(SUM(collections), 0) - COALESCE(SUM(outflows), 0) AS closing
        FROM (
          SELECT DATE_TRUNC('month', payment_date)::date AS month_key, SUM(amount_paid) AS collections, 0::numeric AS outflows
          FROM public.fee_payments
          GROUP BY DATE_TRUNC('month', payment_date)::date
          UNION ALL
          SELECT DATE_TRUNC('month', date)::date AS month_key, 0::numeric AS collections, SUM(amount) AS outflows
          FROM public.expenses
          GROUP BY DATE_TRUNC('month', date)::date
          UNION ALL
          SELECT DATE_TRUNC('month', payment_date)::date AS month_key, 0::numeric AS collections, SUM(net_salary) AS outflows
          FROM public.payroll
          WHERE payment_status = 'PAID' AND payment_date IS NOT NULL
          GROUP BY DATE_TRUNC('month', payment_date)::date
        ) activity
        GROUP BY month_key
        ORDER BY month_key ASC
        LIMIT 12
      `),
      pool.query(`
        SELECT
          id,
          receipt_no AS ref_no,
          amount_paid AS amount,
          payment_mode,
          payment_date AS date,
          'Fee Collection' AS type
        FROM public.fee_payments
        ORDER BY payment_date DESC, id DESC
        LIMIT 15
      `),
    ]);

    const today = todayResult.rows[0] || {};
    const totalCollections = toNumber(today.total_collections);
    const totalExpenses = toNumber(today.total_expenses);
    const totalSalaryPaid = toNumber(today.total_salary_paid);
    const closingBalance = totalCollections - totalExpenses - totalSalaryPaid;

    const breakdown = breakdownResult.rows.reduce(
      (accumulator, row) => {
        const mode = String(row.mode || "").toLowerCase();
        if (mode.includes("cash")) accumulator.cash += Number(row.count || 0);
        if (mode.includes("upi") || mode.includes("online")) accumulator.upi += Number(row.count || 0);
        if (mode.includes("check") || mode.includes("cheque")) accumulator.check += Number(row.count || 0);
        accumulator.totalAmount += toNumber(row.amount);
        return accumulator;
      },
      { cash: 0, upi: 0, check: 0, totalAmount: 0 }
    );

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          cashInHand: closingBalance,
          bankBalance: 0,
          totalLiquid: closingBalance,
          upiPending: 0,
          checksPending: 0,
        },
        today: {
          date: new Date().toISOString().split("T")[0],
          openingBalance: 0,
          feeCollections: toNumber(today.fee_collections),
          otherIncome: 0,
          expenses: toNumber(today.expenses),
          salaryPaid: toNumber(today.salary_paid),
          cashDeposit: 0,
          cashWithdrawal: 0,
          closingBalance,
        },
        collectionsBreakdown: breakdown,
        monthlyTrend: monthlyResult.rows.map((row) => ({
          month: row.month,
          month_key: row.month_key,
          openingBalance: 0,
          deposits: toNumber(row.deposits),
          withdrawals: toNumber(row.withdrawals),
          closing: toNumber(row.closing),
        })),
        recentTransactions: recentResult.rows,
        unclearedItems: [],
        reconciliation: {
          bookBalance: closingBalance,
          bankBalance: 0,
          checksInTransit: 0,
          depositsInTransit: 0,
          reconcileBalance: closingBalance,
        },
      },
    });
  } catch (err) {
    console.error("Cash/Bank API Error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
