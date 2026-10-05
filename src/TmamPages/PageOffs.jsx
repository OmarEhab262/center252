import { useEffect, useState } from "react";

import { ArrowBack, Visibility } from "@mui/icons-material";

import { Button } from "@mui/material";

import { Link } from "react-router-dom";

import toast from "react-hot-toast";

import ButtonsTmam from "../components/ButtonsTmam";

import { getJSON, setJSON } from "../utils/storage";

const PageOffs = () => {
  const [listNames, setListNames] = useState([]);

  const [counts, setCounts] = useState({
    الخارج: 0,
    الموجود: 0,
    إجازة: 0,
    "إجازة مرضية": 0,
    المستشفى: 0,
    مأمورية: 0,
    الفرقة: 0,
    "خارج التمركز": 0,
    "خارج البلاد": 0,
    غياب: 0,
    سجن: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      const names = await getJSON("listNames", []);
      const tmam = await getJSON("tmam", {});

      const savedCounts = tmam.tmamOfficers || {};

      setListNames(names);

      setCounts((prev) => ({
        ...prev,
        ...savedCounts,
      }));
    };

    loadData();
  }, []);

  const officers = [
    "لواء أح",
    "لواء",
    "عميد أح",
    "عميد",
    "عقيد أح",
    "عقيد",
    "مقدم أح",
    "مقدم",
    "رائد أح",
    "رائد",
    "نقيب",
    "ملازم.أ",
    "ملازم",
  ];

  const officersCount = listNames.filter((person) =>
    officers.includes(person.rank),
  ).length;

  const outsideTypes = [
    "إجازة",
    "إجازة مرضية",
    "المستشفى",
    "مأمورية",
    "الفرقة",
    "خارج التمركز",
    "خارج البلاد",
    "غياب",
    "سجن",
  ];

  const outsideTotal = outsideTypes.reduce(
    (total, type) => total + Number(counts[type] || 0),
    0,
  );

  const presentCount = Math.max(0, officersCount - Number(counts.الخارج || 0));

  const handleChange = (name, value) => {
    const numberValue = Math.max(0, Number(value) || 0);

    setCounts((prev) => ({
      ...prev,
      [name]: numberValue,
    }));
  };

  const handleSave = async () => {
    const outside = Number(counts.الخارج || 0);

    if (outside > officersCount) {
      toast.error("عدد الخارج لا يمكن أن يكون أكبر من عدد الضباط");
      return;
    }

    if (outsideTotal !== outside) {
      toast.error(
        `يجب أن يكون مجموع حالات الخارج (${outsideTotal}) مساويًا لعدد الخارج (${outside})`,
      );
      return;
    }

    const dataToSave = {
      ...counts,
      القوة: officersCount,
      الموجود: presentCount,
    };
    const tmam = await getJSON("tmam", {});

    await setJSON("tmam", {
      ...tmam,
      tmamOfficers: dataToSave,
    });

    setCounts(dataToSave);

    toast.success("تم حفظ التمام بنجاح");
  };
  const sectionSx = {
    backgroundColor: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    marginTop: "24px",
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-cyan-900 via-slate-900 to-black text-white py-6 sm:py-10 px-3 sm:px-5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
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
              <Visibility
                sx={{
                  fontSize: { xs: 30, sm: 40 },
                  color: "#67e8f9",
                  flexShrink: 0,
                }}
              />

              <div className="text-center min-w-0">
                <h1 className="text-xl sm:text-3xl lg:text-4xl font-black leading-relaxed bg-gradient-to-l from-cyan-300 to-white bg-clip-text text-transparent">
                  تمام الضباط
                </h1>

                <p className="text-xs sm:text-base text-cyan-200/80 font-semibold mt-1">
                  بيانات تمام الضباط
                </p>
              </div>
            </div>

            <div className="w-11 sm:w-24 flex-shrink-0" />
          </div>
        </div>

        <ButtonsTmam />

        {/* Counts */}
        <section dir="rtl" style={sectionSx}>
          <div className="p-4">
            {/* Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {/* العدد الكلي */}
              <div className="relative overflow-hidden rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 p-3">
                <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-400/5 rounded-full blur-xl" />

                <div className="relative flex flex-col items-center gap-2">
                  <span className="text-xs font-bold text-cyan-200">
                    العدد الكلي
                  </span>

                  <div className="flex items-center justify-center w-16 h-10 rounded-xl bg-slate-900/70 border border-cyan-400/20">
                    <span className="text-lg font-black text-cyan-300">
                      {officersCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* الخارج */}
              <div className="relative overflow-hidden rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 p-3">
                <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-400/5 rounded-full blur-xl" />

                <div className="relative flex flex-col items-center gap-2">
                  <span className="text-xs font-bold text-cyan-200">
                    الخارج
                  </span>

                  <input
                    type="number"
                    min="0"
                    max={officersCount}
                    value={counts.الخارج}
                    onChange={(e) => handleChange("الخارج", e.target.value)}
                    className="
          w-16
          h-10
          rounded-xl
          bg-slate-950/80
          border border-cyan-400/20
          text-cyan-300
          text-center
          text-base
          font-black
          outline-none
          transition
          focus:border-cyan-400
          focus:ring-2
          focus:ring-cyan-400/20
        "
                  />
                </div>
              </div>

              {/* الموجود */}
              <div className="relative overflow-hidden rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 p-3">
                <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-400/5 rounded-full blur-xl" />

                <div className="relative flex flex-col items-center gap-2">
                  <span className="text-xs font-bold text-cyan-200">
                    الموجود
                  </span>

                  <div className="flex items-center justify-center w-16 h-10 rounded-xl bg-slate-900/70 border border-cyan-400/20">
                    <span className="text-lg font-black text-cyan-300">
                      {presentCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* حالات الخارج */}
              {outsideTypes.map((item) => (
                <div
                  key={item}
                  className="
        relative
        overflow-hidden
        rounded-2xl
        border border-cyan-400/20
        bg-gradient-to-br
        from-cyan-500/10
        to-blue-500/5
        p-3
        transition-all
        duration-200
        hover:border-cyan-400/35
        hover:from-cyan-500/15
        hover:to-blue-500/10
      "
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-400/5 rounded-full blur-xl" />

                  <div className="relative flex flex-col items-center gap-2">
                    <span className="text-xs font-bold text-cyan-200 whitespace-nowrap">
                      {item}
                    </span>

                    <input
                      type="number"
                      min="0"
                      value={counts[item]}
                      onChange={(e) => handleChange(item, e.target.value)}
                      className="
            w-16
            h-10
            rounded-xl
            bg-slate-950/80
            border border-cyan-400/20
            text-cyan-300
            text-center
            text-base
            font-black
            outline-none
            transition
            focus:border-cyan-400
            focus:ring-2
            focus:ring-cyan-400/20
          "
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* حفظ */}
            <div className="flex justify-center mt-5">
              <button
                onClick={handleSave}
                className="
                  px-6
                  py-2
                  rounded-xl
                  bg-cyan-600
                  hover:bg-cyan-500
                  text-white
                  font-bold
                  transition
                  cursor-pointer
                "
              >
                حفظ
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PageOffs;
