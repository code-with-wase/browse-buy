import { Link, useNavigate } from "@tanstack/react-router";
import { WHATSAPP_NUMBER } from "@/lib/data";
import { Heart, LogOut, Menu, Search, ShoppingBag, User, X, Instagram, Facebook, MessageCircle } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useStore } from "@/lib/store";
import logoImg from "@/assets/logo.png";

export function Logo({ small }: { small?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="Deluxe Culture home">
      <img src={logoImg} alt="Deluxe Culture logo" className={small ? "h-10 w-auto" : "h-12 w-auto"} />
      <div className="leading-none">
        <div className="font-serif text-lg tracking-[0.25em] text-gold-gradient sm:text-xl">DELUXE CULTURE</div>
        <div className="mt-1 text-[0.55rem] tracking-[0.5em] text-muted-foreground">MEN'S WEAR</div>
      </div>
    </Link>
  );
}

const nav = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const { cart, wishlist, user, logout, settings } = useStore();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const count = cart.reduce((a, b) => a + b.qty, 0);
  const [bump, setBump] = useState(false);
  useEffect(() => { if (!count) return; setBump(true); const t = setTimeout(() => setBump(false), 400); return () => clearTimeout(t); }, [count]);

  const doSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/products", search: { q } });
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-gold-gradient py-1.5 text-center text-[0.65rem] tracking-[0.2em] text-primary-foreground uppercase">{settings.announcement}</div>
      <div className="border-b bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-8 lg:flex">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }} className="text-xs tracking-[0.2em] uppercase text-foreground/80 transition-colors hover:text-primary" activeProps={{ className: "text-primary" }}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1 sm:gap-3">
            <form onSubmit={doSearch} className="hidden items-center md:flex">
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" aria-label="Search products" className="field w-40 py-1.5 text-xs" />
            </form>
            <Link to="/products" search={{ wish: true }} className="relative p-2 hover:text-primary" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-primary text-[0.6rem] text-primary-foreground">{wishlist.length}</span>}
            </Link>
            <Link to="/cart" className="relative p-2 hover:text-primary" aria-label="Cart">
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && <span className={`absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-primary text-[0.6rem] text-primary-foreground ${bump ? "animate-pop" : ""}`}>{count}</span>}
            </Link>
            {user ? (
              <button onClick={logout} title={`Signed in as ${user.email} — sign out`} className="hidden items-center gap-1.5 p-2 text-xs hover:text-primary sm:flex">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-gold-gradient text-primary-foreground uppercase">{user.name[0] || user.email[0]}</span>
                <LogOut className="h-4 w-4" />
              </button>
            ) : (
              <Link to="/login" search={{ redirect: "/" }} className="hidden p-2 hover:text-primary sm:block" aria-label="Sign in"><User className="h-5 w-5" /></Link>
            )}
            <button className="p-2 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu className="h-5 w-5" /></button>
          </div>
        </div>
      </div>
      {/* mobile drawer */}
      <div className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`}>
        <div onClick={() => setOpen(false)} className={`absolute inset-0 bg-background/70 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} />
        <aside className={`absolute right-0 top-0 flex h-full w-80 max-w-[85%] flex-col gap-6 border-l bg-card p-6 transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex items-center justify-between"><Logo small /><button onClick={() => setOpen(false)} aria-label="Close menu"><X /></button></div>
          <form onSubmit={doSearch} className="flex gap-2"><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" className="field" /><button className="btn-gold px-3" aria-label="Search"><Search className="h-4 w-4" /></button></form>
          {nav.map((n) => <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="font-serif text-2xl hover:text-primary">{n.label}</Link>)}
          <div className="mt-auto text-sm text-muted-foreground">
            {user ? <button onClick={() => { logout(); setOpen(false); }} className="btn-outline w-full">Sign out ({user.email})</button>
              : <Link to="/login" search={{ redirect: "/" }} onClick={() => setOpen(false)} className="btn-outline w-full">Sign in</Link>}
          </div>
        </aside>
      </div>
    </header>
  );
}

export function Footer() {
  const { settings } = useStore();
  return (
    <footer className="mt-24 border-t bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo />
          <p className="mt-4 font-serif text-xl italic text-champagne">{settings.tagline}</p>
          <div className="mt-5 flex gap-3 text-muted-foreground">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-primary"><Instagram className="h-5 w-5" /></a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-primary"><Facebook className="h-5 w-5" /></a>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="hover:text-primary"><MessageCircle className="h-5 w-5" /></a>
          </div>
        </div>
        <FooterCol title="Shop" links={[["/products", "All Products"], ["/products", "New Arrivals"], ["/cart", "Cart"]]} />
        <FooterCol title="Company" links={[["/about", "About Us"], ["/services", "Services & FAQ"], ["/contact", "Contact"]]} />
        <FooterCol title="Policies" links={[["/privacy", "Privacy Policy"], ["/terms", "Terms & Returns"], ["/services", "Shipping"]]} />
      </div>
      <div className="border-t py-5 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} {settings.brand} — Men's Wear. All rights reserved.</div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <div className="eyebrow mb-4">{title}</div>
      <ul className="space-y-2.5 text-sm text-muted-foreground">
        {links.map(([to, l]) => <li key={l}><Link to={to} className="hover:text-primary">{l}</Link></li>)}
      </ul>
    </div>
  );
}

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { el.classList.add("in"); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

export function SectionTitle({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="mb-10 text-center">
      <div className="eyebrow">{eyebrow}</div>
      <h2 className="mt-3 text-4xl sm:text-5xl">{title}</h2>
      {sub && <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">{sub}</p>}
      <div className="mx-auto mt-5 h-px w-20 bg-gold-gradient" />
    </div>
  );
}

export function PageHero({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <section className="border-b bg-card py-16 text-center sm:py-20">
      <div className="animate-rise px-4">
        <div className="eyebrow">{eyebrow}</div>
        <h1 className="mt-3 text-5xl sm:text-6xl">{title}</h1>
        {sub && <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{sub}</p>}
      </div>
    </section>
  );
}
