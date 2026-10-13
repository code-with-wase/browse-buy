// Frontend-only store. All data lives in localStorage for DEMO purposes.
// Replace the load/save helpers with API calls when a backend is added.
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  defaultCategories, defaultSettings,
  type CartItem, type Category, type Order, type Product, type Settings,
} from "./data";

type User = { email: string; name: string };
export type CheckoutSource = { mode: "cart" } | { mode: "buynow"; item: CartItem };

type Store = {
  ready: boolean; productsLoaded: boolean;
  products: Product[]; setProducts: (p: Product[]) => void;
  categories: Category[]; setCategories: (c: Category[]) => void;
  settings: Settings; setSettings: (s: Settings) => void;
  orders: Order[]; addOrder: (o: Order) => void; setOrders: (o: Order[]) => void;
  cart: CartItem[]; addToCart: (i: CartItem) => void; updateQty: (idx: number, qty: number) => void; removeItem: (idx: number) => void; clearCart: () => void;
  wishlist: string[]; toggleWish: (id: string) => void;
  user: User | null; login: (u: User) => void; logout: () => void;
  checkout: CheckoutSource; setCheckout: (c: CheckoutSource) => void;
};

// Keep one context instance across hot reloads so Provider and consumers always match.
const g = globalThis as unknown as { __dcStoreCtx?: React.Context<Store | null> };
const Ctx = g.__dcStoreCtx ?? (g.__dcStoreCtx = createContext<Store | null>(null));

function load<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem("dc_" + key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch { return fallback; }
}
function save(key: string, v: unknown) {
  try { localStorage.setItem("dc_" + key, JSON.stringify(v)); }
  catch { toast.error("Browser storage is full — use fewer or smaller photos"); }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [products, setProductsS] = useState<Product[]>([]);
  const [categories, setCategoriesS] = useState<Category[]>(defaultCategories);
  const [settings, setSettingsS] = useState<Settings>(defaultSettings);
  const [orders, setOrdersS] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [checkout, setCheckoutS] = useState<CheckoutSource>({ mode: "cart" });

  useEffect(() => {
    setCategoriesS(load("categories", defaultCategories));
    setSettingsS({ ...defaultSettings, ...load("settings", {}) });
    setOrdersS(load("orders", []));
    setCart(load("cart", []));
    setWishlist(load("wishlist", []));
    setUser(load("user", null));
    setCheckoutS(load("checkout", { mode: "cart" }));
    try { localStorage.removeItem("dc_products"); } catch { /* ignore */ }
    setReady(true);
    import("@/axios/axiosInstance").then(({ getProducts }) => getProducts()).then((list) => {
      setProductsS(list);
    }).catch(() => { /* backend unreachable */ }).finally(() => setProductsLoaded(true));
  }, []);

  useEffect(() => {
    if (!ready) return;
    save("cart", cart);
    if (user) save("cart_" + user.email.toLowerCase(), cart);
  }, [cart, ready, user]);
  useEffect(() => { if (ready) save("wishlist", wishlist); }, [wishlist, ready]);

  const setProducts = useCallback((p: Product[]) => { setProductsS(p); }, []);
  const setCategories = useCallback((c: Category[]) => { setCategoriesS(c); save("categories", c); }, []);
  const setSettings = useCallback((s: Settings) => { setSettingsS(s); save("settings", s); }, []);
  const setOrders = useCallback((o: Order[]) => { setOrdersS(o); save("orders", o); }, []);
  const setCheckout = useCallback((c: CheckoutSource) => { setCheckoutS(c); save("checkout", c); }, []);

  const value = useMemo<Store>(() => ({
    ready, productsLoaded, products, setProducts, categories, setCategories, settings, setSettings,
    orders, setOrders, addOrder: (o) => setOrders([o, ...orders]),
    cart,
    addToCart: (i) => setCart((c) => {
      const idx = c.findIndex((x) => x.productId === i.productId && x.size === i.size && x.color === i.color);
      if (idx >= 0) return c.map((x, j) => (j === idx ? { ...x, qty: Math.min(10, x.qty + i.qty) } : x));
      return [...c, i];
    }),
    updateQty: (idx, qty) => setCart((c) => c.map((x, j) => (j === idx ? { ...x, qty: Math.max(1, Math.min(10, qty)) } : x))),
    removeItem: (idx) => setCart((c) => c.filter((_, j) => j !== idx)),
    clearCart: () => setCart([]),
    wishlist,
    toggleWish: (id) => setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id])),
    user,
    login: (u) => {
      // Restore this user's saved cart and merge with anything added before sign-in.
      const saved = load<CartItem[]>("cart_" + u.email.toLowerCase(), []);
      setCart((guest) => {
        const merged = [...saved];
        for (const i of guest) {
          const idx = merged.findIndex((x) => x.productId === i.productId && x.size === i.size && x.color === i.color);
          const ex = merged[idx];
          if (ex) merged[idx] = { ...ex, qty: Math.min(10, Math.max(ex.qty, i.qty)) };
          else merged.push(i);
        }
        return merged;
      });
      setUser(u); save("user", u);
    },
    logout: () => {
      if (user) save("cart_" + user.email.toLowerCase(), cart);
      setCart([]);
      setUser(null); save("user", null); try { localStorage.removeItem("dc_token"); } catch { /* ignore */ }
    },
    checkout, setCheckout,
  }), [ready, productsLoaded, products, categories, settings, orders, cart, wishlist, user, checkout, setProducts, setCategories, setSettings, setOrders, setCheckout]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore outside provider");
  return c;
}

export function shippingFor(subtotal: number, s: Settings) {
  return subtotal === 0 || subtotal >= s.freeShippingAbove ? 0 : s.shippingFee;
}
