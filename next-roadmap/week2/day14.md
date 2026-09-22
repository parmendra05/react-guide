# Day 14 — Advanced Patterns & Final Project

## 📅 Daily Tracker

```
[ ] Concepts read
[ ] Code written
[ ] Final project completed
[ ] Deployed to Vercel
```

---

## 🧠 Concepts

### Advanced Next.js Patterns

This is the final day — we cover the patterns that separate good Next.js developers from great ones.

---

### 1. Intercepting Routes

Show a modal when navigating to a route from within the app, but the full page when accessed directly (e.g., photo lightbox, login modal).

```
app/
├── photos/
│   ├── page.jsx              → /photos (grid)
│   └── [id]/
│       └── page.jsx          → /photos/1 (full page — for direct URL or refresh)
└── @modal/
    └── (.)photos/
        └── [id]/
            └── page.jsx      → modal overlay when clicked inside app
```

`(.)` means "intercept at the same level". `(..)` means "one level up".

```jsx
// app/@modal/(.)photos/[id]/page.jsx
import Modal from '@/components/Modal';

export default async function PhotoModal({ params }) {
  const photo = await getPhoto(params.id);
  return (
    <Modal>
      <img src={photo.url} alt={photo.title} />
    </Modal>
  );
}
```

---

### 2. Parallel Routes

Render multiple pages simultaneously in the same layout — each with its own loading and error states.

```
app/
└── dashboard/
    ├── layout.jsx
    ├── page.jsx
    ├── @analytics/
    │   ├── page.jsx
    │   └── loading.jsx
    └── @notifications/
        ├── page.jsx
        └── loading.jsx
```

```jsx
// app/dashboard/layout.jsx
export default function DashboardLayout({ children, analytics, notifications }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <main className="col-span-2">{children}</main>
      <aside>
        {analytics}
        {notifications}
      </aside>
    </div>
  );
}
```

---

### 3. Middleware Patterns

#### Rate Limiting

```js
// middleware.js
import { NextResponse } from 'next/server';

const rateLimit = new Map();

export function middleware(request) {
  const ip = request.ip ?? '127.0.0.1';
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 100;

  const data = rateLimit.get(ip) ?? { count: 0, start: now };

  if (now - data.start > windowMs) {
    rateLimit.set(ip, { count: 1, start: now });
  } else if (data.count >= maxRequests) {
    return new NextResponse('Too Many Requests', { status: 429 });
  } else {
    rateLimit.set(ip, { count: data.count + 1, start: data.start });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
```

#### A/B Testing

```js
// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const bucket = request.cookies.get('ab-bucket')?.value;

  if (!bucket) {
    const response = NextResponse.next();
    const newBucket = Math.random() < 0.5 ? 'control' : 'variant';
    response.cookies.set('ab-bucket', newBucket, { maxAge: 60 * 60 * 24 * 30 });
    return response;
  }

  // Rewrite to different page based on bucket
  if (bucket === 'variant') {
    return NextResponse.rewrite(new URL('/landing-v2', request.url));
  }

  return NextResponse.next();
}
```

---

### 4. Edge Runtime

Run code closer to users for ultra-low latency:

```js
// app/api/geo/route.js
export const runtime = 'edge'; // runs at the CDN edge, not a Node.js server

export async function GET(request) {
  const country = request.geo?.country ?? 'US';
  const city = request.geo?.city ?? 'Unknown';

  return Response.json({ country, city });
}
```

Use edge runtime for: geolocation, A/B testing, authentication checks, header manipulation.
Avoid edge runtime for: heavy computation, Node.js-only packages, large npm dependencies.

---

### 5. Database Integration Pattern (Prisma)

The standard production pattern for a Next.js + Prisma app:

```bash
npm install prisma @prisma/client
npx prisma init
```

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  published Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

```js
// lib/db.js — singleton pattern to prevent too many connections in dev
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
```

Use it in a Server Component:

```jsx
// app/posts/page.jsx
import { db } from '@/lib/db';

export default async function PostsPage() {
  const posts = await db.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

---

### 5b. Drizzle ORM — Lightweight Alternative to Prisma

Drizzle is gaining popularity for its lightweight size, SQL-first approach, and excellent TypeScript inference:

```bash
npm install drizzle-orm @libsql/client
npm install -D drizzle-kit
```

```ts
// lib/schema.ts
import { int, text, sqliteTable } from 'drizzle-orm/sqlite-core';

export const posts = sqliteTable('posts', {
  id: int('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  published: int('published', { mode: 'boolean' }).default(false),
});
```

```ts
// lib/db.ts
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client);
```

```tsx
// app/posts/page.tsx
import { db } from '@/lib/db';
import { posts } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export default async function PostsPage() {
  const allPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.published, true));

  return <ul>{allPosts.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}
```

**Prisma vs Drizzle:**
| | Prisma | Drizzle |
|---|--------|---------|
| Bundle size | Larger | Tiny |
| Query style | Object API | SQL-like |
| Schema | `.prisma` file | TypeScript |
| Migrations | `prisma migrate` | `drizzle-kit push` |
| Edge runtime | Limited | ✅ Full support |

---

### `cookies()` in Server Actions — Reading & Writing

Manipulate cookies directly inside a Server Action:

```js
// app/actions/auth.js
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function signOut() {
  const cookieStore = cookies();

  // Delete the session cookie
  cookieStore.delete('session-token');

  // Or set it expired
  cookieStore.set('session-token', '', {
    expires: new Date(0),
    path: '/',
  });

  redirect('/auth/signin');
}

export async function setPreference(formData) {
  'use server';
  const theme = formData.get('theme');

  cookies().set('theme', theme, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/',
    httpOnly: false, // readable by JS if needed
    sameSite: 'lax',
  });
}
```

---

### Pre-Launch Deployment Checklist

Before shipping to production, verify all of these:

```
Security
[ ] All secrets are in environment variables (nothing hardcoded)
[ ] .env.local is in .gitignore
[ ] API routes validate input with Zod or similar
[ ] Protected routes checked via middleware (not just inside pages)
[ ] NEXTAUTH_SECRET is a strong random string (32+ chars)
[ ] Content Security Policy headers considered

Performance
[ ] All above-the-fold images have priority prop
[ ] All images have width/height or use fill correctly
[ ] Large components use dynamic() for lazy loading
[ ] Fonts loaded via next/font (no Google Fonts <link>)
[ ] Bundle analyzer run — no unexpected large packages

SEO
[ ] Title template set in root layout
[ ] generateMetadata added to all dynamic pages
[ ] sitemap.js created and tested at /sitemap.xml
[ ] robots.js created and tested at /robots.txt
[ ] OG images set for all key pages (1200×630)
[ ] Canonical URLs set where needed

Functionality
[ ] Production build tested locally (npm run build && npm run start)
[ ] All environment variables added to Vercel dashboard
[ ] Error boundaries (error.jsx) in place for key sections
[ ] 404 (not-found.jsx) page looks good
[ ] Loading states present on all data-fetching routes

Testing
[ ] Core user flows pass (auth, CRUD, navigation)
[ ] At least 1 E2E test for the most critical flow
[ ] No TypeScript or ESLint errors
```

---

### 6. Multi-Tenancy Pattern

Handle subdomains per tenant using middleware:

```js
// middleware.js
export function middleware(request) {
  const hostname = request.headers.get('host');
  const subdomain = hostname?.split('.')[0];

  // Rewrite subdomain traffic to a [tenant] route
  if (subdomain && subdomain !== 'www' && subdomain !== 'app') {
    return NextResponse.rewrite(
      new URL(`/tenant/${subdomain}${request.nextUrl.pathname}`, request.url)
    );
  }

  return NextResponse.next();
}
```

---

## 🏗️ Final Project — Full-Stack Blog Platform

Apply everything from both weeks in one complete project.

### What to Build

A production-ready blog platform with:

### Pages & Routes

| Route | Type | Features |
|-------|------|---------|
| `/` | SSG | Hero, featured posts (ISR 60s) |
| `/blog` | ISR | All posts, category filter (URL state) |
| `/blog/[slug]` | Dynamic SSG | Full post, JSON-LD structured data |
| `/dashboard` | SSR + Auth | Protected, user's posts list |
| `/dashboard/new` | Server Action | Create post form (Zod validation) |
| `/dashboard/edit/[id]` | Server Action | Edit post form |
| `/auth/signin` | Client | NextAuth sign-in |

### API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/[...nextauth]` | ANY | NextAuth handler |
| `/api/posts` | GET, POST | List / create posts |
| `/api/posts/[id]` | GET, PUT, DELETE | CRUD single post |
| `/api/revalidate` | POST | On-demand ISR revalidation |

### Technical Requirements Checklist

```
[ ] App Router with nested layouts (root + dashboard)
[ ] Server Components for all data-fetching pages
[ ] Client Components only where interactivity is needed
[ ] Zod validation on all forms and API routes
[ ] Server Actions for create/edit post forms
[ ] NextAuth with at least one OAuth provider
[ ] Middleware protecting /dashboard routes
[ ] next/image for all images
[ ] Custom Google Font via next/font
[ ] generateMetadata for blog post pages
[ ] Dynamic OG images for blog posts
[ ] Sitemap + robots.txt
[ ] React Query for client-side data (if any)
[ ] Zustand for shopping cart or notification state
[ ] Suspense boundaries with skeleton loaders
[ ] Error boundaries (error.jsx)
[ ] Not found pages (not-found.jsx)
[ ] Environment variables (none hardcoded)
[ ] Deployed to Vercel with env vars configured
[ ] At least 5 unit/integration tests
```

---

## ✅ 2-Week Final Knowledge Check

Answer all of these before considering the roadmap complete:

**Foundations:**
- [ ] Can you explain SSG, SSR, ISR, and CSR — and when to use each?
- [ ] Can you explain Server Components vs Client Components?
- [ ] Can you set up file-based routing with dynamic and catch-all segments?
- [ ] Do you understand `layout.jsx` vs `template.jsx`?

**Data & APIs:**
- [ ] Can you build a REST API with route handlers?
- [ ] Can you protect an API route and return proper status codes?
- [ ] Can you use `generateStaticParams` for dynamic SSG?
- [ ] Do you understand all four caching layers?

**Auth & Security:**
- [ ] Can you set up NextAuth with OAuth and export `authOptions`?
- [ ] Can you protect routes using middleware?
- [ ] Do you know which env vars go in `NEXT_PUBLIC_` and which don't?
- [ ] Can you read and set cookies inside a Server Action?

**Forms & Mutations:**
- [ ] Can you write inline and file-based Server Actions?
- [ ] Can you use `.bind()` to pass extra args to a Server Action?
- [ ] Can you handle file uploads in a Server Action?
- [ ] Can you use Zod `.refine()` and `.transform()`?

**Performance & SEO:**
- [ ] Can you add full SEO with metadata, OG images, and a sitemap?
- [ ] Do you know when to use `priority`, `sizes`, and `placeholder="blur"` on images?
- [ ] Can you load third-party scripts with the right `next/script` strategy?
- [ ] Can you implement skeleton loaders with Suspense?

**Testing:**
- [ ] Can you mock `useRouter` and `usePathname` in tests?
- [ ] Can you test a Server Action by importing it directly?
- [ ] Can you set up MSW for realistic API mocking?

**Advanced:**
- [ ] Can you use intercepting routes for a modal pattern?
- [ ] Do you understand Prisma vs Drizzle trade-offs?
- [ ] Can you complete the pre-launch deployment checklist?

---

## 🎯 What's Next After This Roadmap

| Topic | Resource |
|-------|----------|
| TypeScript with Next.js | Next.js TypeScript docs |
| Database with Prisma | prisma.io/docs |
| tRPC (type-safe API) | trpc.io |
| Uploadthing (file uploads) | uploadthing.com |
| Stripe (payments) | stripe.com/docs |
| Resend (emails) | resend.com/docs |
| Shadcn/UI (component library) | ui.shadcn.com |
| Storybook (component docs) | storybook.js.org |

---

## 📝 Final Reflection

> Write your answers before moving on to new projects:

**What I built:**
-

**What I found hardest:**
-

**Concepts I want to revisit:**
-

**What I'll build next:**
-
