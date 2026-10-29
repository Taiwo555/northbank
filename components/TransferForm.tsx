"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { initials, maskAccount, money } from "@/lib/format";
import { IconCheck } from "./Icons";
import type { Payee, Txn } from "@/lib/types";

type Step = "form" | "review" | "sent";

const cleanAmount = (raw: string) => {
  let v = raw.replace(/[^\d.]/g, "");
  const firstDot = v.indexOf(".");
  if (firstDot !== -1) {
    v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, "");
    const [w, d] = v.split(".");
    v = `${w}.${(d ?? "").slice(0, 2)}`;
  }
  return v;
};

export default function TransferForm() {
  const { balance, payees, sendTransfer } = useStore();

  const [name, setName] = useState("");
  const [bank, setBank] = useState("");
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("form");
  const [error, setError] = useState("");
  const [sent, setSent] = useState<Txn | null>(null);

  const amountNum = Number(amount);
  const valid = useMemo(() => {
    return (
      Number.isFinite(amountNum) &&
      amountNum > 0 &&
      amountNum <= balance &&
      name.trim().length > 1 &&
      account.replace(/\s+/g, "").length >= 6
    );
  }, [amountNum, balance, name, account]);

  function pick(p: Payee) {
    setSelected(p.id);
    setName(p.name);
    setBank(p.bank);
    setAccount(p.account);
    setError("");
  }

  function startNew() {
    setSelected(null);
    setName("");
    setBank("");
    setAccount("");
    setError("");
  }

  function goReview() {
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      setError("Enter an amount to send.");
      return;
    }
    if (amountNum > balance) {
      setError("That's more than your available balance.");
      return;
    }
    if (name.trim().length < 2) {
      setError("Add a recipient name.");
      return;
    }
    if (account.replace(/\s+/g, "").length < 6) {
      setError("That account number looks too short.");
      return;
    }
    setError("");
    setStep("review");
  }

  function confirm() {
    const res = sendTransfer({ name, bank, account, amount: amountNum, note });
    if (!res.ok || !res.txn) {
      setError(res.error ?? "Something went wrong.");
      setStep("form");
      return;
    }
    setSent(res.txn);
    setStep("sent");
  }

  function reset() {
    setStep("form");
    setSent(null);
    setAmount("");
    setNote("");
    setError("");
  }

  return (
    <>
      <div className="card card-pad">
        <div className="field">
          <label>Send to</label>
          <div className="payee-grid">
            {payees.slice(0, 4).map((p) => (
              <button
                key={p.id}
                type="button"
                className={`payee${selected === p.id ? " selected" : ""}`}
                onClick={() => pick(p)}
              >
                <span className="avatar" style={{ background: "#eef2f8", color: "#475467" }}>
                  {initials(p.name)}
                </span>
                <span style={{ minWidth: 0 }}>
                  <span className="payee-name" style={{ display: "block" }}>
                    {p.name}
                  </span>
                  <span className="payee-bank" style={{ display: "block" }}>
                    {p.bank} · {maskAccount(p.account)}
                  </span>
                </span>
              </button>
            ))}
            <button
              type="button"
              className={`payee${selected === null ? " selected" : ""}`}
              onClick={startNew}
            >
              <span className="avatar" style={{ background: "#eef2f8", color: "#475467" }}>
                +
              </span>
              <span>
                <span className="payee-name" style={{ display: "block" }}>
                  New recipient
                </span>
                <span className="payee-bank" style={{ display: "block" }}>
                  Enter details below
                </span>
              </span>
            </button>
          </div>
        </div>

        <div className="row-2">
          <div className="field">
            <label htmlFor="name">Recipient name</label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jordan Blake"
              autoComplete="off"
            />
          </div>
          <div className="field">
            <label htmlFor="bank">Bank</label>
            <input
              id="bank"
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              placeholder="e.g. Chase"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="account">Account number</label>
          <input
            id="account"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            placeholder="10 digits"
            inputMode="numeric"
            autoComplete="off"
          />
        </div>

        <div className="field">
          <label htmlFor="amount">Amount</label>
          <div className="money-input">
            <span>$</span>
            <input
              id="amount"
              value={amount}
              onChange={(e) => setAmount(cleanAmount(e.target.value))}
              placeholder="0.00"
              inputMode="decimal"
            />
          </div>
          <div className="hint">
            Available to send: <strong style={{ color: "var(--text)" }}>{money(balance)}</strong>
          </div>
        </div>

        <div className="field">
          <label htmlFor="note">Note (optional)</label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What's this for?"
            maxLength={140}
          />
        </div>

        {error ? <div className="alert alert-error">{error}</div> : null}

        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={goReview}
          disabled={!valid}
        >
          Review transfer
        </button>
      </div>

      {step === "review" && (
        <div className="overlay" role="dialog" aria-modal="true" aria-label="Review transfer">
          <div className="modal">
            <h3>Review your transfer</h3>
            <p className="sub">Check the details before sending.</p>

            <div className="review-amount">{money(amountNum)}</div>
            <p className="sub">to {name}</p>

            <div className="review-rows">
              <div className="review-row">
                <span>Bank</span>
                <strong>{bank.trim() || "External bank"}</strong>
              </div>
              <div className="review-row">
                <span>Account</span>
                <strong>{maskAccount(account.replace(/\s+/g, ""))}</strong>
              </div>
              <div className="review-row">
                <span>From</span>
                <strong>Northbank · 8841</strong>
              </div>
              <div className="review-row">
                <span>Fee</span>
                <strong>{money(0)}</strong>
              </div>
              {note.trim() ? (
                <div className="review-row">
                  <span>Note</span>
                  <strong>{note.trim()}</strong>
                </div>
              ) : null}
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setStep("form")}
              >
                Back
              </button>
              <button type="button" className="btn btn-primary" onClick={confirm}>
                Send {money(amountNum)}
              </button>
            </div>
          </div>
        </div>
      )}

      {step === "sent" && sent && (
        <div className="overlay" role="dialog" aria-modal="true" aria-label="Transfer sent">
          <div className="modal">
            <div className="success-icon">
              <IconCheck />
            </div>
            <h3>Money sent</h3>
            <p className="sub">
              {money(sent.amount)} is on its way to {sent.counterparty}.
            </p>

            <div className="ref-box">
              <span>Reference</span>
              <strong>{sent.reference}</strong>
            </div>

            <div className="review-rows">
              <div className="review-row">
                <span>New balance</span>
                <strong>{money(balance)}</strong>
              </div>
              <div className="review-row">
                <span>Status</span>
                <strong style={{ color: "var(--accent-dark)" }}>Completed</strong>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={reset}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
