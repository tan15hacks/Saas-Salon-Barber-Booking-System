import { AdminLoginGate } from "@/components/admin/AdminLoginGate";
import { AdminReviewsPanel } from "@/components/admin/AdminReviewsPanel";

export default function AdminReviewsPage() {
  return (
    <main className="min-h-screen bg-cream px-4 py-10 text-espresso md:px-8">
      <AdminLoginGate>
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.26em] text-rosewood/70">Admin workspace</p>
              <h1 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">Reviews</h1>
            </div>
            <a href="/admin" className="w-fit rounded-full border border-rosewood/20 bg-white/65 px-5 py-3 text-sm font-black text-rosewood transition hover:-translate-y-0.5 hover:bg-blush active:scale-95">Back to dashboard</a>
          </div>
          <AdminReviewsPanel />
        </div>
      </AdminLoginGate>
    </main>
  );
}
