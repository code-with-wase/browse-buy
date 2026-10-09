<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Store data (products, cart, orders, settings, sign-in) lives in src/lib/store.tsx backed by localStorage — frontend-only demo until a backend is added.
- Buying (Buy Now / checkout) requires email sign-in; browsing never does — enforced in src/lib/useBuyNow.ts and the checkout page.
