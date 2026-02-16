import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);
    if (result.success) {
      navigate("/admin");
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center p-4 font-cairo" dir="rtl">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gold/3 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 border border-gold/20 mb-4">
            <svg className="w-8 h-8 text-gold" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">ساعات الأناقة</h1>
          <p className="text-gray-500 mt-1">لوحة تحكم الإدارة</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#0f0f1e] border border-gold/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6">تسجيل الدخول</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-400 mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1a1a2e] border border-gold/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gold/40 transition-colors"
                placeholder="admin@watches.mr"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1a1a2e] border border-gold/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gold/40 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-l from-gold to-gold-light text-black font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "جاري الدخول..." : "دخول"}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gold/5 rounded-lg border border-gold/10">
            <p className="text-xs text-gray-500 mb-1">بيانات الدخول التجريبية:</p>
            <p className="text-xs text-gray-400">admin@watches.mr / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
