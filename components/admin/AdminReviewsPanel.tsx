"use client";

import { useEffect, useMemo, useState } from "react";
import { salon } from "@/lib/data";
import { REVIEWS_STORAGE_KEY, averageRating, loadReviews, saveReviews } from "@/lib/reviews";
import type { ReviewStatus, ServiceReview } from "@/lib/reviews";

const panelClass = "rounded-[2rem] border border-rosewood/10 bg-white/82 p-6 shadow-sm";
const primaryButton = "rounded-full bg-rosewood px-5 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-espresso active:scale-95";
const secondaryButton = "rounded-full border border-rosewood/20 bg-white/65 px-5 py-3 text-sm font-black text-rosewood transition hover:-translate-y-0.5 hover:bg-blush active:scale-95";
const reviewPath = "/review";

function statusClass(status: ReviewStatus) {
  if (status === "approved") return "bg-emerald-100 text-emerald-700";
  if (status === "hidden") return "bg-zinc-200 text-zinc-700";
  return "bg-amber-100 text-amber-700";
}

function getReviewUrl() {
  if (typeof window === "undefined") return reviewPath;
  return `${window.location.origin}${reviewPath}`;
}

export function AdminReviewsPanel() {
  const [reviews, setReviews] = useState<ServiceReview[]>([]);
  const [copied, setCopied] = useState("");
  const reviewUrl = getReviewUrl();
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(reviewUrl)}`;

  useEffect(() => {
    setReviews(loadReviews());

    function syncReviews(event: StorageEvent) {
      if (event.key === REVIEWS_STORAGE_KEY) setReviews(loadReviews());
    }

    window.addEventListener("storage", syncReviews);
    return () => window.removeEventListener("storage", syncReviews);
  }, []);

  function updateReviewStatus(reviewId: string, status: ReviewStatus) {
    const nextReviews = reviews.map((review) => (review.id === reviewId ? { ...review, status } : review));
    setReviews(nextReviews);
    saveReviews(nextReviews);
  }

  function deleteReview(reviewId: string) {
    const nextReviews = reviews.filter((review) => review.id !== reviewId);
    setReviews(nextReviews);
    saveReviews(nextReviews);
  }

  async function copyText(value: string, label: string) {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1800);
  }

  const approvedReviews = reviews.filter((review) => review.status === "approved");
  const pendingReviews = reviews.filter((review) => review.status === "pending");
  const hiddenReviews = reviews.filter((review) => review.status === "hidden");
  const avgRating = useMemo(() => averageRating(reviews), [reviews]);
  const messengerMessage = `Hi! Thank you for visiting ${salon.name}. We'd love your feedback. You can rate your service here: ${reviewUrl}`;

  return (
    <div className="space-y-8">
      <div className={panelClass}>
        <div className="grid gap-8 xl:grid-cols-[1fr_320px] xl:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-rosewood/70">Customer reviews</p>
            <h2 className="mt-2 text-4xl font-black tracking-tight">Service ratings & QR code</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-espresso/60">
              Display this QR code at the salon counter so customers can rate their visit after the service. New reviews arrive as pending and can be approved before showing publicly.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={() => copyText(reviewUrl, "Review link copied")} className={primaryButton}>Copy review link</button>
              <button type="button" onClick={() => copyText(messengerMessage, "Message copied")} className={secondaryButton}>Copy Messenger message</button>
              <a href={reviewPath} target="_blank" className={secondaryButton}>Open review page</a>
            </div>
            {copied ? <p className="mt-4 rounded-2xl bg-emerald-100 px-4 py-3 text-sm font-black text-emerald-700">{copied}</p> : null}
          </div>
          <div className="rounded-[1.7rem] bg-cream p-5 text-center">
            <img src={qrSrc} alt="Review QR code" className="mx-auto h-64 w-64 rounded-2xl bg-white p-3" />
            <p className="mt-4 text-sm font-black text-rosewood">Scan to rate {salon.name}</p>
            <p className="mt-2 break-all text-xs leading-5 text-espresso/55">{reviewUrl}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.75rem] border border-rosewood/10 bg-white/82 p-6 shadow-sm"><p className="text-sm font-bold text-espresso/55">Average rating</p><p className="mt-3 text-4xl font-black">{avgRating ? avgRating.toFixed(1) : "0.0"}</p><p className="mt-3 text-xs font-bold uppercase tracking-wide text-rosewood/60">All submitted reviews</p></div>
        <div className="rounded-[1.75rem] border border-rosewood/10 bg-white/82 p-6 shadow-sm"><p className="text-sm font-bold text-espresso/55">Pending</p><p className="mt-3 text-4xl font-black">{pendingReviews.length}</p><p className="mt-3 text-xs font-bold uppercase tracking-wide text-rosewood/60">Needs review</p></div>
        <div className="rounded-[1.75rem] border border-rosewood/10 bg-white/82 p-6 shadow-sm"><p className="text-sm font-bold text-espresso/55">Approved</p><p className="mt-3 text-4xl font-black">{approvedReviews.length}</p><p className="mt-3 text-xs font-bold uppercase tracking-wide text-rosewood/60">Public-ready</p></div>
        <div className="rounded-[1.75rem] border border-rosewood/10 bg-white/82 p-6 shadow-sm"><p className="text-sm font-bold text-espresso/55">Hidden</p><p className="mt-3 text-4xl font-black">{hiddenReviews.length}</p><p className="mt-3 text-xs font-bold uppercase tracking-wide text-rosewood/60">Not public</p></div>
      </div>

      <div className={panelClass}>
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-rosewood/70">Review inbox</p>
            <h3 className="mt-2 text-2xl font-black">Submitted reviews</h3>
          </div>
          <p className="text-sm font-bold text-espresso/55">{reviews.length} total reviews</p>
        </div>

        <div className="mt-6 space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-[1.5rem] bg-cream p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h4 className="text-xl font-black">{review.customerName}</h4>
                    <span className={`rounded-full px-3 py-1 text-xs font-black capitalize ${statusClass(review.status)}`}>{review.status}</span>
                  </div>
                  <p className="mt-2 text-sm font-bold text-rosewood">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)} · {review.serviceName} · {review.staffName}</p>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-espresso/70">“{review.comment}”</p>
                  <p className="mt-3 text-xs font-bold uppercase tracking-wide text-espresso/45">Recommend: {review.wouldRecommend ? "Yes" : "No"} · {new Date(review.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex flex-wrap justify-start gap-2 xl:justify-end">
                  <button type="button" onClick={() => updateReviewStatus(review.id, "approved")} className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-black text-emerald-700">Approve</button>
                  <button type="button" onClick={() => updateReviewStatus(review.id, "hidden")} className="rounded-full bg-zinc-200 px-4 py-2 text-sm font-black text-zinc-700">Hide</button>
                  <button type="button" onClick={() => deleteReview(review.id)} className="rounded-full bg-red-100 px-4 py-2 text-sm font-black text-red-700">Delete</button>
                </div>
              </div>
            </div>
          ))}
          {!reviews.length ? <p className="rounded-2xl bg-cream p-5 text-sm font-bold text-espresso/60">No reviews yet. Open the review page or scan the QR code to submit the first one.</p> : null}
        </div>
      </div>
    </div>
  );
}
