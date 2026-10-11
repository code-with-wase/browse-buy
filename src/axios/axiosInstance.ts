import axios from "axios";
import type { Product } from "@/lib/data";

export const API_BASE_URL = "https://dc-backend-ivory.vercel.app";

const axiosInstance = axios.create({ baseURL: API_BASE_URL, timeout: 15000, headers: { "Content-Type": "application/json" } });

axiosInstance.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("dc_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch { /* SSR */ }
  return config;
});

export default axiosInstance;

type ApiProduct = {
  id?: string; _id?: string; slug?: string; name: string; description?: string; price: number; originalPrice?: number;
  images?: string[]; sizes?: string[]; colors?: string[]; category?: string; stock?: number; tags?: string[]; rating?: number;
};

export function mapProduct(a: ApiProduct): Product {
  const tags = (a.tags ?? []).filter((t): t is Product["tags"][number] => ["trending", "new", "best"].includes(t));
  return {
    id: a.slug || a.id || a._id || a.name, name: a.name, description: a.description ?? "",
    price: a.price, originalPrice: a.originalPrice ?? a.price, images: a.images?.length ? a.images : [],
    sizes: a.sizes?.length ? a.sizes : ["Free Size"], colors: a.colors?.length ? a.colors : ["Default"],
    category: (a.category ?? "").toLowerCase(), stock: a.stock ?? 10, tags, rating: a.rating ?? 4.5,
  };
}

// Public product APIs
export const getProducts = async () => (await axiosInstance.get("/products/all", { params: { limit: 100 } })).data.products.map(mapProduct) as Product[];
export const getProductById = async (id: string) => { const d = (await axiosInstance.get(`/products/details/${id}`)).data; return mapProduct(d.product ?? d.data); };
export const getProductBySlug = async (slug: string) => { const d = (await axiosInstance.get(`/products/slug/${slug}`)).data; return mapProduct(d.product ?? d.data); };

// Auth APIs
export const loginApi = async (name: string, email: string) => (await axiosInstance.post("/auth/login", { name, email })).data as { token?: string; user?: { name: string; email: string } };
export const getMe = async () => (await axiosInstance.get("/auth/me")).data;
