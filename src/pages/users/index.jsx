import { useMemo, useState, useEffect } from "react";
import {
  UserPlus,
  Edit2,
  Trash2,
  Search,
  RefreshCcw,
  Key,
  Shield,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import axiosInstance from "../../lib/axiosInstance";
import { toDate } from "../../utils/helper/dateTimeHelper";

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
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total users</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {stats.total}
          </p>
        </article>
        <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm text-emerald-700">Active</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-800">
            {stats.active}
          </p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-600">Inactive</p>
          <p className="mt-2 text-3xl font-semibold text-slate-800">
            {stats.inactive}
          </p>
        </article>
        <article className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
          <p className="text-sm text-blue-700">Roles</p>
          <p className="mt-2 text-3xl font-semibold text-blue-800">
            {Object.keys(stats.byRole).length}
          </p>
        </article>
      </section>

      {/* Filters and Search */}
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

        {/* Users Table */}
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
                        {/* {user?.status?.charAt(0)?.toUpperCase() + user?.status?.slice(1)} */}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-slate-500 text-xs">
                      {user?.createdAt?.split("T")?.[0]}
                    </td>
                    <td className="py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          // disabled
                          onClick={() => handleEdit(user)}
                          className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-slate-400"
                          title="Edit user"
                        >
                          <Edit2 className="size-4" />
                        </button>
                        <button
                          type="button"
                          // disabled
                          onClick={() => handlePasswordUpdate(user.id)}
                          className="rounded-xl border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-600 hover:border-blue-400"
                          title="Update password"
                        >
                          <Key className="size-4" />
                        </button>
                        <button
                          type="button"
                          // disabled
                          onClick={() => handleRoleUpdate(user)}
                          className="rounded-xl border border-purple-200 px-3 py-2 text-xs font-semibold text-purple-600 hover:border-purple-400"
                          title="Update role"
                        >
                          <Shield className="size-4" />
                        </button>
                        <button
                          type="button"
                          // disabled
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

        {/* Pagination */}
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
      </section>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-900/5 text-slate-900">
                  <UserPlus className="size-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">Create new user</h2>
                  <p className="text-sm text-slate-500">
                    Add a new user to the system
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  setUserForm(emptyUser);
                  setError("");
                }}
                className="rounded-xl p-2 hover:bg-slate-100"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCreate} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-600">
                    Full name *
                  </span>
                  <input
                    type="text"
                    value={userForm.name}
                    onChange={(e) =>
                      setUserForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="John Doe"
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
                    onChange={(e) =>
                      setUserForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="john.doe@guard.com"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-900"
                    required
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-600">
                    Password *
                  </span>
                  <input
                    type="password"
                    value={userForm.password}
                    onChange={(e) =>
                      setUserForm((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-900"
                    required
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-600">
                    Role *
                  </span>
                  <select
                    value={userForm.roleId}
                    onChange={(e) =>
                      setUserForm((prev) => ({
                        ...prev,
                        roleId: e.target.value,
                      }))
                    }
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
                    onChange={(e) =>
                      setUserForm((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-900"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </label>
                {/* Extra dropdown with checkbox options (static data) */}
              </div>
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  <UserPlus className="size-4" />
                  Create user
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setUserForm(emptyUser);
                    setError("");
                  }}
                  className="rounded-2xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 hover:border-slate-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-900/5 text-slate-900">
                  <Edit2 className="size-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">Edit user</h2>
                  <p className="text-sm text-slate-500">
                    Update user information
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setUserForm(emptyUser);
                  setSelectedUserId(null);
                  setError("");
                }}
                className="rounded-xl p-2 hover:bg-slate-100"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitEdit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-600">
                    Full name *
                  </span>
                  <input
                    type="text"
                    value={userForm.name}
                    onChange={(e) =>
                      setUserForm((prev) => ({ ...prev, name: e.target.value }))
                    }
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
                    onChange={(e) =>
                      setUserForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-900"
                    required
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-600">
                    Role *
                  </span>
                  <select
                    value={userForm.roleId}
                    onChange={(e) =>
                      setUserForm((prev) => ({
                        ...prev,
                        roleId: e.target.value,
                      }))
                    }
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
                    onChange={(e) =>
                      setUserForm((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
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
                    onClick={() => setShowEditOptionsDropdown((prev) => !prev)}
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
                              checked={selectedEditOptionIds.includes(
                                option.id
                              )}
                              onChange={() => toggleEditOption(option.id)}
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
                  onClick={() => {
                    setShowEditModal(false);
                    setUserForm(emptyUser);
                    setSelectedUserId(null);
                    setError("");
                  }}
                  className="rounded-2xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 hover:border-slate-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Password Modal */}
      {showPasswordModal && (
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
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordForm({ password: "", confirmPassword: "" });
                  setSelectedUserId(null);
                  setError("");
                }}
                className="rounded-xl p-2 hover:bg-slate-100"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitPassword} className="space-y-4">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-600">
                  New password *
                </span>
                <input
                  type="password"
                  value={passwordForm.password}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
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
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
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
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordForm({ password: "", confirmPassword: "" });
                    setSelectedUserId(null);
                    setError("");
                  }}
                  className="rounded-2xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 hover:border-slate-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Role Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-purple-900/5 text-purple-900">
                  <Shield className="size-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">Update role</h2>
                  <p className="text-sm text-slate-500">Change user's role</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowRoleModal(false);
                  setUserForm(emptyUser);
                  setSelectedUserId(null);
                  setError("");
                }}
                className="rounded-xl p-2 hover:bg-slate-100"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitRole} className="space-y-4">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-600">
                  Role *
                </span>
                <select
                  value={userForm.roleId}
                  onChange={(e) =>
                    setUserForm((prev) => ({ ...prev, roleId: e.target.value }))
                  }
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
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-2xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  <Shield className="size-4" />
                  Update role
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowRoleModal(false);
                    setUserForm(emptyUser);
                    setSelectedUserId(null);
                    setError("");
                  }}
                  className="rounded-2xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 hover:border-slate-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-rose-900/5 text-rose-900">
                <AlertCircle className="size-6" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">Delete user</h2>
                <p className="text-sm text-slate-500">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <p className="mb-6 text-slate-600">
              Are you sure you want to delete this user? All associated data
              will be permanently removed.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => deleteUser(selectedUserId)}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                <Trash2 className="size-4" />
                Delete user
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedUserId(null);
                }}
                className="rounded-2xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 hover:border-slate-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Modal */}
      {showBulkDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-rose-900/5 text-rose-900">
                <AlertCircle className="size-6" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">Delete users</h2>
                <p className="text-sm text-slate-500">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <p className="mb-6 text-slate-600">
              Are you sure you want to delete {selectedUserIds.length} selected
              user(s)? All associated data will be permanently removed.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => bulkDeleteUsers(selectedUserIds)}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                <Trash2 className="size-4" />
                Delete {selectedUserIds.length} user(s)
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowBulkDeleteModal(false);
                }}
                className="rounded-2xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 hover:border-slate-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default UsersPage;
