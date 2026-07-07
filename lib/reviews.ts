export type ReviewStatus = "pending" | "approved" | "hidden";

export type ServiceReview = {
  id: string;
  customerName: string;
  serviceId: string;
  serviceName: string;
  staffId: string;
  staffName: string;
  rating: number;
  comment: string;
  wouldRecommend: boolean;
  contact?: string;
  status: ReviewStatus;
  createdAt: string;
};

export const REVIEWS_STORAGE_KEY = "prime-glow-service-reviews";

export function createReviewId() {
  return `rv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function loadReviews(): ServiceReview[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(REVIEWS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ServiceReview[]) : [];
  } catch {
    return [];
  }
}

export function saveReviews(reviews: ServiceReview[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
}

export function averageRating(reviews: ServiceReview[]) {
  if (!reviews.length) return 0;
  return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
}
