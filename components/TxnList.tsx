import { dayLabel, initials, maskAccount, money, timeLabel } from "@/lib/format";
import type { Txn } from "@/lib/types";

export default function TxnList({
  txns,
  limit,
  empty = "Nothing here yet.",
}: {
  txns: Txn[];
  limit?: number;
  empty?: string;
}) {
  const rows = typeof limit === "number" ? txns.slice(0, limit) : txns;

  if (rows.length === 0) {
    return <div className="empty">{empty}</div>;
  }

  return (
    <div className="txn-list">
      {rows.map((t) => {
        const incoming = t.type === "credit";
        return (
          <div className="txn" key={t.id}>
            <div className={`txn-avatar${incoming ? " in" : ""}`}>
              {initials(t.counterparty)}
            </div>
            <div className="txn-main">
              <div className="txn-name">{t.counterparty}</div>
              <div className="txn-sub">
                {t.note ?? t.category} · {maskAccount(t.account)}
              </div>
            </div>
            <div>
              <div className={`txn-amt ${incoming ? "in" : "out"}`}>
                {incoming ? "+" : "−"}
                {money(t.amount)}
              </div>
              <div className="txn-when">
                {dayLabel(t.createdAt)} · {timeLabel(t.createdAt)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
