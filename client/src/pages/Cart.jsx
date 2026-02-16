import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";
import { formatPrice } from "../services/api";

const Cart = () => {
  const { cart, cartTotal, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
        <h2 className="text-2xl font-bold text-primary">سلة التسوق فارغة</h2>
        <p className="text-gray-500">لم تقم بإضافة أي منتجات بعد</p>
        <Link
          to="/shop"
          className="mt-4 bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-accent transition-colors"
        >
          تصفح المنتجات
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-light min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-extrabold text-primary">سلة التسوق</h1>
          <button
            onClick={clearCart}
            className="text-red-400 hover:text-red-600 text-sm font-medium transition-colors cursor-pointer"
          >
            إفراغ السلة
          </button>
        </div>

        {/* Cart Items */}
        <div className="space-y-4 mb-8">
          {cart.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-primary text-lg mb-4">ملخص الطلب</h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">المجموع الفرعي</span>
              <span className="font-medium text-primary">{formatPrice(cartTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">الشحن</span>
              <span className="font-medium text-green-600">مجاني</span>
            </div>
            <div className="border-t pt-3 flex justify-between">
              <span className="font-bold text-primary text-lg">الإجمالي</span>
              <span className="font-extrabold text-accent text-xl">{formatPrice(cartTotal)}</span>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              to="/checkout"
              className="flex-1 bg-accent hover:bg-accent-dark text-primary font-bold py-3 rounded-xl text-center transition-colors"
            >
              إتمام الشراء
            </Link>
            <Link
              to="/shop"
              className="flex-1 border-2 border-primary text-primary font-bold py-3 rounded-xl text-center hover:bg-primary hover:text-white transition-colors"
            >
              متابعة التسوق
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
