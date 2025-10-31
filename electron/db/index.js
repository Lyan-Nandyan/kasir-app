const path = require("path");
const { app } = require("electron");
const { Sequelize, DataTypes } = require("sequelize");

let sequelize, models;

const dbPath = () => path.join(app.getPath("userData"), "pos.sqlite");

async function initDatabase() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: dbPath(),
    logging: false,
  });

  const Product = require("./models/Product")(sequelize, DataTypes);
  const Sale = require("./models/Sale")(sequelize, DataTypes);
  const SaleItem = require("./models/SaleItem")(sequelize, DataTypes);

  // Relations
  Sale.hasMany(SaleItem, {
    foreignKey: "saleId",
    onDelete: "CASCADE",
    hooks: true,
  });
  SaleItem.belongsTo(Sale, { foreignKey: "saleId" });

  Product.hasMany(SaleItem, { foreignKey: "productId" });
  SaleItem.belongsTo(Product, { foreignKey: "productId" });

  await sequelize.sync();

  models = { Product, Sale, SaleItem };
  return { sequelize, ...models };
}

function getDb() {
  if (!sequelize || !models) throw new Error("DB not initialized");
  return { sequelize, ...models };
}

async function closeDatabase() {
  if (sequelize) await sequelize.close();
}

module.exports = { initDatabase, getDb, closeDatabase };
