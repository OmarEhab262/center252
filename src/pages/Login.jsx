import { useEffect, useState } from "react";

import { Button, IconButton } from "@mui/material";

import LoginIcon from "@mui/icons-material/Login";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { Link, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import {
  decryptText,
  encryptText,
  findUserByEmail,
  getUsers,
} from "../utils/authCrypto";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  // Check if there is already an account
  const hasAccount = getUsers().length > 0;

  useEffect(() => {
    localStorage.removeItem("auth");
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const email = form.email.trim().toLowerCase();
    const password = form.password;

    // Check empty fields
    if (!email || !password) {
      toast.error("من فضلك املأ كل الحقول");
      return;
    }

    // Find user using emailHash
    const user = findUserByEmail(email);

    if (!user) {
      toast.error("البريد الإلكتروني غير مسجل");
      return;
    }

    // Decrypt stored password
    const storedPassword = decryptText(user.password);

    if (storedPassword !== password) {
      toast.error("كلمة السر غير صحيحة");
      return;
    }

    // Create admin session
    const authData = {
      id: user.id,
      name: user.name,
      email: encryptText(email),
      role: "admin",
      enteredAt: Date.now(),
    };

    // Save current session
    localStorage.setItem("auth", JSON.stringify(authData));

    toast.success("تم تسجيل الدخول بنجاح");

    navigate("/", { replace: true });
  };

  const handleGuestLogin = () => {
    const guestData = {
      name: "زائر",
      enteredAt: Date.now(),
    };

    localStorage.setItem("auth", JSON.stringify(guestData));

    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-cyan-900 via-slate-900 to-black text-white py-10 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 rounded-3xl shadow-2xl p-8 backdrop-blur">
          {/* Title */}
          <h1 className="text-3xl leading-tight font-black text-center mb-10">
            تسجيل الدخول
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Email */}
            <div className="w-full bg-white/5 rounded-2xl p-5 shadow-lg">
              <label className="block text-lg font-bold mb-3 text-end">
                البريد الإلكتروني
              </label>

              <input
                type="email"
                dir="ltr"
                value={form.email}
                onChange={handleChange("email")}
                className="w-full rounded-xl p-3 text-end bg-slate-800 text-white text-lg font-bold placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="example@mail.com"
              />
            </div>

            {/* Password */}
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
                  className="w-full rounded-xl p-3  text-end bg-slate-800 text-white text-lg font-bold placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
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

            {/* Login Button */}
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

            {/* Guest Login */}
            <Button
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: "bold",
                px: 3,
                py: 1.4,
                fontSize: "16px",
                bgcolor: "#0000a2",
                color: "#fff",
                borderColor: "#0000a2",

                "&:hover": {
                  bgcolor: "#000080",
                  borderColor: "#000080",
                },

                boxShadow: "0 4px 14px rgba(0, 0, 162, 0.5)",
              }}
              fullWidth
              variant="contained"
              onClick={handleGuestLogin}
            >
              دخول بدون تسجيل
            </Button>
          </form>

          {/* Signup - Only when there is no account */}
          {!hasAccount && (
            <p className="text-center mt-6 text-white/70">
              مفيش عندك حساب؟{" "}
              <Link
                to="/signup"
                className="text-cyan-400 font-bold hover:underline"
              >
                إنشاء حساب جديد
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
