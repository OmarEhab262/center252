import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { Edit, Delete, ArrowBack, KeyboardArrowUp } from "@mui/icons-material";

import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import toast from "react-hot-toast";

import { getUnitName } from "../utils/unitName";

import { getJSON, setJSON } from "../utils/storage";

const Add = () => {
  const ranks = [
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

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, []);

  const [name, setName] = useState("");
  const [rank, setRank] = useState("");

  const [editId, setEditId] = useState(null);

  const [showTopButton, setShowTopButton] = useState(false);

  const unitName = getUnitName();

  const [list, setList] = useState([]);

  const [loaded, setLoaded] = useState(false);

  // Dialog states
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState("");

  const [editPerson, setEditPerson] = useState(null);

  // تحميل القائمة
  useEffect(() => {
    (async () => {
      const saved = await getJSON("listNames", []);
      setList(saved);
      setLoaded(true);
    })();
  }, []);

  const addPerson = () => {
    if (!name.trim()) {
      toast.error("من فضلك اكتب الاسم");
      return;
    }

    if (!rank) {
      toast.error("من فضلك اختر الرتبة / الدرجة");
      return;
    }

    if (editId) {
      setList((prev) =>
        prev.map((person) =>
          person.id === editId
            ? {
                ...person,
                name,
                rank,
              }
            : person,
        ),
      );

      toast.success("تم تحديث البيانات بنجاح");

      setEditId(null);
    } else {
      setList((prev) => [
        {
          id: Date.now(),
          name,
          rank,
        },
        ...prev,
      ]);

      toast.success("تمت الإضافة بنجاح");
    }

    setName("");
    setRank("");
  };

  // فتح Dialog التعديل
  const openEditDialog = (person) => {
    setEditPerson(person);
  };

  // تأكيد التعديل
  const confirmEdit = () => {
    if (!editPerson) return;

    setEditId(editPerson.id);
    setName(editPerson.name);
    setRank(editPerson.rank);

    setEditPerson(null);

    // نستخدم نفس الـ function القديمة
    setTimeout(() => {
      setList((prev) =>
        prev.map((person) =>
          person.id === editPerson.id
            ? {
                ...person,
                name: editPerson.name,
                rank: editPerson.rank,
              }
            : person,
        ),
      );

      toast.success("تم تحديث البيانات بنجاح");

      setEditId(null);
      setName("");
      setRank("");
    }, 0);
  };

  // فتح Dialog الحذف
  const openDeleteDialog = (person) => {
    setDeleteId(person.id);
    setDeleteName(person.name);
  };

  // تأكيد الحذف
  const confirmDelete = () => {
    setList((prev) => prev.filter((person) => person.id !== deleteId));

    toast.success("تم الحذف");

    setDeleteId(null);
    setDeleteName("");
  };

  // حفظ القائمة
  useEffect(() => {
    if (!loaded) return;

    setJSON("listNames", list);
  }, [list, loaded]);

  // Scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowTopButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  const getPersonType = (rank) => {
    const officers = [
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
    ];

    const nco = ["مساعد.أ", "مساعد", "رقيب.أ", "رقيب", "عريف"];

    const soldiers = ["رقيب مجند", "عريف مجند", "جندى"];

    if (officers.includes(rank)) return "ضابط";

    if (nco.includes(rank)) return "صف ضابط";

    if (soldiers.includes(rank)) return "جندي";

    return "";
  };

  const rankOrder = [
    // ضباط
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

    // صف ضباط
    "مساعد.أ",
    "مساعد",
    "رقيب.أ",
    "رقيب",
    "عريف",

    // جنود
    "رقيب مجند",
    "عريف مجند",
    "جندى",
    "---",
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-cyan-900 via-slate-900 to-black text-white py-5 sm:py-10 px-3">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 rounded-3xl shadow-2xl p-5 sm:p-8 backdrop-blur border border-white/10">
          <div className="flex items-center justify-between gap-4">
            {/* Back Button */}
            <Button
              variant="outlined"
              component={Link}
              to="/"
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

            {/* Title */}
            <div className="flex items-center justify-center gap-3 flex-1 min-w-0">
              <span className="text-3xl sm:text-4xl shrink-0">👥</span>

              <div className="text-center min-w-0">
                <h1 className="text-lg sm:text-3xl lg:text-4xl font-black leading-relaxed bg-gradient-to-l from-cyan-300 to-white bg-clip-text text-transparent">
                  إضافة أسماء خدمة
                </h1>

                <p className="text-xs sm:text-base text-cyan-200/80 font-semibold mt-1 truncate">
                  {unitName}
                </p>
              </div>
            </div>

            <div className="w-11 sm:w-24 flex-shrink-0" />
          </div>
        </div>

        {/* Add Person */}
        <div className="bg-white/10 rounded-3xl shadow-2xl  mt-8 p-5 sm:p-8 border border-white/10">
          {/* Section Title */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-400/20 flex items-center justify-center shrink-0">
              <span className="text-xl">➕</span>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                إضافة فرد جديد
              </h2>

              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                أدخل اسم الفرد واختر الرتبة / درجة
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-end">
            {/* Name */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-cyan-100 mb-2">
                الاسم
              </label>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="
          w-full
          h-[50px]
          rounded-xl
          px-4
          bg-slate-950/60
          border border-white/10
          text-white
          placeholder:text-slate-500
          outline-none
          transition-all duration-200
          focus:border-cyan-400/60
          focus:ring-2
          focus:ring-cyan-400/10
          hover:border-white/20
        "
                placeholder="اكتب اسم الفرد"
              />
            </div>

            {/* Rank */}
            <div className="w-full md:w-56">
              <label className="block text-sm font-semibold text-cyan-100 mb-2">
                الرتبة / الدرجة
              </label>

              <select
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                className="
    w-full
    h-[50px]
    rounded-xl
    px-4
    bg-slate-950/60
    border border-white/10
    text-white
    text-sm
    outline-none
    transition-all duration-200
    focus:border-cyan-400/60
    focus:ring-2
    focus:ring-cyan-400/10
    hover:border-white/20
    cursor-pointer
  "
              >
                <option
                  value=""
                  className="bg-slate-900 text-slate-400 text-sm"
                >
                  اختر الرتبة / درجة
                </option>

                {ranks.map((item) => (
                  <option
                    key={item}
                    value={item}
                    className="bg-slate-900 text-white text-sm"
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Add */}
          <div className="flex justify-center items-center mt-3 w-full">
            {" "}
            <Button
              variant="contained"
              onClick={addPerson}
              sx={{
                minWidth: {
                  xs: "100%",
                  // md: 140,
                },
                height: 50,
                borderRadius: "12px",
                fontWeight: "bold",
                fontSize: "16px",
                color: "#fff",
                background:
                  "linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #2563eb 100%)",
                border: "1px solid rgba(103,232,249,0.3)",
                boxShadow:
                  "0 6px 20px rgba(6,182,212,0.2), inset 0 1px 0 rgba(255,255,255,0.12)",
                textTransform: "none",
                transition: "all 0.25s ease",

                "&:hover": {
                  background:
                    "linear-gradient(135deg, #22d3ee 0%, #06b6d4 50%, #3b82f6 100%)",
                  boxShadow:
                    "0 8px 25px rgba(6,182,212,0.35), inset 0 1px 0 rgba(255,255,255,0.18)",
                  transform: "translateY(-2px)",
                },

                "&:active": {
                  transform: "translateY(0)",
                },
              }}
            >
              إضافة
            </Button>
          </div>
        </div>

        {/* List */}
        <div className="bg-white/10 rounded-3xl shadow-2xl backdrop-blur mt-8 p-5 sm:p-8">
          {list.length === 0 ? (
            <div className="text-center text-2xl py-8">لا يوجد أسماء</div>
          ) : (
            <div className="space-y-6">
              {[
                {
                  title: "ضباط",
                  type: "ضابط",
                },
                {
                  title: "صف ضباط",
                  type: "صف ضابط",
                },
                {
                  title: "جنود",
                  type: "جندي",
                },
              ].map((category) => {
                const categoryList = list
                  .filter(
                    (person) => getPersonType(person.rank) === category.type,
                  )
                  .sort(
                    (a, b) =>
                      rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank),
                  );

                if (categoryList.length === 0) return null;

                return (
                  <div key={category.type}>
                    {/* Category Separator */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-px flex-1 bg-white/10" />

                      <span
                        className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-full ${
                          category.type === "ضابط"
                            ? "bg-blue-500/20 text-blue-300"
                            : category.type === "صف ضابط"
                              ? "bg-yellow-500/20 text-yellow-300"
                              : "bg-green-500/20 text-green-300"
                        }`}
                      >
                        {category.title}
                      </span>

                      <div className="h-px flex-1 bg-white/10" />
                    </div>

                    {/* People */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {categoryList.map((person) => (
                        <div
                          key={person.id}
                          className="flex items-center justify-between gap-3 bg-white/10 border-b border-white/20 rounded-xl px-4 py-3 hover:bg-white/20 transition"
                        >
                          {/* Person Info */}
                          <div className="min-w-0 flex-1">
                            <h3 className="text-base sm:text-lg font-bold truncate">
                              <span className="text-cyan-300 text-xl mt-1">
                                {person.rank}/
                              </span>{" "}
                              {person.name}
                            </h3>
                          </div>

                          {/* Buttons */}
                          <div className="flex gap-1.5 shrink-0">
                            {/* Edit */}
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => openEditDialog(person)}
                              sx={{
                                minWidth: 38,
                                width: 38,
                                height: 38,
                                p: 0,
                                borderRadius: "8px",
                              }}
                            >
                              <Edit sx={{ fontSize: 18 }} />
                            </Button>

                            {/* Delete */}
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => openDeleteDialog(person)}
                              sx={{
                                minWidth: 38,
                                width: 38,
                                height: 38,
                                p: 0,
                                borderRadius: "8px",
                              }}
                            >
                              <Delete sx={{ fontSize: 18 }} />
                            </Button>
                          </div>
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

      {/* ================= DELETE DIALOG ================= */}

      <Dialog
        open={deleteId !== null}
        onClose={() => {
          setDeleteId(null);
          setDeleteName("");
        }}
        fullWidth
        maxWidth="xs"
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "#0f172a !important",
            backgroundImage: "none !important",
            color: "#fff !important",
            borderRadius: "20px !important",
            border: "1px solid rgba(255,255,255,0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#fff",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          تأكيد الحذف
        </DialogTitle>

        <DialogContent>
          <div className="text-center text-slate-300 py-2 leading-8">
            هل أنت متأكد من حذف
            <div className="text-red-400 font-bold text-lg">{deleteName}</div>
            من القائمة؟
          </div>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "center",
            gap: 1,
            pb: 3,
          }}
        >
          <Button
            onClick={() => {
              setDeleteId(null);
              setDeleteName("");
            }}
            variant="outlined"
            sx={{
              color: "#cbd5e1",
              borderColor: "rgba(255,255,255,0.2)",
              borderRadius: "10px",
              px: 3,

              "&:hover": {
                borderColor: "#94a3b8",
                backgroundColor: "rgba(255,255,255,0.05)",
              },
            }}
          >
            إلغاء
          </Button>

          <Button
            onClick={confirmDelete}
            variant="contained"
            color="error"
            sx={{
              borderRadius: "10px",
              px: 3,
              fontWeight: "bold",
            }}
          >
            حذف
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================= EDIT DIALOG ================= */}

      <Dialog
        open={editPerson !== null}
        onClose={() => setEditPerson(null)}
        fullWidth
        maxWidth="sm"
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "#0f172a !important",
            backgroundImage: "none !important",
            color: "#fff !important",
            borderRadius: "20px !important",
            border: "1px solid rgba(255,255,255,0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#fff",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          تعديل بيانات الفرد
        </DialogTitle>

        <DialogContent>
          <div className="flex flex-col gap-4 mt-2">
            {/* Name */}
            <input
              value={editPerson?.name || ""}
              onChange={(e) =>
                setEditPerson((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="w-full rounded-xl p-3 bg-white text-black outline-none"
              placeholder="الاسم"
            />

            {/* Rank */}
            <select
              value={editPerson?.rank || ""}
              onChange={(e) =>
                setEditPerson((prev) => ({
                  ...prev,
                  rank: e.target.value,
                }))
              }
              className="w-full rounded-xl p-3 text-black bg-white outline-none"
            >
              <option value="">اختر الرتبة / درجة</option>

              {ranks.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "center",
            gap: 1,
            pb: 3,
          }}
        >
          <Button
            onClick={() => setEditPerson(null)}
            variant="outlined"
            sx={{
              color: "#cbd5e1",
              borderColor: "rgba(255,255,255,0.2)",
              borderRadius: "10px",
              px: 3,

              "&:hover": {
                borderColor: "#94a3b8",
                backgroundColor: "rgba(255,255,255,0.05)",
              },
            }}
          >
            إلغاء
          </Button>

          <Button
            onClick={confirmEdit}
            variant="contained"
            color="warning"
            sx={{
              borderRadius: "10px",
              px: 3,
              fontWeight: "bold",
            }}
          >
            تحديث
          </Button>
        </DialogActions>
      </Dialog>

      {/* Scroll To Top */}
      {showTopButton && (
        <Button
          variant="contained"
          onClick={scrollToTop}
          sx={{
            position: "fixed",
            bottom: 25,
            right: 25,
            minWidth: 55,
            width: 55,
            height: 55,
            borderRadius: "50%",
            backgroundColor: "#06b6d4",
            color: "#fff",
            zIndex: 9999,
            boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
            animation: "fadeInUp 0.3s ease-out",

            "&:hover": {
              backgroundColor: "#0891b2",
              transform: "translateY(-5px)",
              boxShadow: "0 10px 25px rgba(0,0,0,0.45)",
            },

            transition: "all 0.25s ease",

            "@keyframes fadeInUp": {
              from: {
                opacity: 0,
                transform: "translateY(20px)",
              },
              to: {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
          }}
        >
          <KeyboardArrowUp sx={{ fontSize: 30 }} />
        </Button>
      )}
    </div>
  );
};

export default Add;
