module.exports = (sequelize, DataTypes) => {
  const SaleItem = sequelize.define("SaleItem", {
    qty: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    total: { type: DataTypes.INTEGER, allowNull: false },
    productName: { type: DataTypes.STRING, allowNull: false },
  });
  return SaleItem;
};
