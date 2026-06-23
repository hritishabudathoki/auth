"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { handleLogoutUser } from "@/lib/actions/auth-action";
import { useAuth } from "@/lib/providers/auth-provider";
import Logo from "./Logo";

export default function AuthenticatedNavbar() {
  const router = useRouter();
  const { user, clearUser } = useAuth();
  const [isPending, startTransition] = useTransition();

  const onLogout = () => {
    startTransition(async () => {
      await handleLogoutUser();
      clearUser();
      router.push("/login");
      router.refresh();
    });
  };

  return (
    <header className="border-b border-hairline bg-canvas">
      <div className="m-stripe" />
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Logo />
          <span className="text-sm font-light text-muted sm:hidden">
            {user?.email}
          </span>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <nav className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link
              href="/dashboard"
              className="text-xs uppercase tracking-[1.5px] text-body transition-colors hover:text-on-dark sm:text-sm"
            >
              Dashboard
            </Link>
            <Link
              href="/profile"
              className="text-xs uppercase tracking-[1.5px] text-body transition-colors hover:text-on-dark sm:text-sm"
            >
              Profile
            </Link>
            <Link
              href="/password"
              className="text-xs uppercase tracking-[1.5px] text-body transition-colors hover:text-on-dark sm:text-sm"
            >
              Password
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-light text-muted sm:block">
              {user?.email}
            </span>
            <button
              type="button"
              onClick={onLogout}
              disabled={isPending}
              className="border border-hairline px-4 py-2 text-xs uppercase tracking-[1.5px] text-on-dark transition-colors hover:border-on-dark disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
            >
              {isPending ? "Signing out..." : "Logout"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
