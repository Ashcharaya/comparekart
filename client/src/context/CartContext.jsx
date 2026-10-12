import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('comparekart_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [budgetLimit, setBudgetLimit] = useState(() => {
    const saved = localStorage.getItem('comparekart_budget_limit');
    return saved ? Number(saved) : null;
  });

  // Sync cart from backend when logged in
  useEffect(() => {
    const fetchBackendCart = async () => {
      if (isAuthenticated) {
        try {
          const res = await api.get('/cart');
          if (res.data?.cart?.items) {
            const mapped = res.data.cart.items.map(item => ({
              _id: item._id,
              product: item.product,
              quantity: item.quantity,
              selectedColor: item.selectedColor,
              selectedSize: item.selectedSize
            }));
            setCartItems(mapped);
          }
        } catch (err) {
          console.warn('Could not sync cart from backend:', err.message);
        }
      }
    };

    fetchBackendCart();
  }, [isAuthenticated]);

  // Persist cart items to localStorage
  useEffect(() => {
    localStorage.setItem('comparekart_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Persist budget limit
  useEffect(() => {
    if (budgetLimit) {
      localStorage.setItem('comparekart_budget_limit', budgetLimit.toString());
    } else {
      localStorage.removeItem('comparekart_budget_limit');
    }
  }, [budgetLimit]);

  // Add to cart
  const addToCart = async (product, quantity = 1, selectedColor = '', selectedSize = '') => {
    if (isAuthenticated) {
      try {
        const res = await api.post('/cart', {
          productId: product._id,
          quantity,
          selectedColor,
          selectedSize
        });
        if (res.data?.cart?.items) {
          setCartItems(res.data.cart.items);
          return;
        }
      } catch (err) {
        console.error('Add to backend cart failed:', err);
      }
    }

    // Local cart fallback/state update
    setCartItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.product._id === product._id &&
                item.selectedColor === selectedColor &&
                item.selectedSize === selectedSize
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += Number(quantity);
        return updated;
      } else {
        return [
          ...prev,
          {
            _id: `item-${Date.now()}-${Math.random()}`,
            product,
            quantity: Number(quantity),
            selectedColor,
            selectedSize
          }
        ];
      }
    });
  };

  // Update item quantity
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    if (isAuthenticated) {
      try {
        const res = await api.put(`/cart/${itemId}`, { quantity: newQuantity });
        if (res.data?.cart?.items) {
          setCartItems(res.data.cart.items);
          return;
        }
      } catch (err) {
        console.error('Update backend cart item failed:', err);
      }
    }

    setCartItems(prev =>
      prev.map(item =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove single item
  const removeFromCart = async (itemId) => {
    if (isAuthenticated) {
      try {
        const res = await api.delete(`/cart/${itemId}`);
        if (res.data?.cart?.items) {
          setCartItems(res.data.cart.items);
          return;
        }
      } catch (err) {
        console.error('Remove backend cart item failed:', err);
      }
    }

    setCartItems(prev => prev.filter(item => item._id !== itemId));
  };

  // Clear all items
  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await api.delete('/cart');
      } catch (err) {
        console.error('Clear backend cart failed:', err);
      }
    }
    setCartItems([]);
  };

  // Price computations
  const cartSubtotal = cartItems.reduce((acc, item) => {
    const originalPrice = item.product?.oldPrice || item.product?.price || 0;
    return acc + originalPrice * item.quantity;
  }, 0);

  const cartActualTotal = cartItems.reduce((acc, item) => {
    const salePrice = item.product?.price || 0;
    return acc + salePrice * item.quantity;
  }, 0);

  const cartDiscount = cartSubtotal - cartActualTotal;
  const deliveryFee = cartActualTotal > 999 || cartActualTotal === 0 ? 0 : 99;
  const finalTotal = cartActualTotal + deliveryFee;

  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Budget exceeded check
  const isOverBudget = budgetLimit !== null && finalTotal > budgetLimit;
  const budgetDifference = budgetLimit !== null ? finalTotal - budgetLimit : 0;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartDiscount,
        deliveryFee,
        cartTotal: finalTotal,
        cartCount: totalItemCount,
        budgetLimit,
        setBudgetLimit,
        isOverBudget,
        budgetDifference
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
