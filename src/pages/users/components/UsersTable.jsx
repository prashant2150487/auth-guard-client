import { Shield } from "lucide-react";
import UsersLoader from "./UsersLoader";

const UsersTable = ({ users, loading, onAssignPermissions }) => {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
      {loading ? (
        <UsersLoader message="Loading..." />
      ) : users.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">
          No users found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
            <thead>
              <tr className="text-slate-500">
                <th className="py-3 pr-4 font-medium">Name</th>
                <th className="py-3 pr-4 font-medium">Email</th>
                <th className="py-3 pr-4 font-medium">Role</th>
                <th className="py-3 pr-4 font-medium">Phone</th>
                <th className="py-3 pr-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="py-3 pr-4 font-semibold text-slate-900 capitalize">
                    {user.name}
                  </td>
                  <td className="py-3 pr-4 text-slate-600">{user.email}</td>
                  <td className="py-3 pr-4">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      {user?.Role?.name}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-slate-600">
                    {user.phone || "-"}
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        onAssignPermissions && onAssignPermissions(user)
                      }
                      className="inline-flex items-center justify-center rounded-xl border border-blue-200 p-2 text-xs font-semibold text-blue-600 hover:border-blue-400"
                      title="Assign permissions"
                    >
                      <Shield className="size-4" />
                    </button>
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

export default UsersTable;


