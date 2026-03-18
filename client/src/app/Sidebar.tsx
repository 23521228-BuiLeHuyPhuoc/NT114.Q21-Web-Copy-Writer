"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/generate", label: "Generate", icon: "✨" },
  { href: "/seo-analysis", label: "SEO Analysis", icon: "🔍" },
  { href: "/plagiarism", label: "Plagiarism Check", icon: "🛡️" },
  { href: "/templates", label: "Templates", icon: "📄" },
  { href: "/versions", label: "Version History", icon: "🕐" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
      <div className="h-14 flex items-center px-5 border-b border-slate-700">
        <span className="text-lg font-bold tracking-tight">
          🤖 AI CopyWriter
        </span>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-indigo-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-700">
        <p className="text-xs text-slate-500 text-center">
          NT114.Q21 — UIT © 2024
        </p>
      </div>
    </aside>
  );
}
