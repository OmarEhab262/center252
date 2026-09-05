import { useEffect, useState } from "react";
import { Button, IconButton } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { encryptText, decryptText } from "../utils/authCrypto";
import { getItem, setItem, removeItem } from "../utils/storage";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [ready, setReady] = useState(false);

  // إنشاء الحساب الافتراضي أول مرة فقط + حذف الجلسة الحالية عند فتح صفحة Login
  useEffect(() => {
    (async () => {
      const account = await getItem("account");
      if (!account) {
        const defaultAccount = {
          email: "admin",
          password: encryptText("123456"),
        };
        await setItem("account", JSON.stringify(defaultAccount));
      }
      await removeItem("auth");
      setReady(true);
    })();
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (!email || !password) {
      toast.error("من فضلك املأ كل الحقول");
      return;
    }

    const savedAccount = await getItem("account");
    if (!savedAccount) {
      toast.error("بيانات الحساب غير موجودة");
      return;
    }

    const account = JSON.parse(savedAccount);

    // التحقق من اسم المستخدم
    if (email !== account.email) {
      toast.error("اسم المستخدم غير صحيح");
      return;
    }

    // فك تشفير كلمة السر
    const storedPassword = decryptText(account.password);
    if (password !== storedPassword) {
      toast.error("كلمة السر غير صحيحة");
      return;
    }

    // إنشاء الجلسة
    const authData = {
      name: account.email,
      email: encryptText(account.email),
      role: "admin",
      enteredAt: Date.now(),
    };
    await setItem("auth", JSON.stringify(authData));
    toast.success("تم تسجيل الدخول بنجاح");
    navigate("/", { replace: true });
  };

  const handleGuestLogin = async () => {
    await setItem("auth");
    toast.success("تم الدخول كزائر");
    navigate("/", { replace: true });
  };

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-linear-to-br from-cyan-900 via-slate-900 to-black text-white py-10 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 rounded-3xl shadow-2xl p-8 backdrop-blur">
          <h1 className="text-3xl leading-tight font-black text-center mb-10">
            تسجيل الدخول
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="w-full bg-white/5 rounded-2xl p-5 shadow-lg">
              <label className="block text-lg font-bold mb-3 text-end">
                اسم المستخدم
              </label>
              <input
                type="text"
                dir="ltr"
                value={form.email}
                onChange={handleChange("email")}
                className="w-full rounded-xl p-3 text-end bg-slate-800 text-white text-lg font-bold placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="اسم المستخدم"
              />
            </div>
            <div className="w-full bg-white/5 rounded-2xl p-5 shadow-lg">
              <label className="block text-lg font-bold mb-3 text-end">
                كلمة السر
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  dir="ltr"
                  value={form.password}
                  onChange={handleChange("password")}
                  className="w-full rounded-xl p-3 text-end bg-slate-800 text-white text-lg font-bold placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="••••••••"
                />
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  type="button"
                  sx={{
                    position: "absolute",
                    left: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "rgba(255,255,255,0.6)",
                    "&:hover": {
                      color: "#22d3ee",
                      backgroundColor: "rgba(255,255,255,0.08)",
                    },
                  }}
                  aria-label={
                    showPassword ? "إخفاء كلمة السر" : "إظهار كلمة السر"
                  }
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </div>
            </div>
            <Button
              type="submit"
              variant="contained"
              startIcon={
                <LoginIcon
                  sx={{
                    color: "#ffffff",
                    fontSize: 24,
                  }}
                />
              }
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: "bold",
                px: 3,
                py: 1.4,
                fontSize: "16px",
                bgcolor: "#16a34a",
                "&:hover": {
                  bgcolor: "#15803d",
                },
                boxShadow: "0 4px 14px rgba(22,163,74,0.5)",
              }}
            >
              دخول
            </Button>
            <Button
              type="button"
              variant="contained"
              onClick={handleGuestLogin}
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: "bold",
                px: 3,
                py: 1.4,
                fontSize: "16px",
                bgcolor: "#0000a2",
                color: "#fff",
                "&:hover": {
                  bgcolor: "#000080",
                },
                boxShadow: "0 4px 14px rgba(0,0,162,0.5)",
              }}
            >
              دخول بدون تسجيل
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
