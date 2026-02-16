import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice, createOrder } from "../services/api";

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "نواكشوط",
    notes: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const orderData = {
        customer: form.name,
        phone: form.phone,
        city: form.city,
        address: form.address,
        notes: form.notes,
        items: cart.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.images?.[0] || "",
        })),
      };

      await createOrder(orderData);
      setSubmitted(true);
      clearCart();
    } catch (err) {
      setError(err.message || "حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0 && !submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
        <h2 className="text-2xl font-bold text-primary">لا توجد منتجات للدفع</h2>
        <Link
          to="/shop"
          className="mt-4 bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-accent transition-colors"
        >
          تصفح المنتجات
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-2">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-primary">تم إرسال طلبك بنجاح!</h2>
        <p className="text-gray-500 text-center max-w-md">
          شكراً لك {form.name}. سنتواصل معك على الرقم {form.phone} لتأكيد الطلب.
        </p>
        <Link
          to="/"
          className="mt-4 bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-accent transition-colors"
        >
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-light min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-extrabold text-primary mb-8">إتمام الشراء</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-primary text-lg mb-6">معلومات التوصيل</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الاسم الكامل <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="محمد أحمد"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    رقم الهاتف <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+222 XX XX XX XX"
                    dir="ltr"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-accent text-left"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    المدينة <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-accent bg-white"
                  >
                    <option value="نواكشوط">نواكشوط</option>
                    <option value="نواذيبو">نواذيبو</option>
                    <option value="روصو">روصو</option>
                    <option value="كيفة">كيفة</option>
                    <option value="أطار">أطار</option>
                    <option value="زويرات">زويرات</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    العنوان <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={form.address}
                    onChange={handleChange}
                    placeholder="الحي، الشارع، رقم المنزل"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ملاحظات إضافية
                </label>
                <textarea
                  name="notes"
                  rows="3"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="أي تعليمات خاصة بالتوصيل..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-accent resize-none"
                />
              </div>

              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-6 bg-accent hover:bg-accent-dark text-primary font-bold py-3.5 rounded-xl text-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                {submitting ? "جاري إرسال الطلب..." : "تأكيد الطلب"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-20">
              <h3 className="font-bold text-primary text-lg mb-4">ملخص الطلب</h3>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item._id} className="flex items-center gap-3">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded-lg shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-primary truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">الكمية: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-primary shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t mt-4 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">المجموع الفرعي</span>
                  <span className="font-medium">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">الشحن</span>
                  <span className="font-medium text-green-600">مجاني</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-bold text-primary text-lg">الإجمالي</span>
                  <span className="font-extrabold text-accent text-xl">{formatPrice(cartTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
