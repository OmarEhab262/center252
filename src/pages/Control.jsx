import { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Settings from "@mui/icons-material/Settings";
import Add from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Save from "@mui/icons-material/Save";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { encryptText, decryptText } from "../utils/authCrypto";
import { getItem, setItem, getJSON, setJSON } from "../utils/storage";

// إنشاء Data مستقلة لكل خدمة جنود
const createGuardData = () => [
  { position: "حكمدار", id: "", name: "---", rank: "---" },
  { position: "أولى", id: "", name: "---", rank: "---" },
  { position: "ثانية", id: "", name: "---", rank: "---" },
  { position: "ثالثة", id: "", name: "---", rank: "---" },
];

// إصلاح الخدمات القديمة
const normalizeServices = (services) => {
  if (!Array.isArray(services)) return [];
  return services.map((service) => {
    if (service.type === "soldiers" && !Array.isArray(service.data)) {
      return { ...service, data: createGuardData() };
    }
    return service;
  });
};

export default function Control() {
  const [showPassword, setShowPassword] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // المستخدم
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // الخدمات
  const [services, setServices] = useState([]);

  // بيانات الوحدة والقيادة
  const [unitNameValue, setUnitNameValue] = useState("");
  const [commandName, setCommandName] = useState("");

  // تحميل كل البيانات من SQLite أول مرة
  useEffect(() => {
    (async () => {
      try {
        const savedAccount = await getItem("account");
        if (savedAccount) {
          const account = JSON.parse(savedAccount);
          setEmail(account.email || "");
          setPassword(decryptText(account.password) || "");
        }
      } catch {
        // تجاهل أي خطأ في قراءة الحساب
      }

      const savedServices = await getJSON("serviceTypes", []);
      const normalized = normalizeServices(savedServices);
      setServices(normalized);
      await setJSON("serviceTypes", normalized);

      setUnitNameValue((await getItem("unitName")) || "");
      setCommandName((await getItem("commandName")) || "");

      setLoaded(true);
    })();
  }, []);

  // Dialog
  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [message, setMessage] = useState("");

  // أنواع الخدمات
  const serviceTypes = [
    { value: "officers", label: "ضباط" },
    { value: "nco", label: "صف ضباط" },
    { value: "soldiers", label: "جنود" },
  ];

  // حفظ بيانات الدخول
  const handleSaveAuth = async () => {
    if (!email.trim()) {
      toast.error("من فضلك اكتب اسم المستخدم");
      return;
    }
    if (!password) {
      toast.error("من فضلك اكتب كلمة السر");
      return;
    }
    const normalizedEmail = email.trim().toLowerCase();
    const updatedAccount = {
      email: normalizedEmail,
      password: encryptText(password),
    };
    await setItem("account", JSON.stringify(updatedAccount));
    setEmail(normalizedEmail);
    setPassword(password);
    setShowPassword(false);
    toast.success("تم تعديل بيانات الدخول بنجاح");
  };

  // فتح نافذة الإضافة
  const handleOpenAdd = () => {
    setSelectedType("");
    setServiceName("");
    setMessage("");
    setOpenAdd(true);
  };

  // إغلاق النافذة
  const handleCloseAdd = () => {
    setOpenAdd(false);
    setSelectedType("");
    setServiceName("");
  };

  // إضافة خدمة
  const handleAddService = async () => {
    if (!selectedType) {
      setMessage("اختر نوع الخدمة أولاً");
      return;
    }
    if (!serviceName.trim()) {
      setMessage("اكتب اسم الخدمة");
      return;
    }

    const newService = {
      id: Date.now(),
      type: selectedType,
      name: serviceName.trim(),
      ...(selectedType === "soldiers" ? { data: createGuardData() } : {}),
    };

    const updatedServices = [...services, newService];
    setServices(updatedServices);
    await setJSON("serviceTypes", updatedServices);

    handleCloseAdd();
    setMessage("تمت إضافة الخدمة بنجاح");
    setTimeout(() => setMessage(""), 2500);
  };

  // حذف خدمة
  const handleDeleteService = (service) => {
    setServiceToDelete(service);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setServiceToDelete(null);
  };

  const confirmDeleteService = async () => {
    if (!serviceToDelete) return;
    const updatedServices = services.filter(
      (service) => service.id !== serviceToDelete.id,
    );
    setServices(updatedServices);
    await setJSON("serviceTypes", updatedServices);
    toast.success("تم حذف الخدمة بنجاح");
    handleCloseDelete();
  };

  // اسم نوع الخدمة
  const getTypeName = (type) => {
    const item = serviceTypes.find((service) => service.value === type);
    return item?.label || type;
  };

  const handleSaveNames = async () => {
    const unit = unitNameValue.trim();
    const command = commandName.trim();
    if (!unit) {
      toast.error("من فضلك اكتب اسم الوحدة");
      return;
    }
    if (!command) {
      toast.error("من فضلك اكتب اسم القيادة");
      return;
    }
    await setItem("unitName", unit);
    await setItem("commandName", command);
    setUnitNameValue(unit);
    setCommandName(command);
    toast.success("تم حفظ اسم الوحدة والقيادة بنجاح");
  };

  if (!loaded) return null;

  return (
    <div className="min-h-screen bg-linear-to-br from-cyan-900 via-slate-900 to-black text-white py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/10 rounded-3xl shadow-2xl p-8 backdrop-blur">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <Button
              component={Link}
              to="/"
              startIcon={<ArrowBack sx={{ color: "#fff" }} />}
              sx={{
                color: "#fff",
                bgcolor: "#334155",
                borderRadius: "10px",
                px: 2.5,
                py: 1,
                fontWeight: "bold",
                "&:hover": { bgcolor: "#475569" },
              }}
            >
              رجوع
            </Button>
            <div className="flex items-center gap-3">
              <Settings sx={{ fontSize: 42, color: "#67e8f9" }} />
              <h1 className="text-4xl font-black">التحكم</h1>
            </div>
            <div className="w-20" />
          </div>

          {/* Login Settings */}
          <div className="bg-white/5 rounded-2xl p-6 shadow-lg mb-10">
            <h2 className="text-2xl font-bold text-center mb-6">
              تغير بيانات تسجيل الدخول
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <TextField
                fullWidth
                label="البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    backgroundColor: "rgba(15,23,42,0.8)",
                    borderRadius: "12px",
                    "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                    "&:hover fieldset": { borderColor: "#22d3ee" },
                    "&.Mui-focused fieldset": { borderColor: "#22d3ee" },
                  },
                  "& .MuiInputLabel-root": { color: "#fff", right: 14 },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#fff" },
                }}
              />
              <TextField
                fullWidth
                type={showPassword ? "text" : "password"}
                label="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          sx={{ color: "#cbd5e1" }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    backgroundColor: "rgba(15,23,42,0.8)",
                    borderRadius: "12px",
                    "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                    "&:hover fieldset": { borderColor: "#22d3ee" },
                    "&.Mui-focused fieldset": { borderColor: "#22d3ee" },
                  },
                  "& .MuiInputLabel-root": { color: "#fff", right: 14 },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#fff" },
                }}
              />
            </div>
            <div className="flex justify-center mt-6">
              <Button
                variant="contained"
                onClick={handleSaveAuth}
                startIcon={<Save sx={{ color: "#fff" }} />}
                sx={{
                  borderRadius: "10px",
                  px: 4,
                  py: 1.3,
                  fontWeight: "bold",
                  bgcolor: "#1e3a5f",
                  "&:hover": { bgcolor: "#264b73" },
                }}
              >
                حفظ بيانات الدخول
              </Button>
            </div>
          </div>

          {/* Unit / Command names */}
          <div className="bg-white/5 rounded-2xl p-6 shadow-lg mb-10">
            <h2 className="text-2xl font-bold text-center mb-6">
              بيانات الوحدة والقيادة
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <TextField
                fullWidth
                label="اسم الوحدة"
                value={unitNameValue}
                onChange={(e) => setUnitNameValue(e.target.value)}
                placeholder="اكتب اسم الوحدة"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    backgroundColor: "rgba(15,23,42,0.8)",
                    borderRadius: "12px",
                    "& input": { color: "#fff", textAlign: "right" },
                    "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                    "&:hover fieldset": { borderColor: "#22d3ee" },
                    "&.Mui-focused fieldset": { borderColor: "#22d3ee" },
                  },
                  "& .MuiInputLabel-root": { color: "#fff", right: 14 },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#22d3ee" },
                }}
              />
              <TextField
                fullWidth
                label="اسم القيادة"
                value={commandName}
                onChange={(e) => setCommandName(e.target.value)}
                placeholder="اكتب اسم القيادة"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    backgroundColor: "rgba(15,23,42,0.8)",
                    borderRadius: "12px",
                    "& input": { color: "#fff", textAlign: "right" },
                    "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                    "&:hover fieldset": { borderColor: "#22d3ee" },
                    "&.Mui-focused fieldset": { borderColor: "#22d3ee" },
                  },
                  "& .MuiInputLabel-root": { color: "#fff", right: 14 },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#22d3ee" },
                }}
              />
            </div>
            <div className="flex justify-center mt-6">
              <Button
                variant="contained"
                onClick={handleSaveNames}
                startIcon={<Save sx={{ color: "#fff" }} />}
                sx={{
                  borderRadius: "10px",
                  px: 4,
                  py: 1.3,
                  fontWeight: "bold",
                  bgcolor: "#1e3a5f",
                  "&:hover": { bgcolor: "#264b73" },
                }}
              >
                حفظ بيانات الوحدة
              </Button>
            </div>
          </div>

          {/* Services */}
          <div className="bg-white/5 rounded-2xl p-6 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <h2 className="text-2xl font-bold">الخدمات</h2>
              <Button
                variant="contained"
                onClick={handleOpenAdd}
                startIcon={<Add sx={{ color: "#fff" }} />}
                sx={{
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: "bold",
                  px: 3,
                  py: 1.2,
                  bgcolor: "#285943",
                  "&:hover": { bgcolor: "#326b50" },
                }}
              >
                إضافة
              </Button>
            </div>
            {services.length === 0 ? (
              <div className="text-center bg-slate-900/60 rounded-xl p-8 text-slate-300">
                لا توجد خدمات مضافة حتى الآن
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="bg-slate-900/80 border border-slate-700 rounded-2xl p-5 shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-cyan-400 font-bold text-sm mb-2">
                          {getTypeName(service.type)}
                        </div>
                        <div className="text-xl font-bold">{service.name}</div>
                      </div>
                      <IconButton
                        onClick={() => handleDeleteService(service)}
                        sx={{ color: "#ef4444" }}
                      >
                        <Delete />
                      </IconButton>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {message && (
            <div className="mt-6 bg-emerald-600/20 border border-emerald-500/30 rounded-xl p-4 text-center font-bold">
              {message}
            </div>
          )}
        </div>
      </div>

      {/* Add Service Dialog */}
      <Dialog
        open={openAdd}
        onClose={handleCloseAdd}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            backgroundColor: "#0f172a !important",
            borderRadius: "20px !important",
            backgroundImage: "none !important",
            color: "#ffffff",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.7)",
            direction: "rtl",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "#0f172a",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "24px",
            textAlign: "center",
          }}
        >
          إضافة خدمة
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "#0f172a", color: "#fff" }}>
          <div className="pt-4">
            <TextField
              select
              fullWidth
              label="نوع الخدمة"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  backgroundColor: "#1e293b",
                  borderRadius: "12px",
                  "& fieldset": { borderColor: "#475569" },
                  "&:hover fieldset": { borderColor: "#22d3ee" },
                  "&.Mui-focused fieldset": { borderColor: "#22d3ee" },
                },
                "& .MuiInputLabel-root": { color: "#fff" },
                "& .MuiSelect-select": { color: "#fff" },
                "& .MuiSelect-icon": { color: "#fff" },
              }}
              slotProps={{
                select: {
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        bgcolor: "#0f172a",
                        color: "#fff",
                        "& .MuiMenuItem-root": {
                          color: "#fff",
                          "&:hover": { bgcolor: "#1e293b" },
                          "&.Mui-selected": { bgcolor: "#164e63" },
                        },
                      },
                    },
                  },
                },
              }}
            >
              {serviceTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </TextField>
            {selectedType && (
              <div className="mt-6">
                <TextField
                  fullWidth
                  label="اسم الخدمة"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="اكتب اسم الخدمة"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#fff",
                      backgroundColor: "#1e293b",
                      borderRadius: "12px",
                      "& input": {
                        color: "#fff",
                        textAlign: "right",
                        "&::placeholder": { color: "#94a3b8", opacity: 1 },
                      },
                      "& fieldset": { borderColor: "#475569" },
                      "&:hover fieldset": { borderColor: "#22d3ee" },
                      "&.Mui-focused fieldset": { borderColor: "#22d3ee" },
                    },
                    "& .MuiInputLabel-root": { color: "#fff" },
                    "& .MuiInputLabel-root.Mui-focused": { color: "#22d3ee" },
                  }}
                />
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions
          sx={{ backgroundColor: "#0f172a", px: 3, pb: 3, gap: 2 }}
        >
          <Button
            onClick={handleCloseAdd}
            sx={{
              color: "#fff",
              backgroundColor: "#ef4444",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#dc2626" },
            }}
          >
            إلغاء
          </Button>
          <Button
            variant="contained"
            onClick={handleAddService}
            sx={{
              bgcolor: "#285943",
              borderRadius: "10px",
              fontWeight: "bold",
              px: 3,
              "&:hover": { bgcolor: "#326b50" },
            }}
          >
            إضافة
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        fullWidth
        maxWidth="xs"
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "#0f172a",
            color: "#fff",
            borderRadius: "20px",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.7)",
            direction: "rtl",
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: "22px",
            textAlign: "center",
          }}
        >
          تأكيد الحذف
        </DialogTitle>
        <DialogContent sx={{ color: "#cbd5e1", textAlign: "center", pb: 2 }}>
          <div className="text-lg">هل أنت متأكد من حذف الخدمة؟</div>
          {serviceToDelete && (
            <div className="mt-3 text-xl font-bold text-red-400">
              {serviceToDelete.name}
            </div>
          )}
          <div className="mt-2 text-sm text-slate-400">
            لا يمكن التراجع عن هذا الإجراء.
          </div>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 2, px: 3, pb: 3 }}>
          <Button
            onClick={handleCloseDelete}
            sx={{
              color: "#fff",
              backgroundColor: "#475569",
              borderRadius: "10px",
              fontWeight: "bold",
              px: 3,
              "&:hover": { backgroundColor: "#64748b" },
            }}
          >
            إلغاء
          </Button>
          <Button
            variant="contained"
            onClick={confirmDeleteService}
            startIcon={<Delete />}
            sx={{
              color: "#fff",
              backgroundColor: "#dc2626",
              borderRadius: "10px",
              fontWeight: "bold",
              px: 3,
              "& .MuiButton-startIcon": { marginRight: "8px", marginLeft: 0 },
              "&:hover": { backgroundColor: "#b91c1c" },
            }}
          >
            حذف
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
