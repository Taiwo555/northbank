export type TxnType = "debit" | "credit";

export type Txn = {
  id: string;
  type: TxnType;
  amount: number;
  counterparty: string;
  account: string;
  note?: string;
  category: string;
  status: "completed" | "pending";
  createdAt: number;
  reference: string;
};

export type Payee = {
  id: string;
  name: string;
  bank: string;
  account: string;
};

export type TransferInput = {
  name: string;
  bank: string;
  account: string;
  amount: number;
  note: string;
};

export type TransferResult = {
  ok: boolean;
  error?: string;
  txn?: Txn;
};

export type Account = {
  holder: string;
  number: string;
  sortCode: string;
  currency: string;
};
