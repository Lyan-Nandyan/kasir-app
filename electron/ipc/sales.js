const { ipcMain } = require("electron");
const { getDb } = require("../db");

function registerSalesIpc() {
  const { sequelize, Sale, SaleItem, Product } = getDb();

  ipcMain.handle("sales:checkout", async (_e, sale) => {
    if (!sale || !Array.isArray(sale.items) || !sale.items.length) {
      throw new Error("Keranjang kosong");
    }

    // Validasi item dasar (cek id + qty valid)
    for (const it of sale.items) {
      const qty = +it.qty;
      if (!Number.isFinite(qty) || qty <= 0) throw new Error("Qty tidak valid");
      const prod = await Product.findByPk(it.id);
      if (!prod) throw new Error(`Produk ${it.id} tidak ditemukan`);
      // jangan cek stok di sini — kita akan menyesuaikan stok di transaksi
    }

    return await sequelize.transaction(async (t) => {
      const head = await Sale.create(
        {
          datetime: new Date().toISOString(),
          subtotal: +sale.subtotal || 0,
          total: +sale.total || 0,
          paid: +sale.paid || 0,
          change: +sale.change || 0,
        },
        { transaction: t }
      );
      console.log("Created sale:", head.get({ plain: true }));

      for (const it of sale.items) {
        const qty = +it.qty;

        // Ambil product di dalam transaksi (dengan lock)
        const prod = await Product.findByPk(it.id, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        if (!prod) throw new Error(`Produk ${it.id} tidak ditemukan`);

        // Ambil harga dan nama dari DB (snapshot)
        const unitPrice = Number(prod.price || 0);

        await SaleItem.create(
          {
            saleId: head.id,
            productId: prod.id,
            qty,
            price: unitPrice,
            total: qty * unitPrice,
            productName: prod.name,
          },
          { transaction: t }
        );
        console.log("Processed sale item:", it);

        // Set stok baru = max(0, stok_saat_ini - qty)
        const newStock = Math.max(0, (prod.stock || 0) - qty);
        await prod.update({ stock: newStock }, { transaction: t });
      }

      return head.id;
    });
  });

  // list sales with their items (plain objects)
  ipcMain.handle("sales:list", async () => {
    const rows = await Sale.findAll({ order: [["id", "DESC"]], include: [SaleItem] });
    // convert to plain objects
    return rows.map((r) => r.get({ plain: true }));
  });
}

module.exports = { registerSalesIpc };
