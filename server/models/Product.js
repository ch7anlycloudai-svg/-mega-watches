const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    nameEn: { type: String, default: "" },
    brand: { type: String, default: "" },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number, default: null },
    description: { type: String, default: "" },
    features: [{ type: String }],
    images: [{ type: String }],
    inStock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
