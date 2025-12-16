import { useEffect, useState, useRef } from "react";
import { Product } from "../../types/product";

type Props = {
  onSave: (product: Product) => Promise<void> | void;
  initial?: Product | null;
  onCancelEdit?: () => void;
};

const emptyProduct: Product = {
  name: "",
  description: "",
  price: 0,
  category_id: 0,
  image: "",
  quantity: 0,
};

export default function ProductForm({ onSave, initial, onCancelEdit }: Props) {
  const [product, setProduct] = useState<Product>(initial ?? emptyProduct);
  const [category, setCategory] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setProduct(initial ?? emptyProduct);
    setCategory("");
  }, [initial]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setProduct((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "quantity" ? Number(value) : value,
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
      // Optionally, you can create a URL for the selected file to preview it
      setProduct((prev) => ({
        ...prev,
        image: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    await onSave(product);
    setLoading(false);
    setProduct(emptyProduct);
    setCategory("");
    setSelectedFile(null);
  };

  const isEdit = Boolean(initial?.id);

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-indigo-100 transition focus:border-indigo-500 focus:ring-2";

  return (
    <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/60">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
            {isEdit ? "Edit product" : "Add product"}
          </p>
          <h3 className="text-xl font-semibold text-slate-900">
            {isEdit ? "Update inventory item" : "Create new item"}
          </h3>
        </div>
        {isEdit && (
          <span className="inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
            Editing
          </span>
        )}
      </div>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-semibold text-slate-800"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              className={inputClass}
              value={product.name}
              onChange={handleChange}
              placeholder="e.g. Wireless Headphones"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="category"
              className="text-sm font-semibold text-slate-800"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              className={`${inputClass} pr-8`}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select a category</option>
              <option value="electronics">Electronics</option>
              <option value="furniture">Furniture</option>
              <option value="accessories">Accessories</option>
              <option value="office">Office</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="price"
              className="text-sm font-semibold text-slate-800"
            >
              Price ($)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min={0}
              step="0.01"
              className={inputClass}
              value={product.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="quantity"
              className="text-sm font-semibold text-slate-800"
            >
              Quantity
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min={0}
              step="1"
              className={inputClass}
              value={product.quantity}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-800">
            Image
          </label>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50">
              Choose File
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </label>
            <span className="text-sm text-slate-600">
              {selectedFile ? selectedFile.name : "No file chosen"}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="description"
            className="text-sm font-semibold text-slate-800"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="min-h-[110px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-indigo-100 transition focus:border-indigo-500 focus:ring-2"
            value={product.description}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <div className="flex flex-wrap gap-3 pt-2 justify-end">
          <button
            type="button"
            onClick={onCancelEdit}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
          >
            {isEdit ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
