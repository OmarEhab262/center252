import { useEffect, useState } from "react";
import { ArrowBack, Flight, Delete, Add } from "@mui/icons-material";
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

const PageOutCountry = () => {
  const [listNames, setListNames] = useState([]);
  const [outCountries, setOutCountries] = useState([]);

  const [openDelete, setOpenDelete] = useState(false);
  const [outCountryToDelete, setOutCountryToDelete] = useState(null);

  const [form, setForm] = useState({
    personId: "",
    country: "",
    reason: "",
    from: null,
    to: null,
  });

  useEffect(() => {
    const loadData = async () => {
      const names = await getJSON("listNames", []);
      const tmam = await getJSON("tmam", {});

      setListNames(names);
      setOutCountries(tmam.outCountries || []);
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
      toast.error("من فضلك اختر الاسم");
      return;
    }

    if (!form.country.trim()) {
      toast.error("من فضلك أدخل الدولة");
      return;
    }

    if (!form.reason.trim()) {
      toast.error("من فضلك أدخل سبب السفر");
      return;
    }

    if (!form.from || !form.to) {
      toast.error("من فضلك اختر تاريخ البداية والنهاية");
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
      toast.error("الشخص غير موجود");
      return;
    }

    const newOutCountry = {
      id: Date.now(),
      personId: person.id,
      name: person.name,
      rank: person.rank,
      country: form.country.trim(),
      reason: form.reason.trim(),
      from: form.from.toISOString(),
      to: form.to.toISOString(),
    };

    const updated = [...outCountries, newOutCountry];

    const tmam = await getJSON("tmam", {});

    await setJSON("tmam", {
      ...tmam,
      outCountries: updated,
    });

    setOutCountries(updated);

    setForm({
      personId: "",
      country: "",
      reason: "",
      from: null,
      to: null,
    });

    toast.success("تمت إضافة خارج البلاد");
  };

  const handleDelete = (item) => {
    setOutCountryToDelete(item);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setOutCountryToDelete(null);
  };

  const confirmDelete = async () => {
    if (!outCountryToDelete) return;

    const updated = outCountries.filter(
      (item) => item.id !== outCountryToDelete.id,
    );

    const tmam = await getJSON("tmam", {});

    await setJSON("tmam", {
      ...tmam,
      outCountries: updated,
    });

    setOutCountries(updated);

    handleCloseDelete();

    toast.success("تم حذف خارج البلاد");
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
              <span className="hidden sm:inline">رجوع</span>
            </Button>

            <div className="flex items-center justify-center gap-3 flex-1 min-w-0">
              <Flight
                sx={{
                  fontSize: { xs: 30, sm: 40 },
                  color: "#67e8f9",
                  flexShrink: 0,
                }}
              />

              <div className="text-center min-w-0">
                <h1 className="text-xl sm:text-3xl lg:text-4xl font-black leading-relaxed bg-gradient-to-l from-cyan-300 to-white bg-clip-text text-transparent">
                  خارج البلاد
                </h1>

                <p className="text-xs sm:text-base text-cyan-200/80 font-semibold mt-1">
                  تسجيل ومتابعة حالات خارج البلاد
                </p>
              </div>
            </div>

            <div className="w-11 sm:w-24 flex-shrink-0" />
          </div>
        </div>

        <ButtonsTmam />

        {/* ================= Add Section ================= */}
        <section
          dir="rtl"
          className="mt-6 bg-white/10 rounded-3xl shadow-2xl backdrop-blur border border-white/10 p-5 sm:p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center">
              <Add sx={{ color: "#67e8f9" }} />
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                إضافة خارج البلاد
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                أدخل بيانات خارج البلاد
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* ================= Person ================= */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-950/80 p-5 shadow-lg">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-200 mb-3">
                <span className="w-1.5 h-5 rounded-full bg-cyan-400" />
                الاسم
              </label>

              <select
                value={form.personId}
                onChange={(e) => handleChange("personId", e.target.value)}
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
              >
                <option value="" className="bg-slate-900">
                  اختر الاسم
                </option>

                {listNames.map((person) => (
                  <option
                    key={person.id}
                    value={person.id}
                    className="bg-slate-900"
                  >
                    {person.name} - {person.rank}
                  </option>
                ))}
              </select>
            </div>

            {/* ================= Country ================= */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-950/80 p-5 shadow-lg">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-200 mb-3">
                <span className="w-1.5 h-5 rounded-full bg-cyan-400" />
                الدولة
              </label>

              <input
                type="text"
                value={form.country}
                onChange={(e) => handleChange("country", e.target.value)}
                placeholder="أدخل الدولة"
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

            {/* ================= Reason ================= */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-950/80 p-5 shadow-lg">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-200 mb-3">
                <span className="w-1.5 h-5 rounded-full bg-cyan-400" />
                سبب السفر
              </label>

              <input
                type="text"
                value={form.reason}
                onChange={(e) => handleChange("reason", e.target.value)}
                placeholder="أدخل سبب السفر"
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

            {/* ================= From ================= */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-950/80 p-5 shadow-lg">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-200 mb-3">
                <span className="w-1.5 h-5 rounded-full bg-cyan-400" />
                تاريخ البداية
              </label>

              <DatePicker
                selected={form.from}
                onChange={(date) => handleChange("from", date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="اختر التاريخ"
                withPortal
                portalId="datepicker-portal"
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

            {/* ================= To ================= */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-950/80 p-5 shadow-lg">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-200 mb-3">
                <span className="w-1.5 h-5 rounded-full bg-cyan-400" />
                تاريخ النهاية
              </label>

              <DatePicker
                selected={form.to}
                onChange={(date) => handleChange("to", date)}
                minDate={form.from || undefined}
                dateFormat="dd/MM/yyyy"
                placeholderText="اختر التاريخ"
                withPortal
                portalId="datepicker-portal"
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
              إضافة خارج البلاد
            </button>
          </div>
        </section>

        {/* ================= List ================= */}
        <section
          dir="rtl"
          className="mt-6 bg-white/10 rounded-3xl shadow-2xl backdrop-blur border border-white/10"
        >
          <div className="p-5">
            <h2 className="text-lg font-bold text-cyan-200 mb-4">
              حالات خارج البلاد الحالية
            </h2>

            {outCountries.length === 0 ? (
              <div className="text-center py-10 text-slate-400">
                لا توجد حالات خارج البلاد حالياً
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[950px] border-collapse">
                  <thead>
                    <tr className="bg-slate-950/60">
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
                        الدولة
                      </th>

                      <th className="p-3 border border-white/15 text-cyan-300">
                        سبب السفر
                      </th>

                      <th className="p-3 border border-white/15 text-cyan-300">
                        التاريخ من
                      </th>

                      <th className="p-3 border border-white/15 text-cyan-300">
                        التاريخ إلى
                      </th>

                      <th className="p-3 border border-white/15 text-cyan-300">
                        حذف
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {outCountries.map((item, index) => (
                      <tr key={item.id} className="hover:bg-white/5 transition">
                        <td className="p-3 border border-white/15 text-center">
                          {index + 1}
                        </td>

                        <td className="p-3 border border-white/15 text-center">
                          {item.rank || "-"}
                        </td>

                        <td className="p-3 border border-white/15 text-center font-bold">
                          {item.name || "-"}
                        </td>

                        <td className="p-3 border border-white/15 text-center">
                          {item.country || "-"}
                        </td>

                        <td className="p-3 border border-white/15 text-center">
                          {item.reason || "-"}
                        </td>

                        <td className="p-3 border border-white/15 text-center">
                          {formatDate(item.from)}
                        </td>

                        <td className="p-3 border border-white/15 text-center">
                          {formatDate(item.to)}
                        </td>

                        <td className="p-3 border border-white/15 text-center">
                          <button
                            onClick={() => handleDelete(item)}
                            className="
                              w-10 h-10
                              inline-flex
                              items-center
                              justify-center
                              rounded-xl
                              bg-red-500/10
                              border border-red-500/20
                              text-red-400
                              hover:bg-red-500/20
                              hover:text-red-300
                              transition
                              cursor-pointer
                            "
                          >
                            <Delete sx={{ fontSize: 20 }} />
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
              textAlign: "center",
              fontWeight: "900",
              color: "#fff",
              pt: 3,
            }}
          >
            تأكيد الحذف
          </DialogTitle>

          <DialogContent>
            <p className="text-center text-slate-300 leading-7">
              هل أنت متأكد من حذف حالة خارج البلاد الخاصة بـ
              <span className="text-cyan-300 font-bold mx-1">
                {outCountryToDelete?.name}
              </span>
              ؟
            </p>
          </DialogContent>

          <DialogActions
            sx={{
              justifyContent: "center",
              gap: 1,
              pb: 3,
            }}
          >
            <Button
              onClick={handleCloseDelete}
              variant="outlined"
              sx={{
                color: "#cbd5e1",
                borderColor: "rgba(255,255,255,0.2)",
                borderRadius: "10px",
                fontWeight: "bold",
                "&:hover": {
                  borderColor: "#94a3b8",
                  bgcolor: "rgba(148,163,184,0.08)",
                },
              }}
            >
              إلغاء
            </Button>

            <Button
              onClick={confirmDelete}
              variant="contained"
              sx={{
                bgcolor: "#dc2626",
                borderRadius: "10px",
                fontWeight: "bold",
                "&:hover": {
                  bgcolor: "#b91c1c",
                },
              }}
            >
              حذف
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default PageOutCountry;
