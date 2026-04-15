// ============================================
// APP.JSX — Main entry, navigate between steps
// ============================================
import { useState } from "react";
import Step1_JSX_Components        from "./components/Step1_JSX_Components";
import Step2_useState               from "./components/Step2_useState";
import Step3_useEffect              from "./components/Step3_useEffect";
import Step4_useRef_useContext      from "./components/Step4_useRef_useContext";
import Step5_useReducer_CustomHooks from "./components/Step5_useReducer_CustomHooks";
import Step6_Performance            from "./components/Step6_Performance";
import Step7_Forms                  from "./components/Step7_Forms";
import Step8_Router                 from "./components/Step8_Router";

const STEPS = [
  { label: "1. JSX & Components",          component: <Step1_JSX_Components /> },
  { label: "2. useState",                   component: <Step2_useState /> },
  { label: "3. useEffect",                  component: <Step3_useEffect /> },
  { label: "4. useRef & useContext",        component: <Step4_useRef_useContext /> },
  { label: "5. useReducer & Custom Hooks",  component: <Step5_useReducer_CustomHooks /> },
  { label: "6. Performance (memo/useMemo)", component: <Step6_Performance /> },
  { label: "7. Forms",                      component: <Step7_Forms /> },
  { label: "8. React Router",               component: <Step8_Router /> },
];

const sidebarStyle = {
  width: "220px",
  background: "#1e1e2e",
  color: "#cdd6f4",
  padding: "16px",
  minHeight: "100vh",
  flexShrink: 0,
};

const btnStyle = (active) => ({
  display: "block",
  width: "100%",
  textAlign: "left",
  padding: "8px 10px",
  marginBottom: "4px",
  background: active ? "#89b4fa" : "transparent",
  color:      active ? "#1e1e2e" : "#cdd6f4",
  border:     "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: active ? "bold" : "normal",
});

export default function App() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div style={{ display: "flex", fontFamily: "sans-serif" }}>
      {/* Sidebar navigation */}
      <aside style={sidebarStyle}>
        <h2 style={{ color: "#89b4fa", marginTop: 0 }}>⚛️ React Guide</h2>
        {STEPS.map((step, i) => (
          <button
            key={i}
            style={btnStyle(activeStep === i)}
            onClick={() => setActiveStep(i)}
          >
            {step.label}
          </button>
        ))}
      </aside>

      {/* Main content area */}
      <main style={{ flex: 1, padding: "24px", overflowY: "auto" }}>
        {STEPS[activeStep].component}
      </main>
    </div>
  );
}
