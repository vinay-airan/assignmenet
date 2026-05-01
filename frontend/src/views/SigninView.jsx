import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestLogin } from "../api/authRequests";
import { useSession } from "../hooks/useSession";

// ── tiny sub-components ────────────────────────────────

function GridOverlay() {
  return (
    <div className="fixed inset-0 grid-bg pointer-events-none" aria-hidden="true">
      {/* Amber glow in top-right */}
      <div className="absolute top-0 right-0 w-[480px] h-[480px] rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #f59e0b 0%, transparent 70%)" }} />
      {/* Dim glow bottom-left */}
      <div className="absolute bottom-0 left-0 w-[320px] h-[320px] rounded-full opacity-5"
        style={{ background: "radial-gradient(circle, #f59e0b 0%, transparent 70%)" }} />
    </div>
  );
}

function FieldRow({ label, id, type = "text", value, onChange, placeholder, disabled }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs text-steel-500 tracking-widest uppercase font-mono">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="forge-input bg-forge-800 border border-forge-600 text-steel-300 font-mono text-sm
          px-4 py-3 rounded placeholder-forge-500 transition-all duration-200
          disabled:opacity-40 disabled:cursor-not-allowed"
      />
    </div>
  );
}

function AlertBar({ text }) {
  return (
    <div className="flex items-center gap-2 bg-red-950/40 border border-red-800/50 rounded px-3 py-2.5 animate-fade-in">
      <span className="text-red-400 text-xs">▲</span>
      <p className="text-red-400 text-xs font-mono">{text}</p>
    </div>
  );
}

// ── demo role switcher ─────────────────────────────────
const DEMO_SLOTS = [
  { label: "admin", hint: "Full access" },
  { label: "member", hint: "View own tasks" },
];

// ── main view ─────────────────────────────────────────
export default function SigninView() {
  const navigate = useNavigate();
  const { openSession } = useSession();

  const [emailVal,    setEmailVal]    = useState("");
  const [passVal,     setPassVal]     = useState("");
  const [submitting,  setSubmitting]  = useState(false);
  const [errorMsg,    setErrorMsg]    = useState("");
  const [focusedSlot, setFocusedSlot] = useState(null);

  const handleSignin = async (e) => {
    e.preventDefault();
    if (!emailVal.trim() || !passVal.trim()) {
      setErrorMsg("Both fields are required.");
      return;
    }
    setSubmitting(true);
    setErrorMsg("");
    try {
      const { data } = await requestLogin({ email: emailVal.trim(), password: passVal });
      openSession(data.token, data.user);
      navigate("/board");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Login failed. Check credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="noise-layer min-h-screen bg-forge-950 flex items-center justify-center px-4">
      <GridOverlay />

      <div className="relative z-10 w-full max-w-[420px]">

        {/* ── Brand header ── */}
        <div className="mb-10 animate-slide-up">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 bg-ember-400 rounded-sm flex items-center justify-center">
              <span className="text-forge-950 font-display font-bold text-sm">F</span>
            </div>
            <span className="font-display text-white text-xl tracking-tight">FORGE</span>
            <span className="ml-auto text-forge-500 text-xs font-mono tracking-widest">v1.0</span>
          </div>

          <div className="border-l-2 border-ember-400 pl-4">
            <h1 className="font-display text-3xl text-white leading-none mb-1">
              Sign in
            </h1>
            <p className="text-steel-500 text-xs font-mono tracking-wide">
              Workspace access required
            </p>
          </div>
        </div>

        {/* ── Card ── */}
        <div
          className="bg-forge-900 border border-forge-700 rounded-lg overflow-hidden
            animate-slide-up delay-100"
          style={{ animationFillMode: "both", opacity: 0 }}
        >

          {/* Top rule line */}
          <div className="h-px bg-gradient-to-r from-ember-400 via-ember-600 to-transparent" />

          <form onSubmit={handleSignin} className="p-7 flex flex-col gap-5">

            {errorMsg && <AlertBar text={errorMsg} />}

            <FieldRow
              label="Email address"
              id="email-field"
              type="email"
              value={emailVal}
              onChange={(e) => setEmailVal(e.target.value)}
              placeholder="you@company.com"
              disabled={submitting}
            />

            <FieldRow
              label="Password"
              id="pass-field"
              type="password"
              value={passVal}
              onChange={(e) => setPassVal(e.target.value)}
              placeholder="••••••••"
              disabled={submitting}
            />

            {/* ── Submit ── */}
            <button
              type="submit"
              disabled={submitting}
              className="relative mt-1 bg-ember-400 hover:bg-ember-500 disabled:bg-forge-600
                text-forge-950 font-mono font-semibold text-sm tracking-widest uppercase
                px-6 py-3.5 rounded transition-all duration-200 overflow-hidden
                disabled:cursor-not-allowed group"
            >
              {/* Shine sweep on hover */}
              <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%]
                bg-gradient-to-r from-transparent via-white/10 to-transparent
                transition-transform duration-500 ease-in-out" />
              <span className="relative">
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-3 h-3 border-2 border-forge-950/30 border-t-forge-950 rounded-full animate-spin" />
                    Authenticating
                  </span>
                ) : "Access Workspace →"}
              </span>
            </button>

          </form>

          {/* ── Demo role hint ── */}
          <div className="px-7 pb-7">
            <p className="text-forge-500 text-xs font-mono mb-3 tracking-widest uppercase">
              Demo roles
            </p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_SLOTS.map((slot) => (
                <button
                  key={slot.label}
                  type="button"
                  onMouseEnter={() => setFocusedSlot(slot.label)}
                  onMouseLeave={() => setFocusedSlot(null)}
                  onClick={() => {
                    setEmailVal(`${slot.label}@forge.dev`);
                    setPassVal("password123");
                  }}
                  className={`text-left px-3 py-2.5 rounded border transition-all duration-150 cursor-pointer
                    ${focusedSlot === slot.label
                      ? "border-ember-500 bg-ember-400/10"
                      : "border-forge-700 bg-forge-800"}`}
                >
                  <p className={`text-xs font-mono font-semibold tracking-wide
                    ${focusedSlot === slot.label ? "text-ember-400" : "text-steel-400"}`}>
                    {slot.label}
                  </p>
                  <p className="text-forge-500 text-xs font-mono mt-0.5">{slot.hint}</p>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* ── Footer note ── */}
        <p className="text-center text-forge-500 text-xs font-mono mt-6 animate-slide-up delay-300"
          style={{ animationFillMode: "both", opacity: 0 }}>
          No account?{" "}
          <span className="text-steel-500 cursor-pointer hover:text-ember-400 transition-colors">
            Contact your admin
          </span>
        </p>

        {/* ── Corner accent ── */}
        <div className="absolute -bottom-3 -right-3 w-16 h-16 pointer-events-none"
          aria-hidden="true">
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M64 0 L64 64 L0 64" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.2" />
          </svg>
        </div>

      </div>
    </div>
  );
}
