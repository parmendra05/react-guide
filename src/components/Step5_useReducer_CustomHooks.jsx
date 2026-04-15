// ============================================
// STEP 5: useReducer & CUSTOM HOOKS
// ============================================

import { useReducer, useState, useEffect } from "react";

// ---- useReducer ----
// useReducer is like useState but for COMPLEX state logic.
// Instead of calling setState directly, you dispatch an "action".
// A "reducer" function decides how state changes based on the action.
//
// Pattern:
//   state   = current data
//   action  = { type: "WHAT_TO_DO", payload: optionalData }
//   reducer = (state, action) => newState

// 1. Define the reducer — pure function, no side effects
function cartReducer(state, action) {
  switch (action.type) {
    case "ADD":
      // Check if item already exists
      const exists = state.find((i) => i.id === action.payload.id);
      if (exists) {
        // Increase quantity
        return state.map((i) =>
          i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      // Add new item with qty 1
      return [...state, { ...action.payload, qty: 1 }];

    case "REMOVE":
      return state.filter((i) => i.id !== action.payload);

    case "CLEAR":
      return [];

    default:
      return state; // always return state for unknown actions
  }
}

function ShoppingCart() {
  // 2. useReducer(reducerFn, initialState)
  const [cart, dispatch] = useReducer(cartReducer, []);

  const products = [
    { id: 1, name: "Apple",  price: 1.5 },
    { id: 2, name: "Banana", price: 0.8 },
    { id: 3, name: "Mango",  price: 2.0 },
  ];

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div>
      <h3>Products</h3>
      {products.map((p) => (
        <div key={p.id}>
          {p.name} (${p.price}) —{" "}
          {/* 3. Dispatch an action object */}
          <button onClick={() => dispatch({ type: "ADD", payload: p })}>
            Add to Cart
          </button>
        </div>
      ))}

      <h3>Cart ({cart.length} items)</h3>
      {cart.map((item) => (
        <div key={item.id}>
          {item.name} × {item.qty} = ${(item.price * item.qty).toFixed(2)}{" "}
          <button onClick={() => dispatch({ type: "REMOVE", payload: item.id })}>
            ✕
          </button>
        </div>
      ))}
      <p>Total: ${total.toFixed(2)}</p>
      <button onClick={() => dispatch({ type: "CLEAR" })}>Clear Cart</button>
    </div>
  );
}

// ---- Custom Hooks ----
// A Custom Hook is just a function that starts with "use" and uses other hooks.
// Purpose: REUSE stateful logic across multiple components.

// Custom Hook 1: useFetch — reusable data fetching
function useFetch(url) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((d)   => { setData(d);    setLoading(false); })
      .catch((e)  => { setError(e.message); setLoading(false); });
  }, [url]);

  return { data, loading, error }; // return everything the component needs
}

// Custom Hook 2: useLocalStorage — persist state in browser storage
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    // Read from localStorage on first render
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  const setStoredValue = (newValue) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue)); // sync to storage
  };

  return [value, setStoredValue];
}

// Using the custom hooks
function PostViewer() {
  const [postId, setPostId] = useState(1);
  // Reuse useFetch — no need to repeat fetch logic
  const { data: post, loading } = useFetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}`
  );

  return (
    <div>
      <button onClick={() => setPostId((id) => Math.max(1, id - 1))}>◀ Prev</button>
      <button onClick={() => setPostId((id) => id + 1)}>Next ▶</button>
      <p>Post #{postId}</p>
      {loading ? <p>Loading...</p> : <p>{post?.title}</p>}
    </div>
  );
}

function Notepad() {
  // State is automatically saved to localStorage
  const [note, setNote] = useLocalStorage("my-note", "");

  return (
    <div>
      <textarea
        rows={3}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Type a note — it persists on refresh!"
        style={{ width: "100%" }}
      />
      <p>Saved: {note.length} chars</p>
    </div>
  );
}

function Step5_useReducer_CustomHooks() {
  return (
    <div>
      <h1>Step 5: useReducer & Custom Hooks</h1>
      <h3>useReducer — Shopping Cart</h3>
      <ShoppingCart />
      <hr />
      <h3>Custom Hook: useFetch</h3>
      <PostViewer />
      <hr />
      <h3>Custom Hook: useLocalStorage</h3>
      <Notepad />
    </div>
  );
}

export default Step5_useReducer_CustomHooks;
