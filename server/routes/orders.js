const express = require("express");
const jwt = require("jsonwebtoken");
const { fn, col, literal, Op } = require("sequelize");
const sequelize = require("../config/database");
const { Order, OrderItem } = require("../models/Order");

const isMySQL = sequelize.getDialect() === "mysql";
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

// POST /backend/orders - Create new order (from checkout)
router.post("/", async (req, res) => {
  try {
    const { customer, phone, city, address, notes, items } = req.body;

    if (!customer || !phone || !city || !address || !items?.length) {
      return res.status(400).json({ message: "جميع الحقول المطلوبة يجب ملؤها" });
    }

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const t = await sequelize.transaction();
    try {
      const order = await Order.create(
        { customer, phone, city, address, notes: notes || "", total, status: "معلق" },
        { transaction: t }
      );

      const orderItems = items.map((item) => ({
        orderId: order.id,
        productId: item.productId || null,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || "",
      }));

      await OrderItem.bulkCreate(orderItems, { transaction: t });
      await t.commit();

      const result = await Order.findByPk(order.id, { include: [{ model: OrderItem, as: "items" }] });
      res.status(201).json(result);
    } catch (err) {
      await t.rollback();
      throw err;
    }
  } catch (error) {
    res.status(400).json({ message: "خطأ في إنشاء الطلب" });
  }
});

// ============ ADMIN ROUTES (protected) ============

// GET /backend/orders - Get all orders (admin)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: OrderItem, as: "items" }],
      order: [["createdAt", "DESC"]],
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "خطأ في جلب الطلبات" });
  }
});

// PUT /backend/orders/:id/status - Update order status (admin)
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["معلق", "قيد التوصيل", "مكتمل", "ملغى"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "حالة غير صالحة" });
    }

    const order = await Order.findByPk(req.params.id, {
      include: [{ model: OrderItem, as: "items" }],
    });
    if (!order) return res.status(404).json({ message: "الطلب غير موجود" });

    await order.update({ status });
    await order.reload({ include: [{ model: OrderItem, as: "items" }] });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "خطأ في تحديث حالة الطلب" });
  }
});

// GET /backend/orders/stats - Dashboard stats (admin)
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const totalProducts = await Product.count();
    const totalOrders = await Order.count();
    const pendingOrders = await Order.count({ where: { status: "معلق" } });

    const totalRevenue = (await Order.sum("total", { where: { status: "مكتمل" } })) || 0;

    res.json({ totalProducts, totalOrders, totalRevenue, pendingOrders });
  } catch (error) {
    res.status(500).json({ message: "خطأ في جلب الإحصائيات" });
  }
});

// GET /backend/orders/analytics - Analytics data (admin)
router.get("/analytics", authMiddleware, async (req, res) => {
  try {
    // Monthly sales - last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthExpr = isMySQL
      ? fn("MONTH", col("createdAt"))
      : literal("CAST(strftime('%m', createdAt) AS INTEGER)");

    const monthlySales = await Order.findAll({
      attributes: [
        [monthExpr, "month"],
        [fn("SUM", col("total")), "total"],
      ],
      where: {
        createdAt: { [Op.gte]: sixMonthsAgo },
        status: { [Op.ne]: "ملغى" },
      },
      group: [literal(isMySQL ? "MONTH(createdAt)" : "CAST(strftime('%m', createdAt) AS INTEGER)")],
      order: [[literal(isMySQL ? "MONTH(createdAt)" : "CAST(strftime('%m', createdAt) AS INTEGER)"), "ASC"]],
      raw: true,
    });

    const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    const salesLabels = monthlySales.map((m) => monthNames[m.month - 1]);
    const salesData = monthlySales.map((m) => Number(m.total));

    if (salesLabels.length === 0) {
      salesLabels.push("فبراير");
      salesData.push(0);
    }

    // Category distribution from products
    const categoryDist = await Product.findAll({
      attributes: [
        "category",
        [fn("COUNT", col("id")), "count"],
      ],
      group: ["category"],
      raw: true,
    });

    // Order status distribution
    const statusDist = await Order.findAll({
      attributes: [
        "status",
        [fn("COUNT", col("id")), "count"],
      ],
      group: ["status"],
      raw: true,
    });

    // Daily revenue - last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // MySQL DAYOFWEEK: 1=Sunday..7=Saturday; SQLite strftime('%w'): 0=Sunday..6=Saturday
    const dayExpr = isMySQL
      ? fn("DAYOFWEEK", col("createdAt"))
      : literal("CAST(strftime('%w', createdAt) AS INTEGER) + 1");

    const dailyRevenue = await Order.findAll({
      attributes: [
        [dayExpr, "dayOfWeek"],
        [fn("SUM", col("total")), "total"],
      ],
      where: {
        createdAt: { [Op.gte]: sevenDaysAgo },
        status: { [Op.ne]: "ملغى" },
      },
      group: [literal(isMySQL ? "DAYOFWEEK(createdAt)" : "CAST(strftime('%w', createdAt) AS INTEGER) + 1")],
      order: [[literal(isMySQL ? "DAYOFWEEK(createdAt)" : "CAST(strftime('%w', createdAt) AS INTEGER) + 1"), "ASC"]],
      raw: true,
    });

    const dayNames = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    const dailyLabels = dailyRevenue.map((d) => dayNames[d.dayOfWeek - 1]);
    const dailyData = dailyRevenue.map((d) => Number(d.total));

    if (dailyLabels.length === 0) {
      dayNames.forEach((d) => { dailyLabels.push(d); dailyData.push(0); });
    }

    res.json({
      monthlySales: { labels: salesLabels, data: salesData },
      categoryDistribution: {
        labels: categoryDist.map((c) => c.category),
        data: categoryDist.map((c) => Number(c.count)),
      },
      orderStatus: {
        labels: statusDist.map((s) => s.status),
        data: statusDist.map((s) => Number(s.count)),
      },
      dailyRevenue: { labels: dailyLabels, data: dailyData },
    });
  } catch (error) {
    res.status(500).json({ message: "خطأ في جلب التحليلات" });
  }
});

module.exports = router;
