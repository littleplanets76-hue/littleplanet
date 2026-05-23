// Production-ready dummy data for accountant dashboard demo

export const dummyStudents = [
  { id: 1, name: "Aaryan Singh", class: "10", father_name: "Rajesh Singh", father_mobile: "9876543210", status: "Active" },
  { id: 2, name: "Bhavna Sharma", class: "9", father_name: "Amit Sharma", father_mobile: "9876543211", status: "Active" },
  { id: 3, name: "Chirag Patel", class: "10", father_name: "Vikram Patel", father_mobile: "9876543212", status: "Active" },
  { id: 4, name: "Diya Verma", class: "8", father_name: "Ajay Verma", father_mobile: "9876543213", status: "Active" },
  { id: 5, name: "Esha Reddy", class: "9", father_name: "Suresh Reddy", father_mobile: "9876543214", status: "Active" },
  { id: 6, name: "Fikri Khan", class: "10", father_name: "Ahmed Khan", father_mobile: "9876543215", status: "Active" },
  { id: 7, name: "Gagan Arora", class: "8", father_name: "Rohit Arora", father_mobile: "9876543216", status: "Active" },
  { id: 8, name: "Hina Desai", class: "9", father_name: "Pratik Desai", father_mobile: "9876543217", status: "Active" },
  { id: 9, name: "Ishan Jain", class: "10", father_name: "Nikhil Jain", father_mobile: "9876543218", status: "Active" },
  { id: 10, name: "Jasmine Roy", class: "8", father_name: "Sumit Roy", father_mobile: "9876543219", status: "Active" },
  { id: 11, name: "Karan Malhotra", class: "9", father_name: "Vivek Malhotra", father_mobile: "9876543220", status: "Active" },
  { id: 12, name: "Lavanya Rao", class: "10", father_name: "Venkat Rao", father_mobile: "9876543221", status: "Active" },
  { id: 13, name: "Manish Kumar", class: "8", father_name: "Rajendra Kumar", father_mobile: "9876543222", status: "Active" },
  { id: 14, name: "Neha Gupta", class: "9", father_name: "Anil Gupta", father_mobile: "9876543223", status: "Active" },
  { id: 15, name: "Ojas Nair", class: "10", father_name: "Suresh Nair", father_mobile: "9876543224", status: "Active" },
];

export const dummyAdmissions = [
  { id: 1, student_name: "Aaryan Singh", class: "10", fees: 75000, status: "Confirmed", admission_date: "2024-01-15" },
  { id: 2, student_name: "Bhavna Sharma", class: "9", fees: 65000, status: "Confirmed", admission_date: "2024-01-18" },
  { id: 3, student_name: "Chirag Patel", class: "10", fees: 75000, status: "Confirmed", admission_date: "2024-02-01" },
  { id: 4, student_name: "Diya Verma", class: "8", fees: 55000, status: "Confirmed", admission_date: "2024-02-10" },
  { id: 5, student_name: "Esha Reddy", class: "9", fees: 65000, status: "Confirmed", admission_date: "2024-02-15" },
  { id: 6, student_name: "Fikri Khan", class: "10", fees: 75000, status: "Confirmed", admission_date: "2024-03-01" },
  { id: 7, student_name: "Gagan Arora", class: "8", fees: 55000, status: "Confirmed", admission_date: "2024-03-05" },
  { id: 8, student_name: "Hina Desai", class: "9", fees: 65000, status: "Confirmed", admission_date: "2024-03-12" },
  { id: 9, student_name: "Ishan Jain", class: "10", fees: 75000, status: "Confirmed", admission_date: "2024-03-20" },
  { id: 10, student_name: "Jasmine Roy", class: "8", fees: 55000, status: "Confirmed", admission_date: "2024-04-01" },
  { id: 11, student_name: "Karan Malhotra", class: "9", fees: 65000, status: "Confirmed", admission_date: "2024-04-08" },
  { id: 12, student_name: "Lavanya Rao", class: "10", fees: 75000, status: "Confirmed", admission_date: "2024-04-15" },
  { id: 13, student_name: "Manish Kumar", class: "8", fees: 55000, status: "Confirmed", admission_date: "2024-05-01" },
  { id: 14, student_name: "Neha Gupta", class: "9", fees: 65000, status: "Confirmed", admission_date: "2024-05-10" },
  { id: 15, student_name: "Ojas Nair", class: "10", fees: 75000, status: "Confirmed", admission_date: "2024-05-18" },
];

export const dummyFeePayments = [
  { id: 1, receipt_no: "RCP001", student_name: "Aaryan Singh", admission_id: 1, total_fee: 75000, paid_amount: 75000, balance: 0, payment_mode: "Online", payment_date: "2024-01-20", collected_by: "Rajesh" },
  { id: 2, receipt_no: "RCP002", student_name: "Bhavna Sharma", admission_id: 2, total_fee: 65000, paid_amount: 35000, balance: 30000, payment_mode: "Check", payment_date: "2024-02-15", collected_by: "Priya" },
  { id: 3, receipt_no: "RCP003", student_name: "Chirag Patel", admission_id: 3, total_fee: 75000, paid_amount: 45000, balance: 30000, payment_mode: "Cash", payment_date: "2024-02-20", collected_by: "Rajesh" },
  { id: 4, receipt_no: "RCP004", student_name: "Diya Verma", admission_id: 4, total_fee: 55000, paid_amount: 55000, balance: 0, payment_mode: "Online", payment_date: "2024-02-25", collected_by: "Priya" },
  { id: 5, receipt_no: "RCP005", student_name: "Esha Reddy", admission_id: 5, total_fee: 65000, paid_amount: 30000, balance: 35000, payment_mode: "Check", payment_date: "2024-03-10", collected_by: "Rajesh" },
  { id: 6, receipt_no: "RCP006", student_name: "Fikri Khan", admission_id: 6, total_fee: 75000, paid_amount: 75000, balance: 0, payment_mode: "Online", payment_date: "2024-03-15", collected_by: "Priya" },
  { id: 7, receipt_no: "RCP007", student_name: "Gagan Arora", admission_id: 7, total_fee: 55000, paid_amount: 25000, balance: 30000, payment_mode: "Cash", payment_date: "2024-03-18", collected_by: "Rajesh" },
  { id: 8, receipt_no: "RCP008", student_name: "Hina Desai", admission_id: 8, total_fee: 65000, paid_amount: 65000, balance: 0, payment_mode: "Online", payment_date: "2024-03-25", collected_by: "Priya" },
  { id: 9, receipt_no: "RCP009", student_name: "Ishan Jain", admission_id: 9, total_fee: 75000, paid_amount: 40000, balance: 35000, payment_mode: "Check", payment_date: "2024-04-05", collected_by: "Rajesh" },
  { id: 10, receipt_no: "RCP010", student_name: "Jasmine Roy", admission_id: 10, total_fee: 55000, paid_amount: 55000, balance: 0, payment_mode: "Online", payment_date: "2024-04-10", collected_by: "Priya" },
  { id: 11, receipt_no: "RCP011", student_name: "Karan Malhotra", admission_id: 11, total_fee: 65000, paid_amount: 32000, balance: 33000, payment_mode: "Cash", payment_date: "2024-04-15", collected_by: "Rajesh" },
  { id: 12, receipt_no: "RCP012", student_name: "Lavanya Rao", admission_id: 12, total_fee: 75000, paid_amount: 75000, balance: 0, payment_mode: "Online", payment_date: "2024-04-20", collected_by: "Priya" },
  { id: 13, receipt_no: "RCP013", student_name: "Manish Kumar", admission_id: 13, total_fee: 55000, paid_amount: 28000, balance: 27000, payment_mode: "Check", payment_date: "2024-05-05", collected_by: "Rajesh" },
  { id: 14, receipt_no: "RCP014", student_name: "Neha Gupta", admission_id: 14, total_fee: 65000, paid_amount: 65000, balance: 0, payment_mode: "Online", payment_date: "2024-05-12", collected_by: "Priya" },
  { id: 15, receipt_no: "RCP015", student_name: "Ojas Nair", admission_id: 15, total_fee: 75000, paid_amount: 50000, balance: 25000, payment_mode: "Online", payment_date: "2024-05-18", collected_by: "Rajesh" },
];

export const dummyExpenses = [
  { id: 1, date: "2024-05-20", category: "Utilities", title: "Electricity Bill", amount: 12500, payment_mode: "Online", added_by: "Admin" },
  { id: 2, date: "2024-05-20", category: "Maintenance", title: "Classroom Repairs", amount: 8000, payment_mode: "Cash", added_by: "Maintenance" },
  { id: 3, date: "2024-05-19", category: "Supplies", title: "Stationery & Books", amount: 15000, payment_mode: "Check", added_by: "Admin" },
  { id: 4, date: "2024-05-19", category: "Utilities", title: "Water Bill", amount: 3500, payment_mode: "Online", added_by: "Admin" },
  { id: 5, date: "2024-05-18", category: "Transport", title: "Bus Maintenance", amount: 5000, payment_mode: "Cash", added_by: "Transport" },
  { id: 6, date: "2024-05-18", category: "Insurance", title: "Building Insurance", amount: 25000, payment_mode: "Check", added_by: "Admin" },
  { id: 7, date: "2024-05-17", category: "Laboratory", title: "Lab Equipment", amount: 35000, payment_mode: "Online", added_by: "Science Dept" },
  { id: 8, date: "2024-05-17", category: "Supplies", title: "Cleaning Materials", amount: 4000, payment_mode: "Cash", added_by: "Maintenance" },
  { id: 9, date: "2024-05-16", category: "Events", title: "Sports Meet", amount: 20000, payment_mode: "Cash", added_by: "Admin" },
  { id: 10, date: "2024-05-16", category: "Utilities", title: "Internet & Phone", amount: 5000, payment_mode: "Online", added_by: "IT" },
];

export const dummyPayroll = [
  { id: 1, staff_name: "Priya Sharma", position: "Principal", gross_salary: 75000, deductions: 7500, net_salary: 67500, status: "Paid", payment_date: "2024-05-25" },
  { id: 2, staff_name: "Rajesh Kumar", position: "Accountant", gross_salary: 35000, deductions: 3500, net_salary: 31500, status: "Paid", payment_date: "2024-05-25" },
  { id: 3, staff_name: "Meera Singh", position: "English Teacher", gross_salary: 32000, deductions: 3200, net_salary: 28800, status: "Paid", payment_date: "2024-05-25" },
  { id: 4, staff_name: "Arun Patel", position: "Math Teacher", gross_salary: 32000, deductions: 3200, net_salary: 28800, status: "Paid", payment_date: "2024-05-25" },
  { id: 5, staff_name: "Sanjana Gupta", position: "Science Teacher", gross_salary: 32000, deductions: 3200, net_salary: 28800, status: "Paid", payment_date: "2024-05-25" },
  { id: 6, staff_name: "Vikram Singh", position: "Sports Coach", gross_salary: 28000, deductions: 2800, net_salary: 25200, status: "Paid", payment_date: "2024-05-25" },
  { id: 7, staff_name: "Anita Desai", position: "Librarian", gross_salary: 28000, deductions: 2800, net_salary: 25200, status: "Pending", payment_date: "2024-06-01" },
  { id: 8, staff_name: "Ramesh Kumar", position: "Maintenance Staff", gross_salary: 18000, deductions: 1800, net_salary: 16200, status: "Pending", payment_date: "2024-06-01" },
];

export const dummyTransactions = [
  { id: 1, date: "2024-05-23", type: "Fee Collection", description: "Fee received from Aaryan Singh", amount: 75000, balance_after: 825000, payment_mode: "Online" },
  { id: 2, date: "2024-05-23", type: "Expense", description: "Electricity bill payment", amount: -12500, balance_after: 812500, payment_mode: "Online" },
  { id: 3, date: "2024-05-22", type: "Fee Collection", description: "Fee received from Jasmine Roy", amount: 55000, balance_after: 825000, payment_mode: "Online" },
  { id: 4, date: "2024-05-22", type: "Expense", description: "Lab equipment purchase", amount: -35000, balance_after: 790000, payment_mode: "Online" },
  { id: 5, date: "2024-05-21", type: "Salary Payment", description: "Staff payroll May", amount: -305300, balance_after: 825300, payment_mode: "Check" },
  { id: 6, date: "2024-05-21", type: "Fee Collection", description: "Fee received from Ojas Nair", amount: 50000, balance_after: 1130600, payment_mode: "Online" },
  { id: 7, date: "2024-05-20", type: "Expense", description: "Insurance renewal", amount: -25000, balance_after: 1080600, payment_mode: "Check" },
  { id: 8, date: "2024-05-20", type: "Fee Collection", description: "Fee received from Lavanya Rao", amount: 75000, balance_after: 1105600, payment_mode: "Online" },
];

export const dummyDailyCashbook = [
  { dayName: "Today", date: "23-05-2024", openingBalance: 750000, feeCollection: 75000, otherIncome: 5000, expenses: 12500, salaryPaid: 0, bankDeposit: 50000, bankWithdrawal: 0, closingBalance: 767500 },
  { dayName: "Yesterday", date: "22-05-2024", openingBalance: 680000, feeCollection: 55000, otherIncome: 2000, expenses: 35000, salaryPaid: 0, bankDeposit: 55000, bankWithdrawal: 0, closingBalance: 757000 },
  { dayName: "23-05-2024", date: "21-05-2024", openingBalance: 630000, feeCollection: 50000, otherIncome: 3000, expenses: 0, salaryPaid: 305300, bankDeposit: 0, bankWithdrawal: 50000, closingBalance: 327700 },
  { dayName: "24-05-2024", date: "20-05-2024", openingBalance: 352700, feeCollection: 75000, otherIncome: 0, expenses: 25000, salaryPaid: 0, bankDeposit: 0, bankWithdrawal: 0, closingBalance: 402700 },
  { dayName: "25-05-2024", date: "19-05-2024", openingBalance: 340000, feeCollection: 62000, otherIncome: 1200, expenses: 8000, salaryPaid: 0, bankDeposit: 75000, bankWithdrawal: 15000, closingBalance: 405200 },
];

export const dummyMonthlyData = [
  { month: "January", feeCollection: 320000, otherIncome: 15000, expenses: 145000, salary: 275000, netBalance: -85000, bankBalance: 450000 },
  { month: "February", feeCollection: 380000, otherIncome: 18000, expenses: 156000, salary: 275000, netBalance: -33000, bankBalance: 485000 },
  { month: "March", feeCollection: 420000, otherIncome: 20000, expenses: 168000, salary: 275000, netBalance: -3000, bankBalance: 510000 },
  { month: "April", feeCollection: 450000, otherIncome: 25000, expenses: 172000, salary: 275000, netBalance: 28000, bankBalance: 545000 },
  { month: "May", feeCollection: 475000, otherIncome: 30000, expenses: 181000, salary: 275000, netBalance: 49000, bankBalance: 580000 },
  { month: "June (Est.)", feeCollection: 480000, otherIncome: 28000, expenses: 185000, salary: 275000, netBalance: 48000, bankBalance: 620000 },
];

export function getDummyReportsData() {
  const totalAdmissions = dummyAdmissions.length;
  const totalFees = dummyAdmissions.reduce((sum, a) => sum + a.fees, 0);
  const totalCollected = dummyFeePayments.reduce((sum, p) => sum + p.paid_amount, 0);
  const totalExpenses = dummyExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalSalaries = dummyPayroll.filter(p => p.status === "Paid").reduce((sum, p) => sum + p.net_salary, 0);
  const pendingFees = totalFees - totalCollected;

  return {
    totalStudents: dummyStudents.length,
    totalAdmissions,
    totalFees,
    totalCollected,
    pendingFees,
    todayCollection: 75000,
    expenses: totalExpenses,
    salaries: totalSalaries,
    netSurplus: totalCollected - totalExpenses - totalSalaries,
    totalAssets: 42,
    assetValue: 2850000,
    newAdmissionsThisMonth: 5,

    // Reports
    monthlyCollections: [
      { month: "Jan 2024", amount: 320000 },
      { month: "Feb 2024", amount: 380000 },
      { month: "Mar 2024", amount: 420000 },
      { month: "Apr 2024", amount: 450000 },
      { month: "May 2024", amount: 475000 },
    ],
    expenseBreakdown: [
      { category: "Salaries", amount: totalSalaries },
      { category: "Utilities", amount: 21000 },
      { category: "Maintenance", amount: 8000 },
      { category: "Supplies", amount: 19000 },
      { category: "Insurance", amount: 25000 },
      { category: "Laboratory", amount: 35000 },
      { category: "Transport", amount: 5000 },
      { category: "Events", amount: 20000 },
    ],
    classWiseFees: [
      { class: "8", students: 5, collected: 115000, pending: 160000, totalDemand: 275000 },
      { class: "9", students: 5, collected: 162000, pending: 163000, totalDemand: 325000 },
      { class: "10", students: 5, collected: 265000, pending: 110000, totalDemand: 375000 },
    ],
    pendingStudents: dummyFeePayments.filter(p => p.balance > 0).map(p => ({
      admission_id: p.admission_id,
      student_name: p.student_name,
      class: dummyAdmissions.find(a => a.id === p.admission_id)?.class || "N/A",
      father_name: "Parent",
      total_fee: p.total_fee,
      paid_amount: p.paid_amount,
      balance_amount: p.balance,
    })),
    recentPayments: dummyFeePayments.slice(0, 10),
  };
}

export default {
  dummyStudents,
  dummyAdmissions,
  dummyFeePayments,
  dummyExpenses,
  dummyPayroll,
  dummyTransactions,
  dummyDailyCashbook,
  dummyMonthlyData,
  getDummyReportsData,
};
