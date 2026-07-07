"use client";

import { useEffect, useMemo, useState } from "react";
import { salon, services, staffMembers, bookings as seedBookings } from "@/lib/data";
import type { Booking } from "@/lib/types";
import { DEFAULT_WORK_HOURS, OWNER_WORKSPACE_KEY, WORK_HOURS_KEY, getAvailableSlots, isStaffFullyBookedForService, normalizeWorkHours } from "@/lib/bookingAvailability";
import type { WorkHours } from "@/lib/bookingAvailability";

const ANY_STAFF = "any";

type BookingFormLiveProps = {
  compact?: boolean;
};

type SavedWorkspaceState = {
  bookings?: Booking[];
  workHours?: WorkHours;
};

function formatTime(time: string) {
  const [hourText, minute] = time.split(":");
  const hour = Number(hourText);
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minute} ${suffix}`;
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function bookingRef() {
  const date = new Date().toISOString().slice(2, 10).replaceAll("-", "");
  const code = Math.floor(1000 + Math.random() * 9000);
  return `PG-${date}-${code}`;
}

function loadWorkspaceData() {
  try {
    const rawWorkspace = window.localStorage.getItem(OWNER_WORKSPACE_KEY);
    const workspace = rawWorkspace ? (JSON.parse(rawWorkspace) as SavedWorkspaceState) : null;
    const rawHours = window.localStorage.getItem(WORK_HOURS_KEY);
    const hours = rawHours ? (JSON.parse(rawHours) as WorkHours) : workspace?.workHours;

    return {
      bookings: workspace?.bookings ?? seedBookings,
      workHours: normalizeWorkHours(hours ?? DEFAULT_WORK_HOURS),
    };
  } catch {
    return {
      bookings: seedBookings,
      workHours: DEFAULT_WORK_HOURS,
    };
  }
}

export function BookingWizard({ compact = false }: BookingFormLiveProps) {
  const [serviceId, setServiceId] = useState(services[0].id);
  const [staffId, setStaffId] = useState(ANY_STAFF);
  const [date, setDate] = useState(todayIsoDate());
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [sent, setSent] = useState(false);
  const [reference, setReference] = useState(bookingRef());
  const [savedBookings, setSavedBookings] = useState<Booking[]>(seedBookings);
  const [workHours, setWorkHours] = useState<WorkHours>(DEFAULT_WORK_HOURS);

  useEffect(() => {
    const data = loadWorkspaceData();
    setSavedBookings(data.bookings);
    setWorkHours(data.workHours);

    function syncData() {
      const latest = loadWorkspaceData();
      setSavedBookings(latest.bookings);
      setWorkHours(latest.workHours);
    }

    window.addEventListener("storage", syncData);
    window.addEventListener("focus", syncData);
    return () => {
      window.removeEventListener("storage", syncData);
      window.removeEventListener("focus", syncData);
    };
  }, []);

  const service = services.find((item) => item.id === serviceId) ?? services[0];
  const availableStaff = useMemo(() => staffMembers.filter((member) => member.services.includes(serviceId)), [serviceId]);
  const isStaffFull = (id: string) => isStaffFullyBookedForService({ staffId: id, service, date, bookings: savedBookings, workHours });
  const allStaffFull = availableStaff.length > 0 && availableStaff.every((member) => isStaffFull(member.id));
  const selectedStaffFull = staffId !== ANY_STAFF && isStaffFull(staffId);
  const visibleTimes = getAvailableSlots({ service, staffId, date, bookings: savedBookings, staff: staffMembers, workHours });
  const selectedStaff = staffId === ANY_STAFF ? "Any available stylist" : staffMembers.find((member) => member.id === staffId)?.name ?? "Selected stylist";
  const canSend = name.trim().length > 1 && phone.trim().length > 6 && Boolean(time) && !selectedStaffFull && !allStaffFull;

  function reset() {
    setSent(false);
    setTime("");
    setName("");
    setPhone("");
    setNotes("");
    setReference(bookingRef());
  }

  function selectService(nextServiceId: string) {
    setServiceId(nextServiceId);
    setStaffId(ANY_STAFF);
    setTime("");
  }

  function selectStaff(nextStaffId: string) {
    if (nextStaffId !== ANY_STAFF) {
      const targetService = services.find((item) => item.id === serviceId) ?? services[0];
      if (isStaffFullyBookedForService({ staffId: nextStaffId, service: targetService, date, bookings: savedBookings, workHours })) return;
    }
    setStaffId(nextStaffId);
    setTime("");
  }

  function selectDate(nextDate: string) {
    setDate(nextDate);
    setTime("");
  }

  if (sent) {
    return (
      <div className="glass-card rounded-[2rem] p-6 md:p-8">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-rosewood text-2xl font-black text-white">✓</div>
        <p className="mt-6 text-sm font-black uppercase tracking-[0.28em] text-rosewood/70">Booking request sent</p>
        <h3 className="mt-3 text-3xl font-black">We received your appointment request</h3>
        <p className="mt-3 leading-7 text-espresso/70">Thanks, {name}. Your {service.name} request for {date} at {formatTime(time)} has been received. The salon will confirm by call, SMS, or message.</p>
        <div className="mt-6 rounded-3xl bg-rosewood p-5 text-white">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-champagne">Booking reference</p>
          <p className="mt-2 text-3xl font-black">{reference}</p>
          <p className="mt-2 text-sm text-white/70">Save this reference when contacting {salon.name}.</p>
        </div>
        <div className="mt-6 rounded-3xl bg-white/70 p-5 text-sm text-espresso/70">
          <p className="font-black text-espresso">Appointment summary</p>
          <p className="mt-3">{service.name}</p>
          <p>{selectedStaff}</p>
          <p>{date} · {formatTime(time)}</p>
          <p>₱{service.price.toLocaleString()} · {service.durationMinutes} mins</p>
          {notes ? <p>Note: {notes}</p> : null}
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button onClick={reset} className="rounded-full bg-rosewood px-6 py-3 font-black text-white transition hover:bg-espresso">Create another booking</button>
          <a href={`tel:${salon.phone.replaceAll(" ", "")}`} className="rounded-full border border-rosewood/20 px-6 py-3 text-center font-black text-rosewood transition hover:bg-white">Call salon</a>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-[2rem] p-5 md:p-8">
      <div className="flex flex-col gap-2 border-b border-rosewood/10 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-rosewood/70">Appointment</p>
          <h3 className="mt-2 text-3xl font-black">Book your visit</h3>
        </div>
        <p className="text-sm font-bold text-espresso/60">Hours: {formatTime(workHours.open)} – {formatTime(workHours.close)}</p>
      </div>
      <div className="mt-6 grid gap-2 sm:grid-cols-5">
        {["Service", "Stylist", "Schedule", "Details", "Confirm"].map((step, index) => <div key={step} className="rounded-2xl bg-white/70 p-3 text-center text-xs font-black uppercase tracking-wide text-espresso/60"><span className="mr-1 text-rosewood">{index + 1}</span>{step}</div>)}
      </div>
      <div className={`mt-6 grid gap-6 ${compact ? "" : "lg:grid-cols-[1fr_0.82fr]"}`}>
        <div className="space-y-6">
          <div>
            <label className="font-black">1. Select service</label>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {services.map((item) => <button key={item.id} onClick={() => selectService(item.id)} className={`rounded-3xl border p-4 text-left transition ${item.id === serviceId ? "border-rosewood bg-rosewood text-white" : "border-rosewood/10 bg-white/70 hover:border-rosewood/40"}`}><span className="block font-black">{item.name}</span><span className="mt-1 block text-sm opacity-75">₱{item.price.toLocaleString()} · {item.durationMinutes} mins</span></button>)}
            </div>
          </div>
          <div className="rounded-[1.5rem] bg-white/70 p-5"><p className="font-black">Selected service details</p><p className="mt-2 text-sm leading-6 text-espresso/65">{service.description}</p></div>
          <div>
            <label className="font-black">2. Select stylist</label>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {[{ id: ANY_STAFF, name: "Any available stylist", role: allStaffFull ? "Fully booked on this date" : "Fastest available" }, ...availableStaff].map((member) => {
                const full = member.id !== ANY_STAFF && isStaffFull(member.id);
                const disabled = member.id === ANY_STAFF ? allStaffFull : full;
                return <button key={member.id} disabled={disabled} onClick={() => selectStaff(member.id)} className={`rounded-3xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${member.id === staffId ? "border-rosewood bg-blush/70" : "border-rosewood/10 bg-white/70 hover:border-rosewood/40"}`}><span className="block font-black">{member.name}</span><span className="mt-1 block text-sm text-espresso/60">{full || (member.id === ANY_STAFF && allStaffFull) ? "Fully booked on this date" : member.role}</span></button>;
              })}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="font-black">3. Choose date</label><input type="date" value={date} min={todayIsoDate()} onChange={(event) => selectDate(event.target.value)} className="input-field mt-3" /></div>
            <div><label className="font-black">4. Your name</label><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Maria Santos" className="input-field mt-3" /></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="font-black">5. Phone number</label><input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="09XX XXX XXXX" className="input-field mt-3" /></div>
            <div><label className="font-black">Notes</label><input value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Optional request" className="input-field mt-3" /></div>
          </div>
        </div>
        <aside className="rounded-[1.5rem] bg-white/70 p-5">
          <h4 className="text-xl font-black">Available times</h4>
          <p className="mt-2 text-sm leading-6 text-espresso/60">Times are based on working hours and confirmed bookings for the selected date.</p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            {visibleTimes.map((slot) => <button key={slot} onClick={() => setTime(slot)} className={`rounded-2xl border px-3 py-3 text-sm font-black transition ${time === slot ? "border-rosewood bg-rosewood text-white" : "border-rosewood/10 bg-cream hover:border-rosewood/40"}`}>{formatTime(slot)}</button>)}
          </div>
          {visibleTimes.length === 0 ? <p className="mt-4 rounded-2xl bg-red-100 p-4 text-sm font-bold text-red-700">This staff member is fully booked on this date. Please choose another staff member or another date.</p> : null}
          <div className="mt-6 rounded-3xl bg-cream p-4 text-sm"><p className="font-black">Booking summary</p><p className="mt-2 text-espresso/65">{service.name}</p><p className="text-espresso/65">{selectedStaff}{selectedStaffFull ? " · Fully booked on this date" : ""}</p><p className="text-espresso/65">{date}{time ? ` · ${formatTime(time)}` : " · Choose a time"}</p><p className="text-espresso/65">₱{service.price.toLocaleString()} · {service.durationMinutes} mins</p>{notes ? <p className="mt-2 text-espresso/65">Note: {notes}</p> : null}</div>
          <div className="mt-5 rounded-3xl bg-white/80 p-4 text-xs leading-5 text-espresso/60"><p className="font-black text-espresso">Before you send</p><p className="mt-1">This sends a booking request. The salon will confirm your appointment.</p></div>
          <button disabled={!canSend} onClick={() => { setReference(bookingRef()); setSent(true); }} className="mt-5 w-full rounded-full bg-rosewood px-6 py-4 font-black text-white transition hover:bg-espresso disabled:cursor-not-allowed disabled:bg-rosewood/35">Send booking request</button>
        </aside>
      </div>
    </div>
  );
}
