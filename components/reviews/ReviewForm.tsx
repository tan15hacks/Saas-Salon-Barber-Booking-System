"use client";

import { useState } from "react";
import { salon, services, staffMembers } from "@/lib/data";
import { createReviewId, loadReviews, saveReviews } from "@/lib/reviews";
import type { ServiceReview } from "@/lib/reviews";

const starValues = [1, 2, 3, 4, 5];

export function ReviewForm() {
  const [customerName, setCustomerName] = useState("");
  const [contact, setContact] = useState("");
  const [serviceId, setServiceId] = useState(services[0].id);
  const [staffId, setStaffId] = useState(staffMembers[0].id);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [wouldRecommend, setWouldRecommend] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const selectedService = services.find((service) => service.id === serviceId) ?? services[0];
  const selectedStaff = staffMembers.find((staff) => staff.id === staffId) ?? staffMembers[0];
  const canSubmit = customerName.trim().length > 1 && comment.trim().length > 4 && rating >= 1;

  function submitReview() {
    if (!canSubmit) return;

    const review: ServiceReview = {
      id: createReviewId(),
      customerName: customerName.trim(),
      contact: contact.trim() || undefined,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      staffId: selectedStaff.id,
      staffName: selectedStaff.name,
      rating,
      comment: comment.trim(),
      wouldRecommend,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    saveReviews([review, ...loadReviews()]);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="glass-card rounded-[2rem] p-6 md:p-8">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-rosewood text-2xl font-black text-white">✓</div>
        <p className="mt-6 text-sm font-black uppercase tracking-[0.28em] text-rosewood/70">Review submitted</p>
        <h1 className="mt-3 text-4xl font-black">Thank you for your feedback</h1>
        <p className="mt-3 max-w-2xl leading-7 text-espresso/70">
          Your review has been sent to {salon.name}. Reviews are checked by the salon team before appearing publicly.
        </p>
        <a href="/" className="mt-7 inline-flex rounded-full bg-rosewood px-6 py-3 font-black text-white transition hover:bg-espresso">Back to home</a>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-[2rem] p-6 md:p-8">
      <p className="text-sm font-black uppercase tracking-[0.28em] text-rosewood/70">Customer feedback</p>
      <h1 className="mt-3 text-4xl font-black md:text-5xl">How was your visit?</h1>
      <p className="mt-3 max-w-2xl leading-7 text-espresso/70">
        Tell us about your service experience. Your feedback helps the salon improve and helps future customers choose with confidence.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <label className="font-black">
          Your name
          <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Maria Santos" className="input-field mt-3 font-normal" />
        </label>
        <label className="font-black">
          Phone or booking reference <span className="font-bold text-espresso/45">optional</span>
          <input value={contact} onChange={(event) => setContact(event.target.value)} placeholder="09XX XXX XXXX or PG-xxxx" className="input-field mt-3 font-normal" />
        </label>
        <label className="font-black">
          Service received
          <select value={serviceId} onChange={(event) => setServiceId(event.target.value)} className="input-field mt-3 font-normal">
            {services.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}
          </select>
        </label>
        <label className="font-black">
          Staff / stylist
          <select value={staffId} onChange={(event) => setStaffId(event.target.value)} className="input-field mt-3 font-normal">
            {staffMembers.map((staff) => <option key={staff.id} value={staff.id}>{staff.name}</option>)}
          </select>
        </label>
      </div>

      <div className="mt-8 rounded-[1.5rem] bg-white/70 p-5">
        <p className="font-black">Overall rating</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {starValues.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className={`rounded-2xl px-4 py-3 text-2xl transition ${rating >= value ? "bg-rosewood text-white" : "bg-cream text-rosewood"}`}
              aria-label={`${value} star rating`}
            >
              ★
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm font-bold text-espresso/60">{rating} out of 5 stars</p>
      </div>

      <label className="mt-6 block font-black">
        Tell us about your experience
        <textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Share what you liked about the service..." className="input-field mt-3 min-h-32 resize-none font-normal" />
      </label>

      <div className="mt-6 rounded-[1.5rem] bg-cream p-5">
        <p className="font-black">Would you recommend us?</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={() => setWouldRecommend(true)} className={`rounded-full px-5 py-3 font-black ${wouldRecommend ? "bg-rosewood text-white" : "bg-white text-rosewood"}`}>Yes</button>
          <button type="button" onClick={() => setWouldRecommend(false)} className={`rounded-full px-5 py-3 font-black ${!wouldRecommend ? "bg-rosewood text-white" : "bg-white text-rosewood"}`}>No</button>
        </div>
      </div>

      <button disabled={!canSubmit} onClick={submitReview} className="mt-7 w-full rounded-full bg-rosewood px-6 py-4 font-black text-white shadow-soft transition hover:bg-espresso disabled:cursor-not-allowed disabled:bg-rosewood/35">
        Submit review
      </button>
    </div>
  );
}
