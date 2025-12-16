import axios from "axios";
import { Product } from "../types/product";
import { Category } from "../types/category";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});
export async function fetchProducts() {
  const { data } = await api.get<Product[]>("/products");
  return data;
}

export async function createProduct(formData: FormData) {
  const { data } = await api.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}


export async function updateProduct(id: number, formData: FormData) {
  const { data } = await api.put(`/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}

export async function deleteProduct(id: number) {
  await api.delete(`/products/${id}`);
}




export async function fetchCategories(): Promise<Category[]> {
  const res = await api.get("/categories");

  const data = res.data;

  // ✅ Always return array
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.rows)) return data.rows;
  if (Array.isArray(data.data)) return data.data;

  return [];
}


export async function createCategory(name: string): Promise<Category> {
  const { data } = await api.post<Category>("/categories", { name });
  return data;
}