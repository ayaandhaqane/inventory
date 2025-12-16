import { useEffect, useState, useRef } from "react";
import { Product } from "../../types/product";
import { Category } from "../../types/category";
import { fetchCategories } from "../../services/api";

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load categories from backend
  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(console.error);
  }, []);

  useEffect(() => {
    setProduct(initial ?? emptyProduct);
  }, [initial]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "quantity" || name === "category_id"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSave(product);
    setLoading(false);
    setProduct(emptyProduct);
    setSelectedFile(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setProduct((prev) => ({
        ...prev,
        image: URL.createObjectURL(file),
      }));
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="w-full max-w-3xl rounded-xl bg-white p-6 shadow-lg">
      <div className="mb-6 border-b pb-4">
        <h3 className="text-xl font-bold text-gray-900">
          {initial ? "Update Product" : "Create New Product"}
        </h3>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Name & Category in one row on larger screens */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="name" className={labelClass}>
              Name
            </label>
            <input
              id="name"
              name="name"
              className={inputClass}
              placeholder="e.g. Wireless Headphones"
              value={product.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="category_id" className={labelClass}>
              Category
            </label>
            <select
              id="category_id"
              name="category_id"
              className={inputClass}
              value={product.category_id}
              onChange={handleChange}
              required
            >
              <option value={0}>Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Price & Quantity in one row on larger screens */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="price" className={labelClass}>
              Price ($)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              className={inputClass}
              value={product.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="quantity" className={labelClass}>
              Quantity
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min="0"
              className={inputClass}
              value={product.quantity}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <label className={labelClass}>Image</label>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700">
              Choose File
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </label>
            <span className="text-sm text-gray-600">
              {selectedFile ? selectedFile.name : "No file chosen"}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="description" className={labelClass}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className={`min-h-[120px] ${inputClass}`}
            value={product.description}
            onChange={handleChange}
            rows={4}
            placeholder="Enter a detailed description of the product"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : initial ? (
              "Update"
            ) : (
              "Create"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
