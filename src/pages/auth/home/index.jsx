export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute -top-16 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-500/20 blur-[140px]" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-10 right-0 h-72 w-72 rounded-full bg-indigo-500/20 blur-[160px]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-16 px-6 py-20 lg:flex-row lg:items-center lg:gap-24">
        <div className="max-w-2xl text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.4em] text-white/60">
            Guard Platform
          </span>

          <h1 className="mt-6 text-4xl font-semibold leading-tight text-white md:text-6xl">
            Operational Intelligence
            <span className="block bg-linear-to-b from-cyan-200 to-blue-400 bg-clip-text text-transparent">
              Built for Security Leaders
            </span>
          </h1>

          <p className="mt-6 text-lg text-white/70">
            Synchronize patrols, automate reporting, and unlock real-time situational awareness across every site.
            Guard orchestrates field operations with a single, cohesive view.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
            <a
              href="/sign-up"
              className="inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-blue-500 to-cyan-500 px-8 py-4 text-base font-semibold shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:from-blue-600 hover:to-cyan-600"
            >
              Get started
            </a>
            <a
              href="#demo"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-8 py-4 text-base font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
            >
              <span className="inline-block h-2 w-2 rounded-full bg-cyan-400" />
              Watch live demo
            </a>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              { label: "Uptime", value: "99.9%" },
              { label: "Monitoring", value: "24/7" },
              { label: "Insights", value: "Real-time" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/5 bg-white/5/50 p-4 text-center backdrop-blur">
                <div className="text-3xl font-bold text-white">{item.value}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.2em] text-white/50">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full rounded-3xl border border-white/10 bg-linear-to-br from-slate-900 to-slate-950/80 p-6 shadow-2xl shadow-blue-500/10">
          <div className="rounded-2xl bg-black/30 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm uppercase tracking-[0.5em] text-white/50">Live Sites</p>
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-300">Online</span>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 text-left text-white/80">
              {["Corporate HQ", "Logistics Hub", "Retail Flagship", "Industrial Yard"].map((site) => (
                <div key={site} className="rounded-xl border border-white/5 p-4">
                  <p className="text-sm text-white/60">Site</p>
                  <p className="text-lg font-semibold text-white">{site}</p>
                  <p className="mt-1 text-xs text-cyan-300">All patrols synced</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}