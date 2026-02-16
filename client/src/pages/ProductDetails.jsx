import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getProductById, formatPrice } from "../services/api";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProductById(id)
      .then((data) => {
        setProduct(data);
        setSelectedImage(0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
        </svg>
        <p className="text-gray-500 text-lg">المنتج غير موجود</p>
        <Link to="/shop" className="text-accent hover:underline font-semibold">
          العودة للمتجر
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-light min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-accent transition-colors">الرئيسية</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-accent transition-colors">المتجر</Link>
            <span>/</span>
            <span className="text-primary font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Images */}
            <div className="p-6 lg:p-8">
              <div className="relative overflow-hidden rounded-xl mb-4">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-60 sm:h-80 lg:h-[450px] object-cover"
                />
                {product.oldPrice && (
                  <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-4 py-1.5 rounded-full">
                    تخفيض {Math.round((1 - product.price / product.oldPrice) * 100)}%
                  </span>
                )}
              </div>
              <div className="flex gap-2 sm:gap-3 overflow-x-auto">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-colors cursor-pointer shrink-0 ${
                      selectedImage === index ? "border-accent" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="p-6 lg:p-8 flex flex-col">
              <span className="text-accent font-semibold text-sm">{product.brand}</span>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-primary mt-2">
                {product.name}
              </h1>
              <p className="text-sm text-gray-400 mt-1">{product.nameEn}</p>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-4">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? "text-amber-400" : "text-gray-300"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-500 text-sm">{product.rating} / 5</span>
              </div>

              {/* Price */}
              <div className="mt-4 sm:mt-6 flex items-center gap-2 sm:gap-3 flex-wrap">
                <span className="text-2xl sm:text-3xl font-extrabold text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.oldPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice(product.oldPrice)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 mt-6 leading-relaxed">{product.description}</p>

              {/* Features */}
              <div className="mt-6">
                <h3 className="font-bold text-primary mb-3">المميزات</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Stock Status */}
              <div className="mt-6">
                <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${product.inStock ? "text-green-600" : "text-red-500"}`}>
                  <span className={`w-2 h-2 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`} />
                  {product.inStock ? "متوفر في المخزون" : "غير متوفر حالياً"}
                </span>
              </div>

              {/* Category */}
              <div className="mt-4">
                <span className="text-sm text-gray-500">الفئة: </span>
                <Link to="/shop" className="text-sm text-accent hover:underline font-medium">
                  {product.category}
                </Link>
              </div>

              {/* Add to Cart */}
              <div className="mt-auto pt-6">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`w-full py-3.5 rounded-xl font-bold text-lg transition-colors duration-200 cursor-pointer ${
                    added
                      ? "bg-green-500 text-white"
                      : "bg-primary text-white hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                  }`}
                >
                  {added ? "تمت الإضافة ✓" : product.inStock ? "أضف إلى السلة" : "غير متوفر"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
