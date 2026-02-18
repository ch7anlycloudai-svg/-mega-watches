const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const sequelize = require("../config/database");

const Admin = sequelize.define(
  "Admin",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: "admin" },
  },
  {
    tableName: "admins",
    hooks: {
      beforeCreate: async (admin) => {
        admin.password = await bcrypt.hash(admin.password, 10);
      },
      beforeUpdate: async (admin) => {
        if (admin.changed("password")) {
          admin.password = await bcrypt.hash(admin.password, 10);
        }
      },
    },
  }
);

Admin.prototype.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

Admin.prototype.toJSON = function () {
  const values = { ...this.get() };
  values._id = String(values.id);
  delete values.password;
  return values;
};

module.exports = Admin;
