import type { Booking, BookingStatus, Service, StaffMember } from "@/lib/types";

type AdminReportsProps = {
  bookings: Booking[];
  services: Service[];
  staff: StaffMember[];
};

type CsvRow = Record<string, string | number>;

const panelClass = "rounded-[2rem] border border-rosewood/10 bg-white/82 p-6 shadow-sm";
const primaryButton = "rounded-full bg-rosewood px-5 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-espresso active:scale-95";
const secondaryButton = "rounded-full border border-rosewood/20 bg-white/65 px-5 py-3 text-sm font-black text-rosewood transition hover:-translate-y-0.5 hover:bg-blush active:scale-95";

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
  const pending = bookings.filter((booking) => booking.status === "pending").length;
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
    { metric: "Pending bookings", value: pending },
    { metric: "Valid revenue bookings", value: validBookings.length },
    { metric: "Estimated revenue", value: estimatedRevenue },
    { metric: "Average ticket", value: averageTicket },
    { metric: "Completion rate", value: `${completionRate}%` },
    { metric: "No-show rate", value: `${noShowRate}%` },
    { metric: "Top service", value: serviceRevenue[0]?.service.name ?? "None" },
    { metric: "Top staff", value: staffRevenue[0]?.member.name ?? "None" },
  ];

  const summaryCards = [
    { label: "Revenue", value: `₱${estimatedRevenue.toLocaleString()}`, helper: "Confirmed + pending + completed" },
    { label: "Average ticket", value: `₱${averageTicket.toLocaleString()}`, helper: "Revenue per valid booking" },
    { label: "Completion", value: `${completionRate}%`, helper: `${completed} completed bookings` },
    { label: "No-show", value: `${noShowRate}%`, helper: `${noShows} missed bookings` },
  ];

  return (
    <div className="space-y-8">
      <div className={panelClass}>
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-rosewood/70">Business intelligence</p>
            <h3 className="mt-2 text-3xl font-black">Analytics & report exports</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-espresso/60">Review performance, identify top services, track staff revenue, and download CSV files for business records.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={csvHref(summaryRows)} download="prime-glow-summary.csv" className={primaryButton}>Export summary</a>
            <a href={csvHref(bookingRows)} download="prime-glow-bookings.csv" className={secondaryButton}>Export bookings</a>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="rounded-[1.75rem] border border-rosewood/10 bg-white/82 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
            <p className="text-sm font-bold text-espresso/55">{card.label}</p>
            <p className="mt-3 text-4xl font-black tracking-tight">{card.value}</p>
            <p className="mt-3 text-xs font-bold uppercase tracking-wide text-rosewood/60">{card.helper}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 2xl:grid-cols-2">
        <div className={panelClass}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-rosewood/70">Service performance</p>
              <h3 className="mt-2 text-2xl font-black">Revenue by service</h3>
            </div>
            <p className="text-sm font-bold text-espresso/55">Top: {serviceRevenue[0]?.service.name ?? "None"}</p>
          </div>
          <div className="mt-6 space-y-5">
            {serviceRevenue.map((item) => (
              <div key={item.service.id}>
                <div className="mb-2 flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:justify-between">
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

        <div className={panelClass}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-rosewood/70">Team performance</p>
              <h3 className="mt-2 text-2xl font-black">Revenue by staff</h3>
            </div>
            <p className="text-sm font-bold text-espresso/55">Top: {staffRevenue[0]?.member.name ?? "None"}</p>
          </div>
          <div className="mt-6 space-y-5">
            {staffRevenue.map((item) => (
              <div key={item.member.id}>
                <div className="mb-2 flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:justify-between">
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
