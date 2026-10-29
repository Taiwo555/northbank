# Northbank

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

## Note on data

Account details and transactions are sample data defined in `lib/seed.ts`. Everything runs in the browser: balances and transfers are stored in `localStorage` and are not connected to any banking system or payment network.
