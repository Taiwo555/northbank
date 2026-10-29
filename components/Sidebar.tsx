"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ACCOUNT } from "@/lib/seed";
import { initials } from "@/lib/format";
import { IconGrid, IconSend, IconList, IconCard } from "./Icons";

const NAV = [
  { href: "/", label: "Overview", Icon: IconGrid },
  { href: "/transfer", label: "Send money", Icon: IconSend },
  { href: "/transactions", label: "Transactions", Icon: IconList },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <Link href="/" className="brand">
        <span className="brand-mark">N</span>
        <span>
          <span className="brand-name">Northbank</span>
          <span className="brand-sub" style={{ display: "block" }}>
            Personal
          </span>
        </span>
      </Link>

      <nav className="nav" aria-label="Main">
        <span className="nav-label">Banking</span>
        {NAV.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`nav-item${active ? " active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <Icon />
              {label}
            </Link>
          );
        })}
        <span className="nav-item" style={{ opacity: 0.45, cursor: "not-allowed" }}>
          <IconCard />
          Cards
        </span>
      </nav>

      <div className="sidebar-foot">
        <div className="userchip">
          <span className="avatar">{initials(ACCOUNT.holder)}</span>
          <span>
            <span className="userchip-name" style={{ display: "block" }}>
              {ACCOUNT.holder}
            </span>
            <span className="userchip-sub">Account</span>
          </span>
        </div>
      </div>
    </aside>
  );
}
