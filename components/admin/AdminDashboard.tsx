"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { AdminReports } from "@/components/admin/AdminReports";
import { AdminServicesPanel } from "@/components/admin/AdminServicesPanel";
import { AdminStaffPanel } from "@/components/admin/AdminStaffPanel";
import { bookings as seedBookings, salon, services as seedServices, staffMembers as seedStaffMembers } from "@/lib/data";
import type { Booking, BookingStatus, Service, StaffMember } from "@/lib/types";

const tabs = ["Dashboard", "Bookings", "Calendar", "Services", "Staff", "Customers", "Reports", "Settings"] as const;
type AdminTab = (typeof tabs)[number];

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
  return <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide ${statusStyles[status]}`}>{statusLabels[status]}</span>;
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

    return Array.from(uniqueCustomers.values());
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

  function renderBookingForm() {
    return (
      <form onSubmit={addManualBooking} className="rounded-[2rem] border border-rosewood/10 bg-white/80 p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="text-2xl font-black">Add booking manually</h3>
            <p className="mt-2 text-sm text-espresso/60">For walk-ins, phone calls, Messenger, or test bookings.</p>
          </div>
          <span className="rounded-full bg-blush/60 px-4 py-2 text-sm font-black text-rosewood">Auto-saved</span>
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
        <button className="mt-5 rounded-full bg-rosewood px-6 py-3 font-black text-white transition hover:-translate-y-0.5 hover:bg-espresso">Add booking</button>
      </form>
    );
  }

  function renderBookingsTable() {
    return (
      <div className="overflow-hidden rounded-[2rem] border border-rosewood/10 bg-white/80 shadow-sm">
        <div className="flex flex-col gap-4 border-b border-rosewood/10 p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-black">Bookings management</h3>
              <p className="mt-2 text-sm text-espresso/60">Confirm, complete, cancel, search, filter, or mark no-show. This demo now persists in your browser.</p>
            </div>
            <button type="button" onClick={() => setBookingList(seedBookings)} className="rounded-full border border-rosewood/20 px-5 py-3 text-sm font-black text-rosewood transition hover:-translate-y-0.5 hover:bg-rosewood hover:text-white">Reset bookings</button>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
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
      <div className="space-y-6">
        <div className="rounded-[2rem] border border-rosewood/10 bg-white/70 p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.28em] text-rosewood/70">Owner command center</p>
              <h2 className="mt-3 text-4xl font-black">Real-deal admin demo</h2>
              <p className="mt-3 max-w-3xl leading-7 text-espresso/65">Protected by a mock owner PIN, with bookings, analytics, reports, services, staff, customers, settings, and browser-saved demo data.</p>
            </div>
            <div className="rounded-[1.5rem] bg-cream p-4 text-sm font-bold text-espresso/65">
              <p className="text-rosewood">{saveMessage}</p>
              <p className="mt-1">Changes persist on this device until reset.</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["Today", todayBookings.toString(), "Bookings scheduled today"],
            ["Pending", pendingBookings.toString(), "Needs owner action"],
            ["Revenue", `₱${estimatedRevenue.toLocaleString()}`, "Estimated income"],
            ["Avg. ticket", `₱${averageTicket.toLocaleString()}`, `${bookedHours.toFixed(1)} booked hours`],
          ].map(([label, value, helper]) => (
            <div key={label} className="rounded-[1.5rem] border border-rosewood/10 bg-white/75 p-5 transition hover:-translate-y-1 hover:shadow-soft"><p className="text-sm font-bold text-espresso/55">{label}</p><p className="mt-2 text-3xl font-black">{value}</p><p className="mt-2 text-xs font-bold uppercase tracking-wide text-rosewood/60">{helper}</p></div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-rosewood/10 bg-white/80 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black">Pending queue</h3>
                <p className="mt-2 text-sm text-espresso/60">Quick confirm requests that need attention.</p>
              </div>
              <button type="button" onClick={() => setActiveTab("Bookings")} className="rounded-full bg-rosewood px-4 py-2 text-sm font-black text-white">View all</button>
            </div>
            <div className="mt-6 space-y-3">
              {pendingQueue.map((booking) => (
                <div key={booking.id} className="rounded-2xl bg-cream p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-black">{booking.customerName}</p>
                      <p className="text-sm text-espresso/60">{getServiceName(booking.serviceId)} · {booking.date} {booking.startTime}</p>
                    </div>
                    <button type="button" onClick={() => updateBookingStatus(booking.id, "confirmed")} className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-black text-emerald-700">Confirm</button>
                  </div>
                </div>
              ))}
              {!pendingQueue.length ? <p className="rounded-2xl bg-cream p-4 text-sm font-bold text-espresso/60">No pending bookings right now.</p> : null}
            </div>
          </div>

          <div className="rounded-[2rem] border border-rosewood/10 bg-white/80 p-6 shadow-sm">
            <h3 className="text-2xl font-black">Today&apos;s schedule</h3>
            <p className="mt-2 text-sm text-espresso/60">A quick look at appointments scheduled for today.</p>
            <div className="mt-6 space-y-3">
              {todaysSchedule.map((booking) => (
                <div key={booking.id} className="grid gap-3 rounded-2xl bg-cream p-4 sm:grid-cols-[auto_1fr_auto] sm:items-center">
                  <span className="rounded-full bg-white px-3 py-2 text-sm font-black text-rosewood">{booking.startTime}</span>
                  <div>
                    <p className="font-black">{getServiceName(booking.serviceId)}</p>
                    <p className="text-sm text-espresso/60">{booking.customerName} · {getStaffName(booking.staffId)}</p>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>
              ))}
              {!todaysSchedule.length ? <p className="rounded-2xl bg-cream p-4 text-sm font-bold text-espresso/60">No bookings today.</p> : null}
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
      <div className="rounded-[2rem] border border-rosewood/10 bg-white/80 p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-2xl font-black">Daily stylist schedule</h3>
            <p className="mt-2 text-sm text-espresso/60">Calendar-style view grouped by staff for a selected date.</p>
          </div>
          <input type="date" value={calendarDate} onChange={(event) => setCalendarDate(event.target.value)} className="input-field max-w-xs" />
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {staffList.map((staff) => {
            const staffBookings = selectedDateBookings.filter((booking) => booking.staffId === staff.id).sort((a, b) => a.startTime.localeCompare(b.startTime));

            return (
              <div key={staff.id} className="rounded-[1.5rem] bg-cream p-5">
                <p className="font-black">{staff.name}</p>
                <p className="mt-1 text-sm text-rosewood">{staff.role}</p>
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
      <div className="rounded-[2rem] border border-rosewood/10 bg-white/80 p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-2xl font-black">Customers</h3>
            <p className="mt-2 text-sm text-espresso/60">Auto-generated customer list from booking records.</p>
          </div>
          <span className="rounded-full bg-blush/60 px-4 py-2 text-sm font-black text-rosewood">{customers.length} customers</span>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {customers.map((customer) => (
            <div key={customer.latest.customerPhone} className="rounded-[1.5rem] bg-cream p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-black">{customer.latest.customerName}</p>
                  <p className="mt-1 text-sm text-espresso/60">{customer.latest.customerPhone}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-rosewood">{customer.bookings.length} visits</span>
              </div>
              <p className="mt-4 text-sm font-bold text-rosewood">Latest: {getServiceName(customer.latest.serviceId)}</p>
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
        <div className="rounded-[2rem] border border-rosewood/10 bg-white/80 p-6 shadow-sm">
          <h3 className="text-2xl font-black">Business settings</h3>
          <p className="mt-2 text-sm text-espresso/60">Editable fields for demo. These now persist in browser localStorage.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <label className="font-black">Shop name<input value={shopName} onChange={(event) => setShopName(event.target.value)} className="input-field mt-3 font-normal" /></label>
            <label className="font-black">Phone<input value={shopPhone} onChange={(event) => setShopPhone(event.target.value)} className="input-field mt-3 font-normal" /></label>
            <label className="font-black">Opening hours<input value={shopHours} onChange={(event) => setShopHours(event.target.value)} className="input-field mt-3 font-normal" /></label>
          </div>
          <div className="mt-6 rounded-[1.5rem] bg-rosewood p-5 text-white"><p className="text-sm font-bold uppercase tracking-[0.22em] text-champagne">Live preview</p><h4 className="mt-2 text-2xl font-black">{shopName}</h4><p className="mt-2 text-white/75">{shopPhone} · {shopHours}</p></div>
        </div>

        <div className="rounded-[2rem] border border-red-100 bg-red-50 p-6 shadow-sm">
          <h3 className="text-2xl font-black text-red-700">Reset demo data</h3>
          <p className="mt-2 text-sm text-red-700/70">This clears browser-saved admin changes and restores the seed demo records.</p>
          <button type="button" onClick={resetDemoState} className="mt-5 rounded-full bg-red-600 px-6 py-3 font-black text-white transition hover:-translate-y-0.5 hover:bg-red-700">Reset all demo data</button>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 md:py-16">
      <div className="salon-container">
        <div className="grid gap-6 lg:grid-cols-[270px_1fr]">
          <aside className="h-fit rounded-[2rem] bg-espresso p-5 text-white lg:sticky lg:top-28">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-champagne">Owner panel</p>
            <h1 className="mt-3 text-3xl font-black">{shopName}</h1>
            <p className="mt-2 text-sm text-white/55">{saveMessage}</p>
            <div className="mt-6 grid grid-cols-3 gap-2 text-center text-xs md:grid-cols-3 lg:grid-cols-1 lg:text-left"><div className="rounded-2xl bg-white/10 p-3"><b>{pendingBookings}</b> pending</div><div className="rounded-2xl bg-white/10 p-3"><b>{confirmedBookings}</b> confirmed</div><div className="rounded-2xl bg-white/10 p-3"><b>{activeServices}</b> active services</div></div>
            <nav className="mt-8 space-y-2 text-sm font-bold text-white/70">{tabs.map((item) => <button key={item} type="button" onClick={() => setActiveTab(item)} className={`w-full rounded-2xl px-4 py-3 text-left transition hover:bg-white/10 ${activeTab === item ? "bg-white text-rosewood shadow-soft" : ""}`}>{item}</button>)}</nav>
          </aside>
          <div className="space-y-6">
            {activeTab === "Dashboard" ? renderDashboard() : null}
            {activeTab === "Bookings" ? <div className="space-y-6">{renderBookingForm()}{renderBookingsTable()}</div> : null}
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
