import Link from "next/link";
import { redirect } from "next/navigation";
import AuthenticatedNavbar from "@/app/_components/AuthenticatedNavbar";
import { getUserData } from "@/lib/cookies";

export default async function DashboardPage() {
  const user = await getUserData();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-canvas">
      <AuthenticatedNavbar />

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
          <p className="mt-1 text-sm text-body">{user.email}</p>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="border border-hairline bg-surface-card p-6">
            <p className="text-xs uppercase tracking-[1.5px] text-muted">
              Profile
            </p>
            <p className="mt-3 text-sm font-light text-body">
              Update your name, email, username, and profile image from the
              protected profile page.
            </p>
            <Link
              href="/profile"
              className="mt-4 inline-flex text-sm uppercase tracking-[1.5px] text-on-dark"
            >
              Manage profile
            </Link>
          </div>

          <div className="border border-hairline bg-surface-card p-6">
            <p className="text-xs uppercase tracking-[1.5px] text-muted">
              Security
            </p>
            <p className="mt-3 text-sm font-light text-body">
              Change your password using the same protected update API and auth
              flow.
            </p>
            <Link
              href="/password"
              className="mt-4 inline-flex text-sm uppercase tracking-[1.5px] text-on-dark"
            >
              Update password
            </Link>
          </div>

          {user.role === "admin" && (
            <div className="border border-m-blue-dark bg-surface-card p-6 sm:col-span-2">
              <p className="text-xs uppercase tracking-[1.5px] text-m-blue-dark">
                Admin Panel
              </p>
              <p className="mt-3 text-sm font-light text-body">
                You have admin access. Manage users — view, create, edit, and
                delete accounts across the platform.
              </p>
              <Link
                href="/dashboard/admin"
                className="mt-4 inline-flex text-sm uppercase tracking-[1.5px] text-on-dark"
              >
                Open admin panel →
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
