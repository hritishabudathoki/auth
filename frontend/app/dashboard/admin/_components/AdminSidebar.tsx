"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { handleLogoutUser } from "@/lib/actions/auth-action";
import type { User } from "@/lib/api/auth";

// ─── Icons ───────────────────────────────────────────────────────────────────

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-4 w-4"}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 14a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"
      />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-4 w-4"}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-4 w-4"}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-4 w-4"}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    </svg>
  );
}

// ─── Nav config ──────────────────────────────────────────────────────────────

const navItems = [
  {
    href: "/dashboard/admin",
    label: "Dashboard",
    Icon: DashboardIcon,
    exact: true,
  },
  {
    href: "/dashboard/admin/users",
    label: "Users",
    Icon: UsersIcon,
    exact: false,
  },
  {
    href: "/dashboard/admin/settings",
    label: "Settings",
    Icon: SettingsIcon,
    exact: false,
  },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminSidebar({ user }: { user: User }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const onLogout = () => {
    startTransition(async () => {
      await handleLogoutUser();
      router.push("/login");
      router.refresh();
    });
  };

  const userInitial = user.firstName ? user.firstName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase();

  return (
    <aside className="relative flex w-64 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3.5 px-7 py-8">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          <span className="text-sm font-black text-white">E</span>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[2px] text-white">
            ExploreEase
          </p>
          <span className="text-[9px] uppercase tracking-[1.5px] text-blue-500 font-medium">Admin Suite</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 px-4 pt-4">
        <p className="px-3 mb-2 text-[9px] uppercase tracking-[2px] text-zinc-600 font-bold">
          Navigation
        </p>
        {navItems.map(({ href, label, Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={`group relative flex items-center gap-3.5 rounded-lg px-3.5 py-3 text-xs font-medium uppercase tracking-[1px] transition-all duration-200 ${
                active
                  ? "bg-gradient-to-r from-blue-600/10 to-indigo-600/10 text-blue-400 border border-blue-500/25 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                  : "text-zinc-400 border border-transparent hover:bg-zinc-900/60 hover:text-zinc-100"
              }`}
            >
              {/* Active marker pill */}
              {active && (
                <span className="absolute -left-1.5 top-1/3 h-1/3 w-1 rounded-r bg-blue-500" />
              )}
              <Icon
                className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                  active ? "text-blue-400" : "text-zinc-500 group-hover:text-zinc-300"
                }`}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer / User Profile Card */}
      <div className="mt-auto border-t border-zinc-800 bg-zinc-900/20 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700/60 font-semibold text-zinc-300">
            {userInitial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-zinc-200">
              {user.firstName ? `${user.firstName} ${user.lastName}` : "Admin User"}
            </p>
            <p className="truncate text-[10px] text-zinc-500">
              {user.email}
            </p>
          </div>
        </div>
        <button
          id="admin-logout"
          onClick={onLogout}
          disabled={isPending}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 py-2.5 text-xs font-semibold uppercase tracking-[1px] text-red-400/90 transition-all duration-200 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40"
        >
          <LogoutIcon className="h-3.5 w-3.5" />
          {isPending ? "Logging out…" : "Logout"}
        </button>
      </div>
    </aside>
  );
}
