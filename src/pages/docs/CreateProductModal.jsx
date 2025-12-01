import { useState } from "react";

const CreateProductModal = ({ open, onClose, onSave, availablePermissions }) => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [permission, setPermission] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }
    setError("");
    onSave({
      title: title.trim(),
      subtitle: subtitle.trim(),
      description: description.trim(),
      permission: permission || null,
    });
    setTitle("");
    setSubtitle("");
    setDescription("");
    setPermission("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shaidow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Create product project
          </h2>
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

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-600">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-900"
              placeholder="Guard Reporting Project"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-600">
              Subtitle
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-900"
              placeholder="Short one-line summary"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-600">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-900"
              placeholder="Describe what this product project documents."
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-600">
              Required permission (optional)
            </label>
            <select
              value={permission}
              onChange={(e) => setPermission(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-900"
            >
              <option value="">Everyone can open</option>
              {availablePermissions.map((perm) => (
                <option key={perm} value={perm}>
                  {perm}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400">
              Only users with this permission will be able to open the project
              card.
            </p>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:border-slate-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
            >
              Create project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;


