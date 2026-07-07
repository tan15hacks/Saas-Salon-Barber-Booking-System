import { salon } from "@/lib/data";

export function Footer() {
  return (
    <footer className="border-t border-rosewood/10 py-10">
      <div className="salon-container flex flex-col gap-4 text-sm text-espresso/60 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} {salon.name}. Salon booking MVP demo.</p>
        <p>{salon.address} · {salon.phone}</p>
      </div>
    </footer>
  );
}
