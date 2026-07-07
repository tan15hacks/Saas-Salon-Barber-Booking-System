import type { Booking, BookingStatus, Service, StaffMember } from "@/lib/types";

type AdminReportsProps = {
  bookings: Booking[];
  services: Service[];
  staff: StaffMember[];
};

type CsvRow = Record<string, string | number>;

const statusLabels: Record<BookingStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No-show",
};

function csvEscape(value: string | number) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function csvHref(rows: CsvRow[]) {
  if (!rows.length) return "data:text/csv;charset=utf-8,No%20data";
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(","), ...rows.map((row) => headers.map((header) => csvEscape(row[header] ?? "")).join(","))].join("\n");
  return `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
}

export function AdminReports({ bookings, services, staff }: AdminReportsProps) {
  const getService = (id: string) => services.find((service) => service.id === id);
  const getServiceName = (id: string) => getService(id)?.name ?? "Service";
  const getStaffName = (id: string) => staff.find((member) => member.id === id)?.name ?? "Any staff";
  const getPrice = (id: string) => getService(id)?.price ?? 0;

  const validBookings = bookings.filter((booking) => booking.status !== "cancelled" && booking.status !== "no_show");
  const estimatedRevenue = validBookings.reduce((sum, booking) => sum + getPrice(booking.serviceId), 0);
  const completed = bookings.filter((booking) => booking.status === "completed").length;
  const noShows = bookings.filter((booking) => booking.status === "no_show").length;
  const completionRate = bookings.length ? Math.round((completed / bookings.length) * 100) : 0;
  const noShowRate = bookings.length ? Math.round((noShows / bookings.length) * 100) : 0;
  const averageTicket = validBookings.length ? Math.round(estimatedRevenue / validBookings.length) : 0;

  const serviceRevenue = services
    .map((service) => {
      const serviceBookings = validBookings.filter((booking) => booking.serviceId === service.id);
      return {
        service,
        bookings: serviceBookings.length,
        revenue: serviceBookings.length * service.price,
      };
    })
    .sort((a, b) => b.revenue - a.revenue);

  const staffRevenue = staff
    .map((member) => ({
      member,
      bookings: validBookings.filter((booking) => booking.staffId === member.id).length,
      revenue: validBookings.filter((booking) => booking.staffId === member.id).reduce((sum, booking) => sum + getPrice(booking.serviceId), 0),
    }))
    .sort((a, b) => b.revenue - a.revenue);

  const maxServiceRevenue = Math.max(1, ...serviceRevenue.map((item) => item.revenue));
  const maxStaffRevenue = Math.max(1, ...staffRevenue.map((item) => item.revenue));

  const bookingRows = bookings.map((booking) => ({
    customer: booking.customerName,
    phone: booking.customerPhone,
    service: getServiceName(booking.serviceId),
    staff: getStaffName(booking.staffId),
    date: booking.date,
    start_time: booking.startTime,
    end_time: booking.endTime,
    status: statusLabels[booking.status],
    estimated_revenue: getPrice(booking.serviceId),
  }));

  const summaryRows = [
    { metric: "Total bookings", value: bookings.length },
    { metric: "Valid revenue bookings", value: validBookings.length },
    { metric: "Estimated revenue", value: estimatedRevenue },
    { metric: "Average ticket", value: averageTicket },
    { metric: "Completion rate", value: `${completionRate}%` },
    { metric: "No-show rate", value: `${noShowRate}%` },
    { metric: "Top service", value: serviceRevenue[0]?.service.name ?? "None" },
    { metric: "Top staff", value: staffRevenue[0]?.member.name ?? "None" },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-rosewood/10 bg-white/80 p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-2xl font-black">Analytics & report exports</h3>
            <p className="mt-2 text-sm text-espresso/60">Download CSV reports and preview business performance without a database.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={csvHref(summaryRows)} download="prime-glow-summary.csv" className="rounded-full bg-rosewood px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-espresso">Export summary</a>
            <a href={csvHref(bookingRows)} download="prime-glow-bookings.csv" className="rounded-full border border-rosewood/20 px-5 py-3 text-sm font-black text-rosewood transition hover:-translate-y-0.5 hover:bg-rosewood hover:text-white">Export bookings</a>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Revenue", `₱${estimatedRevenue.toLocaleString()}`],
          ["Average ticket", `₱${averageTicket.toLocaleString()}`],
          ["Completion", `${completionRate}%`],
          ["No-show", `${noShowRate}%`],
        ].map(([label, value]) => (
          <div key={label} className="rounded-[1.5rem] border border-rosewood/10 bg-white/75 p-5 transition hover:-translate-y-1 hover:shadow-soft">
            <p className="text-sm font-bold text-espresso/55">{label}</p>
            <p className="mt-2 text-3xl font-black">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[2rem] border border-rosewood/10 bg-white/80 p-6 shadow-sm">
          <h3 className="text-2xl font-black">Revenue by service</h3>
          <div className="mt-6 space-y-4">
            {serviceRevenue.map((item) => (
              <div key={item.service.id}>
                <div className="mb-2 flex justify-between gap-4 text-sm">
                  <b>{item.service.name}</b>
                  <b className="text-rosewood">₱{item.revenue.toLocaleString()} · {item.bookings} bookings</b>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-blush/40">
                  <div className="h-full rounded-full bg-rosewood" style={{ width: `${Math.max(8, (item.revenue / maxServiceRevenue) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-rosewood/10 bg-white/80 p-6 shadow-sm">
          <h3 className="text-2xl font-black">Revenue by staff</h3>
          <div className="mt-6 space-y-4">
            {staffRevenue.map((item) => (
              <div key={item.member.id}>
                <div className="mb-2 flex justify-between gap-4 text-sm">
                  <b>{item.member.name}</b>
                  <b className="text-rosewood">₱{item.revenue.toLocaleString()} · {item.bookings} bookings</b>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-blush/40">
                  <div className="h-full rounded-full bg-rosewood" style={{ width: `${Math.max(8, (item.revenue / maxStaffRevenue) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
