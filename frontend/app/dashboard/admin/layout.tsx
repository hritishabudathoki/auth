import { redirect } from "next/navigation";
import { getUserData } from "@/lib/cookies";
import AdminSidebar from "./_components/AdminSidebar";

export const metadata = {
  title: "Admin — ExploreEase",
  description: "Admin panel for ExploreEase platform management",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserData();

  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/dashboard");

  return (
    <div className="flex min-h-screen bg-canvas">
      <AdminSidebar user={user} />
      <div className="flex flex-1 flex-col overflow-auto">{children}</div>
    </div>
  );
}
