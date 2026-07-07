import Link from "next/link";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { SectionHeader } from "@/components/site/SectionHeader";
import { salon, services, staffMembers } from "@/lib/data";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-cream text-espresso">
      <Navbar />

      <section className="relative py-16 md:py-24">
        <div className="absolute left-1/2 top-10 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-blush blur-3xl" />
        <div className="salon-container grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <span className="badge">Salon booking MVP</span>
            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
              Book beautiful salon appointments in seconds.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-espresso/72">
              {salon.name} is the first demo brand for your salon-first SaaS booking system. Customers can pick a service, select a stylist, choose a time, and send a booking request without messaging back and forth.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/book" className="rounded-full bg-rosewood px-7 py-4 text-center font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-espresso">
                Book appointment
              </Link>
              <Link href="/admin" className="rounded-full border border-rosewood/25 px-7 py-4 text-center font-bold text-rosewood transition hover:-translate-y-0.5 hover:bg-white">
                View admin demo
              </Link>
            </div>
            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              {["24/7 online booking", "Staff schedules", "Owner dashboard"].map((item) => (
                <div key={item} className="rounded-3xl border border-rosewood/10 bg-white/60 p-4 text-sm font-bold text-espresso/75">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-[2rem] p-5 md:p-7">
            <div className="rounded-[1.5rem] bg-gradient-to-br from-rosewood via-espresso to-rosewood p-6 text-white">
              <p className="text-sm font-bold uppercase tracking-[0.32em] text-champagne">Today at {salon.name}</p>
              <h2 className="mt-10 text-4xl font-black">12 appointments booked</h2>
              <p className="mt-3 text-white/70">A clean preview of what salon owners see when they manage online appointments.</p>
              <div className="mt-8 space-y-3">
                {[
                  ["09:30 AM", "Haircut & Blow Dry", "Mika"],
                  ["11:00 AM", "Gloss Treatment", "Isabelle"],
                  ["02:30 PM", "Bridal Trial Makeup", "Lara"],
                ].map(([time, service, stylist]) => (
                  <div key={time} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-black">{service}</p>
                        <p className="text-sm text-white/65">Stylist: {stylist}</p>
                      </div>
                      <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-bold">{time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-16">
        <div className="salon-container">
          <SectionHeader eyebrow="Services" title="Salon services ready for online booking" description="Use this list as demo data now. Later, every salon owner can manage these from their dashboard." />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article key={service.id} className="rounded-[1.7rem] border border-rosewood/10 bg-white/70 p-6 shadow-sm">
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-rosewood/70">{service.category}</p>
                <h3 className="mt-4 text-2xl font-black">{service.name}</h3>
                <p className="mt-3 min-h-16 text-sm leading-6 text-espresso/65">{service.description}</p>
                <div className="mt-6 flex items-center justify-between border-t border-rosewood/10 pt-5">
                  <span className="text-xl font-black">₱{service.price.toLocaleString()}</span>
                  <span className="rounded-full bg-blush/60 px-3 py-1 text-sm font-bold text-rosewood">{service.durationMinutes} mins</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="staff" className="py-16">
        <div className="salon-container">
          <SectionHeader eyebrow="Stylists" title="Customers can choose their preferred stylist" description="For the MVP, staff data is static. Next, this becomes a CRUD page for each salon owner." />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {staffMembers.map((member) => (
              <article key={member.id} className="rounded-[1.7rem] border border-rosewood/10 bg-white/70 p-6 text-center shadow-sm">
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-blush to-champagne text-2xl font-black text-rosewood">
                  {member.name.split(" ").map((part) => part[0]).join("")}
                </div>
                <h3 className="mt-5 text-2xl font-black">{member.name}</h3>
                <p className="mt-1 font-bold text-rosewood">{member.role}</p>
                <p className="mt-3 text-sm leading-6 text-espresso/65">{member.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="booking" className="py-16">
        <div className="salon-container grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div>
            <SectionHeader eyebrow="Booking flow" title="The sales feature clients understand fast" description="This is the main product: customers can book without waiting for manual replies on Messenger." />
            <div className="mt-8 rounded-[1.7rem] bg-espresso p-6 text-white">
              <h3 className="text-2xl font-black">MVP booking rules</h3>
              <ul className="mt-5 space-y-3 text-sm text-white/72">
                <li>• Time slots depend on service duration.</li>
                <li>• Pending bookings can temporarily block the selected slot.</li>
                <li>• Admin can later confirm, cancel, complete, or mark no-show.</li>
              </ul>
            </div>
          </div>
          <BookingWizard compact />
        </div>
      </section>

      <section className="py-16">
        <div className="salon-container rounded-[2rem] bg-rosewood p-8 text-white md:p-12">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-champagne">Client-ready offer</p>
              <h2 className="mt-4 text-4xl font-black">Use this demo to pitch your first salon client.</h2>
              <p className="mt-4 max-w-2xl text-white/75">Customize the logo, services, staff, colors, photos, contact info, and booking rules. Then charge a setup fee plus monthly maintenance.</p>
            </div>
            <Link href="/admin" className="rounded-full bg-white px-7 py-4 text-center font-black text-rosewood transition hover:-translate-y-0.5">
              Open dashboard
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
