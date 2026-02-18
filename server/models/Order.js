const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Order = sequelize.define(
  "Order",
  {
    customer: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, defaultValue: "" },
    city: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    notes: { type: DataTypes.TEXT, defaultValue: "" },
    total: { type: DataTypes.FLOAT, allowNull: false },
    status: {
      type: sequelize.getDialect() === "mysql"
        ? DataTypes.ENUM("معلق", "قيد التوصيل", "مكتمل", "ملغى")
        : DataTypes.STRING,
      defaultValue: "معلق",
    },
  },
  {
    tableName: "orders",
  }
);

const OrderItem = sequelize.define(
  "OrderItem",
  {
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Order, key: "id" },
    },
    productId: { type: DataTypes.INTEGER, defaultValue: null },
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    image: { type: DataTypes.STRING, defaultValue: "" },
  },
  {
    tableName: "order_items",
    timestamps: false,
  }
);

Order.hasMany(OrderItem, { as: "items", foreignKey: "orderId", onDelete: "CASCADE" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

Order.prototype.toJSON = function () {
  const values = { ...this.get() };
  values._id = String(values.id);
  if (values.items) {
    values.items = values.items.map((item) => {
      const i = item instanceof OrderItem ? { ...item.get() } : { ...item };
      i._id = String(i.id);
      return i;
    });
  }
  return values;
};

OrderItem.prototype.toJSON = function () {
  const values = { ...this.get() };
  values._id = String(values.id);
  return values;
};

module.exports = { Order, OrderItem };
