import { useEffect, useState } from "react";

import {
  Button,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";

import { Email, LockOutlined, PersonAddAlt } from "@mui/icons-material";

import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  encryptText,
  hashEmail,
  getUsers,
  saveUsers,
  findUserByEmail,
} from "../utils/authCrypto";

import { getUnitName, setUnitName } from "../utils/unitName";

const fieldSx = {
  "& .MuiFilledInput-root": {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: "12px",
    color: "#ffffff",
    transition: "background-color .15s ease",

    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.09)",
    },

    "&.Mui-focused": {
      backgroundColor: "rgba(255,255,255,0.09)",
    },

    "&:before, &:after": {
      display: "none",
    },
  },

  "& .MuiFilledInput-root.Mui-focused": {
    outline: "2px solid #22d3ee",
    outlineOffset: "1px",
  },

  "& .MuiFilledInput-input": {
    textAlign: "right",
  },

  "& .MuiInputLabel-root": {
    color: "rgba(255,255,255,0.6)",
    right: 20,
    left: "auto",
    transformOrigin: "top right",
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "#22d3ee",
  },

  "& .MuiInputLabel-root.Mui-error": {
    color: "#f87171",
  },

  "& .MuiFormHelperText-root": {
    marginRight: 0,
    marginLeft: 0,
    textAlign: "right",
  },

  "& input": {
    color: "#ffffff",
    textAlign: "right",
  },
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    unitName: getUnitName(),
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const errors = {
    unitName: !form.unitName.trim() ? "من فضلك اكتب اسم الوحدة" : "",

    email: !form.email.trim()
      ? "من فضلك اكتب بريدك الإلكتروني"
      : !emailPattern.test(form.email)
        ? "صيغة البريد الإلكتروني غير صحيحة"
        : "",

    password: !form.password
      ? "من فضلك اكتب كلمة السر"
      : form.password.length < 6
        ? "لازم تكون 6 أحرف على الأقل"
        : "",

    confirmPassword: !form.confirmPassword
      ? "أكد كلمة السر"
      : form.confirmPassword !== form.password
        ? "كلمة السر غير متطابقة"
        : "",
  };

  const hasErrors = Object.values(errors).some(Boolean);

  const handleSubmit = (e) => {
    e.preventDefault();

    setTouched({
      unitName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (hasErrors) {
      toast.error("راجع البيانات المكتوبة");
      return;
    }

    const normalizedEmail = form.email.trim().toLowerCase();

    // Check if email already exists
    if (findUserByEmail(normalizedEmail)) {
      toast.error("البريد الإلكتروني مسجل بالفعل");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const users = getUsers();

      const newUser = {
        id: Date.now(),

        name: form.unitName.trim(),

        // Email is encrypted
        email: encryptText(normalizedEmail),

        // Used only to find the user
        emailHash: hashEmail(normalizedEmail),

        // Password is encrypted
        password: encryptText(form.password),
      };

      users.push(newUser);

      saveUsers(users);

      setUnitName(form.unitName.trim());

      setLoading(false);

      toast.success("تم إنشاء الحساب بنجاح");

      navigate("/login");
    }, 400);
  };
  useEffect(() => {
    localStorage.removeItem("auth");
  }, []);
  useEffect(() => {
    const users = getUsers();

    // لو يوجد حساب بالفعل، ممنوع فتح صفحة التسجيل
    if (users.length > 0) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);
  return (
    <div className="min-h-screen bg-linear-to-br from-cyan-900 via-slate-900 to-black text-white flex items-center justify-center px-4 py-10">
      <div className="w-125 max-w-4xl grid rounded-3xl overflow-hidden shadow-2xl">
        <div className="bg-white/10 backdrop-blur p-8 sm:p-10">
          <div className="mb-8 text-end">
            <h1 className="text-3xl font-black mb-2">إنشاء حساب جديد</h1>

            <p className="text-white/60">املأ بياناتك عشان تبدأ</p>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-5"
          >
            {/* Unit Name */}
            <TextField
              variant="filled"
              label="اسم الوحدة"
              dir="rtl"
              value={form.unitName}
              onChange={handleChange("unitName")}
              onBlur={handleBlur("unitName")}
              error={touched.unitName && Boolean(errors.unitName)}
              helperText={touched.unitName ? errors.unitName : ""}
              sx={fieldSx}
              InputProps={{
                disableUnderline: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <PersonAddAlt
                      sx={{
                        color: "rgba(255,255,255,0.5)",
                        fontSize: 20,
                      }}
                    />
                  </InputAdornment>
                ),
              }}
            />

            {/* Email */}
            <TextField
              variant="filled"
              label="البريد الإلكتروني"
              type="email"
              dir="rtl"
              value={form.email}
              onChange={handleChange("email")}
              onBlur={handleBlur("email")}
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email ? errors.email : ""}
              sx={fieldSx}
              InputProps={{
                disableUnderline: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <Email
                      sx={{
                        color: "rgba(255,255,255,0.5)",
                      }}
                    />
                  </InputAdornment>
                ),
              }}
            />

            {/* Password */}
            <TextField
              variant="filled"
              label="كلمة السر"
              type={showPassword ? "text" : "password"}
              dir="rtl"
              value={form.password}
              onChange={handleChange("password")}
              onBlur={handleBlur("password")}
              error={touched.password && Boolean(errors.password)}
              helperText={
                touched.password ? errors.password : "٦ أحرف على الأقل"
              }
              sx={fieldSx}
              InputProps={{
                disableUnderline: true,

                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      onClick={() => setShowPassword((v) => !v)}
                      edge="start"
                      size="small"
                      aria-label="إظهار كلمة السر"
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </IconButton>
                  </InputAdornment>
                ),

                endAdornment: (
                  <InputAdornment position="end">
                    <LockOutlined
                      sx={{
                        color: "rgba(255,255,255,0.5)",
                      }}
                    />
                  </InputAdornment>
                ),
              }}
            />

            {/* Confirm Password */}
            <TextField
              variant="filled"
              label="تأكيد كلمة السر"
              type={showConfirm ? "text" : "password"}
              dir="rtl"
              value={form.confirmPassword}
              onChange={handleChange("confirmPassword")}
              onBlur={handleBlur("confirmPassword")}
              error={touched.confirmPassword && Boolean(errors.confirmPassword)}
              helperText={touched.confirmPassword ? errors.confirmPassword : ""}
              sx={fieldSx}
              InputProps={{
                disableUnderline: true,

                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      onClick={() => setShowConfirm((v) => !v)}
                      edge="start"
                      size="small"
                      aria-label="إظهار تأكيد كلمة السر"
                    >
                      {showConfirm ? "🙈" : "👁️"}
                    </IconButton>
                  </InputAdornment>
                ),

                endAdornment: (
                  <InputAdornment position="end">
                    <LockOutlined
                      sx={{
                        color: "rgba(255,255,255,0.5)",
                      }}
                    />
                  </InputAdornment>
                ),
              }}
            />

            {/* Submit */}
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={
                loading ? (
                  <CircularProgress size={18} sx={{ color: "#ffffff" }} />
                ) : (
                  <PersonAddAlt
                    sx={{
                      color: "#ffffff",
                      fontSize: 22,
                    }}
                  />
                )
              }
              sx={{
                mt: 1,
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: "bold",
                py: 1.5,
                fontSize: "16px",
                bgcolor: "#0e7490",

                "&:hover": {
                  bgcolor: "#155e75",
                },

                "&.Mui-disabled": {
                  bgcolor: "#0e7490",
                  opacity: 0.7,
                  color: "#fff",
                },

                boxShadow: "0 4px 14px rgba(14,116,144,0.5)",
              }}
            >
              {loading ? "جاري الإنشاء..." : "إنشاء الحساب"}
            </Button>
          </form>

          <p className="text-center mt-6 text-white/60">
            عندك حساب بالفعل؟{" "}
            <Link
              to="/login"
              className="text-cyan-400 font-bold hover:underline"
            >
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
