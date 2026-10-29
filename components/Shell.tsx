"use client";

import { useStore } from "@/lib/store";
import Sidebar from "./Sidebar";

export default function Shell({ children }: { children: React.ReactNode }) {
  const { ready } = useStore();

  if (!ready) {
    return (
      <div className="boot">
        <div className="boot-mark" />
      </div>
    );
  }

  return (
    <div className="app">
      <Sidebar />
      <main className="main">
        <div className="wrap">{children}</div>
      </main>
    </div>
  );
}
