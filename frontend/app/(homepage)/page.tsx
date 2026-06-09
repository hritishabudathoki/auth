import Link from "next/link";

export default function HomePage() {
  return (
    <section className="relative min-h-[calc(100vh-140px)] overflow-hidden bg-canvas">
      <div className="m-stripe" />

      <div className="mx-auto flex max-w-5xl flex-col items-start justify-center px-6 py-24 sm:py-32">
        <p className="mb-4 text-xs uppercase tracking-[1.5px] text-muted">
          Your travel companion
        </p>

        <h1 className="mb-6 max-w-2xl text-4xl font-light uppercase leading-tight tracking-[1.5px] text-on-dark sm:text-5xl">
          Explore the world with ExploreEase
        </h1>

        <p className="mb-10 max-w-lg font-light leading-relaxed text-body">
          Plan trips, discover destinations, and manage your adventures — all in
          one place. Create an account to get started.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/register"
            className="flex h-12 items-center justify-center bg-on-dark px-8 text-sm uppercase tracking-[1.5px] text-canvas transition-opacity hover:opacity-90"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="flex h-12 items-center justify-center border border-hairline px-8 text-sm uppercase tracking-[1.5px] text-on-dark transition-colors hover:border-on-dark"
          >
            Login
          </Link>
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-px border border-hairline bg-hairline px-6 pb-24 sm:grid-cols-3">
        {[
          { title: "Discover", desc: "Find destinations tailored to you" },
          { title: "Plan", desc: "Organize trips in one place" },
          { title: "Explore", desc: "Travel with confidence" },
        ].map((item) => (
          <div key={item.title} className="bg-surface-card p-6">
            <h3 className="mb-2 text-sm uppercase tracking-[1.5px] text-on-dark">
              {item.title}
            </h3>
            <p className="text-sm font-light text-muted">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
