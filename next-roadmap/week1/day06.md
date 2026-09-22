# Day 06 — Auth, Middleware & Environment Variables

## 📅 Daily Tracker

```
[ ] Concepts read
[ ] Code written
[ ] Practical task completed
[ ] Quiz answered
```

---

## 🧠 Concepts

### Environment Variables

Next.js has built-in support for environment variables. Store secrets (API keys, DB URLs) in `.env.local` — never hardcode them.

#### `.env.local` file (never commit this!)

```bash
# .env.local
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
NEXTAUTH_SECRET=my-super-secret-key-32-chars-long
NEXTAUTH_URL=http://localhost:3000
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
NEXT_PUBLIC_API_URL=https://api.example.com
```

#### Accessing env vars

```js
// Server-side ONLY (API routes, Server Components, middleware)
const dbUrl = process.env.DATABASE_URL;
const secret = process.env.NEXTAUTH_SECRET;

// Client-side accessible (prefix with NEXT_PUBLIC_)
// Available everywhere — browser + server
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

> ⚠️ **Critical rule:** Only variables prefixed with `NEXT_PUBLIC_` are sent to the browser. Never put secrets in `NEXT_PUBLIC_` variables — they are visible to everyone.

---

### .gitignore — Protect Your Secrets

Make sure `.env.local` is in your `.gitignore`:

```bash
# .gitignore
.env.local
.env.*.local
```

Create a `.env.example` file (safe to commit) to document what variables are needed:

```bash
# .env.example
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

---

### Middleware

Middleware runs **before** a request is completed. It's perfect for:
- Redirecting unauthenticated users
- Adding response headers
- A/B testing
- Geo-based redirects
- Rate limiting

Create `middleware.js` at the **root of your project** (same level as `app/`):

```js
// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Example: redirect /old-page to /new-page
  if (pathname === '/old-page') {
    return NextResponse.redirect(new URL('/new-page', request.url));
  }

  // Example: add a custom header to all responses
  const response = NextResponse.next();
  response.headers.set('X-Custom-Header', 'my-value');
  return response;
}
```

---

### Middleware Matcher

Control which routes middleware runs on using the `config` export:

```js
// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  // runs only on matched routes
  console.log('Middleware running for:', request.nextUrl.pathname);
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',   // all /dashboard routes
    '/profile',            // only /profile
    '/api/protected/:path*',
  ],
};
```

---

### Authentication with NextAuth.js

[NextAuth.js](https://next-auth.js.org/) (now called Auth.js) is the most popular auth library for Next.js. It handles sessions, OAuth providers, JWT, and database sessions.

#### Install

```bash
npm install next-auth
```

#### Set up the auth handler

Always export `authOptions` separately — you'll need it in Server Components to call `getServerSession`:

```js
// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';

// ✅ Export authOptions so Server Components can import it
export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Check credentials against your DB
        const user = await getUserFromDb(credentials.email, credentials.password);
        if (user) return user;
        return null; // null = auth failed
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin', // custom sign-in page
  },

  // Callbacks let you customise token and session content
  callbacks: {
    async jwt({ token, user }) {
      // Runs when a JWT is created (sign in) or updated
      if (user) {
        token.role = user.role; // attach extra fields to the token
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Runs whenever a session is checked
      // Expose token fields to the client session object
      session.user.role = token.role;
      session.user.id = token.id;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

---

### JWT vs Database Sessions

NextAuth supports two session storage strategies:

| Strategy | How it works | Best for |
|----------|-------------|----------|
| **JWT** (default) | Session stored in an encrypted cookie; no DB reads per request | Stateless apps, edge deployments |
| **Database** | Session stored in DB; token is just a reference ID | Apps that need instant session revocation |

```js
// Switch to database sessions:
export const authOptions = {
  session: { strategy: 'database' },
  adapter: PrismaAdapter(db), // requires an adapter + DB setup
  // ...providers
};
```

Stick with JWT unless you need server-side session invalidation.

---

### Protecting Routes with Middleware

The most robust way to protect routes — runs before the page renders:

```js
// middleware.js
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard');

  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // Redirect authenticated users away from auth pages
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};
```

---

### Reading Session in Server Components

```jsx
// app/dashboard/page.jsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div>
      <h1>Welcome, {session.user.name}!</h1>
      <p>Email: {session.user.email}</p>
    </div>
  );
}
```

---

### Reading Session in Client Components

```jsx
'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <p>Loading...</p>;

  if (session) {
    return (
      <div>
        <p>Signed in as {session.user.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }

  return <button onClick={() => signIn()}>Sign in</button>;
}
```

Wrap your root layout with the `SessionProvider`:

```jsx
// app/layout.jsx
import { SessionProvider } from 'next-auth/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
```

---

## 💻 Practical Task

**Add auth protection to your Day 02 dashboard:**

1. Set up NextAuth with GitHub OAuth (create a GitHub OAuth App at github.com/settings/developers)
2. Add env variables to `.env.local`
3. Create a sign-in page at `app/auth/signin/page.jsx`
4. Protect `/dashboard` and its sub-routes using middleware
5. Show the logged-in user's name and avatar in the dashboard layout
6. Add a sign-out button

---

## ✅ End-of-Day Quiz

**Q1.** What prefix makes an environment variable accessible in the browser?

**Q2.** Where do you create middleware in a Next.js project?

**Q3.** What does `NextResponse.redirect()` do vs. `NextResponse.next()`?

**Q4.** Why is middleware better for protecting routes than checking auth inside each page?

**Q5.** What is the difference between `getServerSession` and `useSession`?

**Q6.** Why should you never put `DATABASE_URL` in a `NEXT_PUBLIC_` variable?

---

<details>
<summary>📖 Answers (click to reveal)</summary>

**A1.** `NEXT_PUBLIC_` — only variables with this prefix are bundled into the client-side JavaScript. All others are server-only.

**A2.** In `middleware.js` (or `middleware.ts`) at the root of the project, alongside the `app/` folder — NOT inside `app/`.

**A3.** `NextResponse.redirect()` sends the user to a different URL (302 redirect). `NextResponse.next()` continues processing the request normally and proceeds to the page or API route.

**A4.** Middleware runs at the edge BEFORE the page is rendered. If you check auth inside the page, the server still does work before redirecting. Middleware intercepts early, saving server resources and preventing flash of protected content.

**A5.** `getServerSession` is an async function used in Server Components and API routes — it reads the session on the server. `useSession` is a React hook for Client Components — it reads the session via an HTTP request to `/api/auth/session`.

**A6.** `NEXT_PUBLIC_` variables are embedded in the client-side bundle and visible to anyone who reads the source code. A `DATABASE_URL` with credentials would expose your database to the public internet.

</details>

---

## 📝 Notes

> Use this space to write your own notes.

-
-
-
