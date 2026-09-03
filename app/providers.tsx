"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { fetchCart } from "../lib/cart-client";
import { toCartItems } from "../lib/customer-data";
import { hydrateAuth } from "../store/authSlice";
import { hydrateCart } from "../store/cartSlice";
import { makeStore, AppStore } from "../store/store";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [store] = useState<AppStore>(() => makeStore());

  useEffect(() => {
    try {
      localStorage.removeItem("mira-user");
      const cart = JSON.parse(localStorage.getItem("mira-cart") ?? "[]");
      const auth = JSON.parse(
        localStorage.getItem("mira-auth") ??
          '{"user":null,"token":null}',
      );
      store.dispatch(hydrateCart(cart));
      store.dispatch(hydrateAuth(auth));
      localStorage.removeItem("mira-orders");

      if (auth.token) {
        void fetchCart(auth.token)
          .then((serverCart) => store.dispatch(hydrateCart(toCartItems(serverCart))))
          .catch(() => store.dispatch(hydrateAuth({ user: null, token: null })));
      }
    } catch {
      store.dispatch(hydrateCart([]));
      store.dispatch(hydrateAuth({ user: null, token: null }));
    }

    return store.subscribe(() => {
      const state = store.getState();
      localStorage.setItem("mira-cart", JSON.stringify(state.cart.items));
      localStorage.setItem(
        "mira-auth",
        JSON.stringify({ user: state.auth.user, token: state.auth.token }),
      );
    });
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
