import { Key, X } from "lucide-react";

const PasswordModal = ({
  open,
  loading,
  passwordForm,
  onClose,
  onChange,
  onSubmit,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-900/5 text-blue-900">
              <Key className="size-6" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Update password</h2>
              <p className="text-sm text-slate-500">
                Set a new password for this user
              </p>
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
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-600">
              New password *
            </span>
            <input
              type="password"
              value={passwordForm.password}
              onChange={(e) => onChange({ password: e.target.value })}
              placeholder="••••••••"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-900"
              required
            />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-600">
              Confirm password *
            </span>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => onChange({ confirmPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-900"
              required
            />
          </label>
          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              <Key className="size-4" />
              Update password
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

export default PasswordModal;


