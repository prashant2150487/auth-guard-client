import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CreateProductModal from "./CreateProductModal";

const docsSections = [
  {
    id: "project-users",
    title: "Guard Users Project",
    permission: "users.read",
    description:
      "Project overview for managing users: onboarding flows, account lifecycle, and directory views.",
    link: "/docs/users-project",
  },
  {
    id: "project-permissions",
    title: "Guard Permissions Project",
    permission: "permissions.read",
    description:
      "Project describing permission models, assign flows, and audit trails across the platform.",
    link: "/docs/permissions-project",
  },
  {
    id: "project-roles",
    title: "Guard Roles Project",
    permission: "roles.read",
    description:
      "Project for defining roles, mapping permissions, and structuring access for teams.",
    link: "/docs/roles-project",
  },
];

const DocsPage = () => {
  const user = useSelector((state) => state.user.user);
  const userPermissions = user?.Permissions?.map((p) => p.name) || [];

  const [customProjects, setCustomProjects] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const hasPermission = (perm) =>
    !perm || userPermissions.includes(perm);

  const canCreateProduct = hasPermission("permissions.create");

  const allSections = [...docsSections, ...customProjects];

  const handleCreateProductClick = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleSaveProduct = ({ title, subtitle, description, permission }) => {
    const newProject = {
      id: `custom-${Date.now()}`,
      title,
      permission,
      description: subtitle
        ? `${subtitle} — ${description}`
        : description,
      link: "#", // can be wired to a dedicated route later
    };
    setCustomProjects((prev) => [...prev, newProject]);
    setShowCreateModal(false);
  };

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            Documentation
          </p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-900">
            Product docs
          </h1>
          <p className="text-slate-600">
            Browse project-style documentation cards. Access depends on your
            permissions.
          </p>
        </div>
        {canCreateProduct && (
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            onClick={handleCreateProductClick}
          >
            Create product
          </button>
        )}
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {allSections.map((section) => {
          const allowed = hasPermission(section.permission);
          return (
            <article
              key={section.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {section.title}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {section.description}
                </p>
                {section.permission && (
                  <p className="mt-2 text-xs text-slate-400">
                    Requires permission:{" "}
                    <span className="font-mono">{section.permission}</span>
                  </p>
                )}
              </div>
              <div className="mt-4">
                <Link
                  to={allowed ? section.link : "#"}
                  onClick={(e) => {
                    if (!allowed) e.preventDefault();
                  }}
                  className={`inline-flex items-center rounded-xl px-4 py-2 text-xs font-semibold ${
                    allowed
                      ? "bg-slate-900 text-white hover:bg-slate-800"
                      : "border border-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {allowed ? "Open" : "No access"}
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      <CreateProductModal
        open={showCreateModal}
        onClose={handleCloseCreateModal}
        onSave={handleSaveProduct}
        availablePermissions={userPermissions}
      />
    </section>
  );
};

export default DocsPage;


