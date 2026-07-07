"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { AdminReports } from "@/components/admin/AdminReports";
import { AdminServicesPanel } from "@/components/admin/AdminServicesPanel";
import { AdminStaffPanel } from "@/components/admin/AdminStaffPanel";
import { bookings as seedBookings, salon, services as seedServices, staffMembers as seedStaffMembers } from "@/lib/data";
import type { Booking, BookingStatus, Service, StaffMember } from "@/lib/types";

const tabs = [
  { id: "Dashboard", label: "Dashboard", helper: "Overview" },
  { id: "Bookings", label: "Appointments", helper: "Requests" },
  { id: "Calendar", label: "Calendar", helper: "Schedule" },
  { id: "Services", label: "Services", helper: "Menu" },
  { id: "Staff", label: "Staff", helper: "Team" },
  { id: "Customers", label: "Customers", helper: "Clients" },
  { id: "Reports", label: "Reports", helper: "Exports" },
  { id: "Settings", label: "Settings", helper: "Business" },
] as const;

type AdminTab = (typeof tabs)[number]["id"];
type BookingStatusFilter = BookingStatus | "all";

type AdminDemoState = {
  bookings: Booking[];
  services: Service[];
  staff: StaffMember[];
  shopName: string;
  shopPhone: string;
  shopHours: string;
};

const STORAGE_KEY = "prime-glow-admin-demo-state-v1";
const statusFilters: BookingStatusFilter[] = ["all", "pending", "confirmed", "completed", "cancelled", "no_show"];

const primaryButton = "rounded-full bg-rosewood px-5 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-espresso active:scale-95";
const secondaryButton = "rounded-full border border-rosewood/20 bg-white/65 px-5 py-3 text-sm font-black text-rosewood transition hover:-translate-y-0.5 hover:bg-blush active:scale-95";
const panelClass = "rounded-[2rem] border border-rosewood/10 bg-white/82 p-6 shadow-sm";

const statusStyles: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  completed: "bg-blue-100 text-blue-700",
  cancelled: "bg-zinc-200 text-zinc-700",
  no_show: "bg-red-100 text-red-700",
};

const statusLabels: Record<BookingStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No-show",
};

function StatusBadge({ status }: { status: BookingStatus }) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide ${statusStyles[status]}`}>{statusLabels[status]}</span>;
}

function timeToMinutes(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

function minutesToTime(total: number) {
  const hour = Math.floor(total / 60).toString().padStart(2, "0");
  const minute = (total % 60).toString().padStart(2, "0");
  return `${hour}:${minute}`;
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function statusFilterLabel(status: BookingStatusFilter) {
  return status === "all" ? "All" : statusLabels[status];
}

function loadDemoState(): AdminDemoState | null {
  try {
    const rawState = window.localStorage.getItem(STORAGE_KEY);
    return rawState ? (JSON.parse(rawState) as AdminDemoState) : null;
  } catch {
    return null;
  }
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("Dashboard");
  const [bookingList, setBookingList] = useState<Booking[]>(seedBookings);
  const [serviceList, setServiceList] = useState<Service[]>(seedServices);
  const [staffList, setStaffList] = useState<StaffMember[]>(seedStaffMembers);
  const [shopName, setShopName] = useState(salon.name);
  const [shopPhone, setShopPhone] = useState(salon.phone);
  const [shopHours, setShopHours] = useState(salon.openingHours);
  const [hasLoadedDemoState, setHasLoadedDemoState] = useState(false);
  const [saveMessage, setSaveMessage] = useState("Browser demo mode");

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [bookingServiceId, setBookingServiceId] = useState(seedServices[0].id);
  const [bookingStaffId, setBookingStaffId] = useState(seedStaffMembers[0].id);
  const [bookingDate, setBookingDate] = useState(todayIsoDate);
  const [bookingTime, setBookingTime] = useState("09:00");
  const [bookingStatusFilter, setBookingStatusFilter] = useState<BookingStatusFilter>("all");
  const [bookingSearch, setBookingSearch] = useState("");
  const [calendarDate, setCalendarDate] = useState(todayIsoDate);

  useEffect(() => {
    const savedState = loadDemoState();
    if (savedState) {
      setBookingList(savedState.bookings);
      setServiceList(savedState.services);
      setStaffList(savedState.staff);
      setShopName(savedState.shopName);
      setShopPhone(savedState.shopPhone);
      setShopHours(savedState.shopHours);
      setSaveMessage("Loaded saved demo data");
    }
    setHasLoadedDemoState(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedDemoState) return;

    const state: AdminDemoState = {
      bookings: bookingList,
      services: serviceList,
      staff: staffList,
      shopName,
      shopPhone,
      shopHours,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    setSaveMessage("Saved to this browser");
  }, [bookingList, serviceList, staffList, shopName, shopPhone, shopHours, hasLoadedDemoState]);

  const getService = (serviceId: string) => serviceList.find((service) => service.id === serviceId);
  const getServiceName = (serviceId: string) => getService(serviceId)?.name ?? "Service";
  const getStaffName = (staffId: string) => staffList.find((staff) => staff.id === staffId)?.name ?? "Any stylist";
  const getServicePrice = (serviceId: string) => getService(serviceId)?.price ?? 0;
  const getServiceDuration = (serviceId: string) => getService(serviceId)?.durationMinutes ?? 60;

  const validRevenueBookings = bookingList.filter((booking) => booking.status !== "cancelled" && booking.status !== "no_show");
  const todayBookings = bookingList.filter((booking) => booking.date === todayIsoDate()).length;
  const pendingBookings = bookingList.filter((booking) => booking.status === "pending").length;
  const confirmedBookings = bookingList.filter((booking) => booking.status === "confirmed").length;
  const completedBookings = bookingList.filter((booking) => booking.status === "completed").length;
  const estimatedRevenue = validRevenueBookings.reduce((sum, booking) => sum + getServicePrice(booking.serviceId), 0);
  const averageTicket = validRevenueBookings.length ? Math.round(estimatedRevenue / validRevenueBookings.length) : 0;
  const bookedHours = bookingList.reduce((sum, booking) => sum + getServiceDuration(booking.serviceId), 0) / 60;
  const activeServices = serviceList.filter((service) => service.isActive).length;

  const customers = useMemo(() => {
    const uniqueCustomers = new Map<string, { latest: Booking; bookings: Booking[]; totalSpend: number }>();

    bookingList.forEach((booking) => {
      const current = uniqueCustomers.get(booking.customerPhone);
      const bookingSpend = booking.status === "cancelled" || booking.status === "no_show" ? 0 : getServicePrice(booking.serviceId);

      if (!current) {
        uniqueCustomers.set(booking.customerPhone, { latest: booking, bookings: [booking], totalSpend: bookingSpend });
        return;
      }

      current.bookings.push(booking);
      current.totalSpend += bookingSpend;
      if (`${booking.date} ${booking.startTime}` > `${current.latest.date} ${current.latest.startTime}`) {
        current.latest = booking;
      }
    });

    return Array.from(uniqueCustomers.values()).sort((a, b) => b.totalSpend - a.totalSpend);
  }, [bookingList, serviceList]);

  const filteredBookings = useMemo(() => {
    const query = bookingSearch.trim().toLowerCase();

    return bookingList.filter((booking) => {
      const matchesStatus = bookingStatusFilter === "all" || booking.status === bookingStatusFilter;
      const searchableText = [booking.customerName, booking.customerPhone, getServiceName(booking.serviceId), getStaffName(booking.staffId), booking.date, booking.startTime].join(" ").toLowerCase();
      return matchesStatus && (!query || searchableText.includes(query));
    });
  }, [bookingList, bookingSearch, bookingStatusFilter, serviceList, staffList]);

  const pendingQueue = bookingList.filter((booking) => booking.status === "pending").slice(0, 5);
  const todaysSchedule = bookingList.filter((booking) => booking.date === todayIsoDate()).sort((a, b) => a.startTime.localeCompare(b.startTime));

  function updateBookingStatus(bookingId: string, status: BookingStatus) {
    setBookingList((currentBookings) => currentBookings.map((booking) => (booking.id === bookingId ? { ...booking, status } : booking)));
  }

  function addManualBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const serviceDuration = getServiceDuration(bookingServiceId);
    const start = timeToMinutes(bookingTime);
    const booking: Booking = {
      id: `bk-${Date.now()}`,
      customerName: customerName.trim() || "Walk-in Client",
      customerPhone: customerPhone.trim() || "No phone yet",
      serviceId: bookingServiceId,
      staffId: bookingStaffId,
      date: bookingDate,
      startTime: bookingTime,
      endTime: minutesToTime(start + serviceDuration),
      status: "pending",
    };
    setBookingList((currentBookings) => [booking, ...currentBookings]);
    setCustomerName("");
    setCustomerPhone("");
    setActiveTab("Bookings");
  }

  function resetDemoState() {
    setBookingList(seedBookings);
    setServiceList(seedServices);
    setStaffList(seedStaffMembers);
    setShopName(salon.name);
    setShopPhone(salon.phone);
    setShopHours(salon.openingHours);
    window.localStorage.removeItem(STORAGE_KEY);
    setSaveMessage("Demo reset to seed data");
  }

  function renderStatCards() {
    const statCards = [
      { label: "Today", value: todayBookings.toString(), helper: "Bookings scheduled today" },
      { label: "Pending", value: pendingBookings.toString(), helper: "Needs owner action" },
      { label: "Revenue", value: `₱${estimatedRevenue.toLocaleString()}`, helper: "Estimated income" },
      { label: "Avg. ticket", value: `₱${averageTicket.toLocaleString()}`, helper: `${bookedHours.toFixed(1)} booked hours` },
    ];

    return (
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-[1.75rem] border border-rosewood/10 bg-white/82 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
            <p className="text-sm font-bold text-espresso/55">{card.label}</p>
            <p className="mt-3 text-4xl font-black tracking-tight">{card.value}</p>
            <p className="mt-3 text-xs font-bold uppercase tracking-wide text-rosewood/60">{card.helper}</p>
          </div>
        ))}
      </div>
    );
  }

  function renderAdminHeader() {
    return (
      <div className={`${panelClass} overflow-hidden`}>
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-rosewood/70">Owner dashboard</p>
            <h2 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">Welcome back, {shopName}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-espresso/62">
              Manage appointment requests, daily schedules, services, staff, customers, reports, and business settings from one clean demo workspace.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => setActiveTab("Bookings")} className={primaryButton}>Add booking</button>
            <button type="button" onClick={() => setActiveTab("Reports")} className={secondaryButton}>View reports</button>
            <button type="button" onClick={() => setActiveTab("Services")} className={secondaryButton}>Manage services</button>
          </div>
        </div>
        <div className="mt-6 grid gap-3 rounded-[1.5rem] bg-cream p-4 text-sm font-bold text-espresso/65 md:grid-cols-3">
          <p><span className="text-rosewood">Status:</span> {saveMessage}</p>
          <p><span className="text-rosewood">Data:</span> Browser demo storage</p>
          <p><span className="text-rosewood">Mode:</span> Mock admin, no database yet</p>
        </div>
      </div>
    );
  }

  function renderBookingForm() {
    return (
      <form onSubmit={addManualBooking} className={panelClass}>
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-rosewood/70">Quick create</p>
            <h3 className="mt-2 text-2xl font-black">Add booking manually</h3>
            <p className="mt-2 text-sm text-espresso/60">For walk-ins, phone calls, Messenger bookings, or test appointments.</p>
          </div>
          <span className="w-fit rounded-full bg-blush/60 px-4 py-2 text-sm font-black text-rosewood">Auto-saved</span>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Customer name" className="input-field" />
          <input value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} placeholder="Phone number" className="input-field" />
          <input type="date" value={bookingDate} onChange={(event) => setBookingDate(event.target.value)} className="input-field" />
          <select value={bookingServiceId} onChange={(event) => setBookingServiceId(event.target.value)} className="input-field">
            {serviceList.filter((service) => service.isActive).map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}
          </select>
          <select value={bookingStaffId} onChange={(event) => setBookingStaffId(event.target.value)} className="input-field">
            {staffList.map((staff) => <option key={staff.id} value={staff.id}>{staff.name}</option>)}
          </select>
          <input type="time" value={bookingTime} onChange={(event) => setBookingTime(event.target.value)} className="input-field" />
        </div>
        <button className={`mt-5 ${primaryButton}`}>Add booking</button>
      </form>
    );
  }

  function renderBookingsTable() {
    return (
      <div className="overflow-hidden rounded-[2rem] border border-rosewood/10 bg-white/82 shadow-sm">
        <div className="flex flex-col gap-5 border-b border-rosewood/10 p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-rosewood/70">Appointment manager</p>
              <h3 className="mt-2 text-2xl font-black">Bookings management</h3>
              <p className="mt-2 text-sm text-espresso/60">Confirm, complete, cancel, search, filter, or mark no-show. Changes persist in this browser.</p>
            </div>
            <button type="button" onClick={() => setBookingList(seedBookings)} className={secondaryButton}>Reset bookings</button>
          </div>

          <div className="grid gap-3 xl:grid-cols-[1fr_auto] xl:items-center">
            <input value={bookingSearch} onChange={(event) => setBookingSearch(event.target.value)} placeholder="Search customer, phone, service, stylist, date..." className="input-field" />
            <div className="flex flex-wrap gap-2">
              {statusFilters.map((status) => (
                <button key={status} type="button" onClick={() => setBookingStatusFilter(status)} className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-wide transition ${bookingStatusFilter === status ? "bg-rosewood text-white" : "bg-cream text-espresso/60 hover:bg-blush"}`}>
                  {statusFilterLabel(status)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-blush/35 text-espresso/65">
              <tr>
                <th className="px-6 py-4 font-black">Customer</th>
                <th className="px-6 py-4 font-black">Service</th>
                <th className="px-6 py-4 font-black">Stylist</th>
                <th className="px-6 py-4 font-black">Schedule</th>
                <th className="px-6 py-4 font-black">Revenue</th>
                <th className="px-6 py-4 font-black">Status</th>
                <th className="px-6 py-4 font-black">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rosewood/10">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="transition hover:bg-blush/20">
                  <td className="px-6 py-4"><p className="font-black">{booking.customerName}</p><p className="text-espresso/55">{booking.customerPhone}</p></td>
                  <td className="px-6 py-4 font-bold">{getServiceName(booking.serviceId)}</td>
                  <td className="px-6 py-4 text-espresso/70">{getStaffName(booking.staffId)}</td>
                  <td className="px-6 py-4 text-espresso/70">{booking.date} · {booking.startTime}-{booking.endTime}</td>
                  <td className="px-6 py-4 font-black text-rosewood">₱{getServicePrice(booking.serviceId).toLocaleString()}</td>
                  <td className="px-6 py-4"><StatusBadge status={booking.status} /></td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => updateBookingStatus(booking.id, "confirmed")} className="rounded-full bg-emerald-100 px-3 py-2 text-xs font-black text-emerald-700 transition hover:-translate-y-0.5">Confirm</button>
                      <button type="button" onClick={() => updateBookingStatus(booking.id, "completed")} className="rounded-full bg-blue-100 px-3 py-2 text-xs font-black text-blue-700 transition hover:-translate-y-0.5">Complete</button>
                      <button type="button" onClick={() => updateBookingStatus(booking.id, "cancelled")} className="rounded-full bg-zinc-200 px-3 py-2 text-xs font-black text-zinc-700 transition hover:-translate-y-0.5">Cancel</button>
                      <button type="button" onClick={() => updateBookingStatus(booking.id, "no_show")} className="rounded-full bg-red-100 px-3 py-2 text-xs font-black text-red-700 transition hover:-translate-y-0.5">No-show</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!filteredBookings.length ? <p className="p-6 text-sm font-bold text-espresso/55">No bookings match your search/filter.</p> : null}
      </div>
    );
  }

  function renderDashboard() {
    return (
      <div className="space-y-8">
        {renderAdminHeader()}
        {renderStatCards()}

        <div className="grid gap-6 2xl:grid-cols-[0.95fr_1.05fr]">
          <div className={panelClass}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black">Pending queue</h3>
                <p className="mt-2 text-sm text-espresso/60">Requests waiting for confirmation.</p>
              </div>
              <button type="button" onClick={() => setActiveTab("Bookings")} className={secondaryButton}>View all</button>
            </div>
            <div className="mt-6 space-y-3">
              {pendingQueue.map((booking) => (
                <div key={booking.id} className="rounded-2xl bg-cream p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-lg font-black">{booking.customerName}</p>
                      <p className="mt-1 text-sm text-espresso/60">{getServiceName(booking.serviceId)} · {booking.date} · {booking.startTime}</p>
                      <p className="mt-1 text-xs font-bold uppercase tracking-wide text-rosewood/60">Stylist: {getStaffName(booking.staffId)}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => updateBookingStatus(booking.id, "confirmed")} className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-black text-emerald-700 transition hover:-translate-y-0.5">Confirm</button>
                      <button type="button" onClick={() => updateBookingStatus(booking.id, "cancelled")} className="rounded-full bg-zinc-200 px-4 py-2 text-sm font-black text-zinc-700 transition hover:-translate-y-0.5">Cancel</button>
                    </div>
                  </div>
                </div>
              ))}
              {!pendingQueue.length ? <p className="rounded-2xl bg-cream p-5 text-sm font-bold text-espresso/60">No pending bookings right now.</p> : null}
            </div>
          </div>

          <div className={panelClass}>
            <h3 className="text-2xl font-black">Today&apos;s schedule</h3>
            <p className="mt-2 text-sm text-espresso/60">A quick look at appointments scheduled for today.</p>
            <div className="mt-6 space-y-4">
              {todaysSchedule.map((booking) => (
                <div key={booking.id} className="grid gap-4 rounded-2xl bg-cream p-5 md:grid-cols-[90px_1fr_auto] md:items-center">
                  <div className="rounded-full bg-white px-4 py-2 text-center text-sm font-black text-rosewood">{booking.startTime}</div>
                  <div>
                    <p className="text-lg font-black">{getServiceName(booking.serviceId)}</p>
                    <p className="mt-1 text-sm text-espresso/60">{booking.customerName} · {getStaffName(booking.staffId)}</p>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>
              ))}
              {!todaysSchedule.length ? <p className="rounded-2xl bg-cream p-5 text-sm font-bold text-espresso/60">No bookings today.</p> : null}
            </div>
          </div>
        </div>

        <AdminReports bookings={bookingList} services={serviceList} staff={staffList} />
      </div>
    );
  }

  function renderCalendar() {
    const selectedDateBookings = bookingList.filter((booking) => booking.date === calendarDate);

    return (
      <div className={panelClass}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-rosewood/70">Schedule board</p>
            <h3 className="mt-2 text-2xl font-black">Daily stylist schedule</h3>
            <p className="mt-2 text-sm text-espresso/60">Calendar-style view grouped by staff for a selected date.</p>
          </div>
          <input type="date" value={calendarDate} onChange={(event) => setCalendarDate(event.target.value)} className="input-field max-w-xs" />
        </div>
        <div className="mt-6 grid gap-4 xl:grid-cols-3">
          {staffList.map((staff) => {
            const staffBookings = selectedDateBookings.filter((booking) => booking.staffId === staff.id).sort((a, b) => a.startTime.localeCompare(b.startTime));

            return (
              <div key={staff.id} className="rounded-[1.5rem] bg-cream p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-black">{staff.name}</p>
                    <p className="mt-1 text-sm text-rosewood">{staff.role}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-rosewood">{staffBookings.length} slots</span>
                </div>
                <div className="mt-5 space-y-3">
                  {staffBookings.map((booking) => (
                    <div key={booking.id} className="rounded-2xl bg-white/80 p-4 text-sm"><p className="font-black">{booking.startTime} · {getServiceName(booking.serviceId)}</p><p className="mt-1 text-espresso/60">{booking.customerName}</p><div className="mt-3"><StatusBadge status={booking.status} /></div></div>
                  ))}
                  {!staffBookings.length ? <p className="rounded-2xl bg-white/70 p-4 text-sm text-espresso/60">No bookings for this date.</p> : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function renderCustomers() {
    return (
      <div className={panelClass}>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-rosewood/70">Client list</p>
            <h3 className="mt-2 text-2xl font-black">Customers</h3>
            <p className="mt-2 text-sm text-espresso/60">Auto-generated customer records from booking history.</p>
          </div>
          <span className="w-fit rounded-full bg-blush/60 px-4 py-2 text-sm font-black text-rosewood">{customers.length} customers</span>
        </div>
        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {customers.map((customer) => (
            <div key={customer.latest.customerPhone} className="rounded-[1.5rem] bg-cream p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-black">{customer.latest.customerName}</p>
                  <p className="mt-1 text-sm text-espresso/60">{customer.latest.customerPhone}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-rosewood">{customer.bookings.length} visits</span>
              </div>
              <p className="mt-4 text-sm font-bold text-rosewood">Latest service: {getServiceName(customer.latest.serviceId)}</p>
              <p className="mt-1 text-sm text-espresso/60">Total estimated spend: ₱{customer.totalSpend.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderSettings() {
    return (
      <div className="space-y-6">
        <div className={panelClass}>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-rosewood/70">Business profile</p>
          <h3 className="mt-2 text-2xl font-black">Business settings</h3>
          <p className="mt-2 text-sm text-espresso/60">Editable demo fields. These save to browser localStorage until reset.</p>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <label className="font-black">Shop name<input value={shopName} onChange={(event) => setShopName(event.target.value)} className="input-field mt-3 font-normal" /></label>
            <label className="font-black">Phone<input value={shopPhone} onChange={(event) => setShopPhone(event.target.value)} className="input-field mt-3 font-normal" /></label>
            <label className="font-black">Opening hours<input value={shopHours} onChange={(event) => setShopHours(event.target.value)} className="input-field mt-3 font-normal" /></label>
          </div>
          <div className="mt-6 rounded-[1.5rem] bg-rosewood p-6 text-white"><p className="text-sm font-bold uppercase tracking-[0.22em] text-champagne">Live preview</p><h4 className="mt-2 text-3xl font-black">{shopName}</h4><p className="mt-2 text-white/75">{shopPhone} · {shopHours}</p></div>
        </div>

        <div className="rounded-[2rem] border border-red-100 bg-red-50 p-6 shadow-sm">
          <h3 className="text-2xl font-black text-red-700">Reset demo data</h3>
          <p className="mt-2 text-sm text-red-700/70">This clears browser-saved admin changes and restores the seed demo records.</p>
          <button type="button" onClick={resetDemoState} className="mt-5 rounded-full bg-red-600 px-6 py-3 font-black text-white transition hover:-translate-y-0.5 hover:bg-red-700">Reset all demo data</button>
        </div>
      </div>
    );
  }

  const currentTab = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  return (
    <section className="py-10 md:py-14">
      <div className="salon-container max-w-[1500px]">
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.26em] text-rosewood/70">Admin workspace</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">{currentTab.label}</h1>
          </div>
          <p className="max-w-xl text-sm leading-6 text-espresso/60">Mock owner portal for pitching salon clients. Data saves in this browser while the real database is not connected yet.</p>
        </div>

        <div className="grid gap-8 xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="h-fit rounded-[2rem] bg-espresso p-5 text-white shadow-[0_25px_90px_rgba(42,23,20,0.22)] xl:sticky xl:top-28">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-champagne">Owner panel</p>
            <h2 className="mt-3 text-3xl font-black leading-tight">{shopName}</h2>
            <p className="mt-2 text-sm text-white/55">{saveMessage}</p>

            <div className="mt-6 space-y-3 text-sm">
              <div className="rounded-2xl bg-white/10 px-4 py-3"><b>{pendingBookings}</b> pending requests</div>
              <div className="rounded-2xl bg-white/10 px-4 py-3"><b>{confirmedBookings}</b> confirmed bookings</div>
              <div className="rounded-2xl bg-white/10 px-4 py-3"><b>{activeServices}</b> active services</div>
            </div>

            <nav className="mt-8 space-y-2 text-sm font-bold">
              {tabs.map((item) => (
                <button key={item.id} type="button" onClick={() => setActiveTab(item.id)} className={`group flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition ${activeTab === item.id ? "bg-white text-rosewood shadow-soft" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
                  <span>{item.label}</span>
                  <span className={`text-[10px] uppercase tracking-wide ${activeTab === item.id ? "text-rosewood/55" : "text-white/35 group-hover:text-white/55"}`}>{item.helper}</span>
                </button>
              ))}
            </nav>
          </aside>

          <div className="min-w-0 space-y-8">
            {activeTab === "Dashboard" ? renderDashboard() : null}
            {activeTab === "Bookings" ? <div className="space-y-8">{renderBookingForm()}{renderBookingsTable()}</div> : null}
            {activeTab === "Calendar" ? renderCalendar() : null}
            {activeTab === "Services" ? <AdminServicesPanel services={serviceList} setServices={setServiceList} /> : null}
            {activeTab === "Staff" ? <AdminStaffPanel staff={staffList} services={serviceList} setStaff={setStaffList} /> : null}
            {activeTab === "Customers" ? renderCustomers() : null}
            {activeTab === "Reports" ? <AdminReports bookings={bookingList} services={serviceList} staff={staffList} /> : null}
            {activeTab === "Settings" ? renderSettings() : null}
          </div>
        </div>
      </div>
    </section>
  );
}
