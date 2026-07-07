import Link from "next/link";
import { salon } from "@/lib/data";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/#services", label: "Services" },
  { href: "/#staff", label: "Stylists" },
  { href: "/book", label: "Book" },
];

export function Navbar() {
  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-rosewood/10 bg-cream/88 shadow-[0_10px_40px_rgba(122,56,72,0.08)] backdrop-blur-xl supports-[backdrop-filter]:bg-cream/72">
        <div className="salon-container flex h-20 items-center justify-between gap-6">
          <Link href="/" className="group flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-rosewood text-lg font-black text-white shadow-soft transition duration-300 group-hover:rotate-6 group-hover:scale-105">PG</div>
            <div>
              <p className="font-black leading-none">{salon.name}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-rosewood/65">Booking SaaS Demo</p>
            </div>
          </Link>
          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-full px-4 py-2 text-sm font-bold text-espresso/70 transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-rosewood hover:shadow-sm">
                {item.label}
              </Link>
            ))}
          </nav>
          <Link href="/book" className="rounded-full bg-rosewood px-5 py-3 text-sm font-black text-white shadow-soft transition duration-300 hover:-translate-y-0.5 hover:bg-espresso">
            Book now
          </Link>
        </div>
      </header>
      <div className="h-20" aria-hidden="true" />
    </>
  );
}
