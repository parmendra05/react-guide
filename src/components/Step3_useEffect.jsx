// ============================================
// STEP 3: useEffect HOOK
// ============================================
// useEffect runs SIDE EFFECTS after render.
// Side effects = anything outside React (API calls, timers, subscriptions).
//
// Syntax: useEffect(callback, [dependencies])
//
// Dependency array controls WHEN the effect runs:
//   useEffect(fn)        → runs after EVERY render
//   useEffect(fn, [])    → runs ONCE after first render (mount)
//   useEffect(fn, [x])   → runs when "x" changes

import { useState, useEffect } from "react";

// --- Example 1: Run once on mount (fetch data) ---
function UserFetcher() {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Runs once when component mounts ([] = no dependencies)
    fetch("https://jsonplaceholder.typicode.com/users/1")
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      });
  }, []); // ← empty array = run once

  if (loading) return <p>Loading...</p>;
  return <p>Fetched User: {user.name} — {user.email}</p>;
}

// --- Example 2: Run when dependency changes ---
function SearchFilter() {
  const [query,   setQuery]   = useState("");
  const [results, setResults] = useState([]);
  const items = ["Apple", "Banana", "Avocado", "Blueberry", "Apricot"];

  useEffect(() => {
    // Runs every time "query" changes
    const filtered = items.filter((item) =>
      item.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  }, [query]); // ← re-run when query changes

  return (
    <div>
      <input
        placeholder="Search fruit..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul>
        {results.map((r) => <li key={r}>{r}</li>)}
      </ul>
    </div>
  );
}

// --- Example 3: Cleanup (prevent memory leaks) ---
// Return a function from useEffect to clean up when component unmounts.
function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return; // don't start if not running

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    // Cleanup: clear interval when component unmounts OR "running" changes
    return () => clearInterval(interval);
  }, [running]); // ← re-run when "running" changes

  return (
    <div>
      <p>Timer: {seconds}s</p>
      <button onClick={() => setRunning(true)}>Start</button>
      <button onClick={() => setRunning(false)}>Stop</button>
      <button onClick={() => { setRunning(false); setSeconds(0); }}>Reset</button>
    </div>
  );
}

function Step3_useEffect() {
  return (
    <div>
      <h1>Step 3: useEffect</h1>
      <UserFetcher />
      <hr />
      <SearchFilter />
      <hr />
      <Timer />
    </div>
  );
}

export default Step3_useEffect;
