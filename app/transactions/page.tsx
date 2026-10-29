"use client";

import { useMemo, useState } from "react";
import TxnList from "@/components/TxnList";
import { useStore } from "@/lib/store";
import { money } from "@/lib/format";

type Filter = "all" | "in" | "out";

export default function TransactionsPage() {
  const { txns, incomingThisMonth, outgoingThisMonth } = useStore();
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return txns.filter((t) => {
      if (filter === "in" && t.type !== "credit") return false;
      if (filter === "out" && t.type !== "debit") return false;
      if (!needle) return true;
      return (
        t.counterparty.toLowerCase().includes(needle) ||
        (t.note ?? "").toLowerCase().includes(needle) ||
        t.reference.toLowerCase().includes(needle)
      );
    });
  }, [txns, filter, q]);

  return (
    <>
      <header className="pagehead">
        <div>
          <h1>Transactions</h1>
          <p>Every movement on this account.</p>
        </div>
        <span className="chip">
          <span className="chip-dot" />
          {txns.length} records
        </span>
      </header>

      <div className="stats" style={{ marginBottom: 20 }}>
        <div className="card card-pad">
          <div className="stat-label">In · this month</div>
          <div className="stat-value pos">{money(incomingThisMonth)}</div>
        </div>
        <div className="card card-pad">
          <div className="stat-label">Out · this month</div>
          <div className="stat-value">{money(outgoingThisMonth)}</div>
        </div>
        <div className="card card-pad">
          <div className="stat-label">Net</div>
          <div className="stat-value">{money(incomingThisMonth - outgoingThisMonth)}</div>
        </div>
      </div>

      <section className="card">
        <div className="toolbar">
          <div className="segmented" role="tablist" aria-label="Filter transactions">
            {(
              [
                ["all", "All"],
                ["in", "Money in"],
                ["out", "Money out"],
              ] as [Filter, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={filter === key}
                className={filter === key ? "on" : ""}
                onClick={() => setFilter(key)}
              >
                {label}
              </button>
            ))}
          </div>
          <input
            className="search"
            placeholder="Search name, note or reference"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search transactions"
          />
        </div>

        <TxnList txns={rows} empty="No transactions match that filter." />
      </section>
    </>
  );
}
