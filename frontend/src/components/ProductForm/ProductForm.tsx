import { useEffect, useState } from "react";
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
  quantity: 0,
  category_id: 0,
};

export default function ProductForm({ onSave, initial, onCancelEdit }: Props) {
  const [product, setProduct] = useState<Product>(initial ?? emptyProduct);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
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
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      {/* NAME */}
      <div>
        <label htmlFor="name">Product Name</label>
        <input
          id="name"
          name="name"
          value={product.name}
          onChange={handleChange}
          placeholder="e.g. Wireless Headphones"
          required
        />
      </div>

      {/* CATEGORY */}
      <div>
        <label htmlFor="category_id">Category</label>
        <select
          id="category_id"
          name="category_id"
          value={product.category_id}
          onChange={handleChange}
          required
        >
          <option value={0}>Select category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* PRICE */}
      <div>
        <label htmlFor="price">Price</label>
        <input
          id="price"
          type="number"
          name="price"
          min={0}
          step="0.01"
          value={product.price}
          onChange={handleChange}
          required
        />
      </div>

      {/* QUANTITY */}
      <div>
        <label htmlFor="quantity">Quantity</label>
        <input
          id="quantity"
          type="number"
          name="quantity"
          min={0}
          value={product.quantity}
          onChange={handleChange}
          required
        />
      </div>

      {/* DESCRIPTION */}
      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={product.description}
          onChange={handleChange}
        />
      </div>

      {/* ACTIONS */}
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancelEdit}>
          Cancel
        </button>
        <button type="submit" disabled={loading}>
          {initial ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
