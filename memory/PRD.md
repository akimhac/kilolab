# KiloLab - Product Requirements Document

## Overview
KiloLab is a professional laundry marketplace connecting Clients and Washers (independent laundry providers). Built as a PWA with React/Vite/TypeScript frontend, Supabase backend, Vercel Serverless Functions.

## Live URL
https://kilolab.fr

## Tech Stack
- **Frontend**: React, TypeScript, Vite, TailwindCSS, Vanilla Leaflet
- **Backend**: Supabase (PostgreSQL, Auth, RLS), Vercel Serverless Functions
- **Payments**: Stripe Connect (LIVE mode)
- **Emails**: Resend
- **Error Tracking**: Sentry
- **Hosting**: Vercel

## Key Features Implemented
### Core Marketplace
- Client ordering flow (weight-based pricing: 3€/kg Standard, 5€/kg Express)
- Washer matching via Haversine distance algorithm
- Real-time order tracking with vanilla Leaflet maps (iOS Safari compatible)
- Bilateral in-app chat (Client ↔ Washer)
- One-click reorder functionality
- Stripe Connect live payments with payout sequestration

### Dashboards
- **Client Dashboard**: Orders, tracking, chat, reorder, Google review prompt
- **Washer Dashboard**: Earnings, onboarding, calendar, route optimizer
- **Admin Dashboard**: Full management, fraud alerts, finance tab, analytics

### Security (RLS 100% Active - April 2026)
- Row Level Security on ALL tables (verified via MEGA_FIX_ALL V4)
- Admin bypass policies
- Rate limiting on `/api/send-email` and `/api/stripe-refund`
- Stripe Connect blockage (Washers must configure Stripe before completing orders)
- Fraud detection triggers (excessive cancellations, suspicious completions)

### Notifications
- Uber-style escalating browser notifications (T+0, T+5, T+10, T+20 min)
- Email notifications via Resend (admin alerts, washer assignments)

### Legal Pages (v2.0 - April 2026)
- **CGU**: 16 articles (protection Washers + Clients, mediation, force majeure)
- **CGV**: 10 articles (arbitrage Kilolab, liability capped at order value, delicate items exclusion)
- **Privacy**: 12 articles (full RGPD, sub-processors table, 7 rights, CNIL, breach notification)
- **Cookies**: 7 articles (real cookies table, browser guide)
- **Legal/Mentions Légales**: Company info

### Liability & Guarantee Rules
- Kilolab acts as mandatory arbitrator in all disputes
- Washer liability capped at order value (not a fixed amount)
- NO responsibility for undeclared delicate/luxury items (silk, cashmere, leather, designer)
- Client must declare items >100€ value
- 24h window for claims after delivery

### Revenue Claims
- Washer earnings displayed as "up to 2000€/month" across all pages

### Animations (April 2026)
- Animated counters on landing page stats (1850+, 4.9/5, 500+, 45+)
- Shimmer effect on primary CTA button
- Scroll-triggered fade-in animations throughout

## Stress Test Results (April 2026)
- 12/15 PASS, 0 FAIL
- Rate limiting works per Vercel instance
- Corrupted payloads rejected (400/422)
- XSS/injection attempts blocked
- HTTP methods restricted (POST only)
- 20 concurrent requests: 20/20 OK

## App Store Assets Generated
- App icon 1024x1024 PNG
- 7 mobile screenshots (430x932)
- Short + long descriptions (FR)
- Keywords optimized
- Publication guide via PWABuilder.com

## Database Schema (Key Tables)
- `user_profiles`: id, email, role, first_name, last_active_at
- `orders`: id, client_id, washer_id, status, total_price, reorder_from
- `washers`: id, user_id, stripe_account_id, onboarding_completed, onboarding_step
- `audit_logs`: action tracking for admin
- `fraud_alerts`: automatic fraud detection
- `washer_badges`: gamification (1st mission, 10, 50, 100)
- `washer_availability`: scheduling
- `washer_off_days`: days off management
- `washer_payouts`: payment tracking

## Upcoming Tasks
- (P1) Twilio SMS notifications integration
- (P2) Native mobile app wrapper via PWABuilder
- (P3) React Native full rewrite (future, not needed for launch)

## Admin Credentials
- Admin: akim.hachili@gmail.com (Supabase Auth)
- Test client: sousouait59600@gmail.com
