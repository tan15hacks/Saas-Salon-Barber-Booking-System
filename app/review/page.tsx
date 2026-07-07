import { ReviewForm } from "@/components/reviews/ReviewForm";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { salon } from "@/lib/data";

export default function ReviewPage() {
  return (
    <main className="min-h-screen bg-cream text-espresso">
      <Navbar />
      <section className="py-12 md:py-16">
        <div className="salon-container grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div>
            <span className="badge">Service rating</span>
            <h1 className="mt-5 text-5xl font-black leading-tight tracking-tight">Rate your salon experience</h1>
            <p className="mt-5 text-lg leading-8 text-espresso/70">
              Thank you for visiting {salon.name}. Scan the salon QR code anytime after your visit and share your honest experience.
            </p>
            <div className="mt-8 rounded-[1.7rem] bg-espresso p-6 text-white">
              <h2 className="text-2xl font-black">How reviews work</h2>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-white/72">
                <li>• Choose the service you received.</li>
                <li>• Select the staff member who assisted you.</li>
                <li>• Leave a star rating and short feedback.</li>
                <li>• The salon reviews feedback before showing it publicly.</li>
              </ul>
            </div>
          </div>
          <ReviewForm />
        </div>
      </section>
      <Footer />
    </main>
  );
}
