import { useEffect, useState } from "react";

import {
  ArrowBack,
  BeachAccess,
  Delete,
  Add,
  Close,
} from "@mui/icons-material";

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

const PageVacations = () => {
  const [listNames, setListNames] = useState([]);
  const [vacations, setVacations] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [vacationToDelete, setVacationToDelete] = useState(null);

  const [form, setForm] = useState({
    personId: "",
    type: "ميدانية",
    from: null,
    to: null,
  });

  const vacationTypes = ["ميدانية", "عارضة", "سنوية", "مرضية"];

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
      setVacations(tmam.vacations || []);
    };

    loadData();
  }, []);

  const handleChange = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdd = async () => {
    if (!form.personId) {
      toast.error("اختر الاسم أولاً");
      return;
    }

    if (!form.from || !form.to) {
      toast.error("اختر تاريخ البداية والنهاية");
      return;
    }

    if (form.to < form.from) {
      toast.error("تاريخ النهاية يجب أن يكون بعد تاريخ البداية");
      return;
    }

    const person = listNames.find(
      (item) => String(item.id) === String(form.personId),
    );

    if (!person) {
      toast.error("الاسم غير موجود");
      return;
    }

    const newVacation = {
      id: Date.now(),
      personId: person.id,
      name: person.name,
      rank: person.rank,
      type: form.type,
      from: form.from.toISOString(),
      to: form.to.toISOString(),
    };

    const newVacations = [...vacations, newVacation];

    const tmam = await getJSON("tmam", {});

    await setJSON("tmam", {
      ...tmam,
      vacations: newVacations,
    });

    setVacations(newVacations);

    setForm({
      personId: "",
      type: "ميدانية",
      from: null,
      to: null,
    });

    toast.success("تمت إضافة الإجازة");
  };

  const handleDelete = (vacation) => {
    setVacationToDelete(vacation);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setVacationToDelete(null);
  };

  const confirmDeleteVacation = async () => {
    if (!vacationToDelete) return;

    const newVacations = vacations.filter(
      (item) => item.id !== vacationToDelete.id,
    );

    const tmam = await getJSON("tmam", {});

    await setJSON("tmam", {
      ...tmam,
      vacations: newVacations,
    });

    setVacations(newVacations);
    handleCloseDelete();

    toast.success("تم حذف الإجازة");
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("ar-EG");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-cyan-900 via-slate-900 to-black text-white py-6 sm:py-10 px-3 sm:px-5">
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
              <BeachAccess
                sx={{
                  fontSize: { xs: 30, sm: 40 },
                  color: "#67e8f9",
                  flexShrink: 0,
                }}
              />

              <div className="text-center min-w-0">
                <h1 className="text-xl sm:text-3xl lg:text-4xl font-black leading-relaxed bg-gradient-to-l from-cyan-300 to-white bg-clip-text text-transparent">
                  الإجازات
                </h1>

                <p className="text-xs sm:text-base text-cyan-200/80 font-semibold mt-1">
                  إدارة إجازات الأفراد
                </p>
              </div>
            </div>

            <div className="w-11 sm:w-24 flex-shrink-0" />
          </div>
        </div>

        <ButtonsTmam />

        {/* ================= Add Vacation ================= */}
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
                إضافة إجازة
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                اختر الفرد ونوع الإجازة ومدة الإجازة
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* ================= الاسم ================= */}
            <div
              className="
      group
      rounded-2xl
      border border-white/10
      bg-gradient-to-br from-slate-900/90 to-slate-950/80
      p-5
      shadow-lg shadow-black/10
      transition-all duration-300
      hover:border-cyan-400/20
      hover:shadow-cyan-500/5
    "
            >
              <label className="flex items-center gap-2 text-sm font-bold text-slate-200 mb-3">
                <span className="w-1.5 h-5 rounded-full bg-cyan-400" />
                اسم الفرد
              </label>

              <div className="relative">
                <select
                  value={form.personId}
                  onChange={(e) => handleChange("personId", e.target.value)}
                  className="
          w-full
          h-12
          rounded-xl
          bg-slate-950/80
          border border-white/10
          text-white
          px-4
          outline-none
          cursor-pointer
          transition-all duration-200
          hover:border-white/20
          focus:border-cyan-400
          focus:ring-4
          focus:ring-cyan-400/10
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
            </div>

            {/* ================= نوع الإجازة ================= */}
            <div
              className="
    group
    rounded-2xl
    border border-white/10
    bg-gradient-to-br from-slate-900/90 to-slate-950/80
    p-5
    shadow-lg shadow-black/10
    transition-all duration-300
    hover:border-cyan-400/20
  "
            >
              <label className="flex items-center gap-2 text-sm font-bold text-slate-200 mb-3">
                <span className="w-1.5 h-5 rounded-full bg-cyan-400" />
                نوع الإجازة
              </label>

              <select
                value={form.type}
                onChange={(e) => handleChange("type", e.target.value)}
                className="
      w-full
      h-12
      rounded-xl
      bg-slate-950/80
      border border-white/10
      text-white
      px-4
      outline-none
      cursor-pointer
      transition-all duration-200
      hover:border-white/20
      focus:border-cyan-400
      focus:ring-4
      focus:ring-cyan-400/10
    "
              >
                <option value="" className="bg-slate-900 text-slate-400">
                  اختر نوع الإجازة
                </option>

                {vacationTypes.map((type) => (
                  <option
                    key={type}
                    value={type}
                    className="bg-slate-900 text-white"
                  >
                    {type}
                  </option>
                ))}
              </select>
            </div>
            {/* ================= من ================= */}
            <div
              className="
    group
    rounded-2xl
    border border-white/10
    bg-gradient-to-br from-slate-900/90 to-slate-950/80
    p-5
    shadow-lg shadow-black/10
    transition-all duration-300
    hover:border-cyan-400/20
  "
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-200 whitespace-nowrap">
                  <span className="w-1.5 h-5 rounded-full bg-cyan-400" />
                  تاريخ بداية الإجازة
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
    w-full
    h-12
    rounded-xl
    bg-slate-950/80
    border border-white/10
    text-white
    px-4
    outline-none
    transition-all duration-200
    hover:border-white/20
    focus:border-cyan-400
    focus:ring-4
    focus:ring-cyan-400/10
  "
                  />
                </div>
              </div>
            </div>

            {/* ================= إلى ================= */}
            <div
              className="
    group
    rounded-2xl
    border border-white/10
    bg-gradient-to-br from-slate-900/90 to-slate-950/80
    p-5
    shadow-lg shadow-black/10
    transition-all duration-300
    hover:border-cyan-400/20
  "
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-200 whitespace-nowrap">
                  <span className="w-1.5 h-5 rounded-full bg-cyan-400" />
                  تاريخ نهاية الإجازة
                </label>

                <div className="relative flex-1">
                  <DatePicker
                    selected={form.to}
                    onChange={(date) => handleChange("to", date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="اختر تاريخ النهاية"
                    minDate={form.from || undefined}
                    withPortal
                    portalId="datepicker-portal"
                    className="
    w-full
    h-12
    rounded-xl
    bg-slate-950/80
    border border-white/10
    text-white
    px-4
    outline-none
    transition-all duration-200
    hover:border-white/20
    focus:border-cyan-400
    focus:ring-4
    focus:ring-cyan-400/10
  "
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ================= Preview ================= */}
          {form.personId && (
            <div
              className="
        mt-5
        rounded-2xl
        border border-cyan-400/10
        bg-cyan-400/5
        p-4
      "
            >
              <p className="text-xs text-slate-400 mb-2">معاينة الإجازة</p>

              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-bold text-white">
                  {
                    sortedNames.find(
                      (person) => String(person.id) === String(form.personId),
                    )?.name
                  }
                </span>

                <span className="text-slate-500">•</span>

                <span className="text-cyan-300 font-bold">{form.type}</span>

                {form.from && form.to && (
                  <>
                    <span className="text-slate-500">•</span>

                    <span className="text-slate-300">
                      {formatDate(form.from)}
                    </span>

                    <span className="text-slate-500">←</span>

                    <span className="text-slate-300">
                      {formatDate(form.to)}
                    </span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ================= Add Button ================= */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleAdd}
              className="
        flex
        items-center
        justify-center
        gap-2
        min-w-40
        px-7
        py-3
        rounded-xl
        bg-gradient-to-r
        from-cyan-600
        to-blue-600
        hover:from-cyan-500
        hover:to-blue-500
        text-white
        font-black
        shadow-lg
        shadow-cyan-500/10
        transition
        cursor-pointer
      "
            >
              <Add sx={{ fontSize: 22 }} />
              إضافة الإجازة
            </button>
          </div>
        </section>
        {/* ================= Vacations List ================= */}
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
              الإجازات الحالية
            </h2>

            {vacations.length === 0 ? (
              <div className="text-center text-slate-400 py-8">
                لا توجد إجازات مضافة
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[750px] border-collapse">
                  <thead>
                    <tr>
                      <th className="p-3 border border-white/15 text-cyan-300">
                        م
                      </th>
                      <th className="p-3 border border-white/15 text-cyan-300">
                        الدرجة
                      </th>
                      <th className="p-3 border border-white/15 text-cyan-300">
                        الاسم
                      </th>

                      <th className="p-3 border border-white/15 text-cyan-300">
                        نوع الإجازة
                      </th>

                      <th className="p-3 border border-white/15 text-cyan-300">
                        من
                      </th>

                      <th className="p-3 border border-white/15 text-cyan-300">
                        إلى
                      </th>

                      <th className="p-3 border border-white/15 text-cyan-300">
                        حذف
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {vacations.map((vacation, index) => (
                      <tr key={vacation.id}>
                        <td className="p-3 border border-white/15 text-center">
                          {index + 1}
                        </td>
                        <td className="p-3 border border-white/15 text-center">
                          {vacation.rank}
                        </td>
                        <td className="p-3 border border-white/15 text-center">
                          {vacation.name}
                        </td>

                        <td className="p-3 border border-white/15 text-center">
                          {vacation.type}
                        </td>

                        <td className="p-3 border border-white/15 text-center">
                          {formatDate(vacation.from)}
                        </td>

                        <td className="p-3 border border-white/15 text-center">
                          {formatDate(vacation.to)}
                        </td>

                        <td className="p-3 border border-white/15 text-center">
                          <button
                            onClick={() => handleDelete(vacation)}
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
          <div className="text-lg">هل أنت متأكد من حذف الإجازة؟</div>

          {vacationToDelete && (
            <div className="mt-3 text-xl font-bold text-red-400">
              {vacationToDelete.name}
            </div>
          )}

          {vacationToDelete && (
            <div className="mt-2 text-sm text-slate-400">
              {vacationToDelete.type} — {formatDate(vacationToDelete.from)} ←{" "}
              {formatDate(vacationToDelete.to)}
            </div>
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
            onClick={confirmDeleteVacation}
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

export default PageVacations;
