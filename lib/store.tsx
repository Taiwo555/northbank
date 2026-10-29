"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ACCOUNT, OPENING_BALANCE, SEED_PAYEES, SEED_TXNS } from "./seed";
import { reference, uid } from "./format";
import type { Payee, TransferInput, TransferResult, Txn } from "./types";

const STORAGE_KEY = "northbank.demo.v1";

type Persisted = {
  balance: number;
  txns: Txn[];
  payees: Payee[];
};

type StoreValue = Persisted & {
  ready: boolean;
  sendTransfer: (input: TransferInput) => TransferResult;
  resetDemo: () => void;
  outgoingThisMonth: number;
  incomingThisMonth: number;
};

const StoreContext = createContext<StoreValue | null>(null);

const fresh = (): Persisted => ({
  balance: OPENING_BALANCE,
  txns: SEED_TXNS,
  payees: SEED_PAYEES,
});

function load(): Persisted {
  if (typeof window === "undefined") return fresh();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fresh();
    const parsed = JSON.parse(raw) as Partial<Persisted>;
    if (
      typeof parsed.balance !== "number" ||
      !Array.isArray(parsed.txns) ||
      !Array.isArray(parsed.payees)
    ) {
      return fresh();
    }
    return {
      balance: parsed.balance,
      txns: parsed.txns,
      payees: parsed.payees,
    };
  } catch {
    return fresh();
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(fresh);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(load());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or blocked; demo keeps working in memory */
    }
  }, [state, ready]);

  const sendTransfer = useCallback((input: TransferInput): TransferResult => {
    const amount = Number(input.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return { ok: false, error: "Enter an amount greater than zero." };
    }
    if (Math.round(amount * 100) > Math.round(state.balance * 100)) {
      return { ok: false, error: "That's more than your available balance." };
    }
    if (!input.name.trim()) {
      return { ok: false, error: "Add a recipient name." };
    }
    const digits = input.account.replace(/\s+/g, "");
    if (digits.length < 6) {
      return { ok: false, error: "That account number looks too short." };
    }

    const txn: Txn = {
      id: uid(),
      type: "debit",
      amount: Math.round(amount * 100) / 100,
      counterparty: input.name.trim(),
      account: digits,
      note: input.note.trim() || undefined,
      category: "Transfer",
      status: "completed",
      createdAt: Date.now(),
      reference: reference(),
    };

    setState((prev) => {
      const known = prev.payees.some((p) => p.account === digits);
      const payees = known
        ? prev.payees
        : [
            {
              id: uid(),
              name: txn.counterparty,
              bank: input.bank.trim() || "External bank",
              account: digits,
            },
            ...prev.payees,
          ];
      return {
        balance: Math.round((prev.balance - txn.amount) * 100) / 100,
        txns: [txn, ...prev.txns],
        payees,
      };
    });

    return { ok: true, txn };
  }, [state.balance]);

  const resetDemo = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setState(fresh());
  }, []);

  const { outgoingThisMonth, incomingThisMonth } = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    let out = 0;
    let inc = 0;
    for (const t of state.txns) {
      if (t.createdAt < monthStart) continue;
      if (t.type === "debit") out += t.amount;
      else inc += t.amount;
    }
    return { outgoingThisMonth: out, incomingThisMonth: inc };
  }, [state.txns]);

  const value: StoreValue = {
    ...state,
    ready,
    sendTransfer,
    resetDemo,
    outgoingThisMonth,
    incomingThisMonth,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}

export { ACCOUNT };
