"use client";

import { useState } from "react";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import type { Service, StaffMember } from "@/lib/types";

type AdminStaffPanelProps = {
  staff: StaffMember[];
  services: Service[];
  setStaff: Dispatch<SetStateAction<StaffMember[]>>;
};

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

export function AdminStaffPanel({ staff, services, setStaff }: AdminStaffPanelProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");

  function addStaff(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) return;

    const staffMember: StaffMember = {
      id: `${slugify(cleanName)}-${Date.now()}`,
      name: cleanName,
      role: role.trim() || "Salon Staff",
      bio: bio.trim() || "New team member added from the admin demo.",
      services: services.filter((service) => service.isActive).map((service) => service.id),
    };

    setStaff((currentStaff) => [staffMember, ...currentStaff]);
    setName("");
    setRole("");
    setBio("");
  }

  function removeStaff(staffId: string) {
    setStaff((currentStaff) => currentStaff.filter((member) => member.id !== staffId));
  }

  return (
    <div className="space-y-6">
      <form onSubmit={addStaff} className="rounded-[2rem] border border-rosewood/10 bg-white/80 p-6 shadow-sm">
        <h3 className="text-2xl font-black">Add staff member</h3>
        <p className="mt-2 text-sm text-espresso/60">New staff are assigned to all active services for the mock demo.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Staff name" className="input-field" />
          <input value={role} onChange={(event) => setRole(event.target.value)} placeholder="Role" className="input-field" />
          <input value={bio} onChange={(event) => setBio(event.target.value)} placeholder="Short bio" className="input-field" />
        </div>
        <button className="mt-5 rounded-full bg-rosewood px-6 py-3 font-black text-white transition hover:-translate-y-0.5 hover:bg-espresso">Add staff</button>
      </form>

      <div className="rounded-[2rem] border border-rosewood/10 bg-white/80 p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-2xl font-black">Staff manager</h3>
            <p className="mt-2 text-sm text-espresso/60">Manage stylists and beauty staff for the salon demo.</p>
          </div>
          <span className="rounded-full bg-blush/60 px-4 py-2 text-sm font-black text-rosewood">{staff.length} staff</span>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {staff.map((member) => (
            <div key={member.id} className="rounded-[1.5rem] bg-cream p-5 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-blush text-lg font-black text-rosewood">
                {member.name.split(" ").map((part) => part[0]).join("")}
              </div>
              <h4 className="mt-4 text-xl font-black">{member.name}</h4>
              <p className="mt-1 text-sm font-bold text-rosewood">{member.role}</p>
              <p className="mt-3 text-sm leading-6 text-espresso/60">{member.bio}</p>
              <p className="mt-3 text-xs font-bold uppercase tracking-wide text-espresso/45">{member.services.length} assigned services</p>
              <button type="button" onClick={() => removeStaff(member.id)} className="mt-5 rounded-full bg-white px-4 py-2 text-sm font-black text-rosewood transition hover:-translate-y-0.5 hover:bg-rosewood hover:text-white">Remove</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
