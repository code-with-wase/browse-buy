import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import type { CartItem } from "./data";
import { useStore } from "./store";

/** Buying requires email sign-in. Browsing does not. */
export function useBuyNow() {
  const { setCheckout, user } = useStore();
  const navigate = useNavigate();
  return (item: CartItem) => {
    setCheckout({ mode: "buynow", item });
    if (!user) {
      toast("Please sign in with your email to continue");
      navigate({ to: "/login", search: { redirect: "/checkout" } });
    } else navigate({ to: "/checkout" });
  };
}

export function useProceedCheckout() {
  const { setCheckout, user } = useStore();
  const navigate = useNavigate();
  return () => {
    setCheckout({ mode: "cart" });
    if (!user) navigate({ to: "/login", search: { redirect: "/checkout" } });
    else navigate({ to: "/checkout" });
  };
}
