# Northbank

**Live:** https://northbanks.netlify.app

A personal banking interface built with Next.js and React. Balance, transfers and transaction history, with a seeded $500,000 opening balance and instant payments between accounts.

## Features

- **Overview** — available balance, account details, money in / money out for the month, and recent activity.
- **Send money** — saved recipients or new details, amount validation, a review step and a confirmation with a generated reference.
- **Transactions** — full history with money-in / money-out filters and search across name, note and reference.
- **Persistence** — state survives reloads via `localStorage`; "Reset data" on the Overview page restores the seeded account.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, static export) |
| UI | React 19, plain CSS |
| Language | TypeScript |
| State | React context + `localStorage` |

No backend, no database, no third-party services.

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

Build the static site:

```bash
npm run build        # outputs to out/
npm run preview      # serves out/ on http://localhost:3000
```

## Project layout

```
app/           routes, layout, global styles
components/    sidebar, balance card, transaction list, transfer form
lib/           types, formatting, seed data, store
public/        static assets
```

## Deployment

The build is fully static, so it deploys to any static host. `netlify.toml` configures Netlify to run `npm run build` and publish `out/`.

## Decisions

**Static export, no backend.** `output: "export"` means the whole app is files on a CDN: nothing to run, nothing to pay for, nothing to secure. For a portfolio piece that is the right trade — the interesting problem is the interface, not standing up a server.

**Money is rounded at every boundary.** Amounts are rounded to cents on entry and again when the balance is updated, so a transfer cannot leave a balance like `499999.9999999999`. A real bank would store integer minor units instead; this stops short of that on purpose, and the limit is listed below rather than hidden.

**Validation belongs to the store, not the form.** `sendTransfer` returns `{ ok, error }` rather than throwing or setting local form state, so the rules — positive amount, sufficient funds, recipient name, plausible account number — are enforced in one place and cannot be bypassed by another component or a second screen.

**Bad storage falls back instead of crashing.** `load()` type-checks whatever came out of `localStorage` and returns the seed data if the shape is wrong, so a half-written or hand-edited record shows a working account rather than a blank page.

**Checked at the edges, not the middle.** The transfer form broke on narrow screens: the amount and recipient fields overflowed horizontally, which is the one thing a payment form must never do. It was rebuilt after testing at 390, 560, 700, 900 and 1440 px.

## Limits

- Not a bank: no authentication, no server, no payment network. Transfers move numbers in `localStorage`.
- Single account, single currency, no fees or interest.
- Amounts are JavaScript numbers rounded to cents, not integer minor units.

## Note on data

Account details and transactions are sample data defined in `lib/seed.ts`. Everything runs in the browser: balances and transfers are stored in `localStorage` and are not connected to any banking system or payment network.
