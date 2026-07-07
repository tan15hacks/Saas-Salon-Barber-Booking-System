import type { Booking, BookingStatus, Service, StaffMember } from "./types";

export type WorkHours = {
  open: string;
  close: string;
  slotStepMinutes: number;
};

export const OWNER_WORKSPACE_KEY = "prime-glow-owner-workspace";
export const WORK_HOURS_KEY = "prime-glow-work-hours";

export const DEFAULT_WORK_HOURS: WorkHours = {
  open: "08:00",
  close: "19:00",
  slotStepMinutes: 30,
};

const BLOCKING_STATUSES: BookingStatus[] = ["pending", "confirmed", "completed"];

export function timeToMinutes(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

export function minutesToTime(total: number) {
  const hour = Math.floor(total / 60).toString().padStart(2, "0");
  const minute = (total % 60).toString().padStart(2, "0");
  return `${hour}:${minute}`;
}

export function isBlockingBooking(status: BookingStatus) {
  return BLOCKING_STATUSES.includes(status);
}

export function normalizeWorkHours(hours?: Partial<WorkHours> | null): WorkHours {
  const open = hours?.open || DEFAULT_WORK_HOURS.open;
  const close = hours?.close || DEFAULT_WORK_HOURS.close;
  const slotStepMinutes = Number(hours?.slotStepMinutes) || DEFAULT_WORK_HOURS.slotStepMinutes;

  if (timeToMinutes(open) >= timeToMinutes(close)) {
    return DEFAULT_WORK_HOURS;
  }

  return { open, close, slotStepMinutes };
}

export function getQualifiedStaff(serviceId: string, staff: StaffMember[]) {
  return staff.filter((member) => member.services.includes(serviceId));
}

export function getAvailableSlotsForStaff(params: {
  staffId: string;
  service: Service;
  date: string;
  bookings: Booking[];
  workHours: WorkHours;
}) {
  const { staffId, service, date, bookings, workHours } = params;
  const hours = normalizeWorkHours(workHours);
  const open = timeToMinutes(hours.open);
  const close = timeToMinutes(hours.close);
  const slots: string[] = [];

  for (let start = open; start + service.durationMinutes <= close; start += hours.slotStepMinutes) {
    const end = start + service.durationMinutes;
    const hasConflict = bookings.some((booking) => {
      if (booking.date !== date) return false;
      if (booking.staffId !== staffId) return false;
      if (!isBlockingBooking(booking.status)) return false;

      const bookingStart = timeToMinutes(booking.startTime);
      const bookingEnd = timeToMinutes(booking.endTime);
      return start < bookingEnd && end > bookingStart;
    });

    if (!hasConflict) slots.push(minutesToTime(start));
  }

  return slots;
}

export function getAvailableSlots(params: {
  service: Service;
  staffId: string;
  date: string;
  bookings: Booking[];
  staff: StaffMember[];
  workHours: WorkHours;
}) {
  const { service, staffId, date, bookings, staff, workHours } = params;
  const qualifiedStaff = getQualifiedStaff(service.id, staff);

  if (staffId !== "any") {
    return getAvailableSlotsForStaff({ staffId, service, date, bookings, workHours });
  }

  const allSlots = new Set<string>();
  qualifiedStaff.forEach((member) => {
    getAvailableSlotsForStaff({ staffId: member.id, service, date, bookings, workHours }).forEach((slot) => allSlots.add(slot));
  });

  return Array.from(allSlots).sort((a, b) => timeToMinutes(a) - timeToMinutes(b));
}

export function isStaffFullyBookedForService(params: {
  staffId: string;
  service: Service;
  date: string;
  bookings: Booking[];
  workHours: WorkHours;
}) {
  return getAvailableSlotsForStaff(params).length === 0;
}
