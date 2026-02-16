import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminApi, formatPrice } from "../../services/api";
import StatsCard from "../../components/admin/StatsCard";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, ordersData] = await Promise.all([
          adminApi.getStats(),
          adminApi.getOrders(),
        ]);
        setStats(statsData);
        setRecentOrders(ordersData.slice(0, 4));
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      title: "إجمالي المنتجات",
      value: stats.totalProducts,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: "from-blue-500/20 to-blue-600/10",
      iconColor: "text-blue-400",
    },
    {
      title: "إجمالي الطلبات",
      value: stats.totalOrders,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: "from-green-500/20 to-green-600/10",
      iconColor: "text-green-400",
    },
    {
      title: "إجمالي الإيرادات",
      value: formatPrice(stats.totalRevenue),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "from-gold/20 to-gold/10",
      iconColor: "text-gold",
    },
    {
      title: "طلبات معلقة",
      value: stats.pendingOrders,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "from-orange-500/20 to-orange-600/10",
      iconColor: "text-orange-400",
    },
  ];

  const statusColor = {
    "مكتمل": "bg-green-500/10 text-green-400 border-green-500/20",
    "قيد التوصيل": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "معلق": "bg-orange-500/10 text-orange-400 border-orange-500/20",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">لوحة التحكم</h1>
        <p className="text-gray-500 mt-1">نظرة عامة على المتجر</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <StatsCard key={i} {...card} />
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-[#0f0f1e] border border-gold/10 rounded-xl overflow-hidden">
        <div className="p-6 flex items-center justify-between border-b border-gold/10">
          <h3 className="text-lg font-bold text-white">آخر الطلبات</h3>
          <Link to="/admin/orders" className="text-gold text-sm hover:underline">
            عرض الكل
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-gray-500 text-sm border-b border-gold/5">
                <th className="text-right py-3 px-6 font-medium">رقم الطلب</th>
                <th className="text-right py-3 px-6 font-medium">العميل</th>
                <th className="text-right py-3 px-6 font-medium">المبلغ</th>
                <th className="text-right py-3 px-6 font-medium">الحالة</th>
                <th className="text-right py-3 px-6 font-medium">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id} className="border-b border-gold/5 hover:bg-white/2 transition-colors">
                  <td className="py-4 px-6 text-white font-mono text-sm">#{order._id.slice(-6)}</td>
                  <td className="py-4 px-6 text-gray-300">{order.customer}</td>
                  <td className="py-4 px-6 text-gold font-semibold">{formatPrice(order.total)}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs border ${statusColor[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-400 text-sm">
                    {new Date(order.createdAt).toLocaleDateString("ar-MR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
