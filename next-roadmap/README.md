# 🚀 Next.js Complete Learning Roadmap

> A 2-week structured roadmap for React developers transitioning to Next.js.
> Each day includes: Concepts → Practical Tasks → Daily Tracker → End-of-Day Quiz

---

## 📋 Prerequisites

- ✅ React fundamentals (components, props, state)
- ✅ React Hooks (useState, useEffect, useContext, useRef)
- ✅ JSX and basic ES6+ JavaScript
- ✅ Basic understanding of REST APIs
- ✅ Node.js installed (v18+)

---

## 🗂️ Roadmap Index

### Week 1 — Foundations

| Day | Topic | File | Status |
|-----|-------|------|--------|
| Day 01 | Setup, Intro & File-based Routing | [week1/day01.md](./week1/day01.md) | `[ ]` |
| Day 02 | App Router, Layouts & Pages | [week1/day02.md](./week1/day02.md) | `[ ]` |
| Day 03 | Server vs Client Components | [week1/day03.md](./week1/day03.md) | `[ ]` |
| Day 04 | Data Fetching Strategies | [week1/day04.md](./week1/day04.md) | `[ ]` |
| Day 05 | API Routes & Dynamic Routes | [week1/day05.md](./week1/day05.md) | `[ ]` |
| Day 06 | Auth, Middleware & Env Variables | [week1/day06.md](./week1/day06.md) | `[ ]` |
| Day 07 | Build & Deploy — Mini Project | [week1/day07.md](./week1/day07.md) | `[ ]` |

### Week 2 — Intermediate to Advanced

| Day | Topic | File | Status |
|-----|-------|------|--------|
| Day 08 | Styling, Fonts & Image Optimization | [week2/day08.md](./week2/day08.md) | `[ ]` |
| Day 09 | State Management & React Query | [week2/day09.md](./week2/day09.md) | `[ ]` |
| Day 10 | Forms, Validation & Server Actions | [week2/day10.md](./week2/day10.md) | `[ ]` |
| Day 11 | Caching & Performance | [week2/day11.md](./week2/day11.md) | `[ ]` |
| Day 12 | SEO, Metadata & OG Tags | [week2/day12.md](./week2/day12.md) | `[ ]` |
| Day 13 | Testing in Next.js | [week2/day13.md](./week2/day13.md) | `[ ]` |
| Day 14 | Advanced Patterns & Final Project | [week2/day14.md](./week2/day14.md) | `[ ]` |

### 🎯 Interview Preparation

| File | Description |
|------|-------------|
| [interview-qa.md](./interview-qa.md) | 62 Interview Questions & Answers with self-rating |

---

## 🧠 Knowledge Map

This is the full mental model of Next.js. Use it to see how all the concepts connect.

```
NEXT.JS
│
├── ROUTING
│   ├── File-based (app/ directory)
│   ├── Dynamic segments [slug]
│   ├── Catch-all [...slug]
│   ├── Route Groups (folder)
│   ├── Parallel Routes @slot
│   └── Intercepting Routes (.)folder
│
├── RENDERING
│   ├── Server Components (default)
│   │   ├── SSG  — cached at build time
│   │   ├── ISR  — revalidate: N seconds
│   │   └── SSR  — cache: 'no-store'
│   └── Client Components ('use client')
│       └── CSR  — fetched in browser
│
├── DATA FETCHING
│   ├── async/await in Server Components
│   ├── fetch() with cache options
│   ├── generateStaticParams (dynamic SSG)
│   ├── React Query (client-side server state)
│   └── SWR (alternative to React Query)
│
├── MUTATIONS
│   ├── API Routes (route.js)
│   └── Server Actions ('use server')
│       ├── useFormState (errors)
│       ├── useFormStatus (pending)
│       └── useOptimistic (instant UI)
│
├── CACHING (4 layers)
│   ├── Request Memoization (per render)
│   ├── Data Cache (fetch, disk)
│   ├── Full Route Cache (HTML, disk)
│   └── Router Cache (client memory)
│
├── SPECIAL FILES
│   ├── layout.jsx   — persistent wrapper
│   ├── page.jsx     — route UI
│   ├── loading.jsx  — Suspense fallback
│   ├── error.jsx    — error boundary
│   ├── not-found.jsx — 404 UI
│   └── route.js    — API endpoint
│
├── AUTH & SECURITY
│   ├── NextAuth.js (OAuth, credentials)
│   ├── middleware.js (route protection)
│   └── env variables (NEXT_PUBLIC_ vs private)
│
├── PERFORMANCE
│   ├── next/image (auto optimize)
│   ├── next/font (self-hosted fonts)
│   ├── dynamic() (lazy loading)
│   ├── <Suspense> (streaming)
│   └── Edge Runtime
│
├── SEO
│   ├── metadata export (static)
│   ├── generateMetadata (dynamic)
│   ├── Open Graph tags
│   ├── Dynamic OG images (ImageResponse)
│   ├── sitemap.js → /sitemap.xml
│   ├── robots.js → /robots.txt
│   └── JSON-LD structured data
│
├── STYLING
│   ├── CSS Modules
│   ├── Tailwind CSS
│   ├── Sass/SCSS
│   └── CSS-in-JS (styled-components)
│
├── STATE MANAGEMENT
│   ├── useState / useReducer (local)
│   ├── Zustand (global UI state)
│   ├── React Query (server state)
│   └── useSearchParams (URL state)
│
├── FORMS & VALIDATION
│   ├── Controlled components
│   ├── React Hook Form
│   ├── Zod (schema validation)
│   └── Server Actions + useFormState
│
└── TESTING
    ├── Vitest + React Testing Library (unit/integration)
    └── Playwright (E2E)
```

---

## 📅 Daily Tracking Template

Each day file contains a tracker section. Mark your progress:

```
[ ] Concepts read
[ ] Code written
[ ] Practical task completed
[ ] Quiz answered
```

---

## 📊 Overall Progress Tracker

Update this as you complete each day:

| Week | Days Done | Concepts | Projects | Quiz Score |
|------|-----------|----------|----------|------------|
| Week 1 | 0 / 7 | | | |
| Week 2 | 0 / 7 | | | |
| Interview QA | — | — | — | ___ / 62 ✅ |

---

## 🛠️ Tools You'll Need

- **Node.js** v18+ → https://nodejs.org
- **VS Code** with extensions:
  - ES7+ React/Next snippets
  - Tailwind CSS IntelliSense
  - Prisma (if using DB)
  - Thunder Client (API testing)
- **Vercel account** (free) → https://vercel.com
- **Git & GitHub** for version control and deploying

---

## 📌 How to Use This Roadmap

1. Read the concepts section first — don't skip it
2. Type out the code examples manually (don't copy-paste)
3. Complete the practical task before moving on
4. Answer the quiz at the end of each day before checking answers
5. Track your progress using the checklist in each file
6. After Day 07 and Day 14, do the mini projects to solidify your learning
7. Review `interview-qa.md` after each week — re-read weak spots

---

## 🔗 Official Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Next.js Learn Course:** https://nextjs.org/learn
- **Vercel Deployment:** https://vercel.com/docs
- **TanStack Query:** https://tanstack.com/query/latest
- **NextAuth.js:** https://next-auth.js.org
- **Zod:** https://zod.dev
- **Prisma:** https://prisma.io/docs
- **Playwright:** https://playwright.dev
- **Shadcn/UI:** https://ui.shadcn.com

---

## 🗓️ Suggested Study Schedule

| Time available | Pace |
|----------------|------|
| 2 hours/day | Follow the 14-day plan as written |
| 1 hour/day | Spread each day over 2 calendar days (28-day plan) |
| Weekends only | ~7 weeks; do 2 days per weekend session |

---

## ⚠️ Common Mistakes to Avoid

| Mistake | Correct Approach |
|---------|-----------------|
| Using `useState` in a Server Component | Add `'use client'` if you need state |
| Importing a Server Component into a Client Component | Pass server data as props instead |
| Putting secrets in `NEXT_PUBLIC_` vars | Only use `NEXT_PUBLIC_` for truly public values |
| Using `<a>` for internal links | Use `<Link>` from `next/link` |
| Forgetting `'use client'` on `error.jsx` | Error components must always be Client Components |
| Running `fetch` in `useEffect` when a Server Component would do | Default to Server Components; add `'use client'` only when needed |
| Committing `.env.local` to Git | Add it to `.gitignore` immediately |
