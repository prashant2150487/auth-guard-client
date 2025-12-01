import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axiosInstance from "../../../lib/axiosInstance";
import { setCredentials } from "../../../store/userSlice";

const features = [
  "Real-time perimeter alerts",
  "AI-assisted patrol reports",
  "Centralized team coordination",
];

export default function SignInPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please enter both your work email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post("/api/auth/login", {
        email,
        password,
      });
      dispatch(
        setCredentials({
          token: response.data?.accessToken || "",
        })
      );
      setSuccess("Authentication successful. Redirecting…");
      setTimeout(() => navigate("/", { replace: true }), 800);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Unable to sign in right now. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl grid gap-8 lg:grid-cols-[3fr_2fr]">
        <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-8 shadow-xl shadow-indigo-500/5">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-lg font-semibold">
              G
            </div>
            <div>
              <p className="text-sm text-white/60 text-start">
                Welcome back to Guard
              </p>
              <h1 className="text-2xl font-semibold">Secure access portal</h1>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-white/80"
              >
                Work email
              </label>
              <input
                id="email"
                type="email"
                placeholder="jordan@acmesecurity.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-base text-white placeholder:text-white/40 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 disabled:opacity-60"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm font-medium text-white/80">
                <label htmlFor="password">Password</label>
                <button
                  type="button"
                  className="text-indigo-300 hover:text-indigo-200"
                >
                  Forgot password?
                </button>
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-base text-white placeholder:text-white/40 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 disabled:opacity-60"
                disabled={isSubmitting}
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
              <input
                type="checkbox"
                className="size-4 rounded border-white/20 bg-transparent accent-indigo-400"
              />
              Keep me signed in for 30 days
            </label>

            {error && (
              <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-100">
                {error}
              </p>
            )}

            {success && (
              <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-100">
                {success}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-500 py-3 text-base font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-indigo-500/60"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Authenticating…" : "Access dashboard"}
            </button>

            <div className="flex items-center gap-3 text-sm text-white/50">
              <span className="h-px flex-1 bg-white/10" />
              Or continue with
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="rounded-xl border border-white/10 bg-transparent py-3 text-sm font-medium text-white/80 transition hover:border-white/30"
              >
                SSO
              </button>
              <button
                type="button"
                className="rounded-xl border border-white/10 bg-transparent py-3 text-sm font-medium text-white/80 transition hover:border-white/30"
              >
                Passkey
              </button>
            </div>
          </form>

          <p className="mt-8 text-sm text-white/60">
            Need an account?{" "}
            <a
              className="text-indigo-300 hover:text-indigo-200"
              href="/sign-up"
            >
              Request access
            </a>
          </p>
        </div>

        <aside className="rounded-2xl border border-white/10 bg-linear-to-b from-indigo-500/40 to-blue-500/20 p-8 shadow-xl shadow-indigo-500/20">
          <p className="text-sm uppercase tracking-[0.2em] text-white/70">
            Guard platform
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight">
            Coordinate your security operations with live intel.
          </h2>

          <ul className="mt-8 space-y-4">
            {features.map((item) => (
              <li key={item} className="flex items-start gap-3 text-white/90">
                <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs font-semibold text-white">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-10 rounded-2xl bg-white/10 p-5">
            <p className="text-sm uppercase tracking-wide text-white/70">
              Status
            </p>
            <p className="mt-2 text-3xl font-semibold">Operational</p>
            <p className="text-white/60">All monitoring systems are running</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
