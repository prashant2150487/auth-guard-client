import { useState, useCallback, useEffect, useMemo } from "react";

const CreateProductModal = ({ open, onClose, onSave, availablePermissions }) => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [permission, setPermission] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setTitle("");
      setSubtitle("");
      setDescription("");
      setPermission("");
      setError("");
      setIsSubmitting(false);
    }
  }, [open]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && open && !isSubmitting) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [open, onClose, isSubmitting]);

  // Memoize permission options to prevent unnecessary re-renders
  const permissionOptions = useMemo(() => {
    return availablePermissions?.map((perm) => (
      <option key={perm} value={perm}>
        {perm}
      </option>
    )) || [];
  }, [availablePermissions]);

  // Optimized submit handler with useCallback
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!title.trim() || !description.trim()) {
        setError("Title and description are required.");
        return;
      }

      setError("");
      setIsSubmitting(true);
      console.log(title, subtitle, description, permission);

      try {
        await onSave({
          title: title.trim(),
          subtitle: subtitle.trim(),
          description: description.trim(),
          permission: permission || null,
        });
        // Modal close is handled by parent, and reset happens via useEffect
      } catch (err) {
        console.error("Error saving product:", err);
        setError(err?.message || "Something went wrong while saving.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [title, subtitle, description, permission, onSave]
  );


  // Optimized close handler
  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      onClose();
    }
  }, [onClose, isSubmitting]);

  // Handle backdrop click
  const handleBackdropClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget && !isSubmitting) {
        onClose();
      }
    },
    [onClose, isSubmitting]
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="modal-title" className="text-lg font-semibold text-slate-900">
            Create product project
          </h2>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="rounded-xl px-3 py-1 text-sm text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close modal"
          >
            Close
          </button>
        </div>

        {error && (
          <div
            className="mb-3 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700"
            role="alert"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="space-y-1">
            <label htmlFor="product-title" className="block text-xs font-medium text-slate-600">
              Title *
            </label>
            <input
              id="product-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-900 disabled:cursor-not-allowed disabled:bg-slate-50"
              placeholder="Guard Reporting Project"
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="product-subtitle" className="block text-xs font-medium text-slate-600">
              Subtitle
            </label>
            <input
              id="product-subtitle"
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-900 disabled:cursor-not-allowed disabled:bg-slate-50"
              placeholder="Short one-line summary"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="product-description" className="block text-xs font-medium text-slate-600">
              Description *
            </label>
            <textarea
              id="product-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              rows={4}
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-900 disabled:cursor-not-allowed disabled:bg-slate-50"
              placeholder="Describe what this product project documents."
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="product-permission" className="block text-xs font-medium text-slate-600">
              Required permission (optional)
            </label>
            <select
              id="product-permission"
              value={permission}
              onChange={(e) => setPermission(e.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-900 disabled:cursor-not-allowed disabled:bg-slate-50"
            >
              <option value="">Everyone can open</option>
              {permissionOptions}
            </select>
            <p className="text-[11px] text-slate-400">
              Only users with this permission will be able to open the project card.
            </p>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;


