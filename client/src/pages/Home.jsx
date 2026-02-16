import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getFeaturedProducts } from "../services/api";

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedProducts().then((data) => {
      setFeatured(data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-primary text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-l from-accent/20 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 md:py-32 relative">
          <div className="max-w-2xl">
            <span className="inline-block bg-accent/20 text-accent px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
              أفضل الساعات العالمية
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight mb-4 sm:mb-6">
              اكتشف عالم
              <br />
              <span className="text-accent">الساعات الفاخرة</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8 leading-relaxed">
              تشكيلة حصرية من أرقى الساعات العالمية. اختر ساعتك المثالية من بين أفضل العلامات التجارية بأسعار تنافسية بالأوقية الموريتانية.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Link
                to="/shop"
                className="bg-accent hover:bg-accent-dark text-primary font-bold px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl transition-colors duration-200 text-sm sm:text-base"
              >
                تسوق الآن
              </Link>
              <Link
                to="/shop"
                className="border-2 border-white/30 hover:border-accent text-white hover:text-accent font-bold px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl transition-colors duration-200 text-sm sm:text-base"
              >
                عرض المجموعة
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative watch illustration */}
        <div className="hidden lg:block absolute left-10 top-1/2 -translate-y-1/2">
          <div className="w-72 h-72 rounded-full border-4 border-accent/30 flex items-center justify-center">
            <div className="w-56 h-56 rounded-full border-2 border-accent/20 flex items-center justify-center">
              <svg className="w-32 h-32 text-accent/40" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "M5 13l4 4L19 7", title: "أصلية 100%", desc: "جميع ساعاتنا أصلية ومضمونة" },
              { icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", title: "شحن مجاني", desc: "توصيل مجاني لجميع الطلبات" },
              { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: "ضمان سنتين", desc: "ضمان شامل على جميع الساعات" },
              { icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z", title: "دفع آمن", desc: "طرق دفع متعددة وآمنة" },
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-4 p-4">
                <div className="shrink-0 w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-primary">{feature.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-primary">منتجات مميزة</h2>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">اكتشف أفضل ساعاتنا المختارة بعناية</p>
            <div className="w-20 h-1 bg-accent mx-auto mt-4 rounded-full" />
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featured.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/shop"
              className="inline-block bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-accent transition-colors duration-200"
            >
              عرض جميع المنتجات
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-primary py-10 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 sm:mb-4">
            اشترك في نشرتنا البريدية
          </h2>
          <p className="text-gray-300 mb-6 sm:mb-8 text-sm sm:text-base">
            كن أول من يعرف عن العروض الحصرية والمنتجات الجديدة
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="بريدك الإلكتروني"
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-accent"
            />
            <button className="bg-accent hover:bg-accent-dark text-primary font-bold px-6 py-3 rounded-xl transition-colors cursor-pointer">
              اشترك
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
