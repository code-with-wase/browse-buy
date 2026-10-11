import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useStore } from "@/lib/store";
import { loginApi } from "@/axios/axiosInstance";

export const Route = createFileRoute("/login")({
  validateSearch: z.object({ redirect: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Sign In — Deluxe Culture" },
      { name: "description", content: "Sign in with your email to complete your purchase." },
      { property: "og:title", content: "Sign In — Deluxe Culture" },
      { property: "og:description", content: "Sign in with your email to buy from Deluxe Culture." },
    ],
  }),
  component: Login,
});

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.string().trim().email("Please enter a valid email").max(255),
});

function Login() {
  const { redirect } = Route.useSearch();
  const { user, login, ready } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "" });
  const [err, setErr] = useState<Partial<Record<string, string>>>({});
  // only allow internal paths
  const dest = redirect && redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/";

  useEffect(() => { if (ready && user) navigate({ to: dest, replace: true }); }, [ready, user]);

  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) { setErr(Object.fromEntries(r.error.issues.map((i) => [i.path[0], i.message]))); return; }
    setBusy(true);
    try {
      const res = await loginApi(r.data.name, r.data.email.toLowerCase());
      if (res.token) localStorage.setItem("dc_token", res.token);
      login({ name: res.user?.name ?? r.data.name, email: (res.user?.email ?? r.data.email).toLowerCase() });
    } catch (ex: unknown) {
      const msg = (ex as { response?: { data?: { message?: string } } }).response?.data?.message;
      if (msg) { setBusy(false); toast.error(msg); return; }
      login({ name: r.data.name, email: r.data.email.toLowerCase() }); // server unreachable — continue offline
    }
    setBusy(false);
    toast.success(`Welcome, ${r.data.name}`);
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <div className="rounded-lg border bg-card p-8 shadow-gold">
        <Mail className="h-8 w-8 text-primary" strokeWidth={1.3} />
        <h1 className="mt-4 text-4xl">Sign in to Buy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Browsing is open to everyone. To place an order, please sign in with your email.</p>
        <form onSubmit={submit} className="mt-7 space-y-4" noValidate>
          <div>
            <label htmlFor="name" className="eyebrow">Full name</label>
            <input id="name" className="field mt-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={80} />
            {err["name"] && <p className="mt-1 text-xs text-destructive">{err["name"]}</p>}
          </div>
          <div>
            <label htmlFor="email" className="eyebrow">Email address</label>
            <input id="email" type="email" className="field mt-2" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={255} />
            {err["email"] && <p className="mt-1 text-xs text-destructive">{err["email"]}</p>}
          </div>
          <button disabled={busy} className="btn-gold w-full">{busy ? "Signing in…" : "Continue"}</button>
        </form>
        <Link to="/products" className="mt-5 block text-center text-xs tracking-widest text-primary uppercase">Keep browsing</Link>
      </div>
    </div>
  );
}
