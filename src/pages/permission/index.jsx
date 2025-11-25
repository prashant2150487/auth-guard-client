import { useMemo, useState } from "react";
import {
  BadgeCheck,
  CircleSlash,
  Edit2,
  Plus,
  RefreshCcw,
  Search,
  Shield,
  Trash2,
} from "lucide-react";

const seedPermissions = [
  {
    id: crypto.randomUUID(),
    name: "Watchtower vis cams",
    resource: "Video feeds",
    scope: "read",
    description: "Allows remote viewing of all tower cameras for SOC analysts.",
    status: "active",
    assignedTeams: ["SOC"],
    lastUpdated: "15 Nov 2025 09:28",
  },
  {
    id: crypto.randomUUID(),
    name: "Patrol log edits",
    resource: "Field reports",
    scope: "write",
    description: "Permit supervisors to edit and approve patrol logs in real time.",
    status: "pending",
    assignedTeams: ["Ops Leads"],
    lastUpdated: "23 Nov 2025 18:42",
  },
  {
    id: crypto.randomUUID(),
    name: "Door overrides",
    resource: "Access control",
    scope: "admin",
    description: "Grants emergency overrides on remote doors and checkpoints.",
    status: "revoked",
    assignedTeams: ["Emergency"],
    lastUpdated: "11 Oct 2025 07:50",
  },
];

const emptyDraft = {
  name: "",
  resource: "",
  scope: "",
  description: "",
  status: "active",
  assignedTeams: [],
};

const statusCopy = {
  active: "Active",
  pending: "Pending approval",
  revoked: "Revoked",
};

const statusColors = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  revoked: "bg-rose-50 text-rose-700 border-rose-200",
};

function statusIcon(status) {
  switch (status) {
    case "active":
      return <BadgeCheck className="size-4" />;
    case "pending":
      return <RefreshCcw className="size-4" />;
    default:
      return <CircleSlash className="size-4" />;
  }
}

export default function PermissionPage() {
  const [permissions, setPermissions] = useState(seedPermissions);
  const [mode, setMode] = useState("create");
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState("");

  const filteredPermissions = useMemo(() => {
    return permissions.filter((entry) => {
      const matchesQuery =
        !query ||
        entry.name.toLowerCase().includes(query.toLowerCase()) ||
        entry.resource.toLowerCase().includes(query.toLowerCase()) ||
        entry.scope.toLowerCase().includes(query.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ? true : entry.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [permissions, query, statusFilter]);

  const stats = useMemo(() => {
    return permissions.reduce(
      (acc, entry) => {
        acc.total += 1;
        acc[entry.status] += 1;
        return acc;
      },
      { total: 0, active: 0, pending: 0, revoked: 0 }
    );
  }, [permissions]);

  const resetForm = () => {
    setDraft(emptyDraft);
    setMode("create");
    setEditingId(null);
    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!draft.name.trim() || !draft.resource.trim() || !draft.scope.trim()) {
      setError("Permission name, resource, and scope are required.");
      return;
    }
    setError("");
    if (mode === "update" && editingId) {
      setPermissions((prev) =>
        prev.map((entry) =>
          entry.id === editingId
            ? {
                ...entry,
                ...draft,
                lastUpdated: new Date().toLocaleString(),
              }
            : entry
        )
      );
    } else {
      setPermissions((prev) => [
        {
          id: crypto.randomUUID(),
          ...draft,
          lastUpdated: new Date().toLocaleString(),
        },
        ...prev,
      ]);
    }
    resetForm();
  };

  const handleEdit = (record) => {
    setDraft({
      name: record.name,
      resource: record.resource,
      scope: record.scope,
      description: record.description,
      status: record.status,
      assignedTeams: record.assignedTeams,
    });
    setMode("update");
    setEditingId(record.id);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    setPermissions((prev) => prev.filter((entry) => entry.id !== id));
    if (editingId === id) {
      resetForm();
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
            Manage every access policy from one workspace. Draft, approve,
            revoke.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={resetForm}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-400"
          >
            <RefreshCcw className="size-4" />
            Reset form
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("create");
              setEditingId(null);
              setDraft((prev) => ({ ...prev, status: "active" }));
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            <Plus className="size-4" />
            New permission
          </button>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total policies</p>
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
        <article className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm text-amber-700">Pending</p>
          <p className="mt-2 text-3xl font-semibold text-amber-800">
            {stats.pending}
          </p>
        </article>
        <article className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
          <p className="text-sm text-rose-700">Revoked</p>
          <p className="mt-2 text-3xl font-semibold text-rose-800">
            {stats.revoked}
          </p>
        </article>
      </section>

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-sm"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-900/5 text-slate-900">
            <Shield className="size-6" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
              {mode === "create" ? "Create" : "Update"}
            </p>
            <h2 className="text-2xl font-semibold">
              {mode === "create" ? "New permission" : "Adjust permission"}
            </h2>
          </div>
        </div>

        {error && (
          <p className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-600">
              Permission name
            </span>
            <input
              value={draft.name}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, name: event.target.value }))
              }
              placeholder="e.g., Remote drone access"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-900"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-600">Resource</span>
            <input
              value={draft.resource}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, resource: event.target.value }))
              }
              placeholder="What system or asset?"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-900"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-600">Scope</span>
            <input
              value={draft.scope}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, scope: event.target.value }))
              }
              placeholder="read / write / admin"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-900"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-600">
              Status
            </span>
            <select
              value={draft.status}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  status: event.target.value,
                }))
              }
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-900"
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="revoked">Revoked</option>
            </select>
          </label>
        </div>

        <label className="mt-6 block space-y-2">
          <span className="text-sm font-medium text-slate-600">
            Assigned teams (comma separated)
          </span>
          <input
            value={draft.assignedTeams.join(", ")}
            onChange={(event) =>
              setDraft((prev) => ({
                ...prev,
                assignedTeams: event.target.value
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean),
              }))
            }
            placeholder="SOC, Field Ops, Incident Response"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-900"
          />
        </label>

        <label className="mt-6 block space-y-2">
          <span className="text-sm font-medium text-slate-600">
            Description
          </span>
          <textarea
            value={draft.description}
            onChange={(event) =>
              setDraft((prev) => ({
                ...prev,
                description: event.target.value,
              }))
            }
            rows={4}
            placeholder="Explain the policy intent, audit notes, or escalation paths."
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-900"
          />
        </label>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
          >
            {mode === "create" ? (
              <>
                <Plus className="size-4" />
                Create permission
              </>
            ) : (
              <>
                <Edit2 className="size-4" />
                Update permission
              </>
            )}
          </button>
          {mode === "update" && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-2xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 hover:border-slate-400"
            >
              Cancel edit
            </button>
          )}
        </div>
      </form>

      <section className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-64">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, resource, or scope"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm outline-none focus:border-slate-900"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-600 outline-none focus:border-slate-900"
          >
            <option value="all">All states</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="revoked">Revoked</option>
          </select>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
            <thead>
              <tr className="text-slate-500">
                <th className="py-3 pr-4 font-medium">Permission</th>
                <th className="py-3 pr-4 font-medium">Resource</th>
                <th className="py-3 pr-4 font-medium">Scope</th>
                <th className="py-3 pr-4 font-medium">Teams</th>
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3 pr-4 font-medium">Last updated</th>
                <th className="py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPermissions.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-10 text-center text-slate-500"
                  >
                    Nothing matches your filters yet. Add or adjust a policy.
                  </td>
                </tr>
              ) : (
                filteredPermissions.map((entry) => (
                  <tr key={entry.id}>
                    <td className="py-4 pr-4">
                      <p className="font-semibold text-slate-900">
                        {entry.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {entry.description}
                      </p>
                    </td>
                    <td className="py-4 pr-4">{entry.resource}</td>
                    <td className="py-4 pr-4">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                        {entry.scope}
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="text-xs text-slate-600">
                        {entry.assignedTeams.join(", ") || "—"}
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${statusColors[entry.status]}`}
                      >
                        {statusIcon(entry.status)}
                        {statusCopy[entry.status]}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-slate-500">
                      {entry.lastUpdated}
                    </td>
                    <td className="py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(entry)}
                          className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-slate-400"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(entry.id)}
                          className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 hover:border-rose-400"
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
      </section>
    </section>
  );
}

