# SaaS Salon & Barber Booking System

Salon-first booking system MVP built with **Next.js**, **TypeScript**, and **Tailwind CSS**.

This repo starts as a polished demo for a salon business, then can grow into a reusable SaaS for salons, barbershops, spas, nail studios, and beauty clinics.

## What is included

- Premium salon landing page
- Service and staff showcase
- Customer booking wizard
- Booking summary and fake confirmation state
- Hidden mock owner admin area
- Analytics and CSV report demo
- Mobile sticky booking CTA
- Demo salon data separated in `lib/data.ts`
- Clean structure for future Supabase/database integration

## Public demo polish

The public customer view now includes trust badges, service details, stylist cards, gallery placeholders, reviews, how-booking-works, booking policies, location/hours, FAQs, a stronger booking page, and confirmation reference numbers.

## Tech stack

- Next.js App Router
- TypeScript
- Tailwind CSS

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Pages

- `/` - Public salon website
- `/book` - Customer booking flow
- `/admin` - Hidden owner dashboard preview

## Suggested next features

1. Connect Supabase for real bookings.
2. Add owner authentication.
3. Add shop slugs like `/salons/prime-glow-studio`.
4. Add SMS/email reminders and PayMongo/GCash reservation fees.
5. Replace gallery placeholders with real salon photos.

## Business direction

Use this as the demo you show to salons. For the first client, customize the brand, services, staff, prices, location, photos, and domain. After 3–5 clients, convert the repeated setup into a true SaaS dashboard.
