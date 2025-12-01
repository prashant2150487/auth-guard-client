import { useEffect, useState } from "react";
import axiosInstance from "../../../lib/axiosInstance";
import UsersLoader from "./UsersLoader";

const PermissionsModal = ({ open, user, onClose }) => {
  const [permissions, setPermissions] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch permissions for the selected user when modal opens
  useEffect(() => {
    const fetchUserPermissions = async () => {
      if (!open || !user?.id) return;
      setLoading(true);
      setError("");
      try {
        const res = await axiosInstance(
          `/api/user-management/${user.id}/permissions`
        );
        const data = res?.data?.data;
        const perms = data?.permissions || [];
        setPermissions(perms);
        setSelectedIds(perms.filter((p) => p.isAssigned).map((p) => p.id));
      } catch (err) {
        setError(
          err?.response?.data?.message || "Failed to load permissions list"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserPermissions();
  }, [open, user?.id]);

  if (!open || !user) return null;

  // While first loading, show only a full-screen loader, then show modal once data is ready
  if (loading && permissions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="w-full max-w-xs rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
          <UsersLoader message="Loading..." />
        </div>
      </div>
    );
  }

  const togglePermission = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await axiosInstance.post(
        `/api/user-management/${user.id}/permissions/bulk`,
        { permissionIds: selectedIds }
      );
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to update user permissions"
      );
    } finally {
      setSaving(false);
    }
  };

  const assignedCount = permissions.filter((p) => selectedIds.includes(p.id))
    .length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Assign permissions
            </h2>
            <p className="text-xs text-slate-500">
              User: <span className="font-medium">{user.name}</span> (
              {user.email})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-3 py-1 text-sm text-slate-500 hover:bg-slate-100"
          >
            Close
          </button>
        </div>

        {error && (
          <div className="mb-3 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
            {error}
          </div>
        )}

        {loading ? (
          <p className="py-4 text-sm text-slate-500">Loading...</p>
        ) : permissions.length === 0 ? (
          <p className="py-4 text-sm text-slate-500">
            No permissions available.
          </p>
        ) : (
          <>
            <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
              <span>Total: {permissions.length}</span>
              <span>Assigned: {assignedCount}</span>
              <span>Not assigned: {permissions.length - assignedCount}</span>
            </div>
            <ul className="max-h-64 space-y-2 overflow-y-auto text-sm">
              {permissions.map((perm) => (
                <li
                  key={perm.id}
                  className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 px-3 py-2"
                >
                  <label className="flex flex-1 cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-slate-300"
                      checked={selectedIds.includes(perm.id)}
                      onChange={() => togglePermission(perm.id)}
                    />
                    <div>
                      <p className="font-medium text-slate-800">{perm.name}</p>
                      {perm.description && (
                        <p className="text-xs text-slate-500">
                          {perm.description}
                        </p>
                      )}
                    </div>
                  </label>
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:border-slate-400"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionsModal;


