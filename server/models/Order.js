const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  image: { type: String, default: "" },
});

const orderSchema = new mongoose.Schema(
  {
    customer: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: "" },
    city: { type: String, required: true },
    address: { type: String, required: true },
    notes: { type: String, default: "" },
    items: [orderItemSchema],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["معلق", "قيد التوصيل", "مكتمل", "ملغى"],
      default: "معلق",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
