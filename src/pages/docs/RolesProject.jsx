const RolesProject = () => {
  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-10">
      <header>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
          Project
        </p>
        <h1 className="mt-1 text-3xl font-semibold text-slate-900">
          Guard Roles Project
        </h1>
        <p className="text-slate-600">
          High-level description of how roles group permissions and define
          access levels.
        </p>
      </header>

      <article className="space-y-4 text-sm text-slate-700">
        <p>
          This project focuses on role definitions and how they bundle
          permissions into reusable access profiles for teams. It describes
          typical roles like super-admin, manager, and operator, and how they
          map to permission sets.
        </p>
        <p>
          Use this section when you design new roles, adjust existing ones, or
          need to understand which permissions are implied by a given role.
        </p>
      </article>
    </section>
  );
};

export default RolesProject;


