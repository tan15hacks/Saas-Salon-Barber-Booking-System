"use client";

import { useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";

const OWNER_PIN = "primeglow2026";
const SESSION_KEY = "prime-glow-owner-session";

type AdminLoginGateProps = {
  children: ReactNode;
};

export function AdminLoginGate({ children }: AdminLoginGateProps) {
  const [mounted, setMounted] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  const [pin, setPin] = useState(OWNER_PIN);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
    setIsAllowed(window.localStorage.getItem(SESSION_KEY) === "true");
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pin.trim() !== OWNER_PIN) {
      setError("Invalid demo owner PIN.");
      return;
    }

    window.localStorage.setItem(SESSION_KEY, "true");
    setIsAllowed(true);
    setError("");
  }

  function handleLogout() {
    window.localStorage.removeItem(SESSION_KEY);
    setIsAllowed(false);
  }

  if (!mounted) {
    return <section className="py-16"><div className="salon-container rounded-[2rem] bg-white/70 p-8">Loading owner area...</div></section>;
  }

  if (!isAllowed) {
    return (
      <section className="relative overflow-hidden py-12 md:py-16">
        <div className="absolute left-1/2 top-10 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-blush blur-3xl" />
        <div className="salon-container grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <span className="badge">Hidden owner portal</span>
            <h1 className="mt-5 text-5xl font-black leading-tight tracking-tight md:text-6xl">Salon owner access</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-espresso/70">
              This admin area is intentionally hidden from the public navbar. Open /admin directly, enter the demo PIN, and manage the salon from a polished owner dashboard.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {["Mock protected", "Browser-saved data", "No database yet"].map((item) => (
                <div key={item} className="rounded-[1.4rem] border border-rosewood/10 bg-white/75 p-4 text-sm font-black text-espresso/70 shadow-sm">{item}</div>
              ))}
            </div>

            <div className="mt-8 rounded-[1.7rem] bg-espresso p-6 text-white shadow-[0_25px_90px_rgba(42,23,20,0.22)]">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-champagne">Demo owner PIN</p>
              <p className="mt-4 text-3xl font-black">{OWNER_PIN}</p>
              <p className="mt-3 text-sm leading-6 text-white/65">This is only a front-end mock for demo purposes. Real authentication comes later with Supabase Auth.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="glass-card rounded-[2rem] p-6 md:p-8">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-rosewood/70">Owner login</p>
            <h2 className="mt-2 text-3xl font-black">Enter dashboard</h2>
            <p className="mt-2 text-sm leading-6 text-espresso/60">Use the demo PIN to access bookings, services, staff, reports, customers, and settings.</p>
            <label className="mt-6 block font-black">
              Owner PIN
              <input value={pin} onChange={(event) => setPin(event.target.value)} className="input-field mt-3 font-normal" />
            </label>
            {error ? <p className="mt-4 rounded-2xl bg-red-100 px-4 py-3 text-sm font-bold text-red-700">{error}</p> : null}
            <button className="mt-6 w-full rounded-full bg-rosewood px-6 py-4 font-black text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-espresso active:scale-95">
              Open owner dashboard
            </button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <>
      <div className="salon-container mt-8 flex justify-end">
        <button type="button" onClick={handleLogout} className="rounded-full bg-espresso px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-rosewood active:scale-95">
          Logout owner
        </button>
      </div>
      {children}
    </>
  );
}
