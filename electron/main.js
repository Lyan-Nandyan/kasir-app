const { app, BrowserWindow } = require("electron");
const { initDatabase, closeDatabase } = require("./db");
const { createMainWindow } = require("./windows/mainWindow");
const { registerProductIpc } = require("./ipc/products");
const { registerSalesIpc } = require("./ipc/sales");

let win;
const isDev = !app.isPackaged;

app.whenReady().then(async () => {
  // (Opsional, Windows) app.setAppUserModelId("com.kasir.app");

  await initDatabase();

  // Register IPC dulu, supaya preload bisa langsung akses
  registerProductIpc();
  registerSalesIpc();

  win = createMainWindow(isDev);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      win = createMainWindow(isDev);
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("quit", async () => {
  await closeDatabase();
});
