import { redirect } from "next/navigation";
import AuthenticatedNavbar from "@/app/_components/AuthenticatedNavbar";
import PasswordUpdateForm from "@/app/_components/PasswordUpdateForm";
import { getUserData } from "@/lib/cookies";

export default async function PasswordPage() {
  const user = await getUserData();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-canvas">
      <AuthenticatedNavbar />

      <main className="mx-auto max-w-5xl px-6 py-16">
        <p className="mb-3 text-xs uppercase tracking-[1.5px] text-muted">
          Account security
        </p>
        <PasswordUpdateForm />
      </main>
    </div>
  );
}
