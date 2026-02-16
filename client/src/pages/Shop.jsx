import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { getProducts, getCategories } from "../services/api";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [priceRange, setPriceRange] = useState([0, 700000]);
  const [sortBy, setSortBy] = useState("default");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProducts(), getCategories()]).then(([prods, cats]) => {
      setProducts(prods);
      setFiltered(prods);
      setCategories(cats);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let result = [...products];

    if (selectedCategory !== "الكل") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    setFiltered(result);
  }, [selectedCategory, priceRange, sortBy, products]);

  return (
    <div className="bg-light min-h-screen">
      {/* Header */}
      <div className="bg-primary py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-white">المتجر</h1>
          <p className="text-gray-300 mt-2">تصفح مجموعتنا الكاملة من الساعات</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-20">
              <h3 className="font-bold text-primary text-lg mb-4">التصفية</h3>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-semibold text-primary mb-3">الفئات</h4>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`block w-full text-right px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-accent text-primary font-bold"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-semibold text-primary mb-3">نطاق السعر</h4>
                <input
                  type="range"
                  min="0"
                  max="700000"
                  step="5000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                  className="w-full accent-accent"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0 أوقية</span>
                  <span>{priceRange[1].toLocaleString("ar-MR")} أوقية</span>
                </div>
              </div>

              {/* Sort */}
              <div>
                <h4 className="font-semibold text-primary mb-3">الترتيب</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-accent bg-white"
                >
                  <option value="default">الافتراضي</option>
                  <option value="price-asc">السعر: من الأقل</option>
                  <option value="price-desc">السعر: من الأعلى</option>
                  <option value="rating">التقييم</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-500 text-sm">
                عرض <span className="font-bold text-primary">{filtered.length}</span> منتج
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-gray-500 text-lg">لا توجد منتجات مطابقة</p>
                <button
                  onClick={() => {
                    setSelectedCategory("الكل");
                    setPriceRange([0, 700000]);
                    setSortBy("default");
                  }}
                  className="mt-4 text-accent hover:underline font-semibold cursor-pointer"
                >
                  إعادة تعيين الفلاتر
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
