export type ServiceCategory = "Hair" | "Color" | "Treatment" | "Makeup" | "Nails";

export type Service = {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  price: number;
  durationMinutes: number;
  isActive: boolean;
};

export type StaffMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  services: string[];
};

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled" | "no_show";

export type Booking = {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceId: string;
  staffId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  notes?: string;
};

export type SalonProfile = {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  openingHours: string;
};
