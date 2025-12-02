import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CreateProductModal from "./CreateProductModal";
import axiosInstance from "../../lib/axiosInstance";
import { toast } from "react-hot-toast";


const DocsPage = () => {
  const user = useSelector((state) => state.user.user);
  const userPermissions = user?.Permissions?.map((p) => p.name) || [];

  const [products, setProducts] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const hasPermission = (perm) =>
    !perm || userPermissions.includes(perm);

  const canCreateProduct = hasPermission("permissions.create");


  const handleCreateProductClick = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };
  const fetchAllProduct = async () => {
    try {
      const response = await axiosInstance.get("/api/products/");
      setProducts(response.data.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error(error.response?.data?.message || "Error fetching products", {
        id: "fetch-products-error", // Prevents duplicate toasts
      });
    }
  }
  useEffect(() => {
    fetchAllProduct();
  }, []);

  const handleSaveProduct = async ({ title, subtitle, description, permission }) => {
    try {
      const response = await axiosInstance.post("/api/products/", {
        title,
        subtitle,
        description,
        permission,
      });
      setProducts((prev) => [...prev, response.data.data.product]);
      setShowCreateModal(false);
    } catch (error) {
      toast.error("Error creating product:", error);
      throw error; // so error flows back to modal
    }
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
        {products.map((section) => {
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
                  to={allowed ? `/pdp/${section.id}` : "#"}
                  onClick={(e) => {
                    if (!allowed) e.preventDefault();
                  }}
                  className={`inline-flex items-center rounded-xl px-4 py-2 text-xs font-semibold ${allowed
                    ? "bg-green-400 text-white hover:bg-slate-800"
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


