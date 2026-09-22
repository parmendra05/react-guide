# Day 12 — SEO, Metadata & OG Tags

## 📅 Daily Tracker

```
[ ] Concepts read
[ ] Code written
[ ] Practical task completed
[ ] Quiz answered
```

---

## 🧠 Concepts

### Why SEO Matters in Next.js

React (CRA/Vite) apps are Client-Side Rendered — search engine crawlers often can't read their content. Next.js solves this by rendering HTML on the server, making your content fully indexable.

Next.js also provides a first-class `metadata` API to control every SEO-relevant tag from your page files — no `react-helmet` or manual `<head>` manipulation needed.

---

### The Metadata API

#### Static Metadata

Export a `metadata` object from any `page.jsx` or `layout.jsx`:

```jsx
// app/about/page.jsx
export const metadata = {
  title: 'About Us — Acme Corp',
  description: 'Learn about our mission, values, and team.',
  keywords: ['about', 'company', 'team'],
  authors: [{ name: 'Jane Doe', url: 'https://example.com' }],
  robots: 'index, follow',
  canonical: 'https://acmecorp.com/about',
};

export default function AboutPage() {
  return <h1>About Us</h1>;
}
```

---

#### Title Templates

Set a template in the root layout so every page gets consistent titles:

```jsx
// app/layout.jsx
export const metadata = {
  title: {
    template: '%s | Acme Corp',   // %s = child page title
    default: 'Acme Corp',         // fallback if no title set
  },
  description: 'The best widgets on the internet.',
};
```

Now each page only needs a short title:

```jsx
// app/blog/page.jsx
export const metadata = {
  title: 'Blog',  // renders as "Blog | Acme Corp"
};
```

---

#### Dynamic Metadata with `generateMetadata`

For pages with data-driven titles (blog posts, product pages):

```jsx
// app/products/[id]/page.jsx

async function getProduct(id) {
  return fetch(`https://api.example.com/products/${id}`, {
    next: { revalidate: 3600 },
  }).then(r => r.json());
}

export async function generateMetadata({ params }) {
  const product = await getProduct(params.id);

  // Return null to fall back to parent metadata
  if (!product) return {};

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.imageUrl, width: 1200, height: 630 }],
    },
  };
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id); // uses same cache hit
  return <div>{product.name}</div>;
}
```

---

### Open Graph Tags (Social Sharing)

OG tags control how your pages look when shared on Twitter/X, Facebook, LinkedIn, Slack, etc.

```jsx
export const metadata = {
  title: 'My Awesome Blog Post',
  description: 'A deep dive into Next.js performance.',

  openGraph: {
    title: 'My Awesome Blog Post',
    description: 'A deep dive into Next.js performance.',
    url: 'https://myblog.com/posts/nextjs-performance',
    siteName: 'My Blog',
    images: [
      {
        url: 'https://myblog.com/og/nextjs-performance.png',
        width: 1200,
        height: 630,
        alt: 'Next.js Performance Article Cover',
      },
    ],
    locale: 'en_US',
    type: 'article',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'My Awesome Blog Post',
    description: 'A deep dive into Next.js performance.',
    creator: '@yourhandle',
    images: ['https://myblog.com/og/nextjs-performance.png'],
  },
};
```

---

### Dynamic OG Images with `ImageResponse`

Next.js can generate OG images on-the-fly using JSX + canvas rendering:

```jsx
// app/og/route.jsx   OR   app/blog/[slug]/opengraph-image.jsx

import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'My Blog';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
          color: '#f8fafc',
          fontFamily: 'sans-serif',
        }}
      >
        <h1 style={{ fontSize: '72px', fontWeight: 'bold', textAlign: 'center' }}>
          {title}
        </h1>
        <p style={{ fontSize: '32px', color: '#94a3b8', marginTop: '20px' }}>
          myblog.com
        </p>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
```

Call it as: `/og?title=My+Blog+Post` and use that URL as your OG image.

---

### Sitemap

Generate a dynamic sitemap for search engines:

```js
// app/sitemap.js
export default async function sitemap() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json());

  const postUrls = posts.map(post => ({
    url: `https://myblog.com/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: 'https://myblog.com',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://myblog.com/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...postUrls,
  ];
}
```

This auto-generates a `/sitemap.xml` file at your domain.

---

### robots.txt

```js
// app/robots.js
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/api/'],
      },
    ],
    sitemap: 'https://myblog.com/sitemap.xml',
  };
}
```

This auto-generates `/robots.txt`.

---

### File-based Metadata Conventions

Next.js recognises special filenames placed inside `app/` or route folders — no code needed:

| File | Output | Where to place |
|------|--------|----------------|
| `favicon.ico` | Browser tab icon | `app/favicon.ico` |
| `icon.png` / `icon.svg` | App icon | `app/icon.png` |
| `apple-icon.png` | iOS home screen icon | `app/apple-icon.png` |
| `opengraph-image.jpg` | Static OG image | `app/` or route folder |
| `twitter-image.jpg` | Static Twitter card image | `app/` or route folder |
| `opengraph-image.jsx` | Dynamic OG image (JSX) | `app/` or route folder |
| `twitter-image.jsx` | Dynamic Twitter image (JSX) | `app/` or route folder |

#### Co-located dynamic OG image (cleanest approach)

Instead of a separate `/og` route, place the generator next to the page it belongs to:

```jsx
// app/blog/[slug]/opengraph-image.jsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Blog post cover';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage({ params }) {
  const post = await fetch(
    `https://api.example.com/posts/${params.slug}`
  ).then(r => r.json());

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
          color: 'white',
          fontSize: '64px',
          fontWeight: 'bold',
          padding: '60px',
          textAlign: 'center',
        }}
      >
        {post.title}
      </div>
    ),
    { ...size }
  );
}
```

Next.js automatically wires this file as the `og:image` for `/blog/[slug]` — no manual metadata needed.

---

### PWA Manifest via `app/manifest.js`

Make your Next.js app installable as a PWA:

```js
// app/manifest.js
export default function manifest() {
  return {
    name: 'My Blog',
    short_name: 'Blog',
    description: 'A Next.js blog',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0070f3',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
```

This auto-generates `/manifest.webmanifest`. Add it as a `<link>` in metadata:

```jsx
// app/layout.jsx
export const metadata = {
  manifest: '/manifest.webmanifest',
};
```

---

### Canonical URLs

Tell search engines the "official" URL when duplicate content exists (e.g. URL params, multiple domains):

```jsx
export const metadata = {
  alternates: {
    canonical: 'https://myblog.com/blog/my-post',
  },
};
```

---

### Structured Data (JSON-LD)

Rich results in Google Search (star ratings, breadcrumbs, FAQ):

```jsx
// app/blog/[slug]/page.jsx
export default async function BlogPost({ params }) {
  const post = await getPost(params.slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    author: { '@type': 'Person', name: post.author },
    datePublished: post.publishedAt,
    description: post.excerpt,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article>{post.content}</article>
    </>
  );
}
```

---

## 💻 Practical Task

**Add full SEO to the Week 1 blog project:**

1. Set a title template in `app/layout.jsx` — `'%s | My Blog'`
2. Add static `openGraph` metadata to the home page and blog listing page
3. Add `generateMetadata` to `app/blog/[id]/page.jsx` — fetch the post title and use it
4. Create `app/og/route.jsx` — a dynamic OG image that accepts a `?title=` param
5. Wire the dynamic OG image URL into your `generateMetadata` response
6. Create `app/sitemap.js` to generate a sitemap including all blog post URLs
7. Create `app/robots.js` — disallow `/api` routes

---

## ✅ End-of-Day Quiz

**Q1.** What is the difference between `metadata` and `generateMetadata`?

**Q2.** What does the `%s` placeholder do in a title template?

**Q3.** What are Open Graph tags used for?

**Q4.** What does Next.js generate automatically when you create `app/sitemap.js`?

**Q5.** Why is structured data (JSON-LD) beneficial for SEO?

**Q6.** What is a canonical URL and when do you need one?

---

<details>
<summary>📖 Answers (click to reveal)</summary>

**A1.** `metadata` is a static export — the values are fixed at build time. `generateMetadata` is an async function — it can fetch data to build metadata dynamically (e.g., a blog post's title based on its slug). Both are exported from `page.jsx` or `layout.jsx`.

**A2.** `%s` is replaced by the `title` value of the current child page. In a root layout template of `'%s | Acme Corp'`, a page with `title: 'About'` renders `<title>About | Acme Corp</title>`.

**A3.** Open Graph tags (`og:title`, `og:image`, etc.) control how a URL appears when shared on social platforms (Twitter, Facebook, LinkedIn, Slack). Without them, platforms display a plain URL or garbled preview.

**A4.** It generates a `/sitemap.xml` file served at your domain root. This file helps search engine crawlers discover and index all your pages, and signals how frequently they change.

**A5.** JSON-LD structured data lets Google render "rich results" — star ratings, FAQ dropdowns, article metadata, breadcrumbs — directly in search results. This increases click-through rates and gives your pages more prominent placement.

**A6.** A canonical URL tells search engines which version of a page is the "official" one when the same content is accessible at multiple URLs (e.g., `/blog/post?ref=newsletter` and `/blog/post`). Without it, search engines may split ranking signals across duplicates and penalize your SEO.

</details>

---

## 📝 Notes

> Use this space to write your own notes.

-
-
-
