const UsersProject = () => {
  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-10">
      <header>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
          Project
        </p>
        <h1 className="mt-1 text-3xl font-semibold text-slate-900">
          Guard Users Project
        </h1>
        <p className="text-slate-600">
          Overview of how Guard manages users, accounts, and directory views.
        </p>
      </header>

      <article className="space-y-4 text-sm text-slate-700">
        <p>
          This project describes the lifecycle of a user inside Guard: how
          accounts are created, updated, disabled, and audited. It also covers
          directory search, profile views, and basic access patterns.
        </p>
        <p>
          Use this section as a reference when working on user onboarding flows,
          profile pages, or directory optimizations.
        </p>
      </article>
    </section>
  );
};

export default UsersProject;


