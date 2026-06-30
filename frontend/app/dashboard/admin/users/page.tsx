import AdminPanel from "./AdminPanel";

export const metadata = {
  title: "Users — Admin — ExploreEase",
  description: "Manage users across the ExploreEase platform",
};

export default function AdminUsersPage() {
  return (
    <div className="flex-1 bg-canvas p-8">
      <AdminPanel />
    </div>
  );
}
