import {
  Check,
  X,
  Edit2,
  Key,
  Shield,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const UsersTable = ({
  loading,
  paginatedUsers,
  filteredUsers,
  statusColors,
  selectedUserIds,
  toggleSelectAll,
  toggleUserSelection,
  currentPage,
  totalPages,
  pageSize,
  setCurrentPage,
  handleEdit,
  handlePasswordUpdate,
  handleRoleUpdate,
  handleDelete,
}) => {
  return (
    <>
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
          <thead>
            <tr className="text-slate-500">
              <th className="py-3 pr-4">
                <input
                  type="checkbox"
                  checked={
                    paginatedUsers?.length > 0 &&
                    selectedUserIds.length === paginatedUsers.length
                  }
                  onChange={toggleSelectAll}
                  className="rounded border-slate-300"
                />
              </th>
              <th className="py-3 pr-4 font-medium">User</th>
              <th className="py-3 pr-4 font-medium">Email</th>
              <th className="py-3 pr-4 font-medium">Role</th>
              <th className="py-3 pr-4 font-medium">Status</th>
              <th className="py-3 pr-4 font-medium">Last login</th>
              <th className="py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-slate-500">
                  Loading...
                </td>
              </tr>
            ) : paginatedUsers?.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-slate-500">
                  No users found. Create a new user to get started.
                </td>
              </tr>
            ) : (
              paginatedUsers?.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="py-4 pr-4">
                    <input
                      type="checkbox"
                      checked={selectedUserIds.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                      className="rounded border-slate-300"
                    />
                  </td>
                  <td className="py-4 pr-4">
                    <p className="font-semibold text-slate-900 capitalize">
                      {user.name}
                    </p>
                  </td>
                  <td className="py-4 pr-4 text-slate-600">{user.email}</td>
                  <td className="py-4 pr-4">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      {user?.Role?.name}
                    </span>
                  </td>
                  <td className="py-4 pr-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${
                        statusColors[user.status] || statusColors.inactive
                      }`}
                    >
                      {user.status === "active" ? (
                        <Check className="size-3" />
                      ) : (
                        <X className="size-3" />
                      )}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-slate-500 text-xs">
                    {user?.createdAt?.split("T")?.[0]}
                  </td>
                  <td className="py-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(user)}
                        className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-slate-400"
                        title="Edit user"
                      >
                        <Edit2 className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePasswordUpdate(user.id)}
                        className="rounded-xl border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-600 hover:border-blue-400"
                        title="Update password"
                      >
                        <Key className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRoleUpdate(user)}
                        className="rounded-xl border border-purple-200 px-3 py-2 text-xs font-semibold text-purple-600 hover:border-purple-400"
                        title="Update role"
                      >
                        <Shield className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(user.id)}
                        className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 hover:border-rose-400"
                        title="Delete user"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, filteredUsers.length)} of{" "}
            {filteredUsers.length} users
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="text-sm text-slate-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage === totalPages}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UsersTable;


