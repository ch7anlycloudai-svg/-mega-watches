const express = require("express");
const jwt = require("jsonwebtoken");
const { fn, col } = require("sequelize");
const Product = require("../models/Product");

const router = express.Router();

// Auth middleware for admin routes
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

// GET /backend/products
router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll({ order: [["createdAt", "DESC"]] });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "خطأ في جلب المنتجات" });
  }
});

// GET /backend/products/featured
router.get("/featured", async (req, res) => {
  try {
    const products = await Product.findAll({ where: { featured: true } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "خطأ في جلب المنتجات المميزة" });
  }
});

// GET /backend/products/categories
router.get("/categories", async (req, res) => {
  try {
    const results = await Product.findAll({
      attributes: [[fn("DISTINCT", col("category")), "category"]],
      raw: true,
    });
    const categories = results.map((r) => r.category);
    res.json(["الكل", ...categories]);
  } catch (error) {
    res.status(500).json({ message: "خطأ في جلب الفئات" });
  }
});

// GET /backend/products/:id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "المنتج غير موجود" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "خطأ في جلب المنتج" });
  }
});

// ============ ADMIN ROUTES (protected) ============

// POST /backend/products
router.post("/", authMiddleware, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: "خطأ في إنشاء المنتج" });
  }
});

// PUT /backend/products/:id
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "المنتج غير موجود" });
    await product.update(req.body);
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: "خطأ في تعديل المنتج" });
  }
});

// DELETE /backend/products/:id
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "المنتج غير موجود" });
    await product.destroy();
    res.json({ message: "تم حذف المنتج بنجاح" });
  } catch (error) {
    res.status(500).json({ message: "خطأ في حذف المنتج" });
  }
});

module.exports = router;
