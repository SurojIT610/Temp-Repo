import React, { createContext, useContext, useReducer } from "react";

// Initial state
const initialState = {
  items: [], // Array of items in the cart
};

// Actions
const ADD_TO_CART = "ADD_TO_CART";
const REMOVE_FROM_CART = "REMOVE_FROM_CART";
const UPDATE_ITEM_QUANTITY = "UPDATE_ITEM_QUANTITY";

// Reducer function
const cartReducer = (state, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const { _id, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item._id === _id
      );

      if (existingItemIndex > -1) {
        // Item already exists, update quantity
        return {
          ...state,
          items: state.items.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      } else {
        // New item, add to cart
        return {
          ...state,
          items: [...state.items, action.payload],
        };
      }

    case REMOVE_FROM_CART:
      return {
        ...state,
        items: state.items.filter((item) => item._id !== action.payload),
      };

    case UPDATE_ITEM_QUANTITY:
      const { itemId, newQuantity } = action.payload;
      return {
        ...state,
        items: state.items.map((item) =>
          item._id === itemId
            ? { ...item, quantity: Math.max(newQuantity, 1) } // Ensure quantity is at least 1
            : item
        ),
      };

    default:
      return state;
  }
};

// Create context
const CartContext = createContext();

// Provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (item, quantity) => {
    dispatch({ type: ADD_TO_CART, payload: { ...item, quantity } });
  };

  const removeFromCart = (_id) => {
    dispatch({ type: REMOVE_FROM_CART, payload: _id });
  };

  const updateItemQuantity = (_id, newQuantity) => {
    dispatch({
      type: UPDATE_ITEM_QUANTITY,
      payload: { itemId: _id, newQuantity },
    });
  };

  const getTotalPrice = () => {
    return state.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addToCart,
        removeFromCart,
        updateItemQuantity,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for using cart context
export const useCart = () => useContext(CartContext);
