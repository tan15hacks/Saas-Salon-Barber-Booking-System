"use client";

import { useState } from "react";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import type { Service, ServiceCategory } from "@/lib/types";

const categories: ServiceCategory[] = ["Hair", "Color", "Treatment", "Makeup", "Nails"];

type AdminServicesPanelProps = {
  services: Service[];
  setServices: Dispatch<SetStateAction<Service[]>>;
};

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

export function AdminServicesPanel({ services, setServices }: AdminServicesPanelProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ServiceCategory>("Hair");
  const [price, setPrice] = useState("500");
  const [duration, setDuration] = useState("60");

  function addService(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) return;

    const service: Service = {
      id: `${slugify(cleanName)}-${Date.now()}`,
      name: cleanName,
      description: description.trim() || "Custom salon service added from the admin demo.",
      category,
      price: Number(price) || 0,
      durationMinutes: Number(duration) || 60,
      isActive: true,
    };

    setServices((currentServices) => [service, ...currentServices]);
    setName("");
    setDescription("");
    setPrice("500");
    setDuration("60");
  }

  function toggleService(serviceId: string) {
    setServices((currentServices) => currentServices.map((service) => (service.id === serviceId ? { ...service, isActive: !service.isActive } : service)));
  }

  function deleteService(serviceId: string) {
    setServices((currentServices) => currentServices.filter((service) => service.id !== serviceId));
  }

  return (
    <div className="space-y-6">
      <form onSubmit={addService} className="rounded-[2rem] border border-rosewood/10 bg-white/80 p-6 shadow-sm">
        <h3 className="text-2xl font-black">Add service</h3>
        <p className="mt-2 text-sm text-espresso/60">Create a new salon service for the demo. This stays in the browser until reset.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-5">
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Service name" className="input-field md:col-span-2" />
          <select value={category} onChange={(event) => setCategory(event.target.value as ServiceCategory)} className="input-field">
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
          <input value={price} onChange={(event) => setPrice(event.target.value)} type="number" min="0" placeholder="Price" className="input-field" />
          <input value={duration} onChange={(event) => setDuration(event.target.value)} type="number" min="15" step="15" placeholder="Minutes" className="input-field" />
        </div>
        <input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Short description" className="input-field mt-4" />
        <button className="mt-5 rounded-full bg-rosewood px-6 py-3 font-black text-white transition hover:-translate-y-0.5 hover:bg-espresso">Add service</button>
      </form>

      <div className="rounded-[2rem] border border-rosewood/10 bg-white/80 p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-2xl font-black">Services manager</h3>
            <p className="mt-2 text-sm text-espresso/60">Show, hide, or delete services from the admin demo.</p>
          </div>
          <span className="rounded-full bg-blush/60 px-4 py-2 text-sm font-black text-rosewood">{services.filter((service) => service.isActive).length} active</span>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {services.map((service) => (
            <div key={service.id} className="rounded-[1.5rem] border border-rosewood/10 bg-cream p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-rosewood/70">{service.category}</p>
                  <h4 className="mt-2 text-xl font-black">{service.name}</h4>
                  <p className="mt-2 text-sm text-espresso/60">₱{service.price.toLocaleString()} · {service.durationMinutes} mins</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${service.isActive ? "bg-emerald-100 text-emerald-700" : "bg-zinc-200 text-zinc-700"}`}>{service.isActive ? "Active" : "Hidden"}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-espresso/60">{service.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <button type="button" onClick={() => toggleService(service.id)} className="rounded-full bg-rosewood px-4 py-2 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-espresso">{service.isActive ? "Hide" : "Show"}</button>
                <button type="button" onClick={() => deleteService(service.id)} className="rounded-full bg-red-100 px-4 py-2 text-sm font-black text-red-700 transition hover:-translate-y-0.5">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
