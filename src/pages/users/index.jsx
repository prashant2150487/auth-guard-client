import { useEffect, useState } from "react";
import { RefreshCcw } from "lucide-react";
import axiosInstance from "../../lib/axiosInstance";
import UsersTable from "./components/UsersTable";
import PermissionsModal from "./components/PermissionsModal";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance("/api/users?page=1&limit=10");
      const list = response?.data?.data?.users || [];
      setUsers(list);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRefresh = () => {
    fetchUsers();
  };

  const handleAssignPermissions = (user) => {
    setSelectedUser(user);
    setShowPermissionsModal(true);
  };

  const handleClosePermissionsModal = () => {
    setShowPermissionsModal(false);
    setSelectedUser(null);
  };

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            User management
          </p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-900">
            Users directory
          </h1>
          <p className="text-slate-600">
            Manage user accounts, roles, and permissions from one workspace.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-400"
          >
            <RefreshCcw className="size-4" />
            Refresh
          </button>
        </div>
      </header>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <UsersTable
        users={users}
        loading={loading}
        onAssignPermissions={handleAssignPermissions}
      />

      <PermissionsModal
        open={showPermissionsModal}
        user={selectedUser}
        onClose={handleClosePermissionsModal}
      />
    </section>
  );
};

export default UsersPage;
