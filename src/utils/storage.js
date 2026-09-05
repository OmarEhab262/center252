// طبقة تخزين موحّدة تستخدمها كل صفحات الريأكت بدل localStorage مباشرة.
// - جوه Electron: بتتحول تلقائيًا لـ SQLite عن طريق electron/db.js
// - لو شغال Vite لوحده في متصفح عادي (بدون Electron) بترجع تلقائيًا
//   لـ localStorage عشان تقدر تعاين الواجهة برضو أثناء التطوير.

const hasElectronStorage =
  typeof window !== "undefined" &&
  window.electronAPI &&
  typeof window.electronAPI.getItem === "function";

export async function getItem(key) {
  if (hasElectronStorage) {
    return window.electronAPI.getItem(key);
  }
  return localStorage.getItem(key);
}

export async function setItem(key, value) {
  if (hasElectronStorage) {
    return window.electronAPI.setItem(key, value);
  }
  localStorage.setItem(key, value);
  return true;
}

export async function removeItem(key) {
  if (hasElectronStorage) {
    return window.electronAPI.removeItem(key);
  }
  localStorage.removeItem(key);
  return true;
}

// اختصار مفيد: قراءة قيمة JSON وإرجاع fallback لو مش موجودة أو تالفة
export async function getJSON(key, fallback) {
  try {
    const raw = await getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export async function setJSON(key, value) {
  return setItem(key, JSON.stringify(value));
}
