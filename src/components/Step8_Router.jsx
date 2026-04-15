// ============================================
// STEP 8: REACT ROUTER (Client-Side Navigation)
// ============================================
// React Router lets you build Single Page Applications (SPA).
// The URL changes but the page never fully reloads.
//
// Install: npm install react-router-dom
//
// Key components:
//   <BrowserRouter>  → wraps the app, enables routing
//   <Routes>         → container for all Route definitions
//   <Route>          → maps a URL path to a component
//   <Link>           → navigation link (replaces <a> tag)
//   <NavLink>        → like Link but adds "active" class when matched
//   useNavigate()    → programmatic navigation (redirect in code)
//   useParams()      → read URL parameters like /users/:id

import { BrowserRouter, Routes, Route, Link, NavLink, useNavigate, useParams } from "react-router-dom";

// --- Pages ---
function Home() {
  const navigate = useNavigate(); // hook for programmatic navigation

  return (
    <div>
      <h2>🏠 Home Page</h2>
      <p>Welcome to the React Router demo!</p>
      {/* Navigate programmatically (e.g., after form submit) */}
      <button onClick={() => navigate("/about")}>Go to About</button>
    </div>
  );
}

function About() {
  return (
    <div>
      <h2>ℹ️ About Page</h2>
      <p>This is the about page.</p>
    </div>
  );
}

// Dynamic route: /users/:id
// useParams() reads the :id from the URL
function UserDetail() {
  const { id } = useParams(); // reads ":id" from the URL

  return (
    <div>
      <h2>👤 User Detail</h2>
      <p>Showing details for User ID: <strong>{id}</strong></p>
    </div>
  );
}

function Users() {
  const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
  ];

  return (
    <div>
      <h2>👥 Users</h2>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {/* Link to dynamic route */}
            <Link to={`/users/${u.id}`}>{u.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// 404 page
function NotFound() {
  return <h2>❌ 404 — Page Not Found</h2>;
}

// --- Navigation Bar ---
const navStyle = { display: "flex", gap: "16px", padding: "10px", background: "#f0f0f0" };
const activeStyle = { fontWeight: "bold", color: "blue" }; // applied when route is active

function Navbar() {
  return (
    <nav style={navStyle}>
      {/* NavLink adds "active" styling when the route matches */}
      <NavLink to="/"      style={({ isActive }) => isActive ? activeStyle : {}}>Home</NavLink>
      <NavLink to="/about" style={({ isActive }) => isActive ? activeStyle : {}}>About</NavLink>
      <NavLink to="/users" style={({ isActive }) => isActive ? activeStyle : {}}>Users</NavLink>
    </nav>
  );
}

// --- App with Router ---
function Step8_Router() {
  return (
    // BrowserRouter must wrap everything that uses routing
    <BrowserRouter>
      <Navbar />
      <div style={{ padding: "16px" }}>
        <Routes>
          {/* Each Route maps a path to a component */}
          <Route path="/"          element={<Home />} />
          <Route path="/about"     element={<About />} />
          <Route path="/users"     element={<Users />} />
          <Route path="/users/:id" element={<UserDetail />} />
          {/* Catch-all: matches any unmatched path */}
          <Route path="*"          element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default Step8_Router;
