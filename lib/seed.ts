import type { Account, Payee, Txn } from "./types";

export const OPENING_BALANCE = 500_000;

export const ACCOUNT: Account = {
  holder: "Alex Morgan",
  number: "4417 0932 8841",
  sortCode: "04-29-18",
  currency: "USD",
};

const day = 86_400_000;
const now = Date.now();

export const SEED_PAYEES: Payee[] = [
  { id: "p1", name: "Marina Apartments", bank: "Chase", account: "8830194472" },
  { id: "p2", name: "Halden Studio", bank: "Bank of America", account: "5510823319" },
  { id: "p3", name: "Priya Raman", bank: "Wells Fargo", account: "2290471188" },
  { id: "p4", name: "Northline Payroll", bank: "Citibank", account: "7740132265" },
];

export const SEED_TXNS: Txn[] = [
  {
    id: "t1",
    type: "credit",
    amount: 12_450,
    counterparty: "Halden Studio",
    account: "5510823319",
    note: "Invoice #2261 — Q3 design retainer",
    category: "Income",
    status: "completed",
    createdAt: now - day * 1 - 3.4 * 3_600_000,
    reference: "NB-7K2M9XQ4RT",
  },
  {
    id: "t2",
    type: "debit",
    amount: 3_200,
    counterparty: "Marina Apartments",
    account: "8830194472",
    note: "Monthly rent",
    category: "Housing",
    status: "completed",
    createdAt: now - day * 2 - 1.1 * 3_600_000,
    reference: "NB-4B8N2LZ7QP",
  },
  {
    id: "t3",
    type: "debit",
    amount: 842.16,
    counterparty: "Amazon Web Services",
    account: "1100293847",
    note: "Cloud hosting — September",
    category: "Software",
    status: "completed",
    createdAt: now - day * 3 - 6.2 * 3_600_000,
    reference: "NB-9F3P6YH2MN",
  },
  {
    id: "t4",
    type: "credit",
    amount: 8_000,
    counterparty: "Priya Raman",
    account: "2290471188",
    note: "Loan repayment — tranche 2",
    category: "Transfer",
    status: "completed",
    createdAt: now - day * 5 - 2.7 * 3_600_000,
    reference: "NB-2Q7V4XC8LK",
  },
  {
    id: "t5",
    type: "debit",
    amount: 9_600,
    counterparty: "Northline Payroll",
    account: "7740132265",
    note: "Contractor payroll — 4 people",
    category: "Payroll",
    status: "completed",
    createdAt: now - day * 6 - 4.9 * 3_600_000,
    reference: "NB-6D1W8JR3TB",
  },
  {
    id: "t6",
    type: "debit",
    amount: 129.99,
    counterparty: "Figma",
    account: "4400918233",
    note: "Annual plan renewal",
    category: "Software",
    status: "completed",
    createdAt: now - day * 8 - 5.3 * 3_600_000,
    reference: "NB-8A5E2NK9YU",
  },
];
