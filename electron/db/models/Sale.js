module.exports = (sequelize, DataTypes) => {
  const Sale = sequelize.define("Sale", {
    datetime: { type: DataTypes.STRING, allowNull: false,defaultValue: DataTypes.NOW  },
    subtotal: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    total:    { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    paid:     { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    change:   { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  });
  return Sale;
};
