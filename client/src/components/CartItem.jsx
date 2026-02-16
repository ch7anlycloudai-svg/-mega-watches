import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../services/api";

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCart();

  return (
    <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm">
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Image */}
        <Link to={`/product/${item._id}`} className="shrink-0">
          <img
            src={item.images[0]}
            alt={item.name}
            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
          />
        </Link>

        {/* Details + Controls */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Link to={`/product/${item._id}`} className="font-bold text-primary hover:text-accent transition-colors text-sm sm:text-base line-clamp-1">
                {item.name}
              </Link>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{item.brand}</p>
              <p className="text-accent font-bold mt-1 text-sm sm:text-base">{formatPrice(item.price)}</p>
            </div>
            {/* Remove */}
            <button
              onClick={() => removeFromCart(item._id)}
              className="text-red-400 hover:text-red-600 transition-colors cursor-pointer shrink-0 p-1"
              title="حذف"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          {/* Quantity + Subtotal */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-primary font-bold transition-colors cursor-pointer text-sm"
              >
                -
              </button>
              <span className="w-8 sm:w-10 text-center font-bold text-primary text-sm">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-primary font-bold transition-colors cursor-pointer text-sm"
              >
                +
              </button>
            </div>
            <div className="text-left">
              <p className="text-xs text-gray-500">المجموع</p>
              <p className="font-bold text-primary text-sm sm:text-base">{formatPrice(item.price * item.quantity)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
