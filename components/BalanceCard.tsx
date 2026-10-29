import { money } from "@/lib/format";
import { ACCOUNT } from "@/lib/seed";

export default function BalanceCard({ balance }: { balance: number }) {
  const [whole, cents] = money(balance).split(".");

  return (
    <section className="balance" aria-label="Account balance">
      <div className="balance-top">
        <div>
          <div className="balance-label">Available balance</div>
          <div className="balance-amount">
            {whole}
            <span className="cents">.{cents}</span>
          </div>
        </div>
        <span className="tag-account">Account</span>
      </div>

      <div className="balance-meta">
        <div>
          <span>Account holder</span>
          <strong style={{ fontFamily: "inherit" }}>{ACCOUNT.holder}</strong>
        </div>
        <div>
          <span>Account number</span>
          <strong>{ACCOUNT.number}</strong>
        </div>
        <div>
          <span>Sort code</span>
          <strong>{ACCOUNT.sortCode}</strong>
        </div>
        <div>
          <span>Currency</span>
          <strong>{ACCOUNT.currency}</strong>
        </div>
      </div>
    </section>
  );
}
