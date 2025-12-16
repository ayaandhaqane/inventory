import { useState } from "react";

type Props = {
  onCreate: (name: string) => Promise<void>;
  onClose: () => void;
};

export default function CategoryModal({ onCreate, onClose }: Props) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    await onCreate(name.trim());
    setLoading(false);
    setName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex justify-between">
          <h3 className="text-lg font-semibold">Create Category</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-white"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
