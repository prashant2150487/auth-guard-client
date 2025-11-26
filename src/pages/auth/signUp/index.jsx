import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../lib/axiosInstance";
import toast from "react-hot-toast";

const roles = ["Security Director", "Site Supervisor", "Operator", "Analyst"];

export default function SignUpPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    // Validation
    if (!name || !email || !password || !phone) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post("/api/auth/signup", {
        name,
        email,
        password,
        phone,
      });

      console.log(response);
      if (response.data.success) {
        toast.success("Account created successfully!");
      }

      // Redirect to sign-in page after 1.5 seconds
      setTimeout(() => {
        navigate("/sign-in", { replace: true });
      }, 1500);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Unable to create account right now. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl grid gap-8 lg:grid-cols-[2fr_3fr]">
        <section className="rounded-2xl border border-white/10 bg-linear-to-b from-slate-900 to-slate-950 p-8 shadow-xl shadow-blue-500/10">
          <p className="text-sm uppercase tracking-[0.2em] text-white/60">
            New command center
          </p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight text-white">
            Spin up a Guard workspace in under two minutes.
          </h1>
          <p className="mt-4 text-white/70">
            Build your team, connect sites, and automate reporting with
            Guard&apos;s secure-by-default platform.
          </p>

          <div className="mt-8 space-y-6">
            <div>
              <p className="text-sm text-white/60">Trusted by teams securing</p>
              <p className="text-4xl font-semibold text-white">430+</p>
              <p className="text-white/60">critical facilities worldwide</p>
            </div>
            <div className="flex gap-4">
              {roles.map((role) => (
                <span
                  key={role}
                  className="rounded-full border border-white/20 px-3 py-1 text-sm text-white/70"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </section>

        <form
          className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-blue-500/5 space-y-6"
          onSubmit={handleSubmit}
        >
          <div>
            <p className="text-sm text-white/60">
              Let&apos;s get your workspace ready
            </p>
            <h2 className="text-2xl font-semibold">Secure onboarding</h2>
          </div>

          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-white/80">
              Full name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Prashant Sachan"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-base text-white placeholder:text-white/30 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 disabled:opacity-60"
              disabled={isSubmitting}
              required
            />
          </div>

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
              placeholder="psachan04@hotmail.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-base text-white placeholder:text-white/30 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 disabled:opacity-60"
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="text-sm font-medium text-white/80"
            >
              Phone number
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="8546040002"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-base text-white placeholder:text-white/30 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 disabled:opacity-60"
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-white/80"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-base text-white placeholder:text-white/30 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 disabled:opacity-60"
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-white/80"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-base text-white placeholder:text-white/30 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 disabled:opacity-60"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-slate-950/30 px-4 py-3 text-sm text-white/70">
            <input
              type="checkbox"
              className="mt-1 size-4 rounded border-white/30 bg-transparent accent-blue-400"
              required
            />
            I agree to Guard&apos;s security policies and data handling terms.
          </label>

          {error && (
            <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-100">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-500 py-3 text-base font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-blue-500/60"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Create workspace"}
          </button>

          <p className="text-center text-sm text-white/70">
            Already have secure access?{" "}
            <a
              className="font-semibold text-blue-300 hover:text-blue-200"
              href="/sign-in"
            >
              Sign in here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
