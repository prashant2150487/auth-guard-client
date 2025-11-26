import { useMemo, useState, useEffect } from "react";
import { UserPlus, Trash2, Search, RefreshCcw } from "lucide-react";
import axiosInstance from "../../lib/axiosInstance";
import UsersTable from "./components/UsersTable";
import UsersStats from "./components/UsersStats";
import CreateUserModal from "./components/CreateUserModal";
import EditUserModal from "./components/EditUserModal";
import PasswordModal from "./components/PasswordModal";
import RoleModal from "./components/RoleModal";
import DeleteUserModal from "./components/DeleteUserModal";
import BulkDeleteModal from "./components/BulkDeleteModal";

const mockRoles = [
  { id: "1", name: "Admin" },
  { id: "2", name: "Manager" },
  { id: "3", name: "Operator" },
  { id: "4", name: "Viewer" },
];

// Static options for the extra checkbox dropdown in the Edit modal
const mockEditOptions = [
  { id: "can_view_reports", label: "Can view incident reports" },
  { id: "can_manage_shifts", label: "Can manage guard shifts" },
  { id: "can_export_data", label: "Can export data" },
  { id: "receive_alerts", label: "Receives critical alerts" },
];

const emptyUser = {
  name: "",
  email: "",
  password: "",
  roleId: "",
  status: "active",
};

const statusColors = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  inactive: "bg-slate-100 text-slate-600 border-slate-200",
  suspended: "bg-rose-50 text-rose-700 border-rose-200",
};

const UsersPage = () => {
  const [users, setUsers] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    byRole: {},
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Filters and pagination
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Modals and forms
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  // Extra dropdown state for Edit modal
  const [showEditOptionsDropdown, setShowEditOptionsDropdown] = useState(false);
  const [selectedEditOptionIds, setSelectedEditOptionIds] = useState([]);

  // Form states
  const [userForm, setUserForm] = useState(emptyUser);
  const [passwordForm, setPasswordForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  // Calculate filtered users
  const filteredUsers = useMemo(() => {
    return users?.filter((user) => {
      const matchesQuery =
        !query ||
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role.id === roleFilter;
      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;
      return matchesQuery && matchesRole && matchesStatus;
    });
  }, [users, query, roleFilter, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers?.length / pageSize);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers?.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  // Calculate stats
  useMemo(() => {
    const newStats = {
      total: users?.length,
      active: users?.filter((u) => u.status === "active").length,
      inactive: users?.filter((u) => u.status === "inactive").length,
      byRole: {},
    };
    users?.forEach((user) => {
      newStats.byRole[user?.role?.name] =
        (newStats?.byRole[user?.role?.name] || 0) + 1;
    });
    setStats(newStats);
  }, [users]);

  // API Functions (structured for easy integration)
  const fetchUsers = async (page = 1, limit = pageSize) => {
    setLoading(true);
    setError("");
    try {
      // TODO: Replace with actual API call
      const response = await axiosInstance(
        `/api/users?page=${page}&limit=${limit}`
      );
      setUsers(response.data.data?.users);
      // For now, using mock data
      console.log(response, "res");
      setTimeout(() => setLoading(false), 500);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch users");
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await axiosInstance.get("/api/users/stats");
      // setStats(response.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const fetchUsersByRole = async (roleId) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await axiosInstance.get(`/api/users/role/${roleId}`);
      // setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch users by role");
      setLoading(false);
    }
  };

  const createUser = async (userData) => {
    setLoading(true);
    setError("");
    try {
      // TODO: Replace with actual API call
      // const response = await axiosInstance.post("/api/users", userData);
      // setUsers((prev) => [response.data, ...prev]);
      const newUser = {
        id: crypto.randomUUID(),
        ...userData,
        role: mockRoles.find((r) => r.id === userData.roleId),
        createdAt: new Date().toISOString().split("T")[0],
        lastLogin: "Never",
      };
      setUsers((prev) => [newUser, ...prev]);
      setSuccess("User created successfully");
      setShowCreateModal(false);
      setUserForm(emptyUser);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id, userData) => {
    setLoading(true);
    setError("");
    try {
      // TODO: Replace with actual API call
      // const response = await axiosInstance.put(`/api/users/${id}`, userData);
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id
            ? {
                ...user,
                ...userData,
                role:
                  mockRoles.find((r) => r.id === userData.roleId) || user.role,
              }
            : user
        )
      );
      setSuccess("User updated successfully");
      setShowEditModal(false);
      setUserForm(emptyUser);
      setSelectedUserId(null);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    setLoading(true);
    setError("");
    try {
      // TODO: Replace with actual API call
      // await axiosInstance.delete(`/api/users/${id}`);
      setUsers((prev) => prev.filter((user) => user.id !== id));
      setSuccess("User deleted successfully");
      setShowDeleteModal(false);
      setSelectedUserId(null);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  const bulkDeleteUsers = async (ids) => {
    setLoading(true);
    setError("");
    try {
      // TODO: Replace with actual API call
      // await axiosInstance.delete("/api/users", { data: { ids } });
      setUsers((prev) => prev.filter((user) => !ids.includes(user.id)));
      setSuccess(`${ids.length} users deleted successfully`);
      setShowBulkDeleteModal(false);
      setSelectedUserIds([]);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete users");
    } finally {
      setLoading(false);
    }
  };

  const updateUserPassword = async (id, password) => {
    setLoading(true);
    setError("");
    try {
      // TODO: Replace with actual API call
      // await axiosInstance.put(`/api/users/${id}/password`, { password });
      setSuccess("Password updated successfully");
      setShowPasswordModal(false);
      setPasswordForm({ password: "", confirmPassword: "" });
      setSelectedUserId(null);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (id, roleId) => {
    setLoading(true);
    setError("");
    try {
      // TODO: Replace with actual API call
      // await axiosInstance.put(`/api/users/${id}/role`, { roleId });
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id
            ? { ...user, role: mockRoles.find((r) => r.id === roleId) }
            : user
        )
      );
      setSuccess("User role updated successfully");
      setShowRoleModal(false);
      setUserForm(emptyUser);
      setSelectedUserId(null);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update role");
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleCreate = () => {
    setUserForm(emptyUser);
    setShowCreateModal(true);
    setError("");
  };

  const handleEdit = (user) => {
    setUserForm({
      name: user.name,
      email: user.email,
      roleId: user?.Role?.id,
      status: user?.status || null,
      password: "",
    });
    // Reset extra edit options when opening the modal
    setSelectedEditOptionIds([]);
    setShowEditOptionsDropdown(false);
    setSelectedUserId(user.id);
    setShowEditModal(true);
    setError("");
  };

  const handleDelete = (id) => {
    setSelectedUserId(id);
    setShowDeleteModal(true);
  };

  const handleBulkDelete = () => {
    if (selectedUserIds.length === 0) return;
    setShowBulkDeleteModal(true);
  };

  const handlePasswordUpdate = (id) => {
    setSelectedUserId(id);
    setPasswordForm({ password: "", confirmPassword: "" });
    setShowPasswordModal(true);
    setError("");
  };

  const handleRoleUpdate = (user) => {
    console.log(user, "user");
    setUserForm({ roleId: user.Role.id });
    setSelectedUserId(user.id);
    setShowRoleModal(true);
    setError("");
  };

  const handleSubmitCreate = (e) => {
    e.preventDefault();
    if (
      !userForm.name ||
      !userForm.email ||
      !userForm.password ||
      !userForm.roleId
    ) {
      setError("Please fill in all required fields");
      return;
    }
    createUser(userForm);
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    if (!userForm.name || !userForm.email || !userForm.roleId) {
      setError("Please fill in all required fields");
      return;
    }
    const { password, ...updateData } = userForm;
    updateUser(selectedUserId, updateData);
  };

  const toggleEditOption = (id) => {
    setSelectedEditOptionIds((prev) =>
      prev.includes(id) ? prev.filter((optId) => optId !== id) : [...prev, id]
    );
  };

  const handleSubmitPassword = (e) => {
    e.preventDefault();
    if (passwordForm.password !== passwordForm.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (passwordForm.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    updateUserPassword(selectedUserId, passwordForm.password);
  };

  const handleSubmitRole = (e) => {
    e.preventDefault();
    if (!userForm.roleId) {
      setError("Please select a role");
      return;
    }
    updateUserRole(selectedUserId, userForm.roleId);
  };

  const toggleUserSelection = (id) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUserIds.length === paginatedUsers.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(paginatedUsers.map((u) => u.id));
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchUsers();
    fetchUserStats();
  }, []);

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
      {/* Header */}
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
          {selectedUserIds.length > 0 && (
            <button
              type="button"
              onClick={handleBulkDelete}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 hover:border-rose-400"
            >
              <Trash2 className="size-4" />
              Delete ({selectedUserIds.length})
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              fetchUsers();
              fetchUserStats();
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-400"
          >
            <RefreshCcw className="size-4" />
            Refresh
          </button>
          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            <UserPlus className="size-4" />
            New user
          </button>
        </div>
      </header>

      {/* Success/Error Messages */}
      {success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <UsersStats stats={stats} />

      {/* Filters, Search & Users Table */}
      <section className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-64">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or email"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm outline-none focus:border-slate-900"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-600 outline-none focus:border-slate-900"
          >
            <option value="all">All roles</option>
            {mockRoles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-600 outline-none focus:border-slate-900"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        <UsersTable
          loading={loading}
          paginatedUsers={paginatedUsers}
          filteredUsers={filteredUsers}
          statusColors={statusColors}
          selectedUserIds={selectedUserIds}
          toggleSelectAll={toggleSelectAll}
          toggleUserSelection={toggleUserSelection}
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          setCurrentPage={setCurrentPage}
          handleEdit={handleEdit}
          handlePasswordUpdate={handlePasswordUpdate}
          handleRoleUpdate={handleRoleUpdate}
          handleDelete={handleDelete}
        />
      </section>

      <CreateUserModal
        open={showCreateModal}
        loading={loading}
        userForm={userForm}
        mockRoles={mockRoles}
        onClose={() => {
          setShowCreateModal(false);
          setUserForm(emptyUser);
          setError("");
        }}
        onChange={(patch) =>
          setUserForm((prev) => ({
            ...prev,
            ...patch,
          }))
        }
        onSubmit={handleSubmitCreate}
      />

      <EditUserModal
        open={showEditModal}
        loading={loading}
        userForm={userForm}
        mockRoles={mockRoles}
        mockEditOptions={mockEditOptions}
        selectedEditOptionIds={selectedEditOptionIds}
        showEditOptionsDropdown={showEditOptionsDropdown}
        onClose={() => {
          setShowEditModal(false);
          setUserForm(emptyUser);
          setSelectedUserId(null);
          setError("");
        }}
        onChange={(patch) =>
          setUserForm((prev) => ({
            ...prev,
            ...patch,
          }))
        }
        onSubmit={handleSubmitEdit}
        onToggleDropdown={() =>
          setShowEditOptionsDropdown((prev) => !prev)
        }
        onToggleOption={toggleEditOption}
      />

      <PasswordModal
        open={showPasswordModal}
        loading={loading}
        passwordForm={passwordForm}
        onClose={() => {
          setShowPasswordModal(false);
          setPasswordForm({ password: "", confirmPassword: "" });
          setSelectedUserId(null);
          setError("");
        }}
        onChange={(patch) =>
          setPasswordForm((prev) => ({
            ...prev,
            ...patch,
          }))
        }
        onSubmit={handleSubmitPassword}
      />

      <RoleModal
        open={showRoleModal}
        loading={loading}
        userForm={userForm}
        mockRoles={mockRoles}
        onClose={() => {
          setShowRoleModal(false);
          setUserForm(emptyUser);
          setSelectedUserId(null);
          setError("");
        }}
        onChange={(patch) =>
          setUserForm((prev) => ({
            ...prev,
            ...patch,
          }))
        }
        onSubmit={handleSubmitRole}
      />

      <DeleteUserModal
        open={showDeleteModal}
        loading={loading}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedUserId(null);
        }}
        onConfirm={() => deleteUser(selectedUserId)}
      />

      <BulkDeleteModal
        open={showBulkDeleteModal}
        loading={loading}
        count={selectedUserIds.length}
        onClose={() => {
          setShowBulkDeleteModal(false);
        }}
        onConfirm={() => bulkDeleteUsers(selectedUserIds)}
      />
    </section>
  );
};

export default UsersPage;
