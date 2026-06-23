import { redirect } from "next/navigation";
import AuthenticatedNavbar from "@/app/_components/AuthenticatedNavbar";
import ProfileUpdateForm from "@/app/_components/ProfileUpdateForm";
import { getUserData } from "@/lib/cookies";

export default async function ProfilePage() {
  const user = await getUserData();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-canvas">
      <AuthenticatedNavbar />

      <main className="mx-auto max-w-5xl px-6 py-16">
        <p className="mb-3 text-xs uppercase tracking-[1.5px] text-muted">
          Account settings
        </p>
        <h1 className="mb-4 text-3xl font-light uppercase tracking-[1.5px] text-on-dark">
          Update your profile
        </h1>
        <p className="mb-10 max-w-2xl font-light text-body">
          Your current account details are prefilled below. Save changes to sync
          your cookie-backed auth state and protected pages.
        </p>

        <ProfileUpdateForm initialUser={user} />
      </main>
    </div>
  );
}
