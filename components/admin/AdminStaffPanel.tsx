"use client";

import { useMemo, useState } from "react";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import type { Service, StaffMember } from "@/lib/types";

type AdminStaffPanelProps = {
  staff: StaffMember[];
  services: Service[];
  setStaff: Dispatch<SetStateAction<StaffMember[]>>;
};

const panelClass = "rounded-[2rem] border border-rosewood/10 bg-white/82 p-6 shadow-sm";
const primaryButton = "rounded-full bg-rosewood px-5 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-espresso active:scale-95";
const secondaryButton = "rounded-full border border-rosewood/20 bg-white/65 px-5 py-3 text-sm font-black text-rosewood transition hover:-translate-y-0.5 hover:bg-blush active:scale-95";

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

export function AdminStaffPanel({ staff, services, setStaff }: AdminStaffPanelProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [search, setSearch] = useState("");

  const activeServices = services.filter((service) => service.isActive);
  const totalAssignments = staff.reduce((sum, member) => sum + member.services.length, 0);
  const averageAssignments = staff.length ? Math.round(totalAssignments / staff.length) : 0;

  const filteredStaff = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return staff;

    return staff.filter((member) => {
      const serviceNames = member.services.map((serviceId) => services.find((service) => service.id === serviceId)?.name ?? "").join(" ");
      return [member.name, member.role, member.bio, serviceNames].join(" ").toLowerCase().includes(query);
    });
  }, [staff, services, search]);

  function addStaff(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) return;

    const staffMember: StaffMember = {
      id: `${slugify(cleanName)}-${Date.now()}`,
      name: cleanName,
      role: role.trim() || "Salon Staff",
      bio: bio.trim() || "New team member added from the admin demo.",
      services: activeServices.map((service) => service.id),
    };

    setStaff((currentStaff) => [staffMember, ...currentStaff]);
    setName("");
    setRole("");
    setBio("");
  }

  function removeStaff(staffId: string) {
    setStaff((currentStaff) => currentStaff.filter((member) => member.id !== staffId));
  }

  function getServiceNames(serviceIds: string[]) {
    return serviceIds.map((serviceId) => services.find((service) => service.id === serviceId)?.name).filter(Boolean) as string[];
  }

  return (
    <div className="space-y-8">
      <div className={panelClass}>
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-rosewood/70">Team manager</p>
            <h3 className="mt-2 text-3xl font-black">Manage salon staff</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-espresso/60">Add stylists, beauty artists, and staff profiles. New staff are assigned to all active services for this demo.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[480px]">
            <div className="rounded-[1.4rem] bg-cream p-4"><p className="text-xs font-black uppercase tracking-wide text-rosewood/60">Staff</p><p className="mt-1 text-2xl font-black">{staff.length}</p></div>
            <div className="rounded-[1.4rem] bg-cream p-4"><p className="text-xs font-black uppercase tracking-wide text-rosewood/60">Active services</p><p className="mt-1 text-2xl font-black">{activeServices.length}</p></div>
            <div className="rounded-[1.4rem] bg-cream p-4"><p className="text-xs font-black uppercase tracking-wide text-rosewood/60">Avg. assigned</p><p className="mt-1 text-2xl font-black">{averageAssignments}</p></div>
          </div>
        </div>
      </div>

      <form onSubmit={addStaff} className={panelClass}>
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-rosewood/70">Add team member</p>
            <h3 className="mt-2 text-2xl font-black">Create a staff profile</h3>
            <p className="mt-2 text-sm text-espresso/60">Useful for showing salon owners how team management will work.</p>
          </div>
          <span className="w-fit rounded-full bg-blush/60 px-4 py-2 text-sm font-black text-rosewood">Assigned to active services</span>
        </div>
        <div className="mt-6 grid gap-4 xl:grid-cols-3">
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Staff name" className="input-field" />
          <input value={role} onChange={(event) => setRole(event.target.value)} placeholder="Role / specialty" className="input-field" />
          <input value={bio} onChange={(event) => setBio(event.target.value)} placeholder="Short bio" className="input-field" />
        </div>
        <button className={`mt-5 ${primaryButton}`}>Add staff</button>
      </form>

      <div className={panelClass}>
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-rosewood/70">Staff directory</p>
            <h3 className="mt-2 text-2xl font-black">Staff manager</h3>
            <p className="mt-2 text-sm text-espresso/60">Search staff and review their assigned bookable services.</p>
          </div>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search staff, role, service..." className="input-field xl:max-w-md" />
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-3">
          {filteredStaff.map((member) => {
            const assignedServices = getServiceNames(member.services);
            return (
              <div key={member.id} className="rounded-[1.5rem] border border-rosewood/10 bg-cream p-5">
                <div className="flex items-start gap-4">
                  <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-blush text-lg font-black text-rosewood">
                    {member.name.split(" ").map((part) => part[0]).join("")}
                  </div>
                  <div>
                    <h4 className="text-xl font-black">{member.name}</h4>
                    <p className="mt-1 text-sm font-bold text-rosewood">{member.role}</p>
                    <p className="mt-2 text-sm leading-6 text-espresso/60">{member.bio}</p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-white/70 p-4">
                  <p className="text-xs font-black uppercase tracking-wide text-rosewood/60">Assigned services</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {assignedServices.slice(0, 4).map((serviceName) => (
                      <span key={serviceName} className="rounded-full bg-cream px-3 py-1 text-xs font-black text-espresso/60">{serviceName}</span>
                    ))}
                    {assignedServices.length > 4 ? <span className="rounded-full bg-blush px-3 py-1 text-xs font-black text-rosewood">+{assignedServices.length - 4} more</span> : null}
                    {!assignedServices.length ? <span className="text-sm text-espresso/55">No assigned services.</span> : null}
                  </div>
                </div>

                <button type="button" onClick={() => removeStaff(member.id)} className={`mt-5 ${secondaryButton}`}>Remove staff</button>
              </div>
            );
          })}
        </div>
        {!filteredStaff.length ? <p className="mt-6 rounded-2xl bg-cream p-5 text-sm font-bold text-espresso/60">No staff match your search.</p> : null}
      </div>
    </div>
  );
}
