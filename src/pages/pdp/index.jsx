import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../lib/axiosInstance";
import { useEffect, useState } from "react";
import { ArrowLeft, Calendar, Tag, Clock } from "lucide-react";
import { toast } from "react-hot-toast";

export const Pdp = () => {

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { productId } = useParams();
    const navigate = useNavigate();

    const fetchPdp = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(`/api/products/${productId}`);
            if (res.data.success) {
                setProduct(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching product:", error);
            toast.error("Failed to load product details",{
                id:"fetch-product-error",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (productId) {
            fetchPdp();
        }
    }, [productId]);

    if (loading) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="mx-auto max-w-4xl px-6 py-12 text-center">
                <h2 className="text-xl font-semibold text-slate-900">Product not found</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 text-sm text-slate-600 hover:text-slate-900 hover:underline"
                >
                    Go back
                </button>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl px-6 py-10">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to products
            </button>

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                {product.image ? (
                    <div className="aspect-video w-full overflow-hidden bg-slate-100">
                        <img
                            src={product.image}
                            alt={product.title}
                            className="h-full w-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="h-32 w-full bg-gradient-to-r from-slate-50 to-slate-100"></div>
                )}

                <div className="p-8">
                    <div className="mb-8">
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-2">
                                {product.subtitle && (
                                    <p className="text-sm font-medium uppercase tracking-wider text-slate-500">
                                        {product.subtitle}
                                    </p>
                                )}
                                <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                                    {product.title}
                                </h1>
                            </div>
                            {product.price && (
                                <div className="shrink-0 rounded-2xl bg-slate-900 px-4 py-2 text-xl font-bold text-white">
                                    ${product.price}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="prose prose-slate max-w-none text-slate-600">
                        <p className="whitespace-pre-wrap leading-relaxed text-lg">
                            {product.description}
                        </p>
                    </div>

                    <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-slate-100 pt-6 text-sm text-slate-500">
                        <div className="flex items-center gap-2" title="Created date">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <span>Created {new Date(product.createdAt).toLocaleDateString()}</span>
                        </div>

                        <div className="flex items-center gap-2" title="Last updated">
                            <Clock className="h-4 w-4 text-slate-400" />
                            <span>Updated {new Date(product.updatedAt).toLocaleDateString()}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-slate-400" />
                            <span
                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${product.isActive
                                    ? "bg-green-50 text-green-700"
                                    : "bg-amber-50 text-amber-700"
                                    }`}
                            >
                                {product.isActive ? "Active" : "Inactive"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};  