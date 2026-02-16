import { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext();

const getInitialCart = () => {
  try {
    const saved = localStorage.getItem("watch-store-cart");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existing = state.find((item) => item._id === action.payload._id);
      if (existing) {
        return state.map((item) =>
          item._id === action.payload._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    }
    case "REMOVE_FROM_CART":
      return state.filter((item) => item._id !== action.payload);
    case "UPDATE_QUANTITY":
      if (action.payload.quantity <= 0) {
        return state.filter((item) => item._id !== action.payload._id);
      }
      return state.map((item) =>
        item._id === action.payload._id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
    case "CLEAR_CART":
      return [];
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, [], getInitialCart);

  useEffect(() => {
    localStorage.setItem("watch-store-cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    dispatch({ type: "ADD_TO_CART", payload: product });
  };

  const removeFromCart = (_id) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: _id });
  };

  const updateQuantity = (_id, quantity) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { _id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
