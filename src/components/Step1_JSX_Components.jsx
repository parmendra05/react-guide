// ============================================
// STEP 1: JSX & COMPONENTS
// ============================================
// JSX = JavaScript + HTML syntax mixed together.
// React converts JSX into real DOM elements.
// A Component is just a function that returns JSX.

// --- Functional Component ---
// Must start with a Capital letter.
// Returns JSX (looks like HTML but it's JavaScript).
function Greeting() {
  const name = "Ali"; // plain JS variable

  return (
    // JSX must have ONE root element (or use <>...</> Fragment)
    <div>
      {/* Use {} to embed any JS expression inside JSX */}
      <h1>Hello, {name}!</h1>
      <p>2 + 2 = {2 + 2}</p>
      <p>Today: {new Date().toDateString()}</p>
    </div>
  );
}

// --- Props (Properties) ---
// Props = data passed FROM parent TO child component.
// They are READ-ONLY inside the child.
function UserCard({ name, age, role = "User" }) {
  // Destructure props directly in the parameter
  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", margin: "8px" }}>
      <h3>{name}</h3>
      <p>Age: {age}</p>
      <p>Role: {role}</p>
    </div>
  );
}

// --- Rendering Lists ---
// Use .map() to render arrays. Always add a unique "key" prop.
function UserList() {
  const users = [
    { id: 1, name: "Ali",   age: 25 },
    { id: 2, name: "Sara",  age: 30, role: "Admin" },
    { id: 3, name: "John",  age: 22 },
  ];

  return (
    <div>
      <h2>User List</h2>
      {users.map((user) => (
        // key helps React track which items changed
        <UserCard key={user.id} name={user.name} age={user.age} role={user.role} />
      ))}
    </div>
  );
}

// --- Conditional Rendering ---
function StatusBadge({ isOnline }) {
  return (
    <span>
      {/* Ternary operator for inline conditions */}
      Status: {isOnline ? "🟢 Online" : "🔴 Offline"}
    </span>
  );
}

// --- Main export for Step 1 ---
function Step1_JSX_Components() {
  return (
    <div>
      <h1>Step 1: JSX & Components</h1>
      <Greeting />
      <hr />
      <UserList />
      <hr />
      <StatusBadge isOnline={true} />
      <br />
      <StatusBadge isOnline={false} />
    </div>
  );
}

export default Step1_JSX_Components;
