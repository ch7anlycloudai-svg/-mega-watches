const express = require("express");
const jwt = require("jsonwebtoken");
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

// GET /api/products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "خطأ في جلب المنتجات" });
  }
});

// GET /api/products/featured
router.get("/featured", async (req, res) => {
  try {
    const products = await Product.find({ featured: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "خطأ في جلب المنتجات المميزة" });
  }
});

// GET /api/products/categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.json(["الكل", ...categories]);
  } catch (error) {
    res.status(500).json({ message: "خطأ في جلب الفئات" });
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "المنتج غير موجود" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "خطأ في جلب المنتج" });
  }
});

// ============ ADMIN ROUTES (protected) ============

// POST /api/products
router.post("/", authMiddleware, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: "خطأ في إنشاء المنتج" });
  }
});

// PUT /api/products/:id
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: "المنتج غير موجود" });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: "خطأ في تعديل المنتج" });
  }
});

// DELETE /api/products/:id
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "المنتج غير موجود" });
    res.json({ message: "تم حذف المنتج بنجاح" });
  } catch (error) {
    res.status(500).json({ message: "خطأ في حذف المنتج" });
  }
});

module.exports = router;
