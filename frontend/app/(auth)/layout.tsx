import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-canvas flex flex-col lg:flex-row">
      {/* Mobile header */}
      <div className="lg:hidden">
        <div className="m-stripe" />
        <div className="flex items-center justify-between border-b border-hairline px-6 py-5">
          <Link
            href="/"
            className="text-on-dark text-lg font-light uppercase tracking-[1.5px]"
          >
            ExploreEase
          </Link>
        </div>
      </div>

      {/* Left image panel — desktop only */}
      <div className="relative hidden lg:flex lg:w-1/2 lg:min-h-screen">
        <Image
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80"
          alt="ExploreEase travel"
          fill
          className="object-cover"
          priority
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute top-0 left-0 right-0 m-stripe" />
        <div className="relative z-10 flex min-h-screen w-full flex-col justify-between p-12">
          <Link
            href="/"
            className="text-on-dark text-xl font-light uppercase tracking-[1.5px]"
          >
            ExploreEase
          </Link>
          <div>
            <p className="mb-3 text-xs uppercase tracking-[1.5px] text-body">
              Your travel companion
            </p>
            <p className="text-on-dark text-4xl font-light uppercase tracking-[1.5px] leading-tight max-w-md">
              Discover your next adventure
            </p>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 items-center justify-center bg-canvas px-6 py-12 lg:w-1/2 lg:px-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
