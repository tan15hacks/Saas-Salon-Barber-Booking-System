"use client";

import { useMemo, useState } from "react";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import type { Service, ServiceCategory } from "@/lib/types";

const categories: ServiceCategory[] = ["Hair", "Color", "Treatment", "Makeup", "Nails"];
const panelClass = "rounded-[2rem] border border-rosewood/10 bg-white/82 p-6 shadow-sm";
const primaryButton = "rounded-full bg-rosewood px-5 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-espresso active:scale-95";
const secondaryButton = "rounded-full border border-rosewood/20 bg-white/65 px-5 py-3 text-sm font-black text-rosewood transition hover:-translate-y-0.5 hover:bg-blush active:scale-95";

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
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ServiceCategory | "All">("All");

  const activeServices = services.filter((service) => service.isActive);
  const averagePrice = activeServices.length ? Math.round(activeServices.reduce((sum, service) => sum + service.price, 0) / activeServices.length) : 0;
  const averageDuration = activeServices.length ? Math.round(activeServices.reduce((sum, service) => sum + service.durationMinutes, 0) / activeServices.length) : 0;

  const filteredServices = useMemo(() => {
    const query = search.trim().toLowerCase();
    return services.filter((service) => {
      const matchesCategory = categoryFilter === "All" || service.category === categoryFilter;
      const matchesQuery = !query || [service.name, service.description, service.category].join(" ").toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [services, search, categoryFilter]);

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
    <div className="space-y-8">
      <div className={panelClass}>
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-rosewood/70">Service menu</p>
            <h3 className="mt-2 text-3xl font-black">Manage salon services</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-espresso/60">Create, hide, show, and review the services customers can book. This demo data saves in your browser.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[480px]">
            <div className="rounded-[1.4rem] bg-cream p-4"><p className="text-xs font-black uppercase tracking-wide text-rosewood/60">Active</p><p className="mt-1 text-2xl font-black">{activeServices.length}</p></div>
            <div className="rounded-[1.4rem] bg-cream p-4"><p className="text-xs font-black uppercase tracking-wide text-rosewood/60">Avg. price</p><p className="mt-1 text-2xl font-black">₱{averagePrice.toLocaleString()}</p></div>
            <div className="rounded-[1.4rem] bg-cream p-4"><p className="text-xs font-black uppercase tracking-wide text-rosewood/60">Avg. time</p><p className="mt-1 text-2xl font-black">{averageDuration}m</p></div>
          </div>
        </div>
      </div>

      <form onSubmit={addService} className={panelClass}>
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-rosewood/70">Add service</p>
            <h3 className="mt-2 text-2xl font-black">Create a new bookable service</h3>
            <p className="mt-2 text-sm text-espresso/60">Add realistic service details for client presentations.</p>
          </div>
          <span className="w-fit rounded-full bg-blush/60 px-4 py-2 text-sm font-black text-rosewood">Customer-facing</span>
        </div>
        <div className="mt-6 grid gap-4 xl:grid-cols-5">
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Service name" className="input-field xl:col-span-2" />
          <select value={category} onChange={(event) => setCategory(event.target.value as ServiceCategory)} className="input-field">
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
          <input value={price} onChange={(event) => setPrice(event.target.value)} type="number" min="0" placeholder="Price" className="input-field" />
          <input value={duration} onChange={(event) => setDuration(event.target.value)} type="number" min="15" step="15" placeholder="Minutes" className="input-field" />
        </div>
        <input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Short service description" className="input-field mt-4" />
        <button className={`mt-5 ${primaryButton}`}>Add service</button>
      </form>

      <div className={panelClass}>
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-rosewood/70">Service library</p>
            <h3 className="mt-2 text-2xl font-black">Services manager</h3>
            <p className="mt-2 text-sm text-espresso/60">Search, filter, hide, show, or delete services from the demo.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row xl:min-w-[560px]">
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search services..." className="input-field" />
            <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value as ServiceCategory | "All")} className="input-field sm:max-w-[190px]">
              <option>All</option>
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {filteredServices.map((service) => (
            <div key={service.id} className="rounded-[1.5rem] border border-rosewood/10 bg-cream p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-rosewood/70">{service.category}</p>
                  <h4 className="mt-2 text-xl font-black">{service.name}</h4>
                  <p className="mt-2 text-sm font-bold text-espresso/60">₱{service.price.toLocaleString()} · {service.durationMinutes} mins</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${service.isActive ? "bg-emerald-100 text-emerald-700" : "bg-zinc-200 text-zinc-700"}`}>{service.isActive ? "Active" : "Hidden"}</span>
              </div>
              <p className="mt-4 text-sm leading-6 text-espresso/60">{service.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <button type="button" onClick={() => toggleService(service.id)} className={service.isActive ? secondaryButton : primaryButton}>{service.isActive ? "Hide service" : "Show service"}</button>
                <button type="button" onClick={() => deleteService(service.id)} className="rounded-full bg-red-100 px-5 py-3 text-sm font-black text-red-700 transition hover:-translate-y-0.5 hover:bg-red-200">Delete</button>
              </div>
            </div>
          ))}
        </div>
        {!filteredServices.length ? <p className="mt-6 rounded-2xl bg-cream p-5 text-sm font-bold text-espresso/60">No services match your search/filter.</p> : null}
      </div>
    </div>
  );
}
