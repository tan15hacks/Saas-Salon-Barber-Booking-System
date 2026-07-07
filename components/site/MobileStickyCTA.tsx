import Link from "next/link";

export function MobileStickyCTA() {
  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 px-4 md:hidden">
      <div className="mx-auto flex max-w-sm items-center justify-between gap-3 rounded-full border border-rosewood/15 bg-cream/90 p-2 shadow-[0_20px_70px_rgba(42,23,20,0.18)] backdrop-blur-xl">
        <div className="pl-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-rosewood/70">Ready?</p>
          <p className="text-sm font-black text-espresso">Book your visit</p>
        </div>
        <Link href="/book" className="rounded-full bg-rosewood px-5 py-3 text-sm font-black text-white shadow-soft active:scale-95">
          Book now
        </Link>
      </div>
    </div>
  );
}
