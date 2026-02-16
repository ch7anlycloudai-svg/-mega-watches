import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../services/api";

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCart();

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
      {/* Image */}
      <Link to={`/product/${item._id}`} className="shrink-0">
        <img
          src={item.images[0]}
          alt={item.name}
          className="w-24 h-24 object-cover rounded-lg"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 text-center sm:text-right">
        <Link to={`/product/${item._id}`} className="font-bold text-primary hover:text-accent transition-colors">
          {item.name}
        </Link>
        <p className="text-sm text-gray-500 mt-1">{item.brand}</p>
        <p className="text-accent font-bold mt-1">{formatPrice(item.price)}</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(item._id, item.quantity - 1)}
          className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-primary font-bold transition-colors cursor-pointer"
        >
          -
        </button>
        <span className="w-10 text-center font-bold text-primary">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item._id, item.quantity + 1)}
          className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-primary font-bold transition-colors cursor-pointer"
        >
          +
        </button>
      </div>

      {/* Subtotal */}
      <div className="text-center min-w-[120px]">
        <p className="text-sm text-gray-500">المجموع</p>
        <p className="font-bold text-primary">{formatPrice(item.price * item.quantity)}</p>
      </div>

      {/* Remove */}
      <button
        onClick={() => removeFromCart(item._id)}
        className="text-red-400 hover:text-red-600 transition-colors cursor-pointer"
        title="حذف"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
};

export default CartItem;
