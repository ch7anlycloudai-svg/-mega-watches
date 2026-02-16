const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const authRoutes = require("./routes/auth");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;

async function start() {
  let mongoUri = process.env.MONGODB_URI;

  // Try connecting to external MongoDB first
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
    console.log("Connected to MongoDB at", mongoUri);
  } catch {
    // Fallback to in-memory MongoDB
    console.log("External MongoDB not available, starting in-memory server...");
    const { MongoMemoryServer } = require("mongodb-memory-server");
    const mongod = await MongoMemoryServer.create();
    mongoUri = mongod.getUri();
    await mongoose.connect(mongoUri);
    console.log("Connected to in-memory MongoDB");

    // Auto-seed when using in-memory
    await seedData();
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

async function seedData() {
  const Product = require("./models/Product");
  const Admin = require("./models/Admin");
  const Order = require("./models/Order");

  const productCount = await Product.countDocuments();
  if (productCount > 0) return; // Already seeded

  console.log("Seeding initial data...");

  const products = [
    {
      name: "ساعة رولكس ديت جست",
      nameEn: "Rolex Datejust",
      brand: "رولكس",
      category: "فاخرة",
      price: 450000,
      oldPrice: 520000,
      description: "ساعة رولكس ديت جست الكلاسيكية بإطار من الذهب الأبيض وسوار جوبيلي. تتميز بحركة أوتوماتيكية دقيقة ومقاومة للماء حتى 100 متر.",
      features: ["حركة أوتوماتيكية", "مقاومة للماء 100م", "كريستال ياقوتي", "تقويم تاريخ"],
      images: ["https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600", "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600"],
      inStock: true, featured: true, rating: 4.9,
    },
    {
      name: "ساعة أوميغا سيماستر",
      nameEn: "Omega Seamaster",
      brand: "أوميغا",
      category: "فاخرة",
      price: 280000,
      oldPrice: null,
      description: "ساعة أوميغا سيماستر المميزة بتصميمها الرياضي الأنيق. مثالية للغوص مع مقاومة للماء حتى 300 متر وإطار سيراميكي.",
      features: ["حركة أوتوماتيكية", "مقاومة للماء 300م", "إطار سيراميكي", "مضيئة في الظلام"],
      images: ["https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600", "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=600"],
      inStock: true, featured: true, rating: 4.8,
    },
    {
      name: "ساعة كارتييه تانك",
      nameEn: "Cartier Tank",
      brand: "كارتييه",
      category: "فاخرة",
      price: 380000,
      oldPrice: 420000,
      description: "ساعة كارتييه تانك الأيقونية بتصميمها المستطيل الفريد. تجمع بين الأناقة الفرنسية والحرفية السويسرية العالية.",
      features: ["حركة كوارتز", "جلد تمساح أصلي", "كريستال ياقوتي", "مطلية بالذهب"],
      images: ["https://images.unsplash.com/photo-1548171916-c8d1f4c993c4?w=600", "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=600"],
      inStock: true, featured: true, rating: 4.7,
    },
    {
      name: "ساعة تاغ هوير كاريرا",
      nameEn: "TAG Heuer Carrera",
      brand: "تاغ هوير",
      category: "رياضية",
      price: 195000,
      oldPrice: null,
      description: "ساعة تاغ هوير كاريرا الرياضية مع كرونوغراف. مستوحاة من سباقات السيارات بتصميم ديناميكي وأداء استثنائي.",
      features: ["كرونوغراف", "حركة أوتوماتيكية", "مقاومة للماء 100م", "تاكيميتر"],
      images: ["https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=600", "https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?w=600"],
      inStock: true, featured: false, rating: 4.6,
    },
    {
      name: "ساعة كاسيو جي شوك",
      nameEn: "Casio G-Shock",
      brand: "كاسيو",
      category: "رياضية",
      price: 8500,
      oldPrice: 12000,
      description: "ساعة كاسيو جي شوك المتينة والعملية. مصممة لتحمل الصدمات والظروف القاسية مع مميزات متعددة.",
      features: ["مقاومة للصدمات", "مقاومة للماء 200م", "إضاءة LED", "منبه ومؤقت"],
      images: ["https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=600", "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=600"],
      inStock: true, featured: false, rating: 4.5,
    },
    {
      name: "ساعة سيكو بريساج",
      nameEn: "Seiko Presage",
      brand: "سيكو",
      category: "كلاسيكية",
      price: 22000,
      oldPrice: null,
      description: "ساعة سيكو بريساج اليابانية بميناء مستوحى من حدائق اليابان. تجمع بين التقاليد اليابانية والتكنولوجيا الحديثة.",
      features: ["حركة أوتوماتيكية", "ميناء مزخرف", "كريستال هاردلكس", "عرض التاريخ"],
      images: ["https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600", "https://images.unsplash.com/photo-1434056886845-dbe89f0b9571?w=600"],
      inStock: true, featured: true, rating: 4.4,
    },
    {
      name: "ساعة تيسو جنتلمان",
      nameEn: "Tissot Gentleman",
      brand: "تيسو",
      category: "كلاسيكية",
      price: 35000,
      oldPrice: 42000,
      description: "ساعة تيسو جنتلمان بتصميم أنيق يناسب جميع المناسبات. تتميز بحركة باورماتيك 80 مع احتياطي طاقة يصل إلى 80 ساعة.",
      features: ["باورماتيك 80", "كريستال ياقوتي", "مقاومة للماء 100م", "سوار ستانلس ستيل"],
      images: ["https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=600", "https://images.unsplash.com/photo-1585123334904-845d60e97b29?w=600"],
      inStock: true, featured: false, rating: 4.3,
    },
    {
      name: "ساعة أبل ألترا 2",
      nameEn: "Apple Watch Ultra 2",
      brand: "أبل",
      category: "ذكية",
      price: 42000,
      oldPrice: null,
      description: "ساعة أبل ألترا 2 الذكية بشاشة ساطعة وهيكل تيتانيوم. مثالية للرياضيين والمغامرين مع GPS دقيق ومستشعرات متطورة.",
      features: ["شاشة OLED", "هيكل تيتانيوم", "GPS مزدوج", "مستشعر صحي متقدم"],
      images: ["https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=600", "https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=600"],
      inStock: true, featured: false, rating: 4.7,
    },
    {
      name: "ساعة سامسونج جالاكسي 6",
      nameEn: "Samsung Galaxy Watch 6",
      brand: "سامسونج",
      category: "ذكية",
      price: 18000,
      oldPrice: 22000,
      description: "ساعة سامسونج جالاكسي ووتش 6 بتصميم أنيق ونظام Wear OS. تتبع صحي شامل مع شاشة سوبر أموليد واضحة.",
      features: ["شاشة Super AMOLED", "Wear OS", "تتبع النوم", "مقاومة للماء"],
      images: ["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600", "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600"],
      inStock: true, featured: false, rating: 4.2,
    },
    {
      name: "ساعة هوبلو بيغ بانغ",
      nameEn: "Hublot Big Bang",
      brand: "هوبلو",
      category: "فاخرة",
      price: 620000,
      oldPrice: null,
      description: "ساعة هوبلو بيغ بانغ بتصميم جريء وفريد. تجمع بين مواد مبتكرة وحرفية سويسرية راقية في ساعة استثنائية.",
      features: ["حركة يونيكو", "إطار سيراميكي", "سوار مطاط طبيعي", "كرونوغراف فلايباك"],
      images: ["https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600", "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=600"],
      inStock: true, featured: true, rating: 4.8,
    },
    {
      name: "ساعة فوسيل جرانت",
      nameEn: "Fossil Grant",
      brand: "فوسيل",
      category: "كلاسيكية",
      price: 7500,
      oldPrice: 9500,
      description: "ساعة فوسيل جرانت الكلاسيكية بتصميم روماني أنيق. خيار مثالي للاستخدام اليومي بسعر معقول وجودة عالية.",
      features: ["حركة كوارتز", "سوار جلد طبيعي", "كرونوغراف", "مقاومة للماء 50م"],
      images: ["https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=600", "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600"],
      inStock: true, featured: false, rating: 4.1,
    },
    {
      name: "ساعة غارمين فينيكس 7",
      nameEn: "Garmin Fenix 7",
      brand: "غارمين",
      category: "رياضية",
      price: 32000,
      oldPrice: null,
      description: "ساعة غارمين فينيكس 7 الرياضية المتقدمة. مصممة للرياضيين المحترفين مع خرائط وتتبع لياقة شامل وبطارية طويلة.",
      features: ["GPS متعدد الأنظمة", "بطارية حتى 18 يوم", "خرائط طوبوغرافية", "مستشعر نبض"],
      images: ["https://images.unsplash.com/photo-1510017803434-a899b5c3d778?w=600", "https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=600"],
      inStock: false, featured: false, rating: 4.6,
    },
  ];

  await Product.insertMany(products);
  console.log(`  Seeded ${products.length} products`);

  const admin = new Admin({ name: "المدير", email: "admin@watches.mr", password: "admin123" });
  await admin.save();
  console.log("  Seeded admin: admin@watches.mr / admin123");

  const orders = [
    {
      customer: "محمد أحمد", phone: "+222 36 12 34 56", city: "نواكشوط", address: "تفرغ زينه",
      items: [{ name: "ساعة رولكس ديت جست", price: 450000, quantity: 1, image: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600" }],
      total: 450000, status: "مكتمل",
    },
    {
      customer: "أحمد محمود", phone: "+222 46 78 90 12", city: "نواكشوط", address: "الميناء",
      items: [
        { name: "ساعة تاغ هوير كاريرا", price: 195000, quantity: 1, image: "https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=600" },
        { name: "ساعة أوميغا سيماستر", price: 280000, quantity: 1, image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600" },
      ],
      total: 475000, status: "قيد التوصيل",
    },
    {
      customer: "فاطمة بنت سيدي", phone: "+222 22 33 44 55", city: "نواذيبو", address: "المركز",
      items: [{ name: "ساعة هوبلو بيغ بانغ", price: 620000, quantity: 1, image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600" }],
      total: 620000, status: "معلق",
    },
    {
      customer: "عبد الله ولد محمد", phone: "+222 41 22 33 44", city: "نواكشوط", address: "كرفور",
      items: [{ name: "ساعة كارتييه تانك", price: 380000, quantity: 1, image: "https://images.unsplash.com/photo-1548171916-c8d1f4c993c4?w=600" }],
      total: 380000, status: "معلق",
    },
    {
      customer: "مريم بنت أحمد", phone: "+222 33 44 55 66", city: "نواكشوط", address: "السبخة",
      items: [{ name: "ساعة سيكو بريساج", price: 22000, quantity: 1, image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600" }],
      total: 22000, status: "مكتمل",
    },
  ];

  await Order.insertMany(orders);
  console.log(`  Seeded ${orders.length} orders`);
  console.log("Seed complete!");
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
