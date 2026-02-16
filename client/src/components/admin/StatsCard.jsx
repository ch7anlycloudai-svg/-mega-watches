export default function StatsCard({ title, value, icon, color, iconColor }) {
  return (
    <div className="bg-[#0f0f1e] border border-gold/10 rounded-xl p-6 hover:border-gold/20 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center ${iconColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
