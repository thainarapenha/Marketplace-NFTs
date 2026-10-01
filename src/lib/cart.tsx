import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { Nft } from "@/types/nft";
import type { CartItem } from "@/types/cart";

interface CartContextValue {
  items: CartItem[];
  addItem: (nft: Nft, edition: string, quantity?: number) => void;
  updateQuantity: (nftId: string, edition: string, quantity: number) => void;
  removeItem: (nftId: string, edition: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (
    nft: Nft,
    edition: string,
    quantity = 1,
  ) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) =>
          item.nft.id === nft.id &&
          item.edition === edition,
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.nft.id === nft.id &&
          item.edition === edition
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item,
        );
      }

      return [
        ...currentItems,
        {
          nft,
          edition,
          quantity,
        },
      ];
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
        item.nft.id === nftId &&
        item.edition === edition
          ? { ...item, quantity }
          : item,
      ),
    );
  };

  const removeItem = (
    nftId: string,
    edition: string,
  ) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) =>
          !(
            item.nft.id === nftId &&
            item.edition === edition
          ),
      ),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const value = useMemo(
    () => ({
      items,
      addItem,
      updateQuantity,
      removeItem,
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