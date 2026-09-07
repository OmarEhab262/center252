export async function getItem(key) {
  return localStorage.getItem(key);
}

export async function setItem(key, value) {
  localStorage.setItem(key, value);
  return true;
}

export async function removeItem(key) {
  localStorage.removeItem(key);
  return true;
}

// قراءة قيمة JSON وإرجاع fallback
// إذا لم تكن موجودة أو كانت تالفة
export async function getJSON(key, fallback = null) {
  try {
    const raw = await getItem(key);

    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

// حفظ JSON
export async function setJSON(key, value) {
  return setItem(key, JSON.stringify(value));
}
