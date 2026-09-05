import initSqlJs from "sql.js";
import fs from "fs";
import path from "path";
import { app } from "electron";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let db;
let dbFilePath;

// لازم تتنادى مرة واحدة قبل استخدام أي دالة تحت، وقبل ما الـ window يتفتح
export async function initDatabase() {
  const SQL = await initSqlJs({
    // مكان ملف الـ wasm جوه node_modules (مفيش بناء/compile خالص)
    locateFile: (file) =>
      path.join(__dirname, "..", "node_modules", "sql.js", "dist", file),
  });

  dbFilePath = path.join(app.getPath("userData"), "center.sqlite");

  if (fs.existsSync(dbFilePath)) {
    const fileBuffer = fs.readFileSync(dbFilePath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  // جدول واحد بسيط: مفتاح / قيمة (نفس فكرة localStorage بالظبط)
  db.run(`CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY, value TEXT)`);
  persist();
}

// sql.js بتشتغل بالكامل في الذاكرة، فلازم نكتب نسخة الملف على القرص
// يدويًا بعد أي تعديل عشان البيانات متتحفظش
function persist() {
  const data = db.export();
  fs.writeFileSync(dbFilePath, Buffer.from(data));
}

export function getItem(key) {
  const stmt = db.prepare("SELECT value FROM kv WHERE key = :key");
  stmt.bind({ ":key": key });
  let result = null;
  if (stmt.step()) {
    result = stmt.getAsObject().value;
  }
  stmt.free();
  return result;
}

export function setItem(key, value) {
  db.run(
    `INSERT INTO kv (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    [key, value],
  );
  persist();
  return true;
}

export function removeItem(key) {
  db.run("DELETE FROM kv WHERE key = ?", [key]);
  persist();
  return true;
}
