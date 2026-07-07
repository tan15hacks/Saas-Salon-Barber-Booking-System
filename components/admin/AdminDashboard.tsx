"use client";

import { useMemo, useState } from "react";
import { bookings as seedBookings, salon, services as seedServices, staffMembers as seedStaffMembers } from "@/lib/data";
import type { Booking, BookingStatus } from "@/lib/types";

const tabs = ["Dashboard", "Bookings", "Calendar", "Services", "Staff", "Customers", "Settings"] as const;

type AdminTab = (typeof tabs)[number];

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

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("Dashboard");
  const [bookingList, setBookingList] = useState<Booking[]>(seedBookings);
  const [serviceList, setServiceList] = useState(seedServices);
  const [staffList, setStaffList] = useState(seedStaffMembers);
  const [shopName, setShopName] = useState(salon.name);
  const [shopPhone, setShopPhone] = useState(salon.phone);
  const [shopHours, setShopHours] = useState(salon.openingHours);

  const getServiceName = (serviceId: string) => serviceList.find((service) => service.id === serviceId)?.name ?? "Service";
  const getStaffName = (staffId: string) => staffList.find((staff) => staff.id === staffId)?.name ?? "Any stylist";
  const getServicePrice = (serviceId: string) => serviceList.find((service) => service.id === serviceId)?.price ?? 0;

  const todayBookings = bookingList.length;
  const pendingBookings = bookingList.filter((booking) => booking.status === "pending").length;
  const confirmedBookings = bookingList.filter((booking) => booking.status === "confirmed").length;
  const completedBookings = bookingList.filter((booking) => booking.status === "completed").length;
  const estimatedRevenue = bookingList
    .filter((booking) => booking.status !== "cancelled" && booking.status !== "no_show")
    .reduce((sum, booking) => sum + getServicePrice(booking.serviceId), 0);

  const customers = useMemo(() => {
    const uniqueCustomers = new Map<string, Booking>();
    bookingList.forEach((booking) => uniqueCustomers.set(booking.customerPhone, booking));
    return Array.from(uniqueCustomers.values());
  }, [bookingList]);

  const activeServices = serviceList.filter((service) => service.isActive).length;
  const activeStaff = staffList.length;

  function updateBookingStatus(bookingId: string, status: BookingStatus) {
    setBookingList((currentBookings) =>
      currentBookings.map((booking) => (booking.id === bookingId ? { ...booking, status } : booking)),
    );
  }

  function toggleService(serviceId: string) {
    setServiceList((currentServices) =>
      currentServices.map((service) => (service.id === serviceId ? { ...service, isActive: !service.isActive } : service)),
    );
  }

  function removeStaff(staffId: string) {
    setStaffList((currentStaff) => currentStaff.filter((staff) => staff.id !== staffId));
  }

  function renderBookingsTable() {
    return (
      <div className="overflow-hidden rounded-[2rem] border border-rosewood/10 bg-white/80 shadow-sm">
        <div className="flex flex-col gap-3 border-b border-rosewood/10 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-2xl font-black">Bookings management</h3>
            <p className="mt-2 text-sm text-espresso/60">These admin buttons work locally for demo purposes. Supabase will make them permanent later.</p>
          </div>
          <button type="button" onClick={() => setBookingList(seedBookings)} className="rounded-full border border-rosewood/20 px-5 py-3 text-sm font-black text-rosewood transition hover:-translate-y-0.5 hover:bg-rosewood hover:text-white">
            Reset demo data
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="bg-blush/35 text-espresso/65">
              <tr>
                <th className="px-6 py-4 font-black">Customer</th>
                <th className="px-6 py-4 font-black">Service</th>
                <th className="px-6 py-4 font-black">Stylist</th>
                <th className="px-6 py-4 font-black">Schedule</th>
                <th className="px-6 py-4 font-black">Status</th>
                <th className="px-6 py-4 font-black">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rosewood/10">
              {bookingList.map((booking) => (
                <tr key={booking.id} className="transition hover:bg-blush/20">
                  <td className="px-6 py-4">
                    <p className="font-black">{booking.customerName}</p>
                    <p className="text-espresso/55">{booking.customerPhone}</p>
                  </td>
                  <td className="px-6 py-4 font-bold">{getServiceName(booking.serviceId)}</td>
                  <td className="px-6 py-4 text-espresso/70">{getStaffName(booking.staffId)}</td>
                  <td className="px-6 py-4 text-espresso/70">{booking.date} · {booking.startTime}</td>
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
      </div>
    );
  }

  function renderDashboard() {
    return (
      <div className="space-y-6">
        <div className="rounded-[2rem] border border-rosewood/10 bg-white/70 p-6 shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-rosewood/70">Interactive owner panel</p>
          <h2 className="mt-3 text-4xl font-black">Manage salon bookings at a glance</h2>
          <p className="mt-3 max-w-3xl leading-7 text-espresso/65">Click the sidebar tabs and booking action buttons. This is now a working front-end demo that will be connected to a real database next.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["Today", todayBookings.toString()],
            ["Pending", pendingBookings.toString()],
            ["Confirmed", confirmedBookings.toString()],
            ["Revenue", `₱${estimatedRevenue.toLocaleString()}`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[1.5rem] border border-rosewood/10 bg-white/70 p-5 transition hover:-translate-y-1 hover:shadow-soft">
              <p className="text-sm font-bold text-espresso/55">{label}</p>
              <p className="mt-2 text-3xl font-black">{value}</p>
            </div>
          ))}
        </div>

        {renderBookingsTable()}
      </div>
    );
  }

  function renderCalendar() {
    return (
      <div className="rounded-[2rem] border border-rosewood/10 bg-white/80 p-6 shadow-sm">
        <h3 className="text-2xl font-black">Daily stylist schedule</h3>
        <p className="mt-2 text-sm text-espresso/60">A simple calendar-style view for the salon owner.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {staffList.map((staff) => (
            <div key={staff.id} className="rounded-[1.5rem] bg-cream p-5">
              <p className="font-black">{staff.name}</p>
              <p className="mt-1 text-sm text-rosewood">{staff.role}</p>
              <div className="mt-5 space-y-3">
                {bookingList.filter((booking) => booking.staffId === staff.id).map((booking) => (
                  <div key={booking.id} className="rounded-2xl bg-white/80 p-4 text-sm">
                    <p className="font-black">{booking.startTime} · {getServiceName(booking.serviceId)}</p>
                    <p className="mt-1 text-espresso/60">{booking.customerName}</p>
                    <div className="mt-3"><StatusBadge status={booking.status} /></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderServices() {
    return (
      <div className="rounded-[2rem] border border-rosewood/10 bg-white/80 p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-2xl font-black">Services</h3>
            <p className="mt-2 text-sm text-espresso/60">Toggle services on/off for demo. Real add/edit forms come with database integration.</p>
          </div>
          <span className="rounded-full bg-blush/60 px-4 py-2 text-sm font-black text-rosewood">{activeServices} active services</span>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {serviceList.map((service) => (
            <div key={service.id} className="rounded-[1.5rem] border border-rosewood/10 bg-cream p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-rosewood/70">{service.category}</p>
                  <h4 className="mt-2 text-xl font-black">{service.name}</h4>
                  <p className="mt-2 text-sm text-espresso/60">₱{service.price.toLocaleString()} · {service.durationMinutes} mins</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${service.isActive ? "bg-emerald-100 text-emerald-700" : "bg-zinc-200 text-zinc-700"}`}>{service.isActive ? "Active" : "Hidden"}</span>
              </div>
              <button type="button" onClick={() => toggleService(service.id)} className="mt-5 rounded-full bg-rosewood px-4 py-2 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-espresso">
                {service.isActive ? "Hide service" : "Show service"}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderStaff() {
    return (
      <div className="rounded-[2rem] border border-rosewood/10 bg-white/80 p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-2xl font-black">Staff</h3>
            <p className="mt-2 text-sm text-espresso/60">Remove a stylist locally to test how the admin panel reacts.</p>
          </div>
          <button type="button" onClick={() => setStaffList(seedStaffMembers)} className="rounded-full border border-rosewood/20 px-5 py-3 text-sm font-black text-rosewood transition hover:bg-rosewood hover:text-white">Reset staff</button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {staffList.map((staff) => (
            <div key={staff.id} className="rounded-[1.5rem] bg-cream p-5 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-blush text-lg font-black text-rosewood">
                {staff.name.split(" ").map((part) => part[0]).join("")}
              </div>
              <h4 className="mt-4 text-xl font-black">{staff.name}</h4>
              <p className="mt-1 text-sm font-bold text-rosewood">{staff.role}</p>
              <p className="mt-3 text-sm leading-6 text-espresso/60">{staff.bio}</p>
              <button type="button" onClick={() => removeStaff(staff.id)} className="mt-5 rounded-full bg-white px-4 py-2 text-sm font-black text-rosewood transition hover:-translate-y-0.5 hover:bg-rosewood hover:text-white">Remove from demo</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderCustomers() {
    return (
      <div className="rounded-[2rem] border border-rosewood/10 bg-white/80 p-6 shadow-sm">
        <h3 className="text-2xl font-black">Customers</h3>
        <p className="mt-2 text-sm text-espresso/60">Auto-generated from booking records.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {customers.map((customer) => (
            <div key={customer.customerPhone} className="rounded-[1.5rem] bg-cream p-5">
              <p className="font-black">{customer.customerName}</p>
              <p className="mt-1 text-sm text-espresso/60">{customer.customerPhone}</p>
              <p className="mt-3 text-sm font-bold text-rosewood">Latest: {getServiceName(customer.serviceId)}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderSettings() {
    return (
      <div className="rounded-[2rem] border border-rosewood/10 bg-white/80 p-6 shadow-sm">
        <h3 className="text-2xl font-black">Business settings</h3>
        <p className="mt-2 text-sm text-espresso/60">Editable fields for demo. Later, these become saved shop settings.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <label className="font-black">
            Shop name
            <input value={shopName} onChange={(event) => setShopName(event.target.value)} className="input-field mt-3 font-normal" />
          </label>
          <label className="font-black">
            Phone
            <input value={shopPhone} onChange={(event) => setShopPhone(event.target.value)} className="input-field mt-3 font-normal" />
          </label>
          <label className="font-black">
            Opening hours
            <input value={shopHours} onChange={(event) => setShopHours(event.target.value)} className="input-field mt-3 font-normal" />
          </label>
        </div>
        <div className="mt-6 rounded-[1.5rem] bg-rosewood p-5 text-white">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-champagne">Live preview</p>
          <h4 className="mt-2 text-2xl font-black">{shopName}</h4>
          <p className="mt-2 text-white/75">{shopPhone} · {shopHours}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 md:py-16">
      <div className="salon-container">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-[2rem] bg-espresso p-5 text-white lg:sticky lg:top-28">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-champagne">Owner panel</p>
            <h1 className="mt-3 text-3xl font-black">{shopName}</h1>
            <div className="mt-6 grid grid-cols-3 gap-2 text-center text-xs md:grid-cols-3 lg:grid-cols-1 lg:text-left">
              <div className="rounded-2xl bg-white/10 p-3"><b>{pendingBookings}</b> pending</div>
              <div className="rounded-2xl bg-white/10 p-3"><b>{completedBookings}</b> done</div>
              <div className="rounded-2xl bg-white/10 p-3"><b>{activeStaff}</b> staff</div>
            </div>
            <nav className="mt-8 space-y-2 text-sm font-bold text-white/70">
              {tabs.map((item) => (
                <button key={item} type="button" onClick={() => setActiveTab(item)} className={`w-full rounded-2xl px-4 py-3 text-left transition hover:bg-white/10 ${activeTab === item ? "bg-white text-rosewood shadow-soft" : ""}`}>
                  {item}
                </button>
              ))}
            </nav>
          </aside>

          <div className="space-y-6">
            {activeTab === "Dashboard" ? renderDashboard() : null}
            {activeTab === "Bookings" ? renderBookingsTable() : null}
            {activeTab === "Calendar" ? renderCalendar() : null}
            {activeTab === "Services" ? renderServices() : null}
            {activeTab === "Staff" ? renderStaff() : null}
            {activeTab === "Customers" ? renderCustomers() : null}
            {activeTab === "Settings" ? renderSettings() : null}
          </div>
        </div>
      </div>
    </section>
  );
}
