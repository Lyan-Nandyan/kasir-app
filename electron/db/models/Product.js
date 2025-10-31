// CJS
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("Product", {
    barcode: { type: DataTypes.STRING, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  });
  return Product;
};
