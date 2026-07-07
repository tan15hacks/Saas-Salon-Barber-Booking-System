import Link from "next/link";
import { BookingWizard } from "@/components/booking/BookingFormLive";
import { Footer } from "@/components/site/Footer";
import { MobileStickyCTA } from "@/components/site/MobileStickyCTA";
import { Navbar } from "@/components/site/Navbar";
import { SectionHeader } from "@/components/site/SectionHeader";
import { salon, services, staffMembers } from "@/lib/data";

const reviews = [
  ["Angela D.", "Haircut & Blow Dry", "Booking was so easy. I chose my stylist and time in less than a minute."],
  ["Trisha M.", "Full Hair Color", "The service cards helped me choose the right appointment before messaging the salon."],
  ["Kath R.", "Event Makeup", "I loved seeing the summary before sending my request. It felt clear and professional."],
];

const gallery = [
  ["Soft waves finish", "Hair styling", "from-rosewood via-blush to-champagne"],
  ["Glossy brown color", "Hair color", "from-espresso via-rosewood to-blush"],
  ["Clean gel manicure", "Nails", "from-champagne via-blush to-rosewood"],
  ["Event-ready makeup", "Makeup", "from-rosewood via-espresso to-champagne"],
  ["Relaxing hair spa", "Treatment", "from-blush via-champagne to-cream"],
  ["Modern salon space", "Studio", "from-espresso via-rosewood to-champagne"],
];

const faqs = [
  ["Do I need to wait for confirmation?", "Yes. Your request is sent first, then the salon confirms by call, SMS, or message."],
  ["Can I choose a specific stylist?", "Yes. You can choose a preferred stylist or select any available stylist for the fastest schedule."],
  ["Can I book same-day appointments?", "Same-day slots are available when the schedule still has open time."],
  ["Can I reschedule my visit?", "Yes. Contact the salon with your booking reference so the team can assist you."],
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-cream pb-24 text-espresso md:pb-0">
      <Navbar />

      <section className="relative py-16 md:py-24">
        <div className="absolute left-1/2 top-10 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-blush blur-3xl" />
        <div className="salon-container grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <span className="badge">4.9 ★ rated salon · {salon.address}</span>
            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">Look good, feel confident — book your salon visit in seconds.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-espresso/72">{salon.name} helps you reserve hair, beauty, nail, and makeup appointments without waiting for back-and-forth messages.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/book" className="rounded-full bg-rosewood px-7 py-4 text-center font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-espresso active:scale-95">Book appointment</Link>
              <Link href="#services" className="rounded-full border border-rosewood/25 px-7 py-4 text-center font-bold text-rosewood transition hover:-translate-y-0.5 hover:bg-white active:scale-95">View services</Link>
            </div>
            <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-4">
              {["500+ happy visits", "Same-day slots", "Clear prices", "Open 9AM–7PM"].map((item) => <div key={item} className="rounded-3xl border border-rosewood/10 bg-white/60 p-4 text-sm font-bold text-espresso/75">{item}</div>)}
            </div>
          </div>

          <div className="glass-card rounded-[2rem] p-5 md:p-7">
            <div className="rounded-[1.5rem] bg-gradient-to-br from-rosewood via-espresso to-rosewood p-6 text-white">
              <p className="text-sm font-bold uppercase tracking-[0.32em] text-champagne">Today at {salon.name}</p>
              <h2 className="mt-10 text-4xl font-black">12 appointments booked</h2>
              <p className="mt-3 text-white/70">A quick look at the salon schedule for the day.</p>
              <div className="mt-8 space-y-3">
                {[["09:30 AM", "Haircut & Blow Dry", "Mika"], ["11:00 AM", "Gloss Treatment", "Isabelle"], ["02:30 PM", "Event Makeup", "Lara"]].map(([time, service, stylist]) => <div key={time} className="rounded-2xl border border-white/10 bg-white/10 p-4"><div className="flex items-center justify-between gap-4"><div><p className="font-black">{service}</p><p className="text-sm text-white/65">Stylist: {stylist}</p></div><span className="rounded-full bg-white/15 px-3 py-1 text-sm font-bold">{time}</span></div></div>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-16">
        <div className="salon-container">
          <SectionHeader eyebrow="Services" title="Salon services with clear prices and durations" description="Compare services, see what is included, and start booking from the service card." />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => <article key={service.id} className="rounded-[1.7rem] border border-rosewood/10 bg-white/70 p-6 shadow-sm"><p className="text-sm font-bold uppercase tracking-[0.25em] text-rosewood/70">{service.category}</p><h3 className="mt-4 text-2xl font-black">{service.name}</h3><p className="mt-3 min-h-16 text-sm leading-6 text-espresso/65">{service.description}</p><div className="mt-6 flex items-center justify-between border-t border-rosewood/10 pt-5"><div><span className="block text-xl font-black">₱{service.price.toLocaleString()}</span><span className="text-sm font-bold text-espresso/55">{service.durationMinutes} mins</span></div><Link href="/book" className="rounded-full bg-rosewood px-4 py-2 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-espresso">Book</Link></div></article>)}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="salon-container grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <SectionHeader eyebrow="Why choose us" title="A smooth booking experience made for salon customers" description="See prices, duration, stylist options, location, and confirmation details before sending your request." />
          <div className="grid gap-4 sm:grid-cols-2">{["No waiting for replies", "Transparent service pricing", "Choose your preferred stylist", "Clear booking summary", "Mobile-friendly booking", "Fast confirmation process"].map((item) => <div key={item} className="rounded-[1.5rem] border border-rosewood/10 bg-white/75 p-5 font-black shadow-sm"><span className="mr-2 text-rosewood">✓</span>{item}</div>)}</div>
        </div>
      </section>

      <section id="staff" className="py-16">
        <div className="salon-container">
          <SectionHeader eyebrow="Stylists" title="Choose your preferred beauty professional" description="Select a specific stylist or choose any available staff for the fastest schedule." />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {staffMembers.map((member) => <article key={member.id} className="rounded-[1.7rem] border border-rosewood/10 bg-white/70 p-6 text-center shadow-sm"><div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-blush to-champagne text-2xl font-black text-rosewood">{member.name.split(" ").map((part) => part[0]).join("")}</div><h3 className="mt-5 text-2xl font-black">{member.name}</h3><p className="mt-1 font-bold text-rosewood">{member.role}</p><p className="mt-3 text-sm leading-6 text-espresso/65">{member.bio}</p><Link href="/book" className="mt-5 inline-flex rounded-full border border-rosewood/20 px-5 py-3 text-sm font-black text-rosewood transition hover:bg-rosewood hover:text-white">Book with {member.name.split(" ")[0]}</Link></article>)}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="salon-container">
          <SectionHeader eyebrow="Gallery" title="A visual portfolio customers can trust" description="Explore popular looks, treatments, and salon styles before choosing your appointment." />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map(([title, tag, gradient], index) => <div key={title} className={`group relative min-h-64 overflow-hidden rounded-[2rem] bg-gradient-to-br ${gradient} p-6 text-white shadow-sm ${index === 0 ? "lg:row-span-2" : ""}`}><div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.3),transparent_35%)]" /><div className="absolute bottom-6 left-6 right-6"><p className="text-sm font-bold uppercase tracking-[0.25em] text-white/65">{tag}</p><h3 className="mt-2 text-2xl font-black">{title}</h3></div></div>)}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="salon-container">
          <SectionHeader eyebrow="Reviews" title="Customers feel confident before booking" description="Hear from customers who booked their visit online." />
          <div className="mt-10 grid gap-5 md:grid-cols-3">{reviews.map(([name, service, quote]) => <article key={name} className="rounded-[1.7rem] border border-rosewood/10 bg-white/75 p-6 shadow-sm"><p className="text-xl text-rosewood">★★★★★</p><p className="mt-4 leading-7 text-espresso/75">“{quote}”</p><div className="mt-6 border-t border-rosewood/10 pt-4"><p className="font-black">{name}</p><p className="text-sm font-bold text-rosewood">{service}</p></div></article>)}</div>
        </div>
      </section>

      <section id="booking" className="py-16">
        <div className="salon-container grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div>
            <SectionHeader eyebrow="Booking flow" title="Reserve without messaging back and forth" description="Choose your service, stylist, schedule, and contact details with a clear summary before sending." />
            <div className="mt-8 rounded-[1.7rem] bg-white/75 p-6 shadow-sm"><h3 className="text-2xl font-black">What happens after booking?</h3><ul className="mt-5 space-y-3 text-sm leading-6 text-espresso/65"><li>• You receive a booking reference number.</li><li>• The salon confirms your request by call, SMS, or message.</li><li>• Save your reference in case you need to reschedule.</li></ul></div>
          </div>
          <BookingWizard compact />
        </div>
      </section>

      <section className="py-16">
        <div className="salon-container grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[2rem] border border-rosewood/10 bg-white/80 p-8 shadow-sm"><p className="text-sm font-black uppercase tracking-[0.28em] text-rosewood/70">Visit us</p><h2 className="mt-4 text-4xl font-black">Location & hours</h2><div className="mt-6 space-y-4 text-espresso/70"><p><b className="text-espresso">Address:</b> {salon.address}</p><p><b className="text-espresso">Phone:</b> {salon.phone}</p><p><b className="text-espresso">Email:</b> hello@primeglowstudio.com</p><p><b className="text-espresso">Hours:</b> {salon.openingHours}</p></div></div>
          <div className="min-h-80 rounded-[2rem] bg-gradient-to-br from-blush via-champagne to-rosewood p-8 text-white shadow-sm"><p className="text-sm font-black uppercase tracking-[0.28em] text-white/70">Find us</p><h3 className="mt-4 text-4xl font-black">Rizal Street, Legazpi City</h3><p className="mt-4 max-w-md text-white/75">Visit our studio for hair, beauty, nails, and makeup appointments in the heart of Legazpi City.</p></div>
        </div>
      </section>

      <section className="py-16"><div className="salon-container"><SectionHeader eyebrow="FAQ" title="Common questions before booking" description="Find quick answers before sending your appointment request." /><div className="mt-10 grid gap-4 md:grid-cols-2">{faqs.map(([question, answer]) => <div key={question} className="rounded-[1.5rem] border border-rosewood/10 bg-white/75 p-6 shadow-sm"><h3 className="text-xl font-black">{question}</h3><p className="mt-3 leading-7 text-espresso/65">{answer}</p></div>)}</div></div></section>

      <section className="py-16"><div className="salon-container rounded-[2rem] bg-rosewood p-8 text-white md:p-12"><div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center"><div><p className="text-sm font-bold uppercase tracking-[0.3em] text-champagne">Ready for your glow-up?</p><h2 className="mt-4 text-4xl font-black">Book your next salon appointment today.</h2><p className="mt-4 max-w-2xl text-white/75">Choose your service, stylist, date, and time in one guided booking flow.</p></div><Link href="/book" className="rounded-full bg-white px-7 py-4 text-center font-black text-rosewood transition hover:-translate-y-0.5 active:scale-95">Start booking</Link></div></div></section>

      <MobileStickyCTA />
      <Footer />
    </main>
  );
}
