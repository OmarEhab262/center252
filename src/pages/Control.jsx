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
import Edit from "@mui/icons-material/Edit";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Save from "@mui/icons-material/Save";
import Person from "@mui/icons-material/Person";
import Security from "@mui/icons-material/Security";
import Badge from "@mui/icons-material/Badge";

import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import { encryptText, decryptText } from "../utils/authCrypto";
import { getItem, setItem, getJSON, setJSON } from "../utils/storage";

const createGuardData = () => [
  { position: "حكمدار", id: "", name: "---", rank: "---" },
  { position: "أولى", id: "", name: "---", rank: "---" },
  { position: "ثانية", id: "", name: "---", rank: "---" },
  { position: "ثالثة", id: "", name: "---", rank: "---" },
];

const normalizeServices = (services) => {
  if (!Array.isArray(services)) return [];

  return services.map((service) => {
    if (service.type === "soldiers" && !Array.isArray(service.data)) {
      return {
        ...service,
        data: createGuardData(),
      };
    }

    return service;
  });
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    backgroundColor: "rgba(15,23,42,0.85)",
    borderRadius: "14px",

    "& input": {
      color: "#fff",
      textAlign: "right",
    },

    "& fieldset": {
      borderColor: "rgba(148,163,184,0.25)",
    },

    "&:hover fieldset": {
      borderColor: "#22d3ee",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#22d3ee",
    },
  },

  "& .MuiInputLabel-root": {
    color: "#cbd5e1",
    right: 14,
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "#22d3ee",
  },
};

const passwordInputSx = {
  ...inputSx,

  "& .MuiIconButton-root": {
    color: "#94a3b8",
  },

  "& .MuiIconButton-root:hover": {
    color: "#22d3ee",
  },
};

export default function Control() {
  const [loaded, setLoaded] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [accountEmail, setAccountEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [services, setServices] = useState([]);

  const [unitNameValue, setUnitNameValue] = useState("");
  const [commandName, setCommandName] = useState("");

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [serviceToEdit, setServiceToEdit] = useState(null);

  const [draggedServiceId, setDraggedServiceId] = useState(null);
  const [draggedServiceType, setDraggedServiceType] = useState(null);

  const [selectedType, setSelectedType] = useState("");
  const [serviceName, setServiceName] = useState("");

  const serviceTypes = [
    {
      value: "officers",
      label: "ضباط",
    },
    {
      value: "nco",
      label: "صف ضباط",
    },
    {
      value: "soldiers",
      label: "جنود",
    },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedAccount = await getItem("account");

        if (savedAccount) {
          const account = JSON.parse(savedAccount);
          setAccountEmail(account.email || "");
        }

        const savedServices = await getJSON("serviceTypes", []);
        const normalized = normalizeServices(savedServices);

        setServices(normalized);
        await setJSON("serviceTypes", normalized);

        setUnitNameValue((await getItem("unitName")) || "");
        setCommandName((await getItem("commandName")) || "");
      } catch (error) {
        console.error(error);
        toast.error("حدث خطأ أثناء تحميل البيانات");
      } finally {
        setLoaded(true);
      }
    };

    loadData();
  }, []);

  // =========================
  // Authentication
  // =========================

  const handleSaveAuth = async () => {
    const current = currentPassword.trim();
    const email = newEmail.trim().toLowerCase();
    const newPass = newPassword;
    const confirmPass = confirmNewPassword;

    if (!current) {
      toast.error("اكتب كلمة المرور الحالية أولاً");
      return;
    }

    const savedAccount = await getItem("account");

    if (!savedAccount) {
      toast.error("بيانات الحساب غير موجودة");
      return;
    }

    let account;

    try {
      account = JSON.parse(savedAccount);
    } catch {
      toast.error("بيانات الحساب غير صالحة");
      return;
    }

    let savedPassword = "";

    try {
      savedPassword = decryptText(account.password);
    } catch {
      toast.error("تعذر قراءة كلمة المرور الحالية");
      return;
    }

    if (current !== savedPassword) {
      toast.error("كلمة المرور الحالية غير صحيحة");
      return;
    }

    if (!email && !newPass) {
      toast.error("اكتب البريد الجديد أو كلمة المرور الجديدة");
      return;
    }

    if (email && email.length < 3) {
      toast.error("اسم المستخدم الجديد قصير جداً");
      return;
    }

    if (newPass) {
      if (newPass.length < 4) {
        toast.error("كلمة المرور الجديدة يجب أن تكون 4 أحرف على الأقل");
        return;
      }

      if (newPass !== confirmPass) {
        toast.error("تأكيد كلمة المرور غير مطابق");
        return;
      }
    }

    const updatedAccount = {
      email: email || account.email,
      password: encryptText(newPass || savedPassword),
    };

    await setItem("account", JSON.stringify(updatedAccount));

    setAccountEmail(updatedAccount.email);

    setCurrentPassword("");
    setNewEmail("");
    setNewPassword("");
    setConfirmNewPassword("");

    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);

    toast.success("تم تحديث بيانات الدخول بنجاح");
  };

  // =========================
  // Unit / Command
  // =========================

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

    toast.success("تم حفظ بيانات الوحدة والقيادة");
  };

  // =========================
  // Add Service
  // =========================

  const handleOpenAdd = () => {
    setSelectedType("");
    setServiceName("");
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
    setSelectedType("");
    setServiceName("");
  };

  const handleAddService = async () => {
    if (!selectedType) {
      toast.error("اختر نوع الخدمة أولاً");
      return;
    }

    if (!serviceName.trim()) {
      toast.error("اكتب اسم الخدمة");
      return;
    }

    const maxId = services.reduce(
      (max, service) => Math.max(max, Number(service.id) || 0),
      0,
    );

    const newService = {
      id: maxId + 1,
      type: selectedType,
      name: serviceName.trim(),

      ...(selectedType === "soldiers" ? { data: createGuardData() } : {}),
    };

    const updatedServices = [...services, newService];

    setServices(updatedServices);
    await setJSON("serviceTypes", updatedServices);

    handleCloseAdd();

    toast.success("تمت إضافة الخدمة بنجاح");
  };

  // =========================
  // Edit Service
  // =========================

  const handleOpenEdit = (service) => {
    setServiceToEdit(service);
    setSelectedType(service.type);
    setServiceName(service.name);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setServiceToEdit(null);
    setSelectedType("");
    setServiceName("");
  };

  const handleEditService = async () => {
    if (!serviceToEdit) return;

    if (!selectedType) {
      toast.error("اختر نوع الخدمة");
      return;
    }

    if (!serviceName.trim()) {
      toast.error("اكتب اسم الخدمة");
      return;
    }

    const updatedServices = services.map((service) => {
      if (service.id !== serviceToEdit.id) {
        return service;
      }

      const updatedService = {
        ...service,
        type: selectedType,
        name: serviceName.trim(),
      };

      if (selectedType === "soldiers" && !Array.isArray(updatedService.data)) {
        updatedService.data = createGuardData();
      }

      if (selectedType !== "soldiers") {
        delete updatedService.data;
      }

      return updatedService;
    });

    setServices(updatedServices);
    await setJSON("serviceTypes", updatedServices);

    handleCloseEdit();

    toast.success("تم تعديل الخدمة بنجاح");
  };

  // =========================
  // Delete Service
  // =========================

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

  // =========================
  // Drag & Drop
  // Same Type Only
  // =========================

  const getTypeName = (type) => {
    return (
      serviceTypes.find((service) => service.value === type)?.label || type
    );
  };

  const dialogSx = {
    "& .MuiDialog-container": {
      "& .MuiPaper-root": {
        backgroundColor: "#0f172a !important",
        backgroundImage: "none !important",
        color: "#fff !important",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "20px",
      },
    },
  };

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="text-xl font-bold">جاري تحميل البيانات...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-cyan-950 via-slate-950 to-black text-white py-6 sm:py-10 px-3 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 backdrop-blur-xl">
          {/* Header */}

          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 sm:mb-10">
            <Button
              component={Link}
              to="/"
              startIcon={<ArrowBack />}
              sx={{
                color: "#fff",
                bgcolor: "#334155",
                borderRadius: "12px",
                px: 2.5,
                py: 1,
                fontWeight: "bold",

                "&:hover": {
                  bgcolor: "#475569",
                },
              }}
            >
              رجوع
            </Button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
                <Settings
                  sx={{
                    fontSize: 30,
                    color: "#67e8f9",
                  }}
                />
              </div>

              <div>
                <h1 className="text-2xl sm:text-4xl font-black">التحكم</h1>

                <p className="text-slate-400 text-sm mt-1">
                  إدارة إعدادات النظام والخدمات
                </p>
              </div>
            </div>

            <div className="hidden sm:block w-20" />
          </div>

          {/* Login Settings */}

          <div className="bg-slate-950/50 border border-white/10 rounded-2xl p-4 sm:p-6 shadow-lg mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <Security sx={{ color: "#22d3ee" }} />
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold">
                  بيانات تسجيل الدخول
                </h2>

                <p className="text-slate-400 text-sm mt-1">
                  تغيير اسم المستخدم أو كلمة المرور
                </p>
              </div>
            </div>

            {/* Current Account */}

            <div className="mb-6 rounded-xl bg-cyan-400/5 border border-cyan-400/10 p-4">
              <div className="flex items-center gap-3">
                <Person sx={{ color: "#67e8f9" }} />

                <div>
                  <div className="text-xs text-slate-400">
                    اسم المستخدم الحالي
                  </div>

                  <div className="font-bold text-cyan-300 mt-1 break-all">
                    {accountEmail || "---"}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {/* Current Password */}

              <TextField
                fullWidth
                type={showCurrentPassword ? "text" : "password"}
                label="كلمة المرور الحالية"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                sx={passwordInputSx}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowCurrentPassword((prev) => !prev)
                          }
                        >
                          {showCurrentPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {/* New Email */}

              <TextField
                fullWidth
                label="اسم المستخدم الجديد"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder={accountEmail}
                sx={inputSx}
              />

              {/* New Password */}

              <TextField
                fullWidth
                type={showNewPassword ? "text" : "password"}
                label="كلمة المرور الجديدة"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                sx={passwordInputSx}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowNewPassword((prev) => !prev)}
                        >
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {/* Confirm Password */}

              <TextField
                fullWidth
                type={showConfirmPassword ? "text" : "password"}
                label="تأكيد كلمة المرور الجديدة"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                sx={passwordInputSx}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </div>

            <div
              dir="rtl"
              className="mt-5 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 text-sm text-slate-400"
            >
              يجب إدخال كلمة المرور الحالية لتأكيد أي تغيير في بيانات الدخول.
              اترك الحقول الجديدة فارغة إذا كنت لا تريد تغييرها.
            </div>

            <div className="flex justify-center mt-6">
              <Button
                variant="contained"
                onClick={handleSaveAuth}
                startIcon={<Save />}
                sx={{
                  borderRadius: "12px",
                  px: 4,
                  py: 1.3,
                  fontWeight: "bold",
                  bgcolor: "#155e75",

                  "&:hover": {
                    bgcolor: "#0e7490",
                  },
                }}
              >
                حفظ بيانات الدخول
              </Button>
            </div>
          </div>

          {/* Unit / Command */}

          <div className="bg-slate-950/50 border border-white/10 rounded-2xl p-4 sm:p-6 shadow-lg mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Badge sx={{ color: "#60a5fa" }} />
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold">
                  بيانات الوحدة والقيادة
                </h2>

                <p className="text-slate-400 text-sm mt-1">
                  البيانات التي تظهر في النظام والتقارير
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <TextField
                fullWidth
                label="اسم الوحدة"
                value={unitNameValue}
                onChange={(e) => setUnitNameValue(e.target.value)}
                placeholder="اكتب اسم الوحدة"
                sx={inputSx}
              />

              <TextField
                fullWidth
                label="اسم القيادة"
                value={commandName}
                onChange={(e) => setCommandName(e.target.value)}
                placeholder="اكتب اسم القيادة"
                sx={inputSx}
              />
            </div>

            <div className="flex justify-center mt-6">
              <Button
                variant="contained"
                onClick={handleSaveNames}
                startIcon={<Save />}
                sx={{
                  borderRadius: "12px",
                  px: 4,
                  py: 1.3,
                  fontWeight: "bold",
                  bgcolor: "#1e3a5f",

                  "&:hover": {
                    bgcolor: "#264b73",
                  },
                }}
              >
                حفظ بيانات الوحدة
              </Button>
            </div>
          </div>

          {/* Services */}

          <div className="bg-slate-950/50 border border-white/10 rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">الخدمات</h2>

                <p className="text-slate-400 text-sm mt-1">
                  إضافة وتعديل وحذف وترتيب الخدمات
                </p>
              </div>

              <Button
                variant="contained"
                onClick={handleOpenAdd}
                startIcon={<Add />}
                sx={{
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: "bold",
                  px: 3,
                  py: 1.2,
                  bgcolor: "#285943",

                  "&:hover": {
                    bgcolor: "#326b50",
                  },
                }}
              >
                إضافة خدمة
              </Button>
            </div>

            {services.length === 0 ? (
              <div className="text-center bg-slate-900/60 border border-white/5 rounded-xl p-8 text-slate-300">
                لا توجد خدمات مضافة حتى الآن
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                {serviceTypes.map((type, index) => {
                  const typeServices = services.filter(
                    (service) => service.type === type.value,
                  );

                  if (typeServices.length === 0) {
                    return null;
                  }

                  return (
                    <div key={type.value}>
                      {index > 0 && (
                        <div className="border-t border-slate-700 mb-8" />
                      )}

                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-xl font-black text-cyan-300">
                          {type.label}
                        </h3>

                        <span className="text-sm text-slate-500">
                          {typeServices.length} خدمة
                        </span>
                      </div>

                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {typeServices.map((service, serviceIndex) => (
                          <div
                            key={service.id}
                            className={`
                              relative rounded-2xl border
                              p-5 transition-all duration-200
                              bg-slate-900/70
                              ${
                                draggedServiceId === service.id
                                  ? "opacity-40 scale-[0.98] border-cyan-400"
                                  : "border-slate-700 hover:border-cyan-500/40"
                              }
                            `}
                          >
                            <div className="flex items-start gap-3">
                              {/* Service Content */}

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <div className="text-xs text-slate-500 mb-1">
                                      الخدمة #{serviceIndex + 1}
                                    </div>

                                    <h4 className="text-lg font-bold text-white truncate">
                                      {service.name}
                                    </h4>
                                  </div>

                                  <div className="shrink-0 w-8 h-8 rounded-lg bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-300 text-sm font-bold">
                                    {serviceIndex + 1}
                                  </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between gap-2">
                                  <span className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                                    {getTypeName(service.type)}
                                  </span>

                                  <div className="flex items-center gap-1">
                                    <IconButton
                                      onClick={() => handleOpenEdit(service)}
                                      sx={{
                                        color: "#60a5fa",
                                        backgroundColor:
                                          "rgba(59,130,246,0.08)",

                                        "&:hover": {
                                          backgroundColor:
                                            "rgba(59,130,246,0.18)",
                                        },
                                      }}
                                      title="تعديل"
                                    >
                                      <Edit />
                                    </IconButton>

                                    <IconButton
                                      onClick={() =>
                                        handleDeleteService(service)
                                      }
                                      sx={{
                                        color: "#f87171",
                                        backgroundColor: "rgba(239,68,68,0.08)",

                                        "&:hover": {
                                          backgroundColor:
                                            "rgba(239,68,68,0.18)",
                                        },
                                      }}
                                      title="حذف"
                                    >
                                      <Delete />
                                    </IconButton>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {draggedServiceId !== null &&
                              draggedServiceId !== service.id &&
                              draggedServiceType === service.type && (
                                <div className="absolute inset-x-5 -bottom-1 h-0.5 bg-cyan-400 rounded-full opacity-70" />
                              )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Service Dialog */}

      <Dialog
        open={openAdd}
        onClose={handleCloseAdd}
        fullWidth
        maxWidth="sm"
        sx={dialogSx}
        PaperProps={{
          sx: {
            backgroundColor: "#0f172a !important",
            backgroundImage: "none !important",
            color: "#fff !important",
            borderRadius: "20px",
            direction: "rtl",
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: "24px",
            textAlign: "center",
          }}
        >
          إضافة خدمة جديدة
        </DialogTitle>

        <DialogContent>
          <div className="pt-4">
            <TextField
              select
              fullWidth
              label="نوع الخدمة"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              sx={{
                ...inputSx,

                "& .MuiSelect-select": {
                  color: "#fff",
                },

                "& .MuiSelect-icon": {
                  color: "#fff",
                },
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

                          "&:hover": {
                            bgcolor: "#1e293b",
                          },

                          "&.Mui-selected": {
                            bgcolor: "#164e63",
                          },
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
              <div className="mt-5">
                <TextField
                  fullWidth
                  label="اسم الخدمة"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="اكتب اسم الخدمة"
                  sx={inputSx}
                />
              </div>
            )}
          </div>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 3,
            gap: 2,
          }}
        >
          <Button
            onClick={handleCloseAdd}
            sx={{
              color: "#fff",
              backgroundColor: "#475569",
              borderRadius: "10px",
              fontWeight: "bold",

              "&:hover": {
                backgroundColor: "#64748b",
              },
            }}
          >
            إلغاء
          </Button>

          <Button
            variant="contained"
            onClick={handleAddService}
            startIcon={<Add />}
            sx={{
              bgcolor: "#285943",
              borderRadius: "10px",
              fontWeight: "bold",
              px: 3,

              "&:hover": {
                bgcolor: "#326b50",
              },
            }}
          >
            إضافة
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Service Dialog */}
      <Dialog
        open={openEdit}
        onClose={handleCloseEdit}
        fullWidth
        maxWidth="sm"
        sx={dialogSx}
        PaperProps={{
          sx: {
            backgroundColor: "#0f172a !important",
            backgroundImage: "none !important",
            color: "#fff !important",
            borderRadius: "20px",
            direction: "rtl",
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: "24px",
            textAlign: "center",
          }}
        >
          تعديل الخدمة
        </DialogTitle>

        <DialogContent>
          <div className="pt-4">
            <TextField
              select
              fullWidth
              label="نوع الخدمة"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              sx={{
                ...inputSx,

                "& .MuiSelect-select": {
                  color: "#fff",
                },

                "& .MuiSelect-icon": {
                  color: "#fff",
                },
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

                          "&:hover": {
                            bgcolor: "#1e293b",
                          },

                          "&.Mui-selected": {
                            bgcolor: "#164e63",
                          },
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

            <div className="mt-5">
              <TextField
                fullWidth
                label="اسم الخدمة"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                sx={inputSx}
              />
            </div>
          </div>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 3,
            gap: 2,
          }}
        >
          <Button
            onClick={handleCloseEdit}
            sx={{
              color: "#fff",
              backgroundColor: "#475569",
              borderRadius: "10px",
              fontWeight: "bold",

              "&:hover": {
                backgroundColor: "#64748b",
              },
            }}
          >
            إلغاء
          </Button>

          <Button
            variant="contained"
            onClick={handleEditService}
            startIcon={<Save />}
            sx={{
              bgcolor: "#1e3a5f",
              borderRadius: "10px",
              fontWeight: "bold",
              px: 3,

              "&:hover": {
                bgcolor: "#264b73",
              },
            }}
          >
            حفظ التعديل
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}

      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        fullWidth
        maxWidth="xs"
        sx={dialogSx}
        PaperProps={{
          sx: {
            backgroundColor: "#0f172a !important",
            backgroundImage: "none !important",
            color: "#fff !important",
            borderRadius: "20px",
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

        <DialogContent
          sx={{
            color: "#cbd5e1",
            textAlign: "center",
            pb: 2,
          }}
        >
          <div className="text-lg">هل أنت متأكد من حذف الخدمة؟</div>

          {serviceToDelete && (
            <div className="mt-3 text-xl font-bold text-red-400">
              {serviceToDelete.name}
            </div>
          )}

          <div className="mt-2 text-sm text-slate-400">
            سيتم حذف الخدمة نهائياً من النظام.
          </div>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "center",
            gap: 2,
            px: 3,
            pb: 3,
          }}
        >
          <Button
            onClick={handleCloseDelete}
            sx={{
              color: "#fff",
              backgroundColor: "#475569",
              borderRadius: "10px",
              fontWeight: "bold",
              px: 3,

              "&:hover": {
                backgroundColor: "#64748b",
              },
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

              "&:hover": {
                backgroundColor: "#b91c1c",
              },
            }}
          >
            حذف
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
