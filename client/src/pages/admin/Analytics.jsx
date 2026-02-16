import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { adminApi } from "../../services/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: "#9ca3af", font: { family: "Cairo" } },
    },
    tooltip: {
      titleFont: { family: "Cairo" },
      bodyFont: { family: "Cairo" },
      backgroundColor: "#1a1a2e",
      borderColor: "rgba(212, 175, 55, 0.2)",
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      ticks: { color: "#6b7280", font: { family: "Cairo" } },
      grid: { color: "rgba(212, 175, 55, 0.05)" },
    },
    y: {
      ticks: { color: "#6b7280", font: { family: "Cairo" } },
      grid: { color: "rgba(212, 175, 55, 0.05)" },
    },
  },
};

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    adminApi.getAnalytics()
      .then((data) => setAnalytics(data))
      .catch(() => setError("خطأ في جلب التحليلات"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  const monthlySalesData = {
    labels: analytics.monthlySales.labels,
    datasets: [
      {
        label: "المبيعات (أوقية)",
        data: analytics.monthlySales.data,
        backgroundColor: "rgba(212, 175, 55, 0.3)",
        borderColor: "#d4af37",
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: "rgba(212, 175, 55, 0.5)",
      },
    ],
  };

  const dailyRevenueData = {
    labels: analytics.dailyRevenue.labels,
    datasets: [
      {
        label: "الإيرادات اليومية (أوقية)",
        data: analytics.dailyRevenue.data,
        borderColor: "#d4af37",
        backgroundColor: "rgba(212, 175, 55, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#d4af37",
        pointBorderColor: "#0f0f1e",
        pointBorderWidth: 3,
        pointRadius: 5,
      },
    ],
  };

  const categoryData = {
    labels: analytics.categoryDistribution.labels,
    datasets: [
      {
        data: analytics.categoryDistribution.data,
        backgroundColor: [
          "rgba(212, 175, 55, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(168, 85, 247, 0.8)",
        ],
        borderColor: "#0f0f1e",
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const orderStatusData = {
    labels: analytics.orderStatus.labels,
    datasets: [
      {
        data: analytics.orderStatus.data,
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(249, 115, 22, 0.8)",
        ],
        borderColor: "#0f0f1e",
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#9ca3af", font: { family: "Cairo" }, padding: 16 },
      },
      tooltip: {
        titleFont: { family: "Cairo" },
        bodyFont: { family: "Cairo" },
        backgroundColor: "#1a1a2e",
        borderColor: "rgba(212, 175, 55, 0.2)",
        borderWidth: 1,
      },
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">التحليلات</h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">إحصائيات وتقارير المتجر</p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Sales */}
        <div className="bg-[#0f0f1e] border border-gold/10 rounded-xl p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold text-white mb-4">المبيعات الشهرية</h3>
          <div className="h-56 sm:h-72">
            <Bar data={monthlySalesData} options={chartDefaults} />
          </div>
        </div>

        {/* Daily Revenue */}
        <div className="bg-[#0f0f1e] border border-gold/10 rounded-xl p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold text-white mb-4">الإيرادات اليومية</h3>
          <div className="h-56 sm:h-72">
            <Line data={dailyRevenueData} options={chartDefaults} />
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-[#0f0f1e] border border-gold/10 rounded-xl p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold text-white mb-4">توزيع الفئات</h3>
          <div className="h-56 sm:h-72">
            <Doughnut data={categoryData} options={doughnutOptions} />
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-[#0f0f1e] border border-gold/10 rounded-xl p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold text-white mb-4">حالة الطلبات</h3>
          <div className="h-56 sm:h-72">
            <Doughnut data={orderStatusData} options={doughnutOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
