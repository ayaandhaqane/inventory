import axios from "axios";
import { Product } from "../types/product";
import { Category } from "../types/category";

const api = axios.create({
  baseURL: "/api",
});

export async function fetchProducts() {
  const { data } = await api.get<Product[]>("/products");
  return data;
}

export async function createProduct(product: Product) {
  const { data } = await api.post<Product>("/products", product);
  return data;
}

export async function updateProduct(id: number, product: Product) {
  const { data } = await api.put<Product>(`/products/${id}`, product);
  return data;
}

export async function deleteProduct(id: number) {
  await api.delete(`/products/${id}`);
}





export async function fetchCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>("/categories");
  return data;
}

export async function createCategory(name: string): Promise<Category> {
  const { data } = await api.post<Category>("/categories", { name });
  return data;
}