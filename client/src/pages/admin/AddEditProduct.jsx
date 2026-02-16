import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminApi } from "../../services/api";

const categoriesList = ["فاخرة", "رياضية", "كلاسيكية", "ذكية"];

export default function AddEditProduct() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    nameEn: "",
    brand: "",
    price: "",
    oldPrice: "",
    description: "",
    category: "فاخرة",
    features: "",
    inStock: true,
    featured: false,
    images: [""],
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      adminApi.getProduct(id)
        .then((product) => {
          if (product) {
            setForm({
              name: product.name || "",
              nameEn: product.nameEn || "",
              brand: product.brand || "",
              price: product.price || "",
              oldPrice: product.oldPrice || "",
              description: product.description || "",
              category: product.category || "فاخرة",
              features: (product.features || []).join("، "),
              inStock: product.inStock !== false,
              featured: product.featured || false,
              images: product.images?.length ? product.images : [""],
            });
          }
        })
        .catch(() => setError("خطأ في جلب بيانات المنتج"))
        .finally(() => setFetching(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...form.images];
    newImages[index] = value;
    setForm((prev) => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setForm((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

  const removeImageField = (index) => {
    if (form.images.length === 1) return;
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const productData = {
        ...form,
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        features: form.features.split("،").map((f) => f.trim()).filter(Boolean),
        images: form.images.filter(Boolean),
        rating: 0,
      };

      if (isEdit) {
        await adminApi.updateProduct(id, productData);
      } else {
        await adminApi.createProduct(productData);
      }

      navigate("/admin/products");
    } catch (err) {
      setError(err.message || "خطأ في حفظ المنتج");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/products")}
          className="p-2 rounded-lg bg-[#1a1a2e] text-gray-400 hover:text-gold transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">
            {isEdit ? "تعديل المنتج" : "إضافة منتج جديد"}
          </h1>
          <p className="text-gray-500 mt-1">
            {isEdit ? "تعديل بيانات المنتج" : "أضف منتجاً جديداً للمتجر"}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-[#0f0f1e] border border-gold/10 rounded-xl p-6 space-y-5">
          <h3 className="text-lg font-bold text-white mb-2">المعلومات الأساسية</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-gray-400 mb-2">اسم المنتج (عربي)</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-[#1a1a2e] border border-gold/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gold/40 transition-colors"
                placeholder="ساعة رولكس ديت جست"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">اسم المنتج (إنجليزي)</label>
              <input
                type="text"
                name="nameEn"
                value={form.nameEn}
                onChange={handleChange}
                className="w-full bg-[#1a1a2e] border border-gold/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gold/40 transition-colors"
                placeholder="Rolex Datejust"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-gray-400 mb-2">العلامة التجارية</label>
              <input
                type="text"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                className="w-full bg-[#1a1a2e] border border-gold/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gold/40 transition-colors"
                placeholder="رولكس"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">الفئة</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full bg-[#1a1a2e] border border-gold/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold/40 transition-colors"
              >
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">الوصف</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full bg-[#1a1a2e] border border-gold/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gold/40 transition-colors resize-none"
              placeholder="وصف المنتج..."
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">المميزات (مفصولة بفاصلة ،)</label>
            <input
              type="text"
              name="features"
              value={form.features}
              onChange={handleChange}
              className="w-full bg-[#1a1a2e] border border-gold/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gold/40 transition-colors"
              placeholder="حركة أوتوماتيكية، مقاومة للماء، كريستال ياقوتي"
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-[#0f0f1e] border border-gold/10 rounded-xl p-6 space-y-5">
          <h3 className="text-lg font-bold text-white mb-2">التسعير والمخزون</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-gray-400 mb-2">السعر (أوقية)</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full bg-[#1a1a2e] border border-gold/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gold/40 transition-colors"
                placeholder="450000"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">السعر القديم (اختياري)</label>
              <input
                type="number"
                name="oldPrice"
                value={form.oldPrice}
                onChange={handleChange}
                className="w-full bg-[#1a1a2e] border border-gold/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gold/40 transition-colors"
                placeholder="520000"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="inStock"
                checked={form.inStock}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gold/20 bg-[#1a1a2e] text-gold focus:ring-gold accent-[#d4af37]"
              />
              <span className="text-gray-300">متوفر في المخزون</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gold/20 bg-[#1a1a2e] text-gold focus:ring-gold accent-[#d4af37]"
              />
              <span className="text-gray-300">منتج مميز</span>
            </label>
          </div>
        </div>

        {/* Images */}
        <div className="bg-[#0f0f1e] border border-gold/10 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">الصور</h3>
            <button
              type="button"
              onClick={addImageField}
              className="text-gold text-sm hover:underline flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              إضافة صورة
            </button>
          </div>

          {form.images.map((img, index) => (
            <div key={index} className="flex gap-3">
              <input
                type="url"
                value={img}
                onChange={(e) => handleImageChange(index, e.target.value)}
                className="flex-1 bg-[#1a1a2e] border border-gold/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gold/40 transition-colors"
                placeholder="رابط الصورة..."
              />
              {form.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImageField(index)}
                  className="p-3 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}

          {/* Preview */}
          {form.images.some(Boolean) && (
            <div className="flex gap-3 flex-wrap">
              {form.images.filter(Boolean).map((img, i) => (
                <div key={i} className="w-20 h-20 rounded-lg bg-[#1a1a2e] overflow-hidden border border-gold/10">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-l from-gold to-gold-light text-black font-bold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "جاري الحفظ..." : isEdit ? "حفظ التعديلات" : "إضافة المنتج"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="bg-[#1a1a2e] text-gray-300 font-medium px-8 py-3 rounded-lg hover:bg-[#252540] transition-colors"
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}
