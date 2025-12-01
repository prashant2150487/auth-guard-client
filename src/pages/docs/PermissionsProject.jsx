const PermissionsProject = () => {
  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-10">
      <header>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
          Project
        </p>
        <h1 className="mt-1 text-3xl font-semibold text-slate-900">
          Guard Permissions Project
        </h1>
        <p className="text-slate-600">
          Documentation for the permission model, assignment flows, and audits.
        </p>
      </header>

      <article className="space-y-4 text-sm text-slate-700">
        <p>
          This project explains how permissions are structured in Guard, how
          they are fetched, and how assignment to users happens via bulk
          operations. It covers read, create, update, delete, and domain-specific
          permissions such as posts and roles.
        </p>
        <p>
          Use this section when implementing permission checks in the UI or
          backend, and when building tools to review or adjust a user&apos;s
          access.
        </p>
      </article>
    </section>
  );
};

export default PermissionsProject;


