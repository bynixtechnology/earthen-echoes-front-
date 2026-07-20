import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem('userCart');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Error reading localStorage", error);
      return [];
    }
  });

  // 2. Sync State with LocalStorage: Jab bhi cartItems change ho, save kar do
  useEffect(() => {
    localStorage.setItem('userCart', JSON.stringify(cartItems));
  }, [cartItems]);

  // 3. Add to Cart Logic (Jitni baar click, utni baar add)
  const addToCart = (product, quantityToAdd = 1) => {
    setCartItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(item => item._id === product._id);

      if (existingItemIndex !== -1) {
        // If exists, increment its quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantityToAdd;
        return updatedItems;
      } else {
        // If new, push to array with initial quantity
        return [...prevItems, { ...product, quantity: quantityToAdd }];
      }
    });
  };

  // 4. Update specific item quantity (from Cart Page + / - buttons)
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prevItems => 
      prevItems.map(item => item._id === id ? { ...item, quantity: newQuantity } : item)
    );
  };

  // 5. Remove Item
  const removeFromCart = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== id));
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity 
    }}>
      {children}
    </CartContext.Provider>
  );
};