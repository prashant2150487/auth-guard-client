const UsersStats = ({ stats }) => {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <article className="rounded-2xl border border-slate-200 bg-white p-5">
        <p className="text-sm text-slate-500">Total users</p>
        <p className="mt-2 text-3xl font-semibold text-slate-900">
          {stats.total}
        </p>
      </article>
      <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <p className="text-sm text-emerald-700">Active</p>
        <p className="mt-2 text-3xl font-semibold text-emerald-800">
          {stats.active}
        </p>
      </article>
      <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-sm text-slate-600">Inactive</p>
        <p className="mt-2 text-3xl font-semibold text-slate-800">
          {stats.inactive}
        </p>
      </article>
      <article className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
        <p className="text-sm text-blue-700">Roles</p>
        <p className="mt-2 text-3xl font-semibold text-blue-800">
          {Object.keys(stats.byRole).length}
        </p>
      </article>
    </section>
  );
};

export default UsersStats;


