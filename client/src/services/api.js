const API_URL = "/api";

// Helper for fetch with error handling
const fetchApi = async (url, options = {}) => {
  const res = await fetch(`${API_URL}${url}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "خطأ في الاتصال بالخادم" }));
    throw new Error(error.message);
  }
  return res.json();
};

// Helper for authenticated admin requests
const adminFetch = async (url, options = {}) => {
  const token = localStorage.getItem("adminToken");
  return fetchApi(url, {
    ...options,
    headers: { ...options.headers, Authorization: `Bearer ${token}` },
  });
};

// ============ PUBLIC API ============

export const getProducts = () => fetchApi("/products");

export const getProductById = (id) => fetchApi(`/products/${id}`);

export const getFeaturedProducts = () => fetchApi("/products/featured");

export const getCategories = () => fetchApi("/products/categories");

export const createOrder = (orderData) =>
  fetchApi("/orders", { method: "POST", body: JSON.stringify(orderData) });

export const formatPrice = (price) => {
  return `${price.toLocaleString("ar-MR")} أوقية`;
};

// ============ ADMIN API ============

export const adminApi = {
  // Auth
  login: (email, password) =>
    fetchApi("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),

  getMe: () => adminFetch("/auth/me"),

  // Products
  getProducts: () => adminFetch("/products"),

  getProduct: (id) => adminFetch(`/products/${id}`),

  createProduct: (product) =>
    adminFetch("/products", { method: "POST", body: JSON.stringify(product) }),

  updateProduct: (id, data) =>
    adminFetch(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  deleteProduct: (id) =>
    adminFetch(`/products/${id}`, { method: "DELETE" }),

  // Orders
  getOrders: () => adminFetch("/orders"),

  updateOrderStatus: (id, status) =>
    adminFetch(`/orders/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }),

  // Dashboard
  getStats: () => adminFetch("/orders/stats"),

  getAnalytics: () => adminFetch("/orders/analytics"),
};
