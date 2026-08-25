import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Product } from '@/data/products';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: { [key: string]: string };
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity: number, variant?: { [key: string]: string }) => void;
  removeItem: (productId: string, variant?: { [key: string]: string }) => void;
  updateQuantity: (productId: string, quantity: number, variant?: { [key: string]: string }) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('sands_cart');
      if (storedCart) {
        setItems(JSON.parse(storedCart));
      }
    } catch (e) {
      console.error('Failed to load cart from local storage', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('sands_cart', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const addItem = (product: Product, quantity: number, variant?: { [key: string]: string }) => {
    setItems(prev => {
      const existingItemIndex = prev.findIndex(item => 
        item.product.id === product.id && 
        JSON.stringify(item.selectedVariant) === JSON.stringify(variant)
      );

      if (existingItemIndex > -1) {
        const newItems = [...prev];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      }

      return [...prev, { product, quantity, selectedVariant: variant }];
    });
    showToast(`${product.name} added to cart`);
  };

  const removeItem = (productId: string, variant?: { [key: string]: string }) => {
    setItems(prev => prev.filter(item => 
      !(item.product.id === productId && JSON.stringify(item.selectedVariant) === JSON.stringify(variant))
    ));
  };

  const updateQuantity = (productId: string, quantity: number, variant?: { [key: string]: string }) => {
    setItems(prev => prev.map(item => {
      if (item.product.id === productId && JSON.stringify(item.selectedVariant) === JSON.stringify(variant)) {
        return { ...item, quantity: Math.max(1, quantity) };
      }
      return item;
    }));
  };

  const clearCart = () => setItems([]);

  const getItemCount = () => items.reduce((total, item) => total + item.quantity, 0);

  const getSubtotal = () => items.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, getItemCount, getSubtotal }}>
      {children}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#333',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '4px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 9999,
          fontFamily: "var(--font-body)",
          fontSize: '14px',
          animation: 'fadeIn 0.3s ease-in-out'
        }}>
          {toastMessage}
        </div>
      )}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
