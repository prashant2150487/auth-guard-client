import { Edit2, X, ChevronRight } from "lucide-react";

const EditUserModal = ({
  open,
  loading,
  userForm,
  mockRoles,
  mockEditOptions,
  selectedEditOptionIds,
  showEditOptionsDropdown,
  onClose,
  onChange,
  onSubmit,
  onToggleDropdown,
  onToggleOption,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-900/5 text-slate-900">
              <Edit2 className="size-6" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Edit user</h2>
              <p className="text-sm text-slate-500">Update user information</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-slate-100"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-600">
                Full name *
              </span>
              <input
                type="text"
                value={userForm.name}
                onChange={(e) => onChange({ name: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-900"
                required
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-600">
                Email address *
              </span>
              <input
                type="email"
                value={userForm.email}
                onChange={(e) => onChange({ email: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-900"
                required
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-600">Role *</span>
              <select
                value={userForm.roleId}
                onChange={(e) => onChange({ roleId: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-900"
                required
              >
                <option value="">Select role</option>
                {mockRoles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-600">
                Status
              </span>
              <select
                value={userForm.status}
                onChange={(e) => onChange({ status: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-900"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </label>
            <div className="space-y-2 md:col-span-2 relative">
              <span className="text-sm font-medium text-slate-600">
                Permissions
              </span>
              <button
                type="button"
                onClick={onToggleDropdown}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none hover:border-slate-400"
              >
                <span>
                  {selectedEditOptionIds.length > 0
                    ? `${selectedEditOptionIds.length} option(s) selected`
                    : "Select options"}
                </span>
                <ChevronRight
                  className={`size-4 transition-transform ${
                    showEditOptionsDropdown ? "rotate-90" : ""
                  }`}
                />
              </button>
              {showEditOptionsDropdown && (
                <div className="absolute z-50 mt-2 w-full max-w-sm rounded-2xl border border-slate-200 bg-white py-2 shadow-lg">
                  <ul className="max-h-48 overflow-y-auto">
                    {mockEditOptions.map((option) => (
                      <li
                        key={option.id}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <input
                          type="checkbox"
                          className="rounded border-slate-300"
                          checked={selectedEditOptionIds.includes(option.id)}
                          onChange={() => onToggleOption(option.id)}
                        />
                        <span>{option.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              <Edit2 className="size-4" />
              Update user
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 hover:border-slate-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;


