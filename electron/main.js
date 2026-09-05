import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import process from "node:process";
import { fileURLToPath } from "url";
import { initDatabase, getItem, setItem, removeItem } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Development
  mainWindow.loadURL("http://localhost:5173");

  // عند البناء النهائي (npm run dist) استبدل السطر اللي فوق بده:
  // mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
}

// ============================================================
// Storage IPC — كل عمليات القراءة/الكتابة بتحصل هنا في SQLite (sql.js)
// ============================================================
ipcMain.handle("store:get", (_event, key) => getItem(key));
ipcMain.handle("store:set", (_event, key, value) => setItem(key, value));
ipcMain.handle("store:remove", (_event, key) => removeItem(key));

// ============================================================
// Print IPC
// ============================================================
ipcMain.handle("app:print", () => {
  if (mainWindow) {
    mainWindow.webContents.print({ silent: false, printBackground: true });
  }
  return true;
});

app.whenReady().then(async () => {
  // لازم قاعدة البيانات تتجهز الأول قبل ما أي صفحة تحاول تقرأ/تكتب منها
  await initDatabase();

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
