import { getUserData } from "@/lib/cookies";

export const metadata = {
  title: "Admin Dashboard — ExploreEase",
};

export default async function AdminDashboardPage() {
  const user = await getUserData();
  const name =
    user
      ? `${user.firstName} ${user.lastName}`.trim() || user.email
      : "Admin";

  return (
    <div className="flex-1 bg-zinc-950 p-8 sm:p-10 relative overflow-hidden">
      {/* Decorative background glow for a premium feel */}
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute right-10 top-20 h-80 w-80 rounded-full bg-indigo-600/5 blur-[150px] pointer-events-none" />

      {/* ── Page Header ─────────────────────────────── */}
      <div className="relative mb-10">
        <p className="text-[10px] font-bold uppercase tracking-[2px] text-blue-500">
          Suite Overview
        </p>
        <h1 className="mt-1 text-3xl font-extrabold uppercase tracking-[1px] text-white sm:text-4xl">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-sm font-light text-zinc-400">
          Welcome back, <span className="font-semibold text-zinc-200">{name}</span>. Here is the operational state of the ExploreEase platform.
        </p>
      </div>

      {/* ── Stat Cards ──────────────────────────────── */}
      <div className="relative grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Total Users Card */}
        <div className="group relative rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 transition-all duration-300 hover:border-zinc-700/60 hover:bg-zinc-900/60 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.7)]">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/0 to-blue-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          
          <div className="relative flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-zinc-500 group-hover:text-zinc-400 transition-colors">
              User Population
            </p>
            <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-medium text-blue-400 border border-blue-500/15">
              Synced
            </span>
          </div>

          <div className="relative mt-6 flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-zinc-800/80 border border-zinc-700/50 text-zinc-300 transition-transform duration-300 group-hover:scale-105">
              <svg
                className="h-6 w-6 text-blue-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A9.342 9.342 0 0012.458 10.22M12 14.25a3 3 0 110-6 3 3 0 010 6zm-7.063 5.088A4.125 4.125 0 017.5 15.75h9a4.125 4.125 0 013.75 3.588M2.625 19.5a9.3 9.3 0 012.625-.372"
                />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-semibold tracking-tight text-white">
                Active Users
              </p>
              <p className="mt-1 text-xs font-light text-zinc-500 leading-relaxed">
                Platform accounts are fully synchronized and available.
              </p>
            </div>
          </div>
        </div>

        {/* System Status Card */}
        <div className="group relative rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 transition-all duration-300 hover:border-zinc-700/60 hover:bg-zinc-900/60 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.7)]">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500/0 to-indigo-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          
          <div className="relative flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-zinc-500 group-hover:text-zinc-400 transition-colors">
              Platform Status
            </p>
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/15">
              Live
            </span>
          </div>

          <div className="relative mt-6 flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-zinc-800/80 border border-zinc-700/50 text-zinc-300 transition-transform duration-300 group-hover:scale-105">
              <svg
                className="h-6 w-6 text-emerald-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-semibold tracking-tight text-white">
                Systems Online
              </p>
              <p className="mt-1 text-xs font-light text-zinc-500 leading-relaxed">
                Core services, database cluster, and token authenticators operational.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
