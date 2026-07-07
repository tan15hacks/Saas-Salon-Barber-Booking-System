import { BookingWizard } from "@/components/booking/BookingWizard";
import { Footer } from "@/components/site/Footer";
import { MobileStickyCTA } from "@/components/site/MobileStickyCTA";
import { Navbar } from "@/components/site/Navbar";
import { SectionHeader } from "@/components/site/SectionHeader";
import { salon } from "@/lib/data";

const bookingSteps = [
  "Choose your service",
  "Pick a stylist or any available staff",
  "Select your date and time",
  "Enter your contact details",
  "Send your booking request",
];

export default function BookPage() {
  return (
    <main className="min-h-screen bg-cream pb-24 text-espresso md:pb-0">
      <Navbar />

      <section className="py-12 md:py-16">
        <div className="salon-container grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <SectionHeader eyebrow="Online booking" title="Reserve your salon appointment" description="Pick your service, stylist, date, and time. Your request gets a reference number so the salon can confirm it clearly." />
            <div className="mt-8 rounded-[1.7rem] bg-white/80 p-6 shadow-sm">
              <h2 className="text-2xl font-black">How booking works</h2>
              <div className="mt-5 space-y-3">
                {bookingSteps.map((step, index) => (
                  <div key={step} className="flex gap-3 rounded-2xl bg-cream p-4">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-rosewood text-sm font-black text-white">{index + 1}</span>
                    <p className="font-bold text-espresso/75">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-[1.7rem] bg-espresso p-6 text-white">
              <h2 className="text-2xl font-black">Booking policy</h2>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-white/72">
                <li>• Please arrive 10 minutes before your appointment.</li>
                <li>• The salon will confirm your request by call, SMS, or message.</li>
                <li>• Late arrivals may be rescheduled depending on availability.</li>
                <li>• Cancellations should be made at least 3 hours before the appointment.</li>
                <li>• For urgent concerns, contact {salon.phone}.</li>
              </ul>
            </div>
          </div>

          <BookingWizard />
        </div>
      </section>

      <MobileStickyCTA />
      <Footer />
    </main>
  );
}
