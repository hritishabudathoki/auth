import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserData } from "@/lib/cookies";

export default async function DashboardPage() {
  const user = await getUserData();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-canvas">
      <div className="m-stripe" />

      <header className="border-b border-hairline">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="text-lg font-light uppercase tracking-[1.5px] text-on-dark"
          >
            ExploreEase
          </Link>
          <span className="text-sm font-light text-muted">{user.email}</span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-16">
        <p className="mb-3 text-xs uppercase tracking-[1.5px] text-muted">
          Dashboard
        </p>
        <h1 className="mb-4 text-3xl font-light uppercase tracking-[1.5px] text-on-dark">
          Welcome, {user.firstName}
        </h1>
        <p className="max-w-lg font-light text-body">
          You are signed in to ExploreEase. This is your dashboard — more features
          coming soon.
        </p>

        <div className="mt-10 border border-hairline bg-surface-card p-6">
          <p className="text-xs uppercase tracking-[1.5px] text-muted">Account</p>
          <p className="mt-2 text-on-dark">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-sm text-body">@{user.username}</p>
        </div>
      </main>
    </div>
  );
}
