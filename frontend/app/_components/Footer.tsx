import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-hairline bg-canvas">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <Logo />
        <nav className="flex gap-6">
          <Link
            href="/login"
            className="text-sm font-light text-muted transition-colors hover:text-on-dark"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="text-sm font-light text-muted transition-colors hover:text-on-dark"
          >
            Register
          </Link>
        </nav>
      </div>
      <div className="border-t border-hairline py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} ExploreEase. All rights reserved.
      </div>
    </footer>
  );
}
