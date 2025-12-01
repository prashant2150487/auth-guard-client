import { Edit2, Trash2 } from "lucide-react";

const PermissionsTable = ({
  permissions,
  loading,
  onEditPermission,
  onDeletePermission,
}) => {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
      {loading ? (
        <p className="py-8 text-center text-sm text-slate-500">Loading...</p>
      ) : permissions.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">
          No permissions found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
            <thead>
              <tr className="text-slate-500">
                <th className="py-3 pr-4 font-medium">ID</th>
                <th className="py-3 pr-4 font-medium">Name</th>
                <th className="py-3 pr-4 font-medium">Description</th>
                <th className="py-3 pr-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissions.map((perm) => (
                <tr key={perm.id} className="hover:bg-slate-50">
                  <td className="py-3 pr-4 text-slate-500 text-xs">
                    {perm.id}
                  </td>
                  <td className="py-3 pr-4 font-semibold text-slate-900">
                    {perm.name}
                  </td>
                  <td className="py-3 pr-4 text-slate-600">
                    {perm.description}
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onEditPermission && onEditPermission(perm)
                        }
                        className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-slate-400"
                      >
                        <Edit2 className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onDeletePermission && onDeletePermission(perm)
                        }
                        className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 hover:border-rose-400"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default PermissionsTable;


