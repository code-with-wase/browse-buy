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
  images?: string[]; sizes?: string[]; colors?: string[]; category?: string; stock?: number; tags?: string[]; rating?: number; isActive?: boolean; [k: string]: unknown;
};

export function mapProduct(a: ApiProduct): Product {
  const tags = (a.tags ?? []).filter((t): t is Product["tags"][number] => ["trending", "new", "best"].includes(t));
  const extra = Object.fromEntries(["brand","sku","fabric","fit","pattern","sleeve","neck","occasion","washCare","packOf","countryOfOrigin","weight","hsn","highlights"].filter((k) => a[k] != null).map((k) => [k, a[k]]));
  const mapped = {
    ...extra, backendId: a.id || a._id, slug: a.slug, isActive: a.isActive ?? true,
    id: a.slug || a.id || a._id || a.name, name: a.name, description: a.description ?? "",
    price: a.price, originalPrice: a.originalPrice ?? a.price, images: a.images?.length ? a.images : [],
    sizes: a.sizes?.length ? a.sizes : ["Free Size"], colors: a.colors?.length ? a.colors : ["Default"],
    category: (a.category ?? "").toLowerCase(), stock: a.stock ?? 10, tags, rating: a.rating ?? 4.5,
  } as Product;
  return mapped;
}

// Public product APIs
export const getProducts = async () => (await axiosInstance.get("/products/all", { params: { limit: 100 } })).data.products.map(mapProduct) as Product[];
export const getProductById = async (id: string) => { const d = (await axiosInstance.get(`/products/details/${id}`)).data; return mapProduct(d.product ?? d.data); };
export const getProductBySlug = async (slug: string) => { const d = (await axiosInstance.get(`/products/slug/${slug}`)).data; return mapProduct(d.product ?? d.data); };

// Auth APIs
export const loginApi = async (name: string, email: string) => (await axiosInstance.post("/auth/login", { name, email })).data as { token?: string; user?: { id?: string; name: string; email: string; role?: string } };
export const getMe = async () => (await axiosInstance.get("/auth/me")).data;

// Admin product APIs (require admin token)
export type ProductPayload = { name: string; slug: string; description: string; price: number; originalPrice: number; images: string[]; sizes: string[]; tags: string[]; category: string; stock: number; isActive: boolean; [k: string]: unknown };
const pickProduct = (d: { product?: ApiProduct; data?: ApiProduct }) => mapProduct((d.product ?? d.data) as ApiProduct);
export const adminGetProducts = async () => { const d = (await axiosInstance.get("/products/admin/all", { params: { limit: 500 } })).data; return ((d.products ?? d.data ?? []) as ApiProduct[]).map(mapProduct); };
export const adminCreateProduct = async (p: ProductPayload) => pickProduct((await axiosInstance.post("/products/admin/create", p)).data);
export const adminUpdateProduct = async (id: string, p: ProductPayload) => pickProduct((await axiosInstance.patch(`/products/admin/update/${id}`, p)).data);
export const adminDeleteProduct = async (id: string) => (await axiosInstance.delete(`/products/admin/delete/${id}`)).data;
