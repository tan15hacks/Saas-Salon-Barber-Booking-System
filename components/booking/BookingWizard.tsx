"use client";

import { useMemo, useState } from "react";
import { bookings, salon, services, staffMembers } from "@/lib/data";
import type { Service } from "@/lib/types";

type BookingWizardProps = {
  compact?: boolean;
};

type Step = "details" | "confirmed";

const ANY_STAFF = "any";

const progressSteps = ["Service", "Stylist", "Schedule", "Details", "Confirm"];

const serviceIncludes: Record<string, string[]> = {
  "haircut-blowdry": ["Consultation", "Haircut", "Blow dry finish"],
  "hair-color": ["Color consultation", "Single-process color", "Aftercare advice"],
  "keratin-treatment": ["Hair assessment", "Smoothing treatment", "Shine finish"],
  "manicure-gel": ["Cuticle care", "Nail shaping", "Gel polish"],
  "event-makeup": ["Skin prep", "Soft glam makeup", "Touch-up guidance"],
  "hair-spa": ["Scalp massage", "Treatment mask", "Soft finish"],
};

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function timeToMinutes(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

function minutesToTime(totalMinutes: number) {
  const hour = Math.floor(totalMinutes / 60).toString().padStart(2, "0");
  const minute = (totalMinutes % 60).toString().padStart(2, "0");
  return `${hour}:${minute}`;
}

function formatTime(time: string) {
  const [hourText, minute] = time.split(":");
  const hour = Number(hourText);
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minute} ${suffix}`;
}

function getSlots(service: Service, selectedStaffId: string, selectedDate: string) {
  const open = timeToMinutes("09:00");
  const close = timeToMinutes("19:00");
  const slotStep = 30;
  const qualifiedStaff = staffMembers.filter((staff) => staff.services.includes(service.id));
  const staffPool = selectedStaffId === ANY_STAFF ? qualifiedStaff : qualifiedStaff.filter((staff) => staff.id === selectedStaffId);
  const possibleSlots: string[] = [];

  if (staffPool.length === 0) return possibleSlots;

  for (let minutes = open; minutes + service.durationMinutes <= close; minutes += slotStep) {
    const start = minutes;
    const end = minutes + service.durationMinutes;
    const isBlockedForEveryStaff = staffPool.every((staff) => {
      return bookings.some((booking) => {
        if (booking.date !== selectedDate || booking.staffId !== staff.id) return false;
        const bookingStart = timeToMinutes(booking.startTime);
        const bookingEnd = timeToMinutes(booking.endTime);
        return start < bookingEnd && end > bookingStart;
      });
    });

    if (!isBlockedForEveryStaff) {
      possibleSlots.push(minutesToTime(minutes));
    }
  }

  return possibleSlots;
}

function findStaffLabel(staffId: string) {
  if (staffId === ANY_STAFF) return "Any available stylist";
  return staffMembers.find((staff) => staff.id === staffId)?.name ?? "Stylist";
}

function createBookingReference() {
  const datePart = new Date().toISOString().slice(2, 10).replaceAll("-", "");
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `PG-${datePart}-${randomPart}`;
}

export function BookingWizard({ compact = false }: BookingWizardProps) {
  const [serviceId, setServiceId] = useState(services[0].id);
  const [staffId, setStaffId] = useState(ANY_STAFF);
  const [date, setDate] = useState(todayIsoDate);
  const [time, setTime] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState<Step>("details");
  const [bookingReference, setBookingReference] = useState(createBookingReference);

  const selectedService = services.find((service) => service.id === serviceId) ?? services[0];
  const availableStaff = useMemo(() => staffMembers.filter((staff) => staff.services.includes(serviceId)), [serviceId]);
  const availableSlots = useMemo(() => getSlots(selectedService, staffId, date), [selectedService, staffId, date]);
  const selectedIncludes = serviceIncludes[selectedService.id] ?? ["Consultation", "Service", "Finish"];

  const canConfirm = customerName.trim().length > 1 && customerPhone.trim().length > 6 && Boolean(time);

  function handleServiceChange(nextServiceId: string) {
    const currentStaff = staffMembers.find((staff) => staff.id === staffId);

    setServiceId(nextServiceId);
    setTime("");

    if (staffId !== ANY_STAFF && !currentStaff?.services.includes(nextServiceId)) {
      setStaffId(ANY_STAFF);
    }
  }

  function handleStaffChange(nextStaffId: string) {
    setStaffId(nextStaffId);
    setTime("");
  }

  function handleDateChange(nextDate: string) {
    setDate(nextDate);
    setTime("");
  }

  function submitBooking() {
    setBookingReference(createBookingReference());
    setStep("confirmed");
  }

  function resetBooking() {
    setStep("details");
    setTime("");
    setCustomerName("");
    setCustomerPhone("");
    setNotes("");
    setBookingReference(createBookingReference());
  }

  if (step === "confirmed") {
    return (
      <div className="glass-card rounded-[2rem] p-6 md:p-8">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-rosewood text-2xl font-black text-white">✓</div>
        <p className="mt-6 text-sm font-black uppercase tracking-[0.28em] text-rosewood/70">Booking request sent</p>
        <h3 className="mt-3 text-3xl font-black">We received your appointment request</h3>
        <p className="mt-3 leading-7 text-espresso/70">
          Thanks, {customerName}. Your {selectedService.name} request for {date} at {formatTime(time)} has been received. The salon will confirm by call, SMS, or message.
        </p>

        <div className="mt-6 rounded-3xl bg-rosewood p-5 text-white">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-champagne">Booking reference</p>
          <p className="mt-2 text-3xl font-black">{bookingReference}</p>
          <p className="mt-2 text-sm text-white/70">Save this reference when contacting {salon.name}.</p>
        </div>

        <div className="mt-6 rounded-3xl bg-white/70 p-5">
          <p className="font-black">Appointment summary</p>
          <dl className="mt-4 grid gap-3 text-sm text-espresso/70 sm:grid-cols-2">
            <div><dt className="font-bold text-espresso">Service</dt><dd>{selectedService.name}</dd></div>
            <div><dt className="font-bold text-espresso">Stylist</dt><dd>{findStaffLabel(staffId)}</dd></div>
            <div><dt className="font-bold text-espresso">Price</dt><dd>₱{selectedService.price.toLocaleString()}</dd></div>
            <div><dt className="font-bold text-espresso">Duration</dt><dd>{selectedService.durationMinutes} mins</dd></div>
            <div><dt className="font-bold text-espresso">Date</dt><dd>{date}</dd></div>
            <div><dt className="font-bold text-espresso">Time</dt><dd>{formatTime(time)}</dd></div>
            <div><dt className="font-bold text-espresso">Contact</dt><dd>{customerPhone}</dd></div>
            {notes ? <div><dt className="font-bold text-espresso">Notes</dt><dd>{notes}</dd></div> : null}
          </dl>
        </div>

        <div className="mt-6 rounded-3xl bg-cream p-5 text-sm leading-6 text-espresso/65">
          <p className="font-black text-espresso">Reminder</p>
          <p className="mt-2">Please arrive 10 minutes early. If you need to cancel or reschedule, contact {salon.phone} at least 3 hours before your appointment.</p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button onClick={resetBooking} className="rounded-full bg-rosewood px-6 py-3 font-black text-white transition hover:bg-espresso">
            Create another booking
          </button>
          <a href={`tel:${salon.phone.replaceAll(" ", "")}`} className="rounded-full border border-rosewood/20 px-6 py-3 text-center font-black text-rosewood transition hover:bg-white">
            Call salon
          </a>
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
        <p className="text-sm font-bold text-espresso/60">Request first · Salon confirms after</p>
      </div>

      <div className="mt-6 grid gap-2 sm:grid-cols-5">
        {progressSteps.map((progressStep, index) => (
          <div key={progressStep} className="rounded-2xl bg-white/70 p-3 text-center text-xs font-black uppercase tracking-wide text-espresso/60">
            <span className="mr-1 text-rosewood">{index + 1}</span>{progressStep}
          </div>
        ))}
      </div>

      <div className={`mt-6 grid gap-6 ${compact ? "" : "lg:grid-cols-[1fr_0.82fr]"}`}>
        <div className="space-y-6">
          <div>
            <label className="font-black">1. Select service</label>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {services.map((service) => (
                <button key={service.id} onClick={() => handleServiceChange(service.id)} className={`rounded-3xl border p-4 text-left transition ${service.id === serviceId ? "border-rosewood bg-rosewood text-white" : "border-rosewood/10 bg-white/70 hover:border-rosewood/40"}`}>
                  <span className="block font-black">{service.name}</span>
                  <span className={`mt-1 block text-sm ${service.id === serviceId ? "text-white/75" : "text-espresso/60"}`}>₱{service.price.toLocaleString()} · {service.durationMinutes} mins</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-white/70 p-5">
            <p className="font-black">Selected service details</p>
            <p className="mt-2 text-sm leading-6 text-espresso/65">{selectedService.description}</p>
            <ul className="mt-4 grid gap-2 text-sm text-espresso/65 sm:grid-cols-3">
              {selectedIncludes.map((item) => <li key={item} className="rounded-2xl bg-cream px-3 py-2 font-bold">✓ {item}</li>)}
            </ul>
          </div>

          <div>
            <label className="font-black">2. Select stylist</label>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {[{ id: ANY_STAFF, name: "Any available stylist", role: "Fastest available" }, ...availableStaff].map((staff) => (
                <button key={staff.id} onClick={() => handleStaffChange(staff.id)} className={`rounded-3xl border p-4 text-left transition ${staff.id === staffId ? "border-rosewood bg-blush/70" : "border-rosewood/10 bg-white/70 hover:border-rosewood/40"}`}>
                  <span className="block font-black">{staff.name}</span>
                  <span className="mt-1 block text-sm text-espresso/60">{staff.role}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="font-black" htmlFor="date">3. Choose date</label>
              <input id="date" type="date" value={date} min={todayIsoDate()} onChange={(event) => handleDateChange(event.target.value)} className="input-field mt-3" />
            </div>
            <div>
              <label className="font-black" htmlFor="name">4. Your name</label>
              <input id="name" value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Maria Santos" className="input-field mt-3" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="font-black" htmlFor="phone">5. Phone number</label>
              <input id="phone" value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} placeholder="09XX XXX XXXX" className="input-field mt-3" />
            </div>
            <div>
              <label className="font-black" htmlFor="notes">Notes</label>
              <input id="notes" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Optional request" className="input-field mt-3" />
            </div>
          </div>
        </div>

        <aside className="rounded-[1.5rem] bg-white/70 p-5">
          <h4 className="text-xl font-black">Available times</h4>
          <p className="mt-2 text-sm leading-6 text-espresso/60">Slots are calculated from demo bookings and the selected service duration.</p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            {availableSlots.slice(0, 12).map((slot) => (
              <button key={slot} onClick={() => setTime(slot)} className={`rounded-2xl border px-3 py-3 text-sm font-black transition ${time === slot ? "border-rosewood bg-rosewood text-white" : "border-rosewood/10 bg-cream hover:border-rosewood/40"}`}>
                {formatTime(slot)}
              </button>
            ))}
          </div>
          {availableSlots.length === 0 ? <p className="mt-4 rounded-2xl bg-red-100 p-4 text-sm font-bold text-red-700">No available time slots for this date and stylist. Try another option.</p> : null}

          <div className="mt-6 rounded-3xl bg-cream p-4 text-sm">
            <p className="font-black">Booking summary</p>
            <p className="mt-2 text-espresso/65">{selectedService.name}</p>
            <p className="text-espresso/65">{findStaffLabel(staffId)}</p>
            <p className="text-espresso/65">{date}{time ? ` · ${formatTime(time)}` : " · Choose a time"}</p>
            <p className="text-espresso/65">₱{selectedService.price.toLocaleString()} · {selectedService.durationMinutes} mins</p>
            {notes ? <p className="mt-2 text-espresso/65">Note: {notes}</p> : null}
          </div>

          <div className="mt-5 rounded-3xl bg-white/80 p-4 text-xs leading-5 text-espresso/60">
            <p className="font-black text-espresso">Before you send</p>
            <p className="mt-1">This sends a booking request. The salon still needs to confirm your appointment.</p>
          </div>

          <button disabled={!canConfirm} onClick={submitBooking} className="mt-5 w-full rounded-full bg-rosewood px-6 py-4 font-black text-white transition hover:bg-espresso disabled:cursor-not-allowed disabled:bg-rosewood/35">
            Send booking request
          </button>
        </aside>
      </div>
    </div>
  );
}
