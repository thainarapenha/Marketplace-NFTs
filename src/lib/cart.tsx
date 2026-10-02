import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { Nft } from "@/types/nft";
import type { CartItem } from "@/types/cart";
import { useAuth } from "@/lib/auth";

interface CartContextValue {
  items: CartItem[];
  addItem: (nft: Nft, edition: string, quantity?: number) => void;
  updateQuantity: (nftId: string, edition: string, quantity: number) => void;
  removeItem: (nftId: string, edition: string) => void;
  removeQuantities: (purchases: { nftId: string; edition: string; quantity: number }[]) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

interface CartProviderProps {
  children: ReactNode;
}

const getCartStorageKey = (userId: string) => `marketplace-cart-${userId}`;

const getStoredCart = (userId: string): CartItem[] => {
  const storedCart = localStorage.getItem(getCartStorageKey(userId));

  if (!storedCart) {
    return [];
  }

  try {
    return JSON.parse(storedCart) as CartItem[];
  } catch {
    localStorage.removeItem(getCartStorageKey(userId));
    return [];
  }
};

export const CartProvider = ({ children }: CartProviderProps) => {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [items, setItems] = useState<CartItem[]>([]);
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!isAuthenticated || !user) {
      setLoadedUserId(null);
      setItems([]);
      return;
    }

    setLoadedUserId(user.id);
    setItems(getStoredCart(user.id));
  }, [isAuthenticated, isAuthLoading, user]);

  useEffect(() => {
    if (
      isAuthLoading ||
      !isAuthenticated ||
      !user ||
      loadedUserId !== user.id
    ) {
      return;
    }

    localStorage.setItem(
      getCartStorageKey(user.id),
      JSON.stringify(items),
    );
  }, [items, isAuthenticated, isAuthLoading, loadedUserId, user]);

  const addItem = (nft: Nft, edition: string, quantity = 1) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.nft.id === nft.id && item.edition === edition,
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.nft.id === nft.id && item.edition === edition
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      return [...currentItems, { nft, edition, quantity }];
    });
  };

  const updateQuantity = (
    nftId: string,
    edition: string,
    quantity: number,
  ) => {
    if (quantity < 1) return;

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.nft.id === nftId && item.edition === edition
          ? { ...item, quantity }
          : item,
      ),
    );
  };

  const removeItem = (nftId: string, edition: string) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) => !(item.nft.id === nftId && item.edition === edition),
      ),
    );
  };

  const removeQuantities = (
    purchases: { nftId: string; edition: string; quantity: number }[],
  ) => {
    setItems((currentItems) =>
      currentItems.flatMap((item) => {
        const purchase = purchases.find(
          (entry) =>
            entry.nftId === item.nft.id && entry.edition === item.edition,
        );

        if (!purchase || item.quantity > purchase.quantity) {
          return purchase
            ? [{ ...item, quantity: item.quantity - purchase.quantity }]
            : [item];
        }

        return [];
      }),
    );
  };

  const clearCart = () => setItems([]);

  const value = useMemo(
    () => ({
      items,
      addItem,
      updateQuantity,
      removeItem,
      removeQuantities,
      clearCart,
    }),
    [items],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
};
