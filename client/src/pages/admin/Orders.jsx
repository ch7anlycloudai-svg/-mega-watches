import { useState, useEffect } from "react";
import { adminApi, formatPrice } from "../../services/api";

const statusOptions = ["معلق", "قيد التوصيل", "مكتمل", "ملغى"];

const statusColor = {
  "مكتمل": "bg-green-500/10 text-green-400 border-green-500/20",
  "قيد التوصيل": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "معلق": "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "ملغى": "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await adminApi.getOrders();
      setOrders(data);
    } catch (err) {
      setError("خطأ في جلب الطلبات");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const updated = await adminApi.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map((o) => (o._id === orderId ? updated : o)));
    } catch (err) {
      setError("خطأ في تحديث حالة الطلب");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">الطلبات</h1>
        <p className="text-gray-500 mt-1">{orders.length} طلب</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "الكل", count: orders.length, color: "text-white" },
          { label: "معلق", count: orders.filter((o) => o.status === "معلق").length, color: "text-orange-400" },
          { label: "قيد التوصيل", count: orders.filter((o) => o.status === "قيد التوصيل").length, color: "text-blue-400" },
          { label: "مكتمل", count: orders.filter((o) => o.status === "مكتمل").length, color: "text-green-400" },
        ].map((item) => (
          <div key={item.label} className="bg-[#0f0f1e] border border-gold/10 rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${item.color}`}>{item.count}</p>
            <p className="text-gray-500 text-sm mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-[#0f0f1e] border border-gold/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-gray-500 text-sm border-b border-gold/10">
                <th className="text-right py-4 px-6 font-medium">رقم الطلب</th>
                <th className="text-right py-4 px-6 font-medium">العميل</th>
                <th className="text-right py-4 px-6 font-medium">الهاتف</th>
                <th className="text-right py-4 px-6 font-medium">المبلغ</th>
                <th className="text-right py-4 px-6 font-medium">التاريخ</th>
                <th className="text-right py-4 px-6 font-medium">الحالة</th>
                <th className="text-right py-4 px-6 font-medium">التفاصيل</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <>
                  <tr key={order._id} className="border-b border-gold/5 hover:bg-white/2 transition-colors">
                    <td className="py-4 px-6 text-white font-mono text-sm">#{order._id.slice(-6)}</td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-gray-300">{order.customer}</p>
                        <p className="text-gray-600 text-xs">{order.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-400 text-sm" dir="ltr">{order.phone}</td>
                    <td className="py-4 px-6 text-gold font-semibold">{formatPrice(order.total)}</td>
                    <td className="py-4 px-6 text-gray-400 text-sm">
                      {new Date(order.createdAt).toLocaleDateString("ar-MR")}
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs border bg-transparent focus:outline-none cursor-pointer ${statusColor[order.status] || statusColor["معلق"]}`}
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s} className="bg-[#0f0f1e] text-white">{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                        className="p-2 rounded-lg bg-gold/10 text-gold hover:bg-gold/20 transition-colors"
                      >
                        <svg
                          className={`w-4 h-4 transition-transform ${expandedOrder === order._id ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                  {expandedOrder === order._id && (
                    <tr key={`${order._id}-detail`} className="border-b border-gold/5">
                      <td colSpan={7} className="py-4 px-6 bg-[#0a0a14]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-gray-500 text-sm mb-2">العنوان</p>
                            <p className="text-gray-300">{order.city}، {order.address}</p>
                            {order.notes && (
                              <p className="text-gray-500 text-sm mt-2">ملاحظات: {order.notes}</p>
                            )}
                          </div>
                          <div>
                            <p className="text-gray-500 text-sm mb-2">المنتجات</p>
                            <div className="space-y-2">
                              {order.items.map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm">
                                  {item.image && (
                                    <img src={item.image} alt="" className="w-10 h-10 rounded object-cover" />
                                  )}
                                  <span className="text-gray-300 flex-1">{item.name} x{item.quantity}</span>
                                  <span className="text-gold">{formatPrice(item.price * item.quantity)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
