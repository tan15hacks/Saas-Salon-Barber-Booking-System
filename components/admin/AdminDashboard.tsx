import { bookings, salon, services, staffMembers } from "@/lib/data";
import type { BookingStatus } from "@/lib/types";

const statusStyles: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  completed: "bg-blue-100 text-blue-700",
  cancelled: "bg-zinc-200 text-zinc-700",
  no_show: "bg-red-100 text-red-700",
};

function getServiceName(serviceId: string) {
  return services.find((service) => service.id === serviceId)?.name ?? "Service";
}

function getStaffName(staffId: string) {
  return staffMembers.find((staff) => staff.id === staffId)?.name ?? "Any stylist";
}

function getServicePrice(serviceId: string) {
  return services.find((service) => service.id === serviceId)?.price ?? 0;
}

export function AdminDashboard() {
  const todayBookings = bookings.length;
  const pendingBookings = bookings.filter((booking) => booking.status === "pending").length;
  const confirmedBookings = bookings.filter((booking) => booking.status === "confirmed").length;
  const estimatedRevenue = bookings.reduce((sum, booking) => sum + getServicePrice(booking.serviceId), 0);

  return (
    <section className="py-12 md:py-16">
      <div className="salon-container">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-[2rem] bg-espresso p-5 text-white">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-champagne">Owner panel</p>
            <h1 className="mt-3 text-3xl font-black">{salon.name}</h1>
            <nav className="mt-8 space-y-2 text-sm font-bold text-white/70">
              {["Dashboard", "Bookings", "Calendar", "Services", "Staff", "Customers", "Settings"].map((item, index) => (
                <div key={item} className={`rounded-2xl px-4 py-3 ${index === 0 ? "bg-white text-rosewood" : "hover:bg-white/10"}`}>{item}</div>
              ))}
            </nav>
          </aside>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-rosewood/10 bg-white/70 p-6 shadow-sm">
              <p className="text-sm font-black uppercase tracking-[0.28em] text-rosewood/70">Dashboard preview</p>
              <h2 className="mt-3 text-4xl font-black">Manage salon bookings at a glance</h2>
              <p className="mt-3 max-w-3xl leading-7 text-espresso/65">This admin screen is static for the MVP scaffold. Next, we will connect it to Supabase and make the booking actions real.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              {[
                ["Today", todayBookings.toString()],
                ["Pending", pendingBookings.toString()],
                ["Confirmed", confirmedBookings.toString()],
                ["Revenue", `₱${estimatedRevenue.toLocaleString()}`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[1.5rem] border border-rosewood/10 bg-white/70 p-5">
                  <p className="text-sm font-bold text-espresso/55">{label}</p>
                  <p className="mt-2 text-3xl font-black">{value}</p>
                </div>
              ))}
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-rosewood/10 bg-white/80 shadow-sm">
              <div className="border-b border-rosewood/10 p-6">
                <h3 className="text-2xl font-black">Upcoming appointments</h3>
                <p className="mt-2 text-sm text-espresso/60">Owner actions later: confirm, cancel, complete, or mark no-show.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="bg-blush/35 text-espresso/65">
                    <tr>
                      <th className="px-6 py-4 font-black">Customer</th>
                      <th className="px-6 py-4 font-black">Service</th>
                      <th className="px-6 py-4 font-black">Stylist</th>
                      <th className="px-6 py-4 font-black">Schedule</th>
                      <th className="px-6 py-4 font-black">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rosewood/10">
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-6 py-4">
                          <p className="font-black">{booking.customerName}</p>
                          <p className="text-espresso/55">{booking.customerPhone}</p>
                        </td>
                        <td className="px-6 py-4 font-bold">{getServiceName(booking.serviceId)}</td>
                        <td className="px-6 py-4 text-espresso/70">{getStaffName(booking.staffId)}</td>
                        <td className="px-6 py-4 text-espresso/70">{booking.date} · {booking.startTime}</td>
                        <td className="px-6 py-4">
                          <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide ${statusStyles[booking.status]}`}>{booking.status.replace("_", " ")}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
