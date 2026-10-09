// DEMO DATA — replace with a real database/service later.
import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";
import p7 from "@/assets/p7.jpg";

export type Category = { id: string; name: string; image: string };
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  images: string[];
  sizes: string[];
  colors: string[];
  category: string;
  stock: number;
  tags: ("trending" | "new" | "best")[];
  rating: number;
  // Marketplace-style (Flipkart / Meesho) listing fields — all optional
  brand?: string; sku?: string; fabric?: string; fit?: string; pattern?: string;
  sleeve?: string; neck?: string; occasion?: string; washCare?: string;
  packOf?: string; countryOfOrigin?: string; weight?: string; hsn?: string;
  highlights?: string[];
};
export const SPEC_FIELDS: [keyof Product, string][] = [
  ["brand", "Brand"], ["sku", "SKU / Style code"], ["fabric", "Fabric"], ["fit", "Fit"], ["pattern", "Pattern"],
  ["sleeve", "Sleeve"], ["neck", "Neck / Collar"], ["occasion", "Occasion"], ["washCare", "Wash care"],
  ["packOf", "Pack of"], ["countryOfOrigin", "Country of origin"], ["weight", "Net weight"], ["hsn", "HSN code"],
];
/** Emails allowed into the admin panel (Ctrl+Shift+A). */
export const ADMIN_EMAILS = ["admin@deluxeculture.in"];
export const WHATSAPP_NUMBER = "919130726736";
export type CartItem = { productId: string; size: string; color: string; qty: number };
export type OrderStatus = "Pending payment" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";
export type Order = {
  id: string;
  createdAt: string;
  customer: { name: string; mobile: string; email: string; address: string; city: string; state: string; pin: string };
  items: { name: string; size: string; color: string; qty: number; price: number }[];
  subtotal: number;
  shipping: number;
  total: number;
  payment: string;
  status: OrderStatus;
};
export type Settings = {
  brand: string;
  tagline: string;
  whatsapp: string;
  upiId: string;
  qrImage: string;
  shippingFee: number;
  freeShippingAbove: number;
  heroTitle: string;
  heroSubtitle: string;
  announcement: string;
};

export const defaultSettings: Settings = {
  brand: "DELUXE CULTURE",
  tagline: "Dress Like a Better You.",
  whatsapp: "919130726736",
  upiId: "deluxeculture@upi",
  qrImage: "",
  shippingFee: 99,
  freeShippingAbove: 1999,
  heroTitle: "Dress Like a Better You.",
  heroSubtitle: "Tailored menswear crafted for the man who leads every room he walks into.",
  announcement: "Free shipping on orders above ₹1,999 · Easy 7-day returns",
};

export const defaultCategories: Category[] = [
  { id: "shirts", name: "Shirts", image: p1 },
  { id: "blazers", name: "Blazers", image: p2 },
  { id: "denim", name: "Denim", image: p3 },
  { id: "jackets", name: "Jackets", image: p4 },
  { id: "ethnic", name: "Ethnic", image: p5 },
  { id: "polos", name: "Polos & Tees", image: p6 },
  { id: "accessories", name: "Accessories", image: p7 },
];

const S = ["S", "M", "L", "XL", "XXL"];
export const defaultProducts: Product[] = [
  { id: "noir-linen-shirt", name: "Noir Linen Shirt", description: "Breathable premium linen in deep noir with mother-of-pearl buttons. Relaxed tailored fit for effortless evenings.", price: 1899, originalPrice: 3499, images: [p1, p6, p4], sizes: S, colors: ["Black", "Ivory"], category: "shirts", stock: 24, tags: ["trending", "best"], rating: 4.7 },
  { id: "sahara-blazer", name: "Sahara Wool Blazer", description: "Soft-structured wool blend blazer in warm sand. Notch lapel, half lining, a timeless smart-casual essential.", price: 5499, originalPrice: 8999, images: [p2, p1], sizes: S, colors: ["Beige", "Charcoal"], category: "blazers", stock: 12, tags: ["trending", "new"], rating: 4.8 },
  { id: "midnight-denim", name: "Midnight Slim Denim", description: "Stretch selvedge-look denim in an indigo midnight wash. Slim taper with a comfortable mid rise.", price: 1699, originalPrice: 2999, images: [p3, p6], sizes: ["28", "30", "32", "34", "36"], colors: ["Indigo", "Black"], category: "denim", stock: 40, tags: ["best"], rating: 4.5 },
  { id: "onyx-leather-jacket", name: "Onyx Leather Jacket", description: "Butter-soft vegan leather with a sharp collar and gunmetal hardware. Built to age beautifully.", price: 6999, originalPrice: 11999, images: [p4, p1], sizes: S, colors: ["Black", "Brown"], category: "jackets", stock: 8, tags: ["trending", "best"], rating: 4.9 },
  { id: "royal-ivory-kurta", name: "Royal Ivory Kurta", description: "Jacquard kurta with hand-finished gold thread embroidery on the placket. Made for celebrations.", price: 3299, originalPrice: 5499, images: [p5], sizes: S, colors: ["Ivory", "Gold"], category: "ethnic", stock: 15, tags: ["new", "best"], rating: 4.8 },
  { id: "charcoal-knit-polo", name: "Charcoal Knit Polo", description: "Fine-gauge cotton knit polo in heathered charcoal. Ribbed hems, three-button placket.", price: 1299, originalPrice: 2199, images: [p6, p3], sizes: S, colors: ["Charcoal", "Black", "Navy"], category: "polos", stock: 30, tags: ["new", "trending"], rating: 4.6 },
  { id: "gentleman-kit", name: "The Gentleman's Kit", description: "Gold-tone watch, full-grain leather belt and classic sunglasses — the finishing set.", price: 4499, originalPrice: 7499, images: [p7], sizes: ["One Size"], colors: ["Gold"], category: "accessories", stock: 10, tags: ["new"], rating: 4.7 },
  { id: "ivory-oxford", name: "Ivory Oxford Shirt", description: "Crisp oxford cotton in ivory under a cream blazer or on its own. Cutaway collar.", price: 1499, originalPrice: 2499, images: [p2, p5], sizes: S, colors: ["Ivory", "Sky"], category: "shirts", stock: 0, tags: ["best"], rating: 4.4 },
  { id: "essential-white-tee", name: "Essential Supima Tee", description: "Heavyweight Supima cotton tee with a structured neckline that holds its shape wash after wash.", price: 799, originalPrice: 1299, images: [p3], sizes: S, colors: ["White", "Black"], category: "polos", stock: 60, tags: ["trending"], rating: 4.5 },
];

export const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
export const discount = (p: Product) => Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
