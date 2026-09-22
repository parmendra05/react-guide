# Day 05 — API Routes & Dynamic Routes

## 📅 Daily Tracker

```
[ ] Concepts read
[ ] Code written
[ ] Practical task completed
[ ] Quiz answered
```

---

## 🧠 Concepts

### API Routes in Next.js (Route Handlers)

Next.js lets you build backend API endpoints **inside your frontend project** using `route.js` files in the `app/` directory. No separate Express server needed.

```
app/
└── api/
    ├── users/
    │   └── route.js        → GET /api/users
    └── posts/
        ├── route.js        → GET/POST /api/posts
        └── [id]/
            └── route.js    → GET/PUT/DELETE /api/posts/:id
```

---

### Creating a Basic Route Handler

```js
// app/api/hello/route.js

export async function GET(request) {
  return Response.json({ message: 'Hello from Next.js API!' });
}
```

Visit `/api/hello` — you'll get the JSON response.

---

### HTTP Methods

Export a named function for each HTTP method you want to support:

```js
// app/api/products/route.js

// GET /api/products
export async function GET(request) {
  const products = await db.products.findAll();
  return Response.json(products);
}

// POST /api/products
export async function POST(request) {
  const body = await request.json(); // parse JSON body
  const newProduct = await db.products.create(body);
  return Response.json(newProduct, { status: 201 });
}
```

---

### Dynamic API Routes

Use `[param]` folders just like page routes:

```js
// app/api/users/[id]/route.js

export async function GET(request, { params }) {
  const { id } = params;
  const user = await db.users.findById(id);

  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 });
  }

  return Response.json(user);
}

export async function DELETE(request, { params }) {
  const { id } = params;
  await db.users.delete(id);
  return Response.json({ message: 'User deleted' }, { status: 200 });
}

export async function PUT(request, { params }) {
  const { id } = params;
  const body = await request.json();
  const updated = await db.users.update(id, body);
  return Response.json(updated);
}
```

---

### Reading Query Parameters

```js
// GET /api/search?q=nextjs&limit=5

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  const limit = searchParams.get('limit') || 10;

  const results = await search(q, Number(limit));
  return Response.json(results);
}
```

---

### Reading Request Headers

```js
export async function GET(request) {
  const token = request.headers.get('authorization');

  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return Response.json({ data: 'protected content' });
}
```

---

### Setting Response Headers & Status

```js
export async function GET() {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}
```

---

### Dynamic Page Routes

Dynamic routes let one file handle many URLs based on a parameter.

#### Single Dynamic Segment `[param]`

```
app/
└── blog/
    └── [slug]/
        └── page.jsx    → /blog/hello-world, /blog/my-post, etc.
```

```jsx
// app/blog/[slug]/page.jsx

export default async function BlogPost({ params }) {
  const { slug } = params;
  const post = await fetch(`https://api.example.com/posts/${slug}`).then(r => r.json());

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
```

---

#### Catch-All Segments `[...segments]`

Matches any number of path segments:

```
app/docs/[...slug]/page.jsx
```

- `/docs/intro` → `params.slug = ['intro']`
- `/docs/api/users` → `params.slug = ['api', 'users']`
- `/docs/a/b/c` → `params.slug = ['a', 'b', 'c']`

```jsx
export default function DocsPage({ params }) {
  const path = params.slug.join('/');
  return <h1>Docs: {path}</h1>;
}
```

---

#### Optional Catch-All `[[...segments]]`

Same as catch-all but also matches the base path:

```
app/shop/[[...categories]]/page.jsx
```

- `/shop` → `params.categories = undefined`
- `/shop/clothing` → `params.categories = ['clothing']`
- `/shop/clothing/shirts` → `params.categories = ['clothing', 'shirts']`

---

### Combining Page Routes + API Routes

A common pattern — your page fetches from your own API:

```jsx
// app/products/page.jsx (Server Component)
export default async function ProductsPage() {
  // Calling your own internal API route
  const res = await fetch('http://localhost:3000/api/products');
  const products = await res.json();
  return <ProductList products={products} />;
}
```

> **Better approach in Server Components:** call your database/service directly instead of going through the API. API routes are for external clients (mobile apps, third parties).

---

### `PATCH` — Partial Updates

```js
// app/api/posts/[id]/route.js
export async function PATCH(request, { params }) {
  const { id } = params;
  const body = await request.json();
  // body may contain only the fields being updated
  const updated = await db.posts.update(id, body);
  return Response.json(updated);
}
```

Use `PATCH` for partial updates (change one field). Use `PUT` for full replacements (replace the entire resource).

---

### Using `NextRequest` and `NextResponse`

For more powerful request/response handling, import the typed wrappers:

```js
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // NextRequest has geo, ip, cookies, and nextUrl helpers
  const country = request.geo?.country ?? 'US';
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // NextResponse lets you set cookies directly on the response
  const response = NextResponse.json({ country });
  response.cookies.set('visited', 'true', { maxAge: 3600 });
  return response;
}
```

> In plain JavaScript projects (no TypeScript), these still work — you just don't get the type hints. They're useful for the `.cookies`, `.geo`, and `.ip` properties that the standard `Request` object doesn't have.

---

### `notFound()` Inside a Page

Call `notFound()` from `next/navigation` when a dynamic resource isn't found — it renders the nearest `not-found.jsx`:

```jsx
// app/blog/[slug]/page.jsx
import { notFound } from 'next/navigation';

export default async function BlogPost({ params }) {
  const post = await fetch(`/api/posts/${params.slug}`).then(r => r.json());

  if (!post || post.error) {
    notFound(); // renders app/not-found.jsx or app/blog/not-found.jsx
  }

  return <article>{post.title}</article>;
}
```

---

### CORS Headers

If your API needs to be called from another domain:

```js
export async function GET(request) {
  return Response.json({ data: 'public' }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST',
    },
  });
}

// Handle preflight OPTIONS request
export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
```

---

## 💻 Practical Task

**Build a mini REST API + dynamic pages:**

1. Create `GET /api/todos` — returns a hardcoded list of todos
2. Create `POST /api/todos` — accepts `{ title }` in body, returns new todo with an id
3. Create `GET /api/todos/[id]` — returns a single todo or 404
4. Create `app/todos/page.jsx` — a Server Component that fetches and displays all todos
5. Create `app/todos/[id]/page.jsx` — displays a single todo by ID
6. Test your API routes in the browser or with a tool like Thunder Client (VS Code extension)

---

## ✅ End-of-Day Quiz

**Q1.** What file name do you use to create an API endpoint in the App Router?

**Q2.** How do you read the request body in a POST route handler?

**Q3.** What is the difference between `[slug]` and `[...slug]` in routing?

**Q4.** How do you return a 404 response from a route handler?

**Q5.** What is the recommended way to read URL query params in a route handler?

**Q6.** When should you use an API route vs. calling the database directly in a Server Component?

---

<details>
<summary>📖 Answers (click to reveal)</summary>

**A1.** `route.js` (or `route.ts`). A `route.js` file inside `app/api/...` creates an API endpoint. It cannot coexist with a `page.jsx` in the same folder.

**A2.** `const body = await request.json()` — this parses the JSON body from the incoming request.

**A3.** `[slug]` matches exactly one path segment (e.g. `/blog/hello`). `[...slug]` catches all remaining segments as an array (e.g. `/blog/a/b/c` → `['a','b','c']`).

**A4.** `return Response.json({ error: 'Not found' }, { status: 404 })`

**A5.** `const { searchParams } = new URL(request.url)` then `searchParams.get('key')`.

**A6.** Use API routes when you need an endpoint for external clients (mobile app, third-party service). In Server Components, call your database or service directly — it's faster and skips the HTTP layer.

</details>

---

## 📝 Notes

> Use this space to write your own notes.

-
-
-
