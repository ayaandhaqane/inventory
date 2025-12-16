import { useEffect, useMemo, useState } from "react";
import ProductForm from "../components/ProductForm/ProductForm";
import ProductTable from "../components/ProductTable/ProductTable";
import StockChart from "../components/StockChart/StockChart";
import LowStockChart from "../components/StockChart/LowStockChart";
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from "../services/api";
import { Product } from "../types/product";
import {
  AlertTriangle,
  DollarSign,
  Filter,
  Package,
  Plus,
  Search,
} from "lucide-react";

type StatCardProps = {
  icon?: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "amber";
  iconBg?: string;
  iconText?: string;
};

function StatCard({
  icon,
  label,
  value,
  hint,
  tone = "default",
  iconBg = "bg-slate-100",
  iconText = "text-slate-700",
}: StatCardProps) {
  const toneClasses =
    tone === "amber"
      ? "bg-amber-50 text-amber-800 ring-1 ring-amber-100"
      : "bg-white text-slate-900 ring-1 ring-slate-200";

  return (
    <div className={`rounded-xl px-5 py-4 shadow-sm ${toneClasses}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {label}
          </p>
          <div className="mt-1 text-2xl font-bold">{value}</div>
          {hint && <p className="text-xs text-slate-500">{hint}</p>}
        </div>
        {icon && (
          <div
            className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-lg ${iconBg} ${iconText}`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const lowStockCount = useMemo(() => {
    return Array.isArray(products)
      ? products.filter((p) => p.quantity < 5).length
      : 0;
  }, [products]);

  const totalValue = useMemo(() => {
    return Array.isArray(products)
      ? products.reduce((sum, p) => sum + p.price * p.quantity, 0)
      : 0;
  }, [products]);

  const averagePrice = useMemo(() => {
    if (!products.length) return 0;
    const total = products.reduce((sum, p) => sum + p.price, 0);
    return total / products.length;
  }, [products]);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return products;
    return products.filter((p) => p.name.toLowerCase().includes(term));
  }, [products, search]);

  const handleSave = async (product: Product) => {
    try {
      if (editingProduct?.id) {
        await updateProduct(editingProduct.id, product);
      } else {
        await createProduct(product);
      }
      await load();
      setEditingProduct(null); // Close the edit modal
      setShowAddForm(false); // Close the add modal
    } catch (err) {
      console.error(err);
      setError("Failed to save product");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id);
      await load();
    } catch (err) {
      console.error(err);
      setError("Failed to delete product");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleCloseEditModal = () => {
    setEditingProduct(null);
  };

  return (
    <div className="space-y-8">
      <div className="card-surface p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">
              Inventory overview
            </h2>
            <p className="text-sm text-slate-500">
              Keep a real-time pulse on products, value, and stock health with
              clean controls.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs" />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            icon={<Package className="h-5 w-5 text-indigo-600" />}
            label="Total Products"
            value={products.length.toString()}
            iconBg="bg-indigo-50"
            iconText="text-indigo-600"
          />
          <StatCard
            icon={<DollarSign className="h-5 w-5 text-emerald-600" />}
            label="Total Value"
            value={`$${totalValue.toFixed(2)}`}
            iconBg="bg-emerald-50"
            iconText="text-emerald-600"
          />
          <StatCard
            icon={<AlertTriangle className="h-5 w-5 text-amber-600" />}
            label="Low Stock Items"
            value={lowStockCount.toString()}
            tone="amber"
            iconBg="bg-amber-50"
            iconText="text-amber-600"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <StockChart products={products} />
        <LowStockChart
          lowCount={lowStockCount}
          okCount={Math.max(products.length - lowStockCount, 0)}
        />
      </div>

      <div className="card-surface flex flex-col gap-2 p-3">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-end lg:gap-3">
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <span className="pointer-events-none absolute left-3 top-2.5 text-slate-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm">
              <span className="text-slate-400">
                <Filter className="h-4 w-4" />
              </span>
              <span className="text-slate-500">All categories</span>
            </button>
          </div>
          <button
            onClick={() => {
              setShowAddForm(true);
            }}
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {loading ? (
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-6 text-sm text-slate-500 shadow-sm">
            Loading...
          </div>
        ) : (
          <ProductTable
            products={filteredProducts}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <button
              aria-label="Close"
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
              onClick={handleCloseEditModal}
            >
              ✕
            </button>
            <ProductForm
              initial={editingProduct}
              onSave={handleSave}
              onCancelEdit={handleCloseEditModal}
            />
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <button
              aria-label="Close"
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
              onClick={() => setShowAddForm(false)}
            >
              ✕
            </button>
            <ProductForm
              onSave={handleSave}
              onCancelEdit={() => setShowAddForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
