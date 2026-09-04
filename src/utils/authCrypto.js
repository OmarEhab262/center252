
import CryptoJS from "crypto-js";

// ⚠️ Client-side encryption
// المفتاح موجود داخل JavaScript، لذلك هذا ليس نظام Authentication
// آمن ضد شخص يستطيع الوصول إلى كود التطبيق.

const SECRET_KEY = "ew252-service-auth-secret-key";

/**
 * Encrypt
 * كل عملية تشفير تنتج قيمة مختلفة بسبب الـ random salt.
 */
export const encryptText = (text) => {
  if (!text) return "";

  return CryptoJS.AES.encrypt(
    text,
    SECRET_KEY
  ).toString();
};

/**
 * Decrypt
 */
export const decryptText = (cipher) => {
  if (!cipher) return "";

  try {
    const bytes = CryptoJS.AES.decrypt(
      cipher,
      SECRET_KEY
    );

    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return "";
  }
};

/**
 * Hash
 *
 * نفس الإيميل يعطي نفس الـ hash دائمًا.
 * نستخدمه فقط للبحث عن المستخدم.
 */
export const hashEmail = (email) => {
  if (!email) return "";

  return CryptoJS.SHA256(
    email.trim().toLowerCase()
  ).toString();
};

/**
 * Get users
 */
export const getUsers = () => {
  try {
    return JSON.parse(
      localStorage.getItem("users") || "[]"
    );
  } catch {
    return [];
  }
};

/**
 * Save users
 */
export const saveUsers = (users) => {
  localStorage.setItem(
    "users",
    JSON.stringify(users)
  );
};

/**
 * Find user by email
 *
 * لا نعتمد على decrypt هنا.
 * نعمل hash للإيميل ونبحث بالـ emailHash.
 */
export const findUserByEmail = (email) => {
  const users = getUsers();

  const emailHash = hashEmail(email);

  return users.find(
    (user) => user.emailHash === emailHash
  );
};
