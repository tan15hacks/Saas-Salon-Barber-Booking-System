import { AdminLoginGate } from "@/components/admin/AdminLoginGate";
import { AdminWorkspaceSmart } from "@/components/admin/AdminWorkspaceSmart";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-cream text-espresso">
      <Navbar />
      <AdminLoginGate>
        <AdminWorkspaceSmart />
      </AdminLoginGate>
      <Footer />
    </main>
  );
}
