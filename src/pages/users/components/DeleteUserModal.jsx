import { Trash2, AlertCircle, X } from "lucide-react";

const DeleteUserModal = ({ open, loading, onClose, onConfirm }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-rose-900/5 text-rose-900">
            <AlertCircle className="size-6" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold">Delete user</h2>
            <p className="text-sm text-slate-500">
              This action cannot be undone
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-slate-100"
          >
            <X className="size-5" />
          </button>
        </div>
        <p className="mb-6 text-slate-600">
          Are you sure you want to delete this user? All associated data will be
          permanently removed.
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            <Trash2 className="size-4" />
            Delete user
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 hover:border-slate-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;


