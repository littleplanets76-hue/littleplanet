/**
 * Report Data Utilities - Mock data and helper functions for Reports
 * This file contains fallback/mock data when real APIs are not available
 * and can be easily replaced with real data from backend APIs
 */

// Format currency in Indian Rupees
export function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

// Format count with Indian number system
export function formatCount(value) {
  return new Intl.NumberFormat("en-IN").format(Number(value) || 0);
}

// Safe percentage calculation
export function safePercent(value) {
  return Math.min(100, Math.max(0, Math.round(Number(value || 0))));
}

// Mock data for class-wise fee collection
export const mockClassWiseFeeCollection = [
  { class: "LKG", students: 24, totalDemand: 600000, collected: 480000, pending: 120000, collectionPercent: 80 },
  { class: "UKG", students: 28, totalDemand: 700000, collected: 630000, pending: 70000, collectionPercent: 90 },
  { class: "I", students: 32, totalDemand: 800000, collected: 720000, pending: 80000, collectionPercent: 90 },
  { class: "II", students: 35, totalDemand: 875000, collected: 700000, pending: 175000, collectionPercent: 80 },
  { class: "III", students: 30, totalDemand: 750000, collected: 600000, pending: 150000, collectionPercent: 80 },
];

// Mock data for pending fee students
export const mockPendingFeeStudents = [
  {
    studentName: "Arjun Kumar",
    class: "II",
    parentMobile: "98765-43210",
    totalFee: 87500,
    paid: 52500,
    pending: 35000,
    dueDays: 45,
  },
  {
    studentName: "Priya Singh",
    class: "III",
    parentMobile: "98765-43211",
    totalFee: 75000,
    paid: 50000,
    pending: 25000,
    dueDays: 30,
  },
  {
    studentName: "Rohan Patel",
    class: "I",
    parentMobile: "98765-43212",
    totalFee: 80000,
    paid: 40000,
    pending: 40000,
    dueDays: 60,
  },
  {
    studentName: "Ananya Desai",
    class: "LKG",
    parentMobile: "98765-43213",
    totalFee: 60000,
    paid: 30000,
    pending: 30000,
    dueDays: 75,
  },
];

// Mock data for admission summary
export const mockAdmissionSummary = [
  { class: "LKG", enquiries: 45, admissions: 24, feePaid: 15, pendingFee: 9, conversionPercent: 53 },
  { class: "UKG", enquiries: 52, admissions: 28, feePaid: 22, pendingFee: 6, conversionPercent: 54 },
  { class: "I", enquiries: 48, admissions: 32, feePaid: 28, pendingFee: 4, conversionPercent: 67 },
  { class: "II", enquiries: 55, admissions: 35, feePaid: 30, pendingFee: 5, conversionPercent: 64 },
];

// Mock data for new admissions this month
export const mockNewAdmissionsThisMonth = [
  { studentName: "Aditya Sharma", class: "I", parentName: "Rajesh Sharma", mobile: "98765-12345", admissionDate: "2026-05-15", feeStatus: "Paid" },
  { studentName: "Zara Khan", class: "LKG", parentName: "Ahmed Khan", mobile: "98765-12346", admissionDate: "2026-05-18", feeStatus: "Partial" },
  { studentName: "Vivaan Reddy", class: "UKG", parentName: "Suresh Reddy", mobile: "98765-12347", admissionDate: "2026-05-20", feeStatus: "Pending" },
];

// Mock data for expense breakdown
export const mockExpenseBreakdown = [
  { category: "Salary", amount: 500000 },
  { category: "Rent", amount: 80000 },
  { category: "Electricity", amount: 35000 },
  { category: "Bus", amount: 60000 },
  { category: "Maintenance", amount: 25000 },
  { category: "Stationery", amount: 15000 },
  { category: "Marketing", amount: 20000 },
  { category: "Others", amount: 10000 },
];

// Mock data for expense table
export const mockExpenseTable = [
  { date: "2026-05-20", category: "Salary", description: "May Monthly Salary", paymentMode: "Bank Transfer", amount: 500000, addedBy: "Admin" },
  { date: "2026-05-18", category: "Electricity", description: "May Bill", paymentMode: "Online", amount: 8500, addedBy: "Accountant" },
  { date: "2026-05-15", category: "Stationery", description: "Note Books & Pens", paymentMode: "Cash", amount: 5000, addedBy: "Admin" },
  { date: "2026-05-12", category: "Maintenance", description: "Classroom Repairs", paymentMode: "Check", amount: 12000, addedBy: "Principal" },
];

// Mock data for monthly income vs expense summary
export const mockMonthlyIncomeExpense = [
  { month: "January", feeCollection: 350000, otherIncome: 25000, expenses: 150000, salary: 500000, netBalance: -275000, bankBalance: 125000 },
  { month: "February", feeCollection: 380000, otherIncome: 30000, expenses: 155000, salary: 500000, netBalance: -245000, bankBalance: 165000 },
  { month: "March", feeCollection: 400000, otherIncome: 35000, expenses: 160000, salary: 500000, netBalance: -225000, bankBalance: 205000 },
  { month: "April", feeCollection: 420000, otherIncome: 40000, expenses: 165000, salary: 500000, netBalance: -205000, bankBalance: 245000 },
  { month: "May", feeCollection: 430000, otherIncome: 45000, expenses: 170000, salary: 500000, netBalance: -195000, bankBalance: 285000 },
];

// Mock data for staff payroll
export const mockStaffPayroll = [
  { name: "Ms. Priya Sharma", role: "Principal", monthlySalary: 80000, paid: 80000, pending: 0, status: "Paid" },
  { name: "Mr. Rajesh Kumar", role: "Vice Principal", monthlySalary: 60000, paid: 60000, pending: 0, status: "Paid" },
  { name: "Ms. Anjali Singh", role: "Class I Teacher", monthlySalary: 35000, paid: 35000, pending: 0, status: "Paid" },
  { name: "Mr. Vikram Patel", role: "Math Teacher", monthlySalary: 40000, paid: 0, pending: 40000, status: "Pending" },
  { name: "Ms. Neha Desai", role: "English Teacher", monthlySalary: 38000, paid: 0, pending: 38000, status: "Pending" },
];

// Mock data for class-wise student strength
export const mockClassWiseStudentStrength = [
  { class: "LKG", boys: 14, girls: 10, total: 24, active: 23, tcLeft: 1 },
  { class: "UKG", boys: 16, girls: 12, total: 28, active: 27, tcLeft: 1 },
  { class: "I", boys: 18, girls: 14, total: 32, active: 31, tcLeft: 1 },
  { class: "II", boys: 20, girls: 15, total: 35, active: 34, tcLeft: 1 },
  { class: "III", boys: 17, girls: 13, total: 30, active: 29, tcLeft: 1 },
];

// Mock data for daily cashbook - Daily transaction logs
export const mockDailyCashbook = [
  {
    date: "2026-05-22",
    dayName: "Today",
    openingBalance: 150000,
    feeCollection: 45000,
    otherIncome: 2500,
    expenses: 15000,
    salaryPaid: 0,
    bankDeposit: 30000,
    bankWithdrawal: 0,
    closingBalance: 152500,
  },
  {
    date: "2026-05-21",
    dayName: "Yesterday",
    openingBalance: 142000,
    feeCollection: 35000,
    otherIncome: 3000,
    expenses: 18000,
    salaryPaid: 0,
    bankDeposit: 25000,
    bankWithdrawal: 5000,
    closingBalance: 150000,
  },
  {
    date: "2026-05-20",
    dayName: "2 days ago",
    openingBalance: 168000,
    feeCollection: 28000,
    otherIncome: 2000,
    expenses: 30000,
    salaryPaid: 50000,
    bankDeposit: 20000,
    bankWithdrawal: 10000,
    closingBalance: 142000,
  },
  {
    date: "2026-05-19",
    dayName: "3 days ago",
    openingBalance: 185000,
    feeCollection: 32000,
    otherIncome: 4000,
    expenses: 22000,
    salaryPaid: 0,
    bankDeposit: 15000,
    bankWithdrawal: 8000,
    closingBalance: 168000,
  },
  {
    date: "2026-05-18",
    dayName: "4 days ago",
    openingBalance: 198000,
    feeCollection: 25000,
    otherIncome: 3000,
    expenses: 28000,
    salaryPaid: 0,
    bankDeposit: 12000,
    bankWithdrawal: 3000,
    closingBalance: 185000,
  },
];

// Calculate action required alerts
export function calculateActionAlerts(data) {
  const alerts = [];

  // Pending fees alert
  if (data.pendingFees > 0) {
    alerts.push({
      type: "warning",
      title: "Pending Fees",
      value: formatCurrency(data.pendingFees),
      description: `${data.pendingFees > 500000 ? "High" : "Medium"} priority - Collect overdue fees`,
      action: "View Defaulters",
    });
  }

  // Salary pending alert
  if (data.salaryPending > 0) {
    alerts.push({
      type: "error",
      title: "Salary Pending",
      value: formatCurrency(data.salaryPending),
      description: "Staff salary payment pending",
      action: "Process Payroll",
    });
  }

  // Cash shortage alert
  if (data.netBalance < 0) {
    alerts.push({
      type: "error",
      title: "Cash Shortage",
      value: formatCurrency(Math.abs(data.netBalance)),
      description: "Expenses exceed collections today",
      action: "View Cashbook",
    });
  }

  // Admissions alert
  if (data.newAdmissionsThisMonth > 0) {
    alerts.push({
      type: "info",
      title: "New Admissions",
      value: `${data.newAdmissionsThisMonth}`,
      description: "Follow-up required for pending fee students",
      action: "View Admissions",
    });
  }

  return alerts;
}

// Generate WhatsApp message for fee reminder
export function generateWhatsAppMessage(studentName, pendingAmount) {
  return `Dear Parent, this is a gentle reminder that ₹${formatCurrency(pendingAmount).replace("₹", "")} fee is pending for ${studentName}. Kindly clear it at the earliest. Thank you.`;
}

// Generate daily cashbook summary
export function generateCashbookSummary(dailyCashbookData) {
  if (!dailyCashbookData || dailyCashbookData.length === 0) return null;
  
  const today = dailyCashbookData[0];
  const totalBankBalance = 285000; // Dummy bank balance
  const cashInHand = today.closingBalance;
  
  return {
    openingBalance: today.openingBalance,
    feeCollection: today.feeCollection,
    otherIncome: today.otherIncome,
    expenses: today.expenses,
    salaryPaid: today.salaryPaid,
    bankDeposit: today.bankDeposit || 0,
    bankWithdrawal: today.bankWithdrawal || 0,
    closingBalance: today.closingBalance,
    bankBalance: totalBankBalance,
    cashInHand: cashInHand,
    status: today.closingBalance < 50000 ? "low" : today.closingBalance < 100000 ? "medium" : "good",
  };
}
