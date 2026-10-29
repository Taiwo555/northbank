"use client";

import TransferForm from "@/components/TransferForm";
import { useStore } from "@/lib/store";
import { money } from "@/lib/format";

export default function TransferPage() {
  const { balance } = useStore();

  return (
    <>
      <header className="pagehead">
        <div>
          <h1>Send money</h1>
          <p>Move funds to any account.</p>
        </div>
      </header>

      <div className="grid-2">
        <TransferForm />

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <section className="card card-pad">
            <div className="stat-label">Available balance</div>
            <div className="stat-value" style={{ fontSize: 26 }}>
              {money(balance)}
            </div>
            <div className="stat-sub" style={{ marginTop: 8 }}>
              Northbank · account ending 8841
            </div>

            <div
              style={{
                marginTop: 18,
                paddingTop: 16,
                borderTop: "1px solid var(--line)",
                display: "flex",
                flexDirection: "column",
                gap: 11,
              }}
            >
              <div className="review-row">
                <span>Transfer fee</span>
                <strong>{money(0)}</strong>
              </div>
              <div className="review-row">
                <span>Arrival</span>
                <strong>Instant</strong>
              </div>
              <div className="review-row">
                <span>Currency</span>
                <strong>USD</strong>
              </div>
              <div className="review-row">
                <span>Reference</span>
                <strong>Generated on send</strong>
              </div>
            </div>
          </section>

          <section className="card card-pad">
            <h2 style={{ fontSize: 14, fontWeight: 620 }}>About this account</h2>
            <p className="stat-sub" style={{ marginTop: 8, lineHeight: 1.6 }}>
              Transfers arrive instantly and appear in your activity. Your available
              balance updates the moment a payment is sent, and each transfer gets its
              own reference you can search for under Transactions.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
