import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import axiosInstance from "../../lib/axiosInstance";
import CreatePermissionModal from "./CreatePermissionModal";
import PermissionsTable from "./PermissionsTable";
import EditPermissionModal from "./EditPermissionModal";
import DeletePermissionModal from "./DeletePermissionModal";

export default function PermissionPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchPermissions = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance("/api/permissions");
      const list = res?.data?.data?.permissions || [];
      setPermissions(list);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to load permissions list"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const handleOpenCreate = () => {
    setError("");
    setShowCreateModal(true);
  };

  const handleCloseCreate = () => {
    if (creating) return;
    setShowCreateModal(false);
  };

  const handleSavePermission = async (payload) => {
    // payload shape: { name: "dashboard.view", description: "View dashboard analytics" }
    try {
      setCreating(true);
      setError("");
      await axiosInstance.post("/api/permissions", payload);
      await fetchPermissions();
      setShowCreateModal(false);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to create permission"
      );
    } finally {
      setCreating(false);
    }
  };

  const handleOpenEdit = (perm) => {
    setSelectedPermission(perm);
    setShowEditModal(true);
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
    setSelectedPermission(null);
  };

  const handleSaveEdit = async ({ id, name, description }) => {
    try {
      setError("");
      await axiosInstance.put(`/api/permissions/${id}`, {
        name,
        description,
      });
      await fetchPermissions();
      handleCloseEdit();
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to update permission"
      );
    }
  };

  const handleOpenDelete = (perm) => {
    setSelectedPermission(perm);
    setShowDeleteModal(true);
  };

  const handleCloseDelete = () => {
    setShowDeleteModal(false);
    setSelectedPermission(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedPermission) return;
    try {
      setError("");
      await axiosInstance.delete(`/api/permissions/${selectedPermission.id}`);
      await fetchPermissions();
      handleCloseDelete();
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to delete permission"
      );
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            Guard policies
          </p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-900">
            Permission directory
          </h1>
          <p className="text-slate-600">
            Create new low-level permissions that can be assigned to roles and
            users across the Guard platform.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          <Plus className="size-4" />
          New permission
        </button>
      </header>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <CreatePermissionModal
        open={showCreateModal}
        onClose={handleCloseCreate}
        onSave={handleSavePermission}
        creating={creating}
      />

      <PermissionsTable
        permissions={permissions}
        loading={loading}
        onEditPermission={handleOpenEdit}
        onDeletePermission={handleOpenDelete}
      />

      <EditPermissionModal
        open={showEditModal}
        permission={selectedPermission}
        onClose={handleCloseEdit}
        onSave={handleSaveEdit}
      />

      <DeletePermissionModal
        open={showDeleteModal}
        permission={selectedPermission}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
      />
    </section>
  );
}

