import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-cream text-espresso">
      <Navbar />
      <AdminDashboard />
      <Footer />
    </main>
  );
}
