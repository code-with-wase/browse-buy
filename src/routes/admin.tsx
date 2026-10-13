import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, ImagePlus, LogOut, Boxes, LayoutDashboard, Package, Pencil, Plus, Settings as Cog, ShoppingCart, Tags, Trash2, Users, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SPEC_FIELDS, formatINR, type Category, type OrderStatus, type Product, type Settings } from "@/lib/data";
import { useStore } from "@/lib/store";
import { loginApi, adminGetProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct, type ProductPayload } from "@/axios/axiosInstance";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Panel — Deluxe Culture" },
      { name: "description", content: "Store management (demo)." },
      { property: "og:title", content: "Admin Panel — Deluxe Culture" },
      { property: "og:description", content: "Store management (demo)." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

const TABS = [
  ["dashboard", "Dashboard", LayoutDashboard], ["products", "Products", Package], ["categories", "Categories", Tags],
  ["inventory", "Inventory", Boxes], ["orders", "Orders", ShoppingCart], ["customers", "Customers", Users], ["settings", "Settings", Cog],
] as const;
type Tab = (typeof TABS)[number][0];

function Admin() {
  const [ok, setOk] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [bad, setBad] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { setOk(sessionStorage.getItem("dc_admin") === "1"); }, []);
  if (ok === null) return null;
  if (!ok) {
    const go = async (e: React.FormEvent) => {
      e.preventDefault();
      const em = email.trim().toLowerCase();
      setBusy(true);
      try {
        // Admin role comes from the backend users collection (role: "admin").
        const res = await loginApi("Admin", em);
        if (res.user?.role === "admin") {
          if (res.token) localStorage.setItem("dc_token", res.token);
          sessionStorage.setItem("dc_admin", "1"); setOk(true); toast.success(`Welcome, ${res.user.name}`);
        } else { setBad("This email is not an admin. Access denied."); toast.error("Not an admin email"); }
      } catch (ex: unknown) {
        const err = ex as { response?: { data?: { message?: string } }; message?: string };
        const msg = err.response?.data?.message ?? (err.response ? "Login failed" : "Cannot reach the server (blocked by CORS or offline). Check the backend's allowed origins.");
        setBad(msg); toast.error(msg);
      } finally { setBusy(false); }
    };
    return (
      <div className="grid min-h-screen place-items-center px-4">
        <form onSubmit={go} className="w-full max-w-sm animate-rise rounded-lg border bg-card p-8 shadow-gold">
          <div className="eyebrow">Restricted</div>
          <h1 className="mt-2 text-4xl">Admin Access</h1>
          <p className="mt-2 text-sm text-muted-foreground">Enter your admin email to continue.</p>
          <input type="email" required autoFocus value={email} onChange={(e) => { setEmail(e.target.value); setBad(""); }} placeholder="admin@email.com" className="field mt-6" />
          {bad && <p className="mt-2 text-xs text-destructive">{bad}</p>}
          <button disabled={busy} className="btn-gold mt-5 w-full">{busy ? "Checking…" : "Enter Panel"}</button>
          <Link to="/" className="mt-4 block text-center text-xs uppercase tracking-widest text-primary">Back to store</Link>
        </form>
      </div>
    );
  }
  return <AdminPanel />;
}

function StockAlert({ onClose, onManage }: { onClose: () => void; onManage: () => void }) {
  const { products } = useStore();
  const low = [...products].filter((p) => p.stock < 10).sort((a, b) => a.stock - b.stock);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4 backdrop-blur" onClick={onClose}>
      <div role="dialog" aria-label="Low stock alert" onClick={(e) => e.stopPropagation()} className="w-full max-w-lg animate-rise rounded-lg border bg-card p-6 shadow-gold">
        <div className="flex items-center gap-2 text-primary"><AlertTriangle className="h-5 w-5" /><span className="eyebrow">Stock Alert</span></div>
        <h2 className="mt-2 text-3xl">{low.length ? `${low.length} products need restocking` : "All products well stocked"}</h2>
        <ul className="mt-5 max-h-80 space-y-2 overflow-y-auto">
          {low.map((p) => (
            <li key={p.id} className="flex items-center gap-3 rounded border p-2">
              <img src={p.images[0]} alt="" className="h-12 w-10 rounded object-cover" />
              <span className="flex-1 text-sm">{p.name}</span>
              <span className={`rounded px-2 py-0.5 text-xs ${p.stock === 0 ? "bg-destructive text-destructive-foreground" : "bg-accent text-accent-foreground"}`}>{p.stock === 0 ? "0 left" : `${p.stock} left`}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex gap-2"><button onClick={onManage} className="btn-gold flex-1">Manage Inventory</button><button onClick={onClose} className="btn-outline">Later</button></div>
      </div>
    </div>
  );
}

function AdminPanel() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [alert, setAlert] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape" && !document.querySelector("[role=dialog],[role=alertdialog]")) navigate({ to: "/" }); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [navigate]);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[230px_1fr]">
      <aside className="border-b bg-sidebar p-4 lg:sticky lg:top-0 lg:h-screen lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"><img src="/favicon.svg" alt="" className="h-8 w-8" /><span className="font-serif text-lg text-gold-gradient">DC Admin</span></div>
          <div className="flex gap-2"><button onClick={() => { sessionStorage.removeItem("dc_admin"); navigate({ to: "/" }); }} className="text-muted-foreground hover:text-primary" aria-label="Log out"><LogOut className="h-5 w-5" /></button><Link to="/" className="text-muted-foreground hover:text-primary" aria-label="Close admin"><X className="h-5 w-5" /></Link></div>
        </div>
        <nav className="mt-4 flex gap-1 overflow-x-auto lg:mt-8 lg:flex-col">
          {TABS.map(([id, label, Icon]) => (
            <button key={id} onClick={() => setTab(id)} className={`flex shrink-0 items-center gap-2.5 rounded px-3 py-2 text-sm transition ${tab === id ? "bg-primary text-primary-foreground" : "text-sidebar-foreground/70 hover:bg-sidebar-accent"}`}>
              <Icon className="h-4 w-4" />{label}
            </button>
          ))}
        </nav>
        <p className="mt-8 hidden text-[0.7rem] leading-relaxed text-muted-foreground lg:block">Press Esc to exit · Ctrl+Shift+A to open</p>
      </aside>
      <div className="min-w-0 p-4 sm:p-8">
        {alert && <StockAlert onClose={() => setAlert(false)} onManage={() => { setAlert(false); setTab("inventory"); }} />}
        <div key={tab} className="animate-rise">
          {tab === "dashboard" && <Dashboard />}
          {tab === "products" && <ProductsAdmin />}
          {tab === "categories" && <CategoriesAdmin />}
          {tab === "inventory" && <Inventory />}
          {tab === "orders" && <Orders />}
          {tab === "customers" && <Customers />}
          {tab === "settings" && <SettingsAdmin />}
        </div>
      </div>
    </div>
  );
}

function H({ children, action }: { children: string; action?: React.ReactNode }) {
  return <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><h1 className="text-4xl">{children}</h1>{action}</div>;
}

function Confirm({ open, onClose, onYes, text }: { open: boolean; onClose: () => void; onYes: () => void; text: string }) {
  return (
    <AlertDialog open={open} onOpenChange={(o) => !o && onClose()}>
      <AlertDialogContent className="bg-card">
        <AlertDialogHeader><AlertDialogTitle className="font-serif text-2xl">Are you sure?</AlertDialogTitle><AlertDialogDescription>{text}</AlertDialogDescription></AlertDialogHeader>
        <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={onYes} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function Dashboard() {
  const { products, orders, categories } = useStore();
  const revenue = orders.filter((o) => o.status !== "Cancelled").reduce((a, o) => a + o.total, 0);
  const stats = [["Products", products.length], ["Categories", categories.length], ["Orders", orders.length], ["Revenue (demo)", formatINR(revenue)], ["Low stock", products.filter((p) => p.stock < 10).length]];
  return (
    <>
      <H>Dashboard</H>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {stats.map(([l, v]) => <div key={l} className="rounded-lg border bg-card p-5"><div className="eyebrow">{l}</div><div className="mt-2 font-serif text-3xl text-champagne">{v}</div></div>)}
      </div>
      <h2 className="mt-10 mb-3 text-2xl">Recent Orders</h2>
      {orders.length ? <OrderTable limit={5} /> : <p className="text-sm text-muted-foreground">No orders yet.</p>}
    </>
  );
}

const productSchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().min(5).max(1000),
  price: z.number().positive(),
  originalPrice: z.number().positive(),
  category: z.string().min(1),
  stock: z.number().int().min(0),
});
const blank = (cat: string): Product => ({ id: "", slug: "", isActive: true, name: "", description: "", price: 0, originalPrice: 0, images: [], sizes: ["S", "M", "L", "XL"], colors: ["Black"], category: cat, stock: 10, tags: ["new"], rating: 4.5 });
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function ProductsAdmin() {
  const { products, setProducts, categories } = useStore();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [edit, setEdit] = useState<Product | null>(null);
  const [del, setDel] = useState<string | null>(null);
  const list = products.filter((p) => (cat === "all" || p.category === cat) && p.name.toLowerCase().includes(q.toLowerCase()));

  const [busy, setBusy] = useState(false);
  useEffect(() => {
    adminGetProducts().then((list) => { setProducts(list); })
      .catch((e) => toast.error(apiMsg(e, "Could not load products from server")));
  }, []);

  const save = async (p: Product) => {
    const s = (p.slug || slug(p.name)).trim();
    if (p.name.trim().length < 2) return void toast.error("Name is required");
    if (!s) return void toast.error("Slug is required");
    if (!p.description.trim()) return void toast.error("Description is required");
    if (!(p.price >= 0) || !p.price) return void toast.error("Price is required");
    if (!(p.originalPrice >= 0) || !p.originalPrice) return void toast.error("Original price is required");
    if (p.price > p.originalPrice) return void toast.error("Price cannot exceed original price");
    if (!p.images.length) return void toast.error("Add at least one image");
    if (!p.sizes.length) return void toast.error("Add at least one size");
    if (!p.tags.length) return void toast.error("Select at least one tag");
    if (!p.category) return void toast.error("Category is required");
    if (!(p.stock >= 0)) return void toast.error("Stock is required");
    const { id: _i, backendId, rating: _r, slug: _s, ...rest } = p;
    const payload: ProductPayload = { ...rest, name: p.name.trim(), slug: s, description: p.description.trim(), isActive: p.isActive ?? true };
    setBusy(true);
    try {
      if (backendId) { const u = await adminUpdateProduct(backendId, payload); setProducts(products.map((x) => (x.id === p.id ? u : x))); }
      else { const c = await adminCreateProduct(payload); setProducts([c, ...products.filter((x) => x.id !== p.id)]); }
      toast.success("Product saved");
      setEdit(null);
    } catch (e) { toast.error(apiMsg(e, "Could not save product")); }
    finally { setBusy(false); }
  };
  const remove = async (id: string) => {
    const p = products.find((x) => x.id === id);
    try {
      if (p?.backendId) await adminDeleteProduct(p.backendId);
      setProducts(products.filter((x) => x.id !== id)); toast.success("Product deleted");
    } catch (e) { toast.error(apiMsg(e, "Could not delete product")); }
    setDel(null);
  };

  return (
    <>
      <H action={<button onClick={() => setEdit(blank(categories[0]?.id ?? ""))} className="btn-gold"><Plus className="h-4 w-4" />Add Product</button>}>Products</H>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" className="field sm:max-w-xs" />
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="field sm:w-48"><option value="all">All categories</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
      </div>
      <div className="grid gap-3">
        {list.map((p) => (
          <div key={p.id} className="flex items-center gap-4 rounded-lg border bg-card p-3">
            <img src={p.images[0]} alt="" className="h-16 w-14 rounded object-cover" />
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium">{p.name}</div>
              <div className="text-xs text-muted-foreground">{categories.find((c) => c.id === p.category)?.name ?? p.category} · {formatINR(p.price)} · Stock {p.stock}</div>
            </div>
            <button onClick={() => setEdit(p)} className="p-2 hover:text-primary" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
            <button onClick={() => setDel(p.id)} className="p-2 hover:text-destructive" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
        {!list.length && <p className="py-10 text-center text-muted-foreground">No products match.</p>}
      </div>
      {edit && <ProductForm p={edit} busy={busy} onSave={save} onClose={() => setEdit(null)} />}
      <Confirm open={!!del} onClose={() => setDel(null)} text="This product will be permanently removed." onYes={() => del && remove(del)} />
    </>
  );
}

function ProductForm({ p, busy, onSave, onClose }: { p: Product; busy: boolean; onSave: (p: Product) => void; onClose: () => void }) {
  const { categories } = useStore();
  const [f, setF] = useState(p);
  const [imgs, setImgs] = useState<string[]>(p.images);
  const [lists, setLists] = useState({ highlights: (p.highlights ?? []).join("\n"), sizes: p.sizes.join(", "), colors: p.colors.join(", ") });
  const split = (s: string, sep: RegExp) => s.split(sep).map((x) => x.trim()).filter(Boolean);
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-background/70" onClick={onClose}>
      <div role="dialog" aria-label="Product form" onClick={(e) => e.stopPropagation()} className="h-full w-full max-w-lg animate-in slide-in-from-right overflow-y-auto border-l bg-card p-6">
        <div className="mb-5 flex items-center justify-between"><h2 className="text-3xl">{p.id ? "Edit Product" : "New Product"}</h2><button onClick={onClose} aria-label="Close"><X /></button></div>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSave({ ...f, images: imgs, highlights: split(lists.highlights, /\n/), sizes: split(lists.sizes, /,/), colors: split(lists.colors, /,/) }); }}>
          <L t="Name *"><input required className="field" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value, slug: p.backendId ? (f.slug ?? "") : slug(e.target.value) })} maxLength={150} /></L>
          <L t="Slug *"><input required className="field" value={f.slug ?? ""} onChange={(e) => setF({ ...f, slug: slug(e.target.value) })} /></L>
          <L t="Description *"><textarea required className="field" rows={3} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} maxLength={1000} /></L>
          <div className="grid grid-cols-2 gap-3">
            <L t="Price (₹) *"><input required min={0} type="number" className="field" value={f.price || ""} onChange={(e) => setF({ ...f, price: +e.target.value })} /></L>
            <L t="Original price (₹) *"><input required min={0} type="number" className="field" value={f.originalPrice || ""} onChange={(e) => setF({ ...f, originalPrice: +e.target.value })} /></L>
            <L t="Category *"><select required className="field" value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></L>
            <L t="Stock *"><input required min={0} type="number" className="field" value={f.stock} onChange={(e) => setF({ ...f, stock: Math.max(0, +e.target.value) })} /></L>
          </div>
          <L t="Product photos *">
            <div className="grid grid-cols-4 gap-2">
              {imgs.map((src, i) => (
                <div key={i} className="group relative aspect-[4/5] overflow-hidden rounded border">
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  <button type="button" onClick={() => setImgs(imgs.filter((_, j) => j !== i))} className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-background/80 opacity-0 transition group-hover:opacity-100" aria-label="Remove photo"><X className="h-3 w-3" /></button>
                  {i === 0 && <span className="absolute bottom-1 left-1 rounded bg-primary px-1 text-[0.6rem] text-primary-foreground">Cover</span>}
                </div>
              ))}
              <label className="grid aspect-[4/5] cursor-pointer place-items-center rounded border border-dashed text-center text-[0.65rem] text-muted-foreground transition hover:border-primary hover:text-primary">
                <span><ImagePlus className="mx-auto mb-1 h-5 w-5" />Upload from gallery</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={async (e) => { const fl = Array.from(e.target.files ?? []); e.target.value = ""; const out = await Promise.all(fl.map(compress)); setImgs((x) => [...x, ...out]); }} />
              </label>
            </div>
            <input className="field mt-2" placeholder="…or paste an image URL and press Enter" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); const v = e.currentTarget.value.trim(); if (v) { setImgs([...imgs, v]); e.currentTarget.value = ""; } } }} />
          </L>
          <L t="Key highlights (one per line, optional)"><textarea className="field" rows={3} value={lists.highlights} onChange={(e) => setLists({ ...lists, highlights: e.target.value })} /></L>
          <div className="grid grid-cols-2 gap-3">
            {SPEC_FIELDS.map(([k, label]) => (
              <L key={k} t={label}><input className="field" value={(f[k] as string) ?? ""} onChange={(e) => setF({ ...f, [k]: e.target.value })} maxLength={120} /></L>
            ))}
          </div>
          <L t="Sizes (comma separated) *"><input required className="field" value={lists.sizes} onChange={(e) => setLists({ ...lists, sizes: e.target.value })} /></L>
          <L t="Colours (comma separated, optional)"><input className="field" value={lists.colors} onChange={(e) => setLists({ ...lists, colors: e.target.value })} /></L>
          <L t="Tags *">
            <div className="flex gap-4 text-sm">
              {(["trending", "new", "best"] as const).map((t) => (
                <label key={t} className="flex items-center gap-1.5"><input type="checkbox" className="accent-primary" checked={f.tags.includes(t)} onChange={() => setF({ ...f, tags: f.tags.includes(t) ? f.tags.filter((x) => x !== t) : [...f.tags, t] })} />{t}</label>
              ))}
            </div>
          </L>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-primary" checked={f.isActive ?? true} onChange={(e) => setF({ ...f, isActive: e.target.checked })} />Active (visible in shop) *</label>
          <button disabled={busy} className="btn-gold w-full">{busy ? "Saving…" : "Save Product"}</button>
        </form>
      </div>
    </div>
  );
}
/** Resize gallery photos so they fit in browser storage. */
function compress(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onerror = rej;
    r.onload = () => {
      const img = new Image();
      img.onload = () => {
        const sc = Math.min(1, 900 / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = img.width * sc; c.height = img.height * sc;
        c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
        res(c.toDataURL("image/jpeg", 0.75));
      };
      img.onerror = rej;
      img.src = r.result as string;
    };
    r.readAsDataURL(file);
  });
}
function L({ t, children }: { t: string; children: React.ReactNode }) { return <label className="block"><span className="eyebrow mb-1.5 block">{t}</span>{children}</label>; }

function CategoriesAdmin() {
  const { categories, setCategories, products } = useStore();
  const [edit, setEdit] = useState<Category | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [del, setDel] = useState<string | null>(null);
  const save = () => {
    if (!edit || edit.name.trim().length < 2) return void toast.error("Name is required");
    if (isNew) {
      const id = slug(edit.name);
      if (categories.some((c) => c.id === id)) return void toast.error("Category already exists");
      setCategories([...categories, { ...edit, id }]);
    } else setCategories(categories.map((c) => (c.id === edit.id ? edit : c)));
    toast.success("Category saved"); setEdit(null);
  };
  return (
    <>
      <H action={<button onClick={() => { setIsNew(true); setEdit({ id: "", name: "", image: "" }); }} className="btn-gold"><Plus className="h-4 w-4" />Add Category</button>}>Categories</H>
      {edit && (
        <div className="mb-6 grid gap-3 rounded-lg border bg-card p-4 sm:grid-cols-[1fr_2fr_auto_auto]">
          <input className="field" placeholder="Name" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} maxLength={50} />
          <input className="field" placeholder="Image URL" value={edit.image} onChange={(e) => setEdit({ ...edit, image: e.target.value })} />
          <button onClick={save} className="btn-gold">Save</button><button onClick={() => setEdit(null)} className="btn-outline">Cancel</button>
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center gap-3 rounded-lg border bg-card p-3">
            {c.image ? <img src={c.image} alt="" className="h-12 w-12 rounded-full object-cover" /> : <div className="h-12 w-12 rounded-full bg-muted" />}
            <div className="flex-1"><div>{c.name}</div><div className="text-xs text-muted-foreground">{products.filter((p) => p.category === c.id).length} products</div></div>
            <button onClick={() => { setIsNew(false); setEdit(c); }} className="p-2 hover:text-primary" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
            <button onClick={() => setDel(c.id)} className="p-2 hover:text-destructive" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
      <Confirm open={!!del} onClose={() => setDel(null)} text="Products in this category will stay but become uncategorised." onYes={() => { setCategories(categories.filter((c) => c.id !== del)); setDel(null); toast.success("Category deleted"); }} />
    </>
  );
}

function Inventory() {
  const { products, setProducts } = useStore();
  const [filter, setFilter] = useState("all");
  const list = products.filter((p) => filter === "all" || (filter === "low" ? p.stock > 0 && p.stock < 10 : p.stock === 0));
  return (
    <>
      <H action={<select className="field w-auto" value={filter} onChange={(e) => setFilter(e.target.value)}><option value="all">All</option><option value="low">Low stock</option><option value="out">Out of stock</option></select>}>Inventory</H>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full min-w-[520px] text-sm">
          <thead className="bg-card text-left text-xs text-muted-foreground uppercase"><tr><th className="p-3">Product</th><th className="p-3">Status</th><th className="p-3">Stock</th></tr></thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{p.name}</td>
                <td className="p-3"><span className={p.stock === 0 ? "text-destructive" : p.stock < 10 ? "text-primary" : "text-success"}>{p.stock === 0 ? "Out of stock" : p.stock < 10 ? "Low" : "In stock"}</span></td>
                <td className="p-3"><input type="number" min={0} className="field w-24 py-1.5" value={p.stock} onChange={(e) => setProducts(products.map((x) => (x.id === p.id ? { ...x, stock: Math.max(0, +e.target.value || 0) } : x)))} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

const STATUSES: OrderStatus[] = ["Pending payment", "Confirmed", "Shipped", "Delivered", "Cancelled"];
function OrderTable({ limit }: { limit?: number }) {
  const { orders, setOrders } = useStore();
  const [q, setQ] = useState("");
  const [st, setSt] = useState("all");
  const [del, setDel] = useState<string | null>(null);
  const list = orders.filter((o) => (st === "all" || o.status === st) && (o.id + o.customer.name + o.customer.mobile).toLowerCase().includes(q.toLowerCase())).slice(0, limit);
  return (
    <>
      {!limit && (
        <div className="mb-4 flex flex-col gap-2 sm:flex-row">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by ref, name, mobile" className="field sm:max-w-xs" />
          <select value={st} onChange={(e) => setSt(e.target.value)} className="field sm:w-48"><option value="all">All statuses</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
        </div>
      )}
      <div className="grid gap-3">
        {list.map((o) => (
          <div key={o.id} className="rounded-lg border bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div><span className="text-champagne">{o.id}</span> <span className="text-xs text-muted-foreground">· {new Date(o.createdAt).toLocaleString("en-IN")}</span></div>
              <div className="flex items-center gap-2">
                <select value={o.status} onChange={(e) => { setOrders(orders.map((x) => (x.id === o.id ? { ...x, status: e.target.value as OrderStatus } : x))); toast.success("Status updated"); }} className="field w-auto py-1.5 text-xs">{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
                {!limit && <button onClick={() => setDel(o.id)} className="p-2 hover:text-destructive" aria-label="Delete order"><Trash2 className="h-4 w-4" /></button>}
              </div>
            </div>
            <div className="mt-2 text-sm">{o.customer.name} · {o.customer.mobile} · {o.customer.city}</div>
            <div className="mt-1 text-xs text-muted-foreground">{o.items.map((i) => `${i.name} (${i.size}/${i.color}) ×${i.qty}`).join(", ")}</div>
            <div className="mt-2 text-sm">{formatINR(o.total)} · {o.payment}</div>
          </div>
        ))}
        {!list.length && <p className="py-8 text-center text-muted-foreground">No orders found.</p>}
      </div>
      <Confirm open={!!del} onClose={() => setDel(null)} text="This order record will be removed." onYes={() => { setOrders(orders.filter((o) => o.id !== del)); setDel(null); toast.success("Order deleted"); }} />
    </>
  );
}
function Orders() { return <><H>Orders</H><OrderTable /></>; }

function Customers() {
  const { orders } = useStore();
  const list = useMemo(() => {
    const m = new Map<string, { name: string; email: string; mobile: string; city: string; count: number; spent: number }>();
    orders.forEach((o) => {
      const k = o.customer.mobile;
      const c = m.get(k) ?? { ...o.customer, count: 0, spent: 0 };
      c.count++; c.spent += o.total; m.set(k, c);
    });
    return [...m.values()];
  }, [orders]);
  return (
    <>
      <H>Customers / Order Contacts</H>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((c) => (
          <div key={c.mobile} className="rounded-lg border bg-card p-4 text-sm">
            <div className="font-serif text-xl">{c.name}</div>
            <div className="text-muted-foreground">{c.email}<br />{c.mobile} · {c.city}</div>
            <div className="mt-2 text-champagne">{c.count} orders · {formatINR(c.spent)}</div>
          </div>
        ))}
      </div>
      {!list.length && <p className="py-8 text-center text-muted-foreground">Customers appear here after orders are placed.</p>}
    </>
  );
}

function SettingsAdmin() {
  const { settings, setSettings } = useStore();
  const [f, setF] = useState<Settings>(settings);
  const field = (k: keyof Settings, t: string, type = "text") => (
    <L t={t}><input type={type} className="field" value={f[k] as string | number} onChange={(e) => setF({ ...f, [k]: type === "number" ? +e.target.value : e.target.value })} /></L>
  );
  return (
    <>
      <H>Site Content & Settings</H>
      <form className="grid max-w-3xl gap-4 sm:grid-cols-2" onSubmit={(e) => {
        e.preventDefault();
        if (!/^\d{10,15}$/.test(f.whatsapp)) return void toast.error("WhatsApp must be digits with country code, e.g. 919130726736");
        if (!/^[\w.-]+@[\w]+$/.test(f.upiId)) return void toast.error("Enter a valid UPI ID");
        setSettings(f); toast.success("Settings saved");
      }}>
        {field("brand", "Brand name")}{field("tagline", "Tagline")}
        {field("heroTitle", "Hero title")}{field("heroSubtitle", "Hero subtitle")}
        {field("announcement", "Announcement bar")}{field("whatsapp", "WhatsApp number")}
        {field("upiId", "UPI ID")}{field("shippingFee", "Shipping fee (₹)", "number")}
        {field("freeShippingAbove", "Free shipping above (₹)", "number")}
        <L t="Payment QR image">
          <input type="file" accept="image/*" className="field" onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            if (file.size > 500_000) return void toast.error("Please use an image under 500 KB");
            const r = new FileReader(); r.onload = () => setF({ ...f, qrImage: String(r.result) }); r.readAsDataURL(file);
          }} />
          {f.qrImage && <div className="mt-2 flex items-center gap-3"><img src={f.qrImage} alt="QR" className="h-20 w-20 rounded bg-ivory object-contain" /><button type="button" onClick={() => setF({ ...f, qrImage: "" })} className="text-xs text-destructive">Remove</button></div>}
        </L>
        <div className="sm:col-span-2"><button className="btn-gold">Save Settings</button></div>
      </form>
    </>
  );
}

function apiMsg(e: unknown, fb: string) {
  return (e as { response?: { data?: { message?: string } } }).response?.data?.message ?? fb;
}
