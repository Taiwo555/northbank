"use client";

import Link from "next/link";
import BalanceCard from "@/components/BalanceCard";
import TxnList from "@/components/TxnList";
import { useStore } from "@/lib/store";
import { money } from "@/lib/format";
import { ACCOUNT } from "@/lib/seed";
import { IconArrowOut, IconSend } from "@/components/Icons";

export default function OverviewPage() {
  const { balance, txns, payees, incomingThisMonth, outgoingThisMonth, resetDemo } =
    useStore();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const scale = Math.max(incomingThisMonth + outgoingThisMonth, 1);

  return (
    <>
      <header className="pagehead">
        <div>
          <h1>
            {greeting}, {ACCOUNT.holder.split(" ")[0]}
          </h1>
          <p>Here&apos;s where your money is today.</p>
        </div>
      </header>

      <BalanceCard balance={balance} />

      <div className="stats">
        <div className="card card-pad">
          <div className="stat-label">Money in · this month</div>
          <div className="stat-value pos">{money(incomingThisMonth)}</div>
          <div className="stat-sub">Across {txns.filter((t) => t.type === "credit").length} credits</div>
        </div>
        <div className="card card-pad">
          <div className="stat-label">Money out · this month</div>
          <div className="stat-value">{money(outgoingThisMonth)}</div>
          <div className="stat-sub">Across {txns.filter((t) => t.type === "debit").length} payments</div>
        </div>
        <div className="card card-pad">
          <div className="stat-label">Saved recipients</div>
          <div className="stat-value">{payees.length}</div>
          <div className="stat-sub">Ready to send</div>
        </div>
      </div>

      <div className="grid-2">
        <section className="card">
          <div className="card-head">
            <h2>Recent activity</h2>
            <Link className="link" href="/transactions">
              View all
            </Link>
          </div>
          <TxnList txns={txns} limit={5} empty="No transactions yet — send your first payment." />
        </section>

        <section className="card card-pad">
          <h2 style={{ fontSize: 14.5, fontWeight: 620, letterSpacing: "-0.01em" }}>
            Quick actions
          </h2>
          <div className="actions" style={{ marginTop: 14 }}>
            <Link href="/transfer" className="btn btn-primary btn-block">
              <IconSend size={15} />
              Send money
            </Link>
            <Link href="/transactions" className="btn btn-ghost btn-block">
              <IconArrowOut size={15} />
              View statements
            </Link>
            <button className="btn btn-quiet btn-block" onClick={resetDemo} type="button">
              Reset data
            </button>
          </div>

          <div
            style={{
              marginTop: 20,
              paddingTop: 16,
              borderTop: "1px solid var(--line)",
            }}
          >
            <div className="stat-label">This month, in vs out</div>
            <div className="split-bar" role="img" aria-label={`${money(incomingThisMonth)} in, ${money(outgoingThisMonth)} out`}>
              <i
                className="in"
                style={{ width: `${(incomingThisMonth / scale) * 100}%` }}
              />
              <i
                className="out"
                style={{ width: `${(outgoingThisMonth / scale) * 100}%` }}
              />
            </div>
            <div className="stat-sub" style={{ marginTop: 7 }}>
              <span style={{ color: "var(--accent-dark)", fontWeight: 550 }}>
                {money(incomingThisMonth)} in
              </span>{" "}
              · {money(outgoingThisMonth)} out
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
