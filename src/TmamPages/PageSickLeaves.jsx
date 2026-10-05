import { useEffect, useState } from "react";

import { ArrowBack, LocalHospital, Delete, Add } from "@mui/icons-material";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import { Link } from "react-router-dom";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import toast from "react-hot-toast";

import { getJSON, setJSON } from "../utils/storage";
import ButtonsTmam from "../components/ButtonsTmam";

const PageSickLeaves = () => {
  const [listNames, setListNames] = useState([]);
  const [sickLeaves, setSickLeaves] = useState([]);

  const [openDelete, setOpenDelete] = useState(false);
  const [sickLeaveToDelete, setSickLeaveToDelete] = useState(null);

  const [form, setForm] = useState({
    personId: "",
    reason: "",
    from: null,
    to: null,
    notes: "",
  });

  const rankOrder = [
    "لواء أح",
    "لواء",
    "عميد أح",
    "عميد",
    "مقدم أح",
    "مقدم",
    "رائد أح",
    "رائد",
    "نقيب",
    "ملازم.أ",
    "ملازم",
    "مساعد.أ",
    "مساعد",
    "رقيب.أ",
    "رقيب",
    "عريف",
    "رقيب مجند",
    "عريف مجند",
    "جندى",
    "---",
  ];
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

  const sortedNames = [...listNames].sort((a, b) => {
    const rankA = rankOrder.indexOf(a.rank);
    const rankB = rankOrder.indexOf(b.rank);

    if (rankA !== rankB) {
      return rankA - rankB;
    }

    return a.name.localeCompare(b.name, "ar");
  });

  useEffect(() => {
    const loadData = async () => {
      const names = await getJSON("listNames", []);
      const tmam = await getJSON("tmam", {});

      setListNames(names);
      setSickLeaves(tmam.sickLeaves || []);
    };

    loadData();
  }, []);

  const handleChange = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("ar-EG");
  };

  const handleAdd = async () => {
    if (!form.personId) {
      toast.error("اختر الاسم أولاً");
      return;
    }

    if (!form.reason.trim()) {
      toast.error("اكتب سبب الإجازة");
      return;
    }

    if (!form.from || !form.to) {
      toast.error("اختر تاريخ بداية وعودة الإجازة");
      return;
    }

    if (form.to < form.from) {
      toast.error("تاريخ العودة يجب أن يكون بعد تاريخ البداية");
      return;
    }

    const person = listNames.find(
      (item) => String(item.id) === String(form.personId),
    );

    if (!person) {
      toast.error("الاسم غير موجود");
      return;
    }

    const newSickLeave = {
      id: Date.now(),
      personId: person.id,
      name: person.name,
      rank: person.rank,
      reason: form.reason.trim(),
      from: form.from.toISOString(),
      to: form.to.toISOString(),
      notes: form.notes.trim(),
    };

    const newSickLeaves = [...sickLeaves, newSickLeave];

    const tmam = await getJSON("tmam", {});

    await setJSON("tmam", {
      ...tmam,
      sickLeaves: newSickLeaves,
    });

    setSickLeaves(newSickLeaves);

    setForm({
      personId: "",
      reason: "",
      from: null,
      to: null,
      notes: "",
    });

    toast.success("تمت إضافة الإجازة المرضية");
  };

  const handleDelete = (sickLeave) => {
    setSickLeaveToDelete(sickLeave);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setSickLeaveToDelete(null);
  };

  const confirmDelete = async () => {
    if (!sickLeaveToDelete) return;

    const newSickLeaves = sickLeaves.filter(
      (item) => item.id !== sickLeaveToDelete.id,
    );

    const tmam = await getJSON("tmam", {});

    await setJSON("tmam", {
      ...tmam,
      sickLeaves: newSickLeaves,
    });

    setSickLeaves(newSickLeaves);

    handleCloseDelete();

    toast.success("تم حذف الإجازة المرضية");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-slate-900 to-black text-white py-6 sm:py-10 px-3 sm:px-5">
      <div className="max-w-7xl mx-auto">
        {/* ================= Header ================= */}
        <div className="bg-white/10 rounded-3xl shadow-2xl p-5 sm:p-8 backdrop-blur border border-white/10">
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outlined"
              component={Link}
              to="/tmam"
              startIcon={<ArrowBack sx={{ fontSize: 20 }} />}
              sx={{
                color: "#e2e8f0",
                borderColor: "rgba(255,255,255,0.25)",
                bgcolor: "rgba(15,23,42,0.4)",
                borderRadius: "12px",
                px: { xs: 1.5, sm: 2.5 },
                py: 1,
                minWidth: { xs: 45, sm: "auto" },
                fontWeight: "bold",
                textTransform: "none",
                flexShrink: 0,
                transition: "all 0.2s ease",

                "&:hover": {
                  bgcolor: "rgba(51,65,85,0.6)",
                  borderColor: "#22d3ee",
                  color: "#22d3ee",
                  transform: "translateX(4px)",
                },
              }}
            >
              <span className="hidden sm:inline">رجوع لصفحة التمام</span>
            </Button>

            <div className="flex items-center justify-center gap-3 flex-1 min-w-0">
              <LocalHospital
                sx={{
                  fontSize: { xs: 30, sm: 40 },
                  color: "#67e8f9",
                  flexShrink: 0,
                }}
              />

              <div className="text-center min-w-0">
                <h1 className="text-xl sm:text-3xl lg:text-4xl font-black leading-relaxed bg-gradient-to-l from-cyan-300 to-white bg-clip-text text-transparent">
                  الإجازات المرضية
                </h1>

                <p className="text-xs sm:text-base text-cyan-200/80 font-semibold mt-1">
                  إدارة الإجازات المرضية للأفراد
                </p>
              </div>
            </div>

            <div className="w-11 sm:w-24 flex-shrink-0" />
          </div>
        </div>
        <ButtonsTmam />

        {/* ================= Add Sick Leave ================= */}
        <section
          dir="rtl"
          className="
            mt-6
            bg-white/10
            rounded-3xl
            shadow-2xl
            backdrop-blur
            border border-white/10
            p-5 sm:p-6
          "
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center">
              <Add sx={{ color: "#67e8f9" }} />
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                إضافة إجازة مرضية
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                أدخل بيانات الإجازة المرضية
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* ================= الاسم ================= */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-950/80 p-5 shadow-lg">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-200 mb-3">
                <span className="w-1.5 h-5 rounded-full bg-cyan-400" />
                اسم الفرد
              </label>

              <select
                value={form.personId}
                onChange={(e) => handleChange("personId", e.target.value)}
                className="
                  w-full h-12 rounded-xl
                  bg-slate-950/80
                  border border-white/10
                  text-white px-4
                  outline-none cursor-pointer
                  transition-all
                  hover:border-white/20
                  focus:border-cyan-400
                  focus:ring-4 focus:ring-cyan-400/10
                "
              >
                <option value="">اختر الفرد</option>

                {sortedNames.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.rank} - {person.name}
                  </option>
                ))}
              </select>
            </div>

            {/* ================= سبب الإجازة ================= */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-950/80 p-5 shadow-lg">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-200 mb-3">
                <span className="w-1.5 h-5 rounded-full bg-cyan-400" />
                سبب الإجازة
              </label>

              <input
                type="text"
                value={form.reason}
                onChange={(e) => handleChange("reason", e.target.value)}
                placeholder="اكتب سبب الإجازة"
                className="
                  w-full h-12 rounded-xl
                  bg-slate-950/80
                  border border-white/10
                  text-white px-4
                  outline-none
                  transition-all
                  placeholder:text-slate-500
                  hover:border-white/20
                  focus:border-cyan-400
                  focus:ring-4 focus:ring-cyan-400/10
                "
              />
            </div>

            {/* ================= بدء الإجازة ================= */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-950/80 p-5 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-200 whitespace-nowrap">
                  <span className="w-1.5 h-5 rounded-full bg-cyan-400" />
                  بدء الإجازة
                </label>

                <div className="relative flex-1">
                  <DatePicker
                    selected={form.from}
                    onChange={(date) => handleChange("from", date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="اختر تاريخ البداية"
                    withPortal
                    portalId="datepicker-portal"
                    className="
                      w-full h-12 rounded-xl
                      bg-slate-950/80
                      border border-white/10
                      text-white px-4
                      outline-none
                      transition-all
                      hover:border-white/20
                      focus:border-cyan-400
                      focus:ring-4 focus:ring-cyan-400/10
                    "
                  />
                </div>
              </div>
            </div>

            {/* ================= عودة الإجازة ================= */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-950/80 p-5 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-200 whitespace-nowrap">
                  <span className="w-1.5 h-5 rounded-full bg-cyan-400" />
                  عودة الإجازة
                </label>

                <div className="relative flex-1">
                  <DatePicker
                    selected={form.to}
                    onChange={(date) => handleChange("to", date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="اختر تاريخ العودة"
                    minDate={form.from || undefined}
                    withPortal
                    portalId="datepicker-portal"
                    className="
                      w-full h-12 rounded-xl
                      bg-slate-950/80
                      border border-white/10
                      text-white px-4
                      outline-none
                      transition-all
                      hover:border-white/20
                      focus:border-cyan-400
                      focus:ring-4 focus:ring-cyan-400/10
                    "
                  />
                </div>
              </div>
            </div>

            {/* ================= ملاحظات ================= */}
            <div className="md:col-span-2 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-950/80 p-5 shadow-lg">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-200 mb-3">
                <span className="w-1.5 h-5 rounded-full bg-cyan-400" />
                ملاحظات
              </label>

              <textarea
                value={form.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="اكتب أي ملاحظات..."
                rows={3}
                className="
                  w-full
                  rounded-xl
                  bg-slate-950/80
                  border border-white/10
                  text-white
                  px-4 py-3
                  outline-none
                  resize-none
                  transition-all
                  placeholder:text-slate-500
                  hover:border-white/20
                  focus:border-cyan-400
                  focus:ring-4 focus:ring-cyan-400/10
                "
              />
            </div>
          </div>

          {/* ================= Add Button ================= */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleAdd}
              className="
                flex items-center justify-center gap-2
                min-w-44 px-7 py-3
                rounded-xl
                bg-gradient-to-r from-cyan-600 to-blue-600
                hover:from-cyan-500 hover:to-blue-500
                text-white font-black
                shadow-lg shadow-cyan-500/10
                transition cursor-pointer
              "
            >
              <Add sx={{ fontSize: 22 }} />
              إضافة الإجازة
            </button>
          </div>
        </section>

        {/* ================= Sick Leaves List ================= */}
        <section
          dir="rtl"
          className="
            mt-6
            bg-white/10
            rounded-3xl
            shadow-2xl
            backdrop-blur
            border border-white/10
          "
        >
          <div className="p-5">
            <h2 className="text-lg font-bold text-cyan-200 mb-4">
              الإجازات المرضية الحالية
            </h2>

            {sickLeaves.length === 0 ? (
              <div className="text-center text-slate-400 py-8">
                لا توجد إجازات مرضية مضافة
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[950px] border-collapse">
                  <thead>
                    <tr>
                      <th className="p-3 border border-white/15 text-cyan-300">
                        م
                      </th>

                      <th className="p-3 border border-white/15 text-cyan-300">
                        الرتبة / الدرجة
                      </th>

                      <th className="p-3 border border-white/15 text-cyan-300">
                        الإسم
                      </th>

                      <th className="p-3 border border-white/15 text-cyan-300">
                        سبب الإجازة
                      </th>

                      <th className="p-3 border border-white/15 text-cyan-300">
                        بدء الإجازة
                      </th>

                      <th className="p-3 border border-white/15 text-cyan-300">
                        عودة الإجازة
                      </th>

                      <th className="p-3 border border-white/15 text-cyan-300">
                        ملاحظات
                      </th>

                      <th className="p-3 border border-white/15 text-cyan-300">
                        حذف
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {sickLeaves.map((item, index) => (
                      <tr key={item.id}>
                        <td className="p-3 border border-white/15 text-center">
                          {index + 1}
                        </td>

                        <td className="p-3 border border-white/15 text-center">
                          {item.rank}
                        </td>

                        <td className="p-3 border border-white/15 text-center font-bold">
                          {item.name}
                        </td>

                        <td className="p-3 border border-white/15 text-center">
                          {item.reason}
                        </td>

                        <td className="p-3 border border-white/15 text-center">
                          {formatDate(item.from)}
                        </td>

                        <td className="p-3 border border-white/15 text-center">
                          {formatDate(item.to)}
                        </td>

                        <td className="p-3 border border-white/15 text-center">
                          {item.notes || "---"}
                        </td>

                        <td className="p-3 border border-white/15 text-center">
                          <button
                            onClick={() => handleDelete(item)}
                            className="
                              p-2
                              rounded-lg
                              bg-red-500/15
                              text-red-400
                              hover:bg-red-500/25
                              transition
                              cursor-pointer
                            "
                          >
                            <Delete />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ================= Delete Dialog ================= */}
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
            border: "1px solid rgba(255,255,255,0.1)",
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
          <div className="text-lg">هل أنت متأكد من حذف الإجازة المرضية؟</div>

          {sickLeaveToDelete && (
            <>
              <div className="mt-3 text-xl font-bold text-red-400">
                {sickLeaveToDelete.name}
              </div>

              <div className="mt-2 text-sm text-slate-400">
                {sickLeaveToDelete.reason}
              </div>
            </>
          )}

          <div className="mt-2 text-sm text-slate-400">
            سيتم حذف الإجازة نهائياً من النظام
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
            onClick={confirmDelete}
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
};

export default PageSickLeaves;
