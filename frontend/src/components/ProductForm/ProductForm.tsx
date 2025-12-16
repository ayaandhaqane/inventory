import { useEffect, useState, useRef } from "react";
import { Product } from "../../types/product";
import { Category } from "../../types/category";
import { fetchCategories } from "../../services/api";

type Props = {
  onSave: (data: FormData) => Promise<void> | void;
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // Load categories from backend
  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(console.error);
  }, []);

  useEffect(() => {
    setProduct(initial ?? emptyProduct);
  
    if (initial?.image) {
      const imageUrl = initial.image.startsWith("http")
        ? initial.image
        : `http://localhost:3000${initial.image}`;
  
      setImagePreview(imageUrl);
    } else {
      setImagePreview(null);
    }
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

  const newErrors: Record<string, boolean> = {};

  if (!product.name.trim()) newErrors.name = true;
  if (!product.category_id) newErrors.category_id = true;
  if (product.price <= 0) newErrors.price = true;
  if (product.quantity < 0) newErrors.quantity = true;
  if (!(product.description ?? "").trim()) newErrors.description = true;
  if (!selectedFile && !initial?.image) newErrors.image = true;

  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) return;

  setLoading(true);

const formData = new FormData();
formData.append("name", product.name);
formData.append("category_id", String(product.category_id));
formData.append("description", product.description ?? "");
formData.append("price", String(product.price));
formData.append("quantity", String(product.quantity));

if (selectedFile) {
  formData.append("image", selectedFile);
}

await onSave(formData);

setLoading(false);

};

  

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed (JPG, PNG, WEBP)");
      event.target.value = "";
      return;
    }
  
    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  
  
  };
  

  const inputClass =
    "w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100";

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const errorClass =
  "border-red-500 focus:border-red-500 focus:ring-red-100";


  return (
    <div className="w-full max-w-2xl rounded-lg bg-white p-4 shadow-md">
      <div className="mb-4 border-b pb-2">
        <h3 className="text-lg font-bold text-gray-900">
          {initial ? "Update Product" : "Create New Product"}
        </h3>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        {/* Name & Category in one row on larger screens */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="name" className={labelClass}>
              Name
            </label>
            <input
  id="name"
  name="name"
  className={`${inputClass} ${errors.name ? errorClass : ""}`}
  value={product.name}
  onChange={handleChange}
/>

{errors.name && (
  <p className="text-xs text-red-600 mt-1">
    Product name is required
  </p>
)}

          </div>

          <div className="space-y-1.5">
            <label htmlFor="category_id" className={labelClass}>
              Category
            </label>
            <select
              id="category_id"
              name="category_id"
              className={`${inputClass} ${errors.category_id ? errorClass : ""}`}
              value={product.category_id}
              onChange={handleChange}
              
            >
              <option value={0}>Select a category</option>
              {Array.isArray(categories) &&
                categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Price & Quantity in one row on larger screens */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="price" className={labelClass}>
              Price ($)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              className={`${inputClass} ${errors.price ? errorClass : ""}`}
              value={product.price}
              onChange={handleChange}
              
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="quantity" className={labelClass}>
              Quantity
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min="0"
              className={`${inputClass} ${errors.quantity ? errorClass : ""}`}
              value={product.quantity}
              onChange={handleChange}
              
            />
          </div>
        </div>

        {/* Image Upload and Preview */}
        <div className="space-y-1.5">
          <label className={labelClass}>Image</label>
          <div className="flex items-center gap-3">
            <label className="cursor-pointer rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-indigo-700">
              Choose File
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
                
              />
            </label>
            <span className={`text-xs ${errors.image ? "text-red-600" : "text-gray-600"}`}>
              {errors.image ? "Image is required" : selectedFile?.name || "No file chosen"}
            </span>

          </div>
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-32 w-auto rounded-md object-cover"
              />
            </div>
          )}
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label htmlFor="description" className={labelClass}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            
            className={`${inputClass} ${errors.description ? errorClass : ""}`}
            value={product.description}
            onChange={handleChange}
            rows={3}
            placeholder="Enter a detailed description of the product"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-1.5">
                <svg
                  className="h-3 w-3 animate-spin"
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
