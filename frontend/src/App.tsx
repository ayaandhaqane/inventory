import { useEffect, useMemo, useState } from "react";
import Dashboard from "./pages/Dashboard";
import { Bell, AlertTriangle } from "lucide-react";
import { fetchProducts } from "./services/api";
import { Product } from "./types/product";

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showNotification, setShowNotification] = useState(false);

  // Load products only for notifications
  useEffect(() => {
    fetchProducts()
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  // Low stock products (<=5)
  const lowStockProducts = useMemo(() => {
    return products.filter((p) => p.quantity <= 5);
  }, [products]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-50">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white text-lg font-bold">
              ID
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              InventoryDash
            </h1>
          </div>

          {/* Right side */}
          <div className="relative flex items-center gap-4 text-xs text-slate-500">
            {/* Notification Bell */}
            <button
              onClick={() => setShowNotification((prev) => !prev)}
              className="relative rounded-full p-1 hover:bg-slate-100"
            >
              <Bell className="h-5 w-5 text-slate-700" />

              {lowStockProducts.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white shadow">
                  {lowStockProducts.length}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotification && (
              <div className="absolute right-10 top-12 w-72 rounded-xl border border-slate-200 bg-white shadow-lg z-50">
                <div className="flex items-center gap-2 border-b px-4 py-3">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-semibold text-slate-800">
                    Low Stock Alerts
                  </span>
                </div>

                <div className="max-h-60 overflow-auto">
                  {lowStockProducts.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-slate-500">
                      ✅ All stock levels are healthy
                    </div>
                  ) : (
                    lowStockProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between px-4 py-2 text-sm hover:bg-slate-50"
                      >
                        <span className="font-medium text-slate-800">
                          {product.name}
                        </span>
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                          {product.quantity} left
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Avatar */}
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
              JD
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <Dashboard />
      </main>
    </div>
  );
}

export default App;
