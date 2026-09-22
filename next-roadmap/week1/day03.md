# Day 03 — Server Components vs Client Components

## 📅 Daily Tracker

```
[ ] Concepts read
[ ] Code written
[ ] Practical task completed
[ ] Quiz answered
```

---

## 🧠 Concepts

### The Mental Shift (Most Important Day!)

This is the #1 thing that confuses React developers moving to Next.js.

In plain React → **everything runs in the browser (client)**
In Next.js App Router → **everything is a Server Component by default**

You have to explicitly opt into client-side behavior.

---

### Server Components

- Run **only on the server**
- Never sent to the browser as JavaScript
- Can directly access databases, file system, env secrets
- Cannot use: `useState`, `useEffect`, browser APIs, event handlers
- Smaller bundle size (no JS shipped to client)

```jsx
// app/users/page.jsx  ← Server Component by default
// No 'use client' directive needed

async function getUsers() {
  const res = await fetch('https://jsonplaceholder.typicode.com/users');
  return res.json();
}

export default async function UsersPage() {
  const users = await getUsers(); // runs on server, no useEffect needed!

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

Notice: **No `useEffect`, no `useState`, no `fetch` in a hook.** Just `async/await` directly in the component.

---

### Client Components

Add `'use client'` at the very top of the file to make it a Client Component:

```jsx
'use client'; // ← this directive makes it a Client Component

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

Client Components:
- Run in the browser
- Can use all React hooks
- Can handle events (onClick, onChange, etc.)
- Can use browser APIs (localStorage, window, document)

---

### When to Use Which?

| Need | Use |
|------|-----|
| Fetch data from DB/API | Server Component |
| Access environment secrets | Server Component |
| Use useState / useEffect | Client Component |
| Handle user events (click, input) | Client Component |
| Use browser APIs (localStorage) | Client Component |
| Render static content | Server Component |
| Use third-party hooks | Client Component |

**Rule of thumb:** Start with Server Component. Only add `'use client'` when you need interactivity.

---

### Composing Server & Client Components

You can nest Client inside Server, but NOT Server inside Client.

```jsx
// app/page.jsx — Server Component
import Counter from '@/components/Counter'; // Client Component

export default async function HomePage() {
  const data = await fetchSomeData(); // server-side fetch

  return (
    <div>
      <h1>{data.title}</h1>
      <Counter />  {/* Client Component nested inside Server Component ✅ */}
    </div>
  );
}
```

**The boundary rule:**
- Once you enter a Client Component tree, all children are client-side
- You can pass Server Component output as `children` prop to a Client Component

```jsx
// ✅ Valid: passing server data down as props
// ServerParent.jsx (Server)
import ClientWrapper from './ClientWrapper';

export default async function ServerParent() {
  const data = await fetchData();
  return <ClientWrapper data={data} />;
}
```

```jsx
// ❌ Invalid: importing a Server Component inside a Client Component
'use client';
import ServerComponent from './ServerComponent'; // This won't work as a Server Component
```

---

### The `'use client'` Directive

- It marks the **boundary** between server and client trees
- You don't need it in every file — it propagates down
- Place it only at the top of files that need client features

```jsx
'use client';
// must be the FIRST line (before imports)
import { useState } from 'react';
```

---

### Hydration

Server Components render HTML on the server. Client Components also render on the server first (for initial HTML), then get "hydrated" in the browser (React attaches event listeners).

This is different from pure SSR — it's a **split model**.

---

### Streaming Server Components with Suspense

You can stream a slow Server Component while the rest of the page renders immediately. Wrap it in `<Suspense>`:

```jsx
// app/dashboard/page.jsx  — Server Component
import { Suspense } from 'react';
import SlowStats from '@/components/SlowStats'; // slow DB query

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      {/* This renders immediately */}
      <p>Welcome back!</p>

      {/* This streams in when the slow query finishes */}
      <Suspense fallback={<p>Loading stats...</p>}>
        <SlowStats />
      </Suspense>
    </div>
  );
}
```

```jsx
// components/SlowStats.jsx — Server Component
async function getStats() {
  await new Promise(r => setTimeout(r, 2000)); // simulated slow query
  return { revenue: '$12,400', orders: 142 };
}

export default async function SlowStats() {
  const stats = await getStats();
  return (
    <div>
      <p>Revenue: {stats.revenue}</p>
      <p>Orders: {stats.orders}</p>
    </div>
  );
}
```

---

### Wrapping Third-Party Client Libraries

Many npm packages use `useState`, context, or browser APIs internally but don't have `'use client'`. You must wrap them:

```jsx
// components/ToastProvider.jsx
'use client';

// react-hot-toast uses browser APIs internally
import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return <Toaster position="top-right" />;
}
```

```jsx
// app/layout.jsx — Server Component can safely import the wrapper
import ToastProvider from '@/components/ToastProvider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <ToastProvider />  {/* wrapper is Client, layout stays Server */}
      </body>
    </html>
  );
}
```

This is the standard pattern for analytics libraries, UI toast providers, drag-and-drop kits, and any library that breaks with SSR.

---

### Context in Server Components

You cannot use React Context in Server Components. Context is for client-side state sharing. If you need shared server state, pass it as props or use a database.

```jsx
// ❌ This won't work in a Server Component
import { useContext } from 'react';
import { ThemeContext } from './context';
const theme = useContext(ThemeContext); // Error!
```

---

## 💻 Practical Task

**Build a product listing page with interactivity:**

1. Create `app/products/page.jsx` as a **Server Component**
   - Fetch products from `https://fakestoreapi.com/products`
   - Render a list of products (title, price, image)
2. Create `components/AddToCartButton.jsx` as a **Client Component**
   - Has a `useState` counter showing how many times it was clicked
   - Shows "Add to Cart (0)" initially, clicking increments the count
3. Import `AddToCartButton` into your Server Component product list
4. Notice: data fetching is server-side, interactivity is client-side

---

## ✅ End-of-Day Quiz

**Q1.** What is the default rendering mode for components in the App Router?

**Q2.** How do you convert a component to a Client Component?

**Q3.** Can you use `useState` in a Server Component?

**Q4.** Can a Server Component import a Client Component?

**Q5.** What does "hydration" mean in Next.js?

**Q6.** Why are Server Components better for performance?

---

<details>
<summary>📖 Answers (click to reveal)</summary>

**A1.** Server Components — all components in the App Router are Server Components by default.

**A2.** Add `'use client'` as the very first line of the file, before any imports.

**A3.** No. `useState`, `useEffect`, and all React hooks that depend on browser state cannot be used in Server Components.

**A4.** Yes! A Server Component can import and render a Client Component. The reverse is not true (you can't import a Server Component inside a Client Component and have it run on the server).

**A5.** Hydration is the process where React attaches JavaScript event listeners to server-rendered HTML in the browser. The initial HTML is rendered on the server, sent to the browser, then React "wakes it up" on the client side.

**A6.** Server Components don't ship any JavaScript to the browser. This means smaller bundle sizes, faster page loads, and better performance — especially for data-heavy pages.

</details>

---

## 📝 Notes

> Use this space to write your own notes.

-
-
-
