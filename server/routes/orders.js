const express = require("express");
const jwt = require("jsonwebtoken");
const Order = require("../models/Order");
const Product = require("../models/Product");

const router = express.Router();

// Auth middleware
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "غير مصرح" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "غير مصرح" });
  }
};

// ============ PUBLIC ROUTES ============

// POST /api/orders - Create new order (from checkout)
router.post("/", async (req, res) => {
  try {
    const { customer, phone, city, address, notes, items } = req.body;

    if (!customer || !phone || !city || !address || !items?.length) {
      return res.status(400).json({ message: "جميع الحقول المطلوبة يجب ملؤها" });
    }

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = new Order({
      customer,
      phone,
      city,
      address,
      notes: notes || "",
      items,
      total,
      status: "معلق",
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: "خطأ في إنشاء الطلب" });
  }
});

// ============ ADMIN ROUTES (protected) ============

// GET /api/orders - Get all orders (admin)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "خطأ في جلب الطلبات" });
  }
});

// PUT /api/orders/:id/status - Update order status (admin)
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["معلق", "قيد التوصيل", "مكتمل", "ملغى"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "حالة غير صالحة" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "الطلب غير موجود" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "خطأ في تحديث حالة الطلب" });
  }
});

// GET /api/orders/stats - Dashboard stats (admin)
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "معلق" });

    const revenueResult = await Order.aggregate([
      { $match: { status: "مكتمل" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    res.json({ totalProducts, totalOrders, totalRevenue, pendingOrders });
  } catch (error) {
    res.status(500).json({ message: "خطأ في جلب الإحصائيات" });
  }
});

// GET /api/orders/analytics - Analytics data (admin)
router.get("/analytics", authMiddleware, async (req, res) => {
  try {
    // Monthly sales - last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlySales = await Order.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo }, status: { $ne: "ملغى" } } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$total" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    const salesLabels = monthlySales.map((m) => monthNames[m._id - 1]);
    const salesData = monthlySales.map((m) => m.total);

    // If no data, provide defaults
    if (salesLabels.length === 0) {
      salesLabels.push("فبراير");
      salesData.push(0);
    }

    // Category distribution from products
    const categoryDist = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    // Order status distribution
    const statusDist = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Daily revenue - last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo }, status: { $ne: "ملغى" } } },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          total: { $sum: "$total" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const dayNames = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    const dailyLabels = dailyRevenue.map((d) => dayNames[d._id - 1]);
    const dailyData = dailyRevenue.map((d) => d.total);

    if (dailyLabels.length === 0) {
      dayNames.forEach((d) => { dailyLabels.push(d); dailyData.push(0); });
    }

    res.json({
      monthlySales: { labels: salesLabels, data: salesData },
      categoryDistribution: {
        labels: categoryDist.map((c) => c._id),
        data: categoryDist.map((c) => c.count),
      },
      orderStatus: {
        labels: statusDist.map((s) => s._id),
        data: statusDist.map((s) => s.count),
      },
      dailyRevenue: { labels: dailyLabels, data: dailyData },
    });
  } catch (error) {
    res.status(500).json({ message: "خطأ في جلب التحليلات" });
  }
});

module.exports = router;
