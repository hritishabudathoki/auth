import Link from "next/link";
import Logo from "./Logo";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-canvas">
      <div className="m-stripe" />
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Logo />
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/login"
            className="text-xs uppercase tracking-[1.5px] text-body transition-colors hover:text-on-dark sm:text-sm"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-on-dark px-4 py-2 text-xs uppercase tracking-[1.5px] text-canvas transition-opacity hover:opacity-90 sm:px-5 sm:text-sm"
          >
            Register
          </Link>
        </nav>
      </div>
    </header>
  );
}
