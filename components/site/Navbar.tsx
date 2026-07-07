import Link from "next/link";
import { salon } from "@/lib/data";

const navItems = [
  { href: "/#services", label: "Services" },
  { href: "/#staff", label: "Stylists" },
  { href: "/book", label: "Book" },
  { href: "/admin", label: "Admin" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-rosewood/10 bg-cream/82 backdrop-blur-xl">
      <div className="salon-container flex h-20 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-full bg-rosewood text-lg font-black text-white">PG</div>
          <div>
            <p className="font-black leading-none">{salon.name}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-rosewood/65">Booking SaaS Demo</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-full px-4 py-2 text-sm font-bold text-espresso/70 transition hover:bg-white hover:text-rosewood">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/book" className="rounded-full bg-rosewood px-5 py-3 text-sm font-black text-white transition hover:bg-espresso">
          Book now
        </Link>
      </div>
    </header>
  );
}
