// ============================================
// STEP 6: useMemo, useCallback & React.memo
// ============================================
// React re-renders a component whenever its state or props change.
// These tools help you SKIP unnecessary re-renders and recalculations.
//
// React.memo  → memoize a COMPONENT (skip re-render if props unchanged)
// useMemo     → memoize a COMPUTED VALUE (skip recalculation)
// useCallback → memoize a FUNCTION (skip re-creation)

import { useState, useMemo, useCallback, memo } from "react";

// ---- React.memo ----
// Wrapping a component with memo() means it only re-renders
// when its props actually change.

// Without memo: re-renders every time parent re-renders
// With memo:    only re-renders when "name" prop changes
const ChildCard = memo(function ChildCard({ name, onGreet }) {
  console.log(`ChildCard rendered: ${name}`); // watch the console!
  return (
    <div style={{ border: "1px solid #aaa", padding: "8px", margin: "4px" }}>
      <span>{name}</span>
      <button onClick={() => onGreet(name)}>Greet</button>
    </div>
  );
});

// ---- useMemo ----
// Caches the RESULT of an expensive calculation.
// Only recalculates when dependencies change.
//
// useMemo(() => expensiveCalc(), [dep])

function ExpensiveList({ items, filter }) {
  // Without useMemo: filters on EVERY render (even unrelated renders)
  // With useMemo:    only re-filters when "items" or "filter" changes
  const filtered = useMemo(() => {
    console.log("Filtering items..."); // watch how often this runs
    return items.filter((item) =>
      item.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);

  return (
    <ul>
      {filtered.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}

// ---- useCallback ----
// Caches a FUNCTION so it's not re-created on every render.
// Important when passing callbacks to memoized child components —
// without useCallback, the function is a new reference each render,
// which breaks React.memo's optimization.

function Step6_Performance() {
  const [count,  setCount]  = useState(0);
  const [filter, setFilter] = useState("");

  const fruits = ["Apple", "Banana", "Avocado", "Blueberry", "Apricot", "Mango"];
  const names  = ["Alice", "Bob", "Charlie"];

  // Without useCallback: new function reference on every render
  //   → ChildCard re-renders even though nothing changed for it
  // With useCallback: same function reference unless dependencies change
  //   → ChildCard skips re-render (memo works correctly)
  const handleGreet = useCallback((name) => {
    alert(`Hello, ${name}!`);
  }, []); // no dependencies → created once, never re-created

  return (
    <div>
      <h1>Step 6: Performance Optimization</h1>

      {/* This counter causes parent re-renders */}
      <p>Parent render count trigger: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Re-render Parent</button>

      <hr />
      <h3>React.memo + useCallback</h3>
      <p>Click "Re-render Parent" and watch the console — ChildCards don't re-render!</p>
      {names.map((name) => (
        <ChildCard key={name} name={name} onGreet={handleGreet} />
      ))}

      <hr />
      <h3>useMemo — Filtered List</h3>
      <input
        placeholder="Filter fruits..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      {/* ExpensiveList only recalculates when filter changes, not on count change */}
      <ExpensiveList items={fruits} filter={filter} />
    </div>
  );
}

export default Step6_Performance;
