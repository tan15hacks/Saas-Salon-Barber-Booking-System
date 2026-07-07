import { BookingWizard } from "@/components/booking/BookingWizard";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { SectionHeader } from "@/components/site/SectionHeader";

export default function BookPage() {
  return (
    <main className="min-h-screen bg-cream text-espresso">
      <Navbar />
      <section className="py-12 md:py-16">
        <div className="salon-container">
          <SectionHeader eyebrow="Online booking" title="Reserve your salon appointment" description="Pick your service, stylist, date, and time. This MVP currently uses demo data and can be connected to Supabase next." />
          <div className="mt-10">
            <BookingWizard />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
