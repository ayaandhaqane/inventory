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

  //Load categories from backend
  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(console.error);
  }, []);

  useEffect(() => {
    setProduct(initial ?? emptyProduct);
  }, [initial]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2";

  return (
    <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <input
          name="name"
          className={inputClass}
          placeholder="e.g. Wireless Headphones"
          value={product.name}
          onChange={handleChange}
          required
        />

        {/* CATEGORY  */}
        <label className="text-sm font-medium" title="Category">
          <span>Category</span>
          <select
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
        </label>


        {/* PRICE */}
        <label className="text-sm font-medium" title="Price">
         <span>Price</span>
          <input
            name="price"
            type="number"
            min={0}
            step="0.01"
            className={inputClass}
            value={product.price}
            onChange={handleChange}
            required
          />
        </label>

        {/* QUANTITY */}
        <label className="text-sm font-medium" title="Quantity">
          <span>Quantity</span>
        <input
          name="quantity"
          type="number"
          min={0}
          className={inputClass}
          value={product.quantity}
          onChange={handleChange}
          required
        />
        </label>

        {/* DESCRIPTION */}
        <label className="text-sm font-medium" title="Description">
          <span>Description</span>
        <textarea
          name="description"
          className={inputClass}
          value={product.description}
          onChange={handleChange}
          rows={4}
        />
        </label>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onCancelEdit}>
            Cancel
          </button>
          <button type="submit" disabled={loading}>
            {initial ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
