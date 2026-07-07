import { AdminLoginGate } from "@/components/admin/AdminLoginGate";
import { AdminWorkspaceSmart } from "@/components/admin/AdminWorkspaceSmart";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-cream text-espresso">
      <AdminLoginGate>
        <AdminWorkspaceSmart />
      </AdminLoginGate>
    </main>
  );
}
