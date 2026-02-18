const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define(
  "Product",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    nameEn: { type: DataTypes.STRING, defaultValue: "" },
    brand: { type: DataTypes.STRING, defaultValue: "" },
    category: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    oldPrice: { type: DataTypes.FLOAT, defaultValue: null },
    description: { type: DataTypes.TEXT, defaultValue: "" },
    features: { type: DataTypes.JSON, defaultValue: [] },
    images: { type: DataTypes.JSON, defaultValue: [] },
    inStock: { type: DataTypes.BOOLEAN, defaultValue: true },
    featured: { type: DataTypes.BOOLEAN, defaultValue: false },
    rating: { type: DataTypes.FLOAT, defaultValue: 0 },
  },
  {
    tableName: "products",
  }
);

Product.prototype.toJSON = function () {
  const values = { ...this.get() };
  values._id = String(values.id);
  return values;
};

module.exports = Product;
