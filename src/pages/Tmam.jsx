import { useState } from "react";

import {
  ArrowBack,
  CalendarMonth,
  Person,
  Groups,
  EventAvailable,
  LocalHospital,
  Assignment,
  School,
  Flight,
  PersonOff,
  Lock,
  Save,
} from "@mui/icons-material";

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import ButtonsTmam from "../components/ButtonsTmam";

const Tmam = () => {
  const [isSaving, setIsSaving] = useState(false);

  const unitName = localStorage.getItem("unitName");

  const tmam = JSON.parse(localStorage.getItem("tmam") || "{}");

  const {
    tmamOfficers = {},
    tmamNCOs = {},
    tmamSoldiers = {},
    vacations = [],
    sickLeaves = [],
    hospitals = [],
    missions = [],
    bands = [],
    outCenters = [],
    outCountries = [],
    absences = [],
    prisons = [],
  } = tmam;

  const listNames = JSON.parse(localStorage.getItem("listNames") || "[]");

  // =========================================================
  // الرتب
  // =========================================================

  const officerRanks = [
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
    "نقيب أح",
    "نقيب",
    "ملازم أول أح",
    "ملازم أول",
    "ملازم.أ",
    "ملازم",
  ];

  const ncoRanks = [
    "مساعد أول",
    "مساعد.أ",
    "مساعد",
    "رقيب أول",
    "رقيب.أ",
    "رقيب",
    "عريف",
  ];

  const soldierRanks = ["رقيب مجند", "عريف مجند", "جندى"];

  const getPersonCategory = (person) => {
    const rank = String(person?.rank || "").trim();

    if (officerRanks.includes(rank)) {
      return "officers";
    }

    if (ncoRanks.includes(rank)) {
      return "ncos";
    }

    if (soldierRanks.includes(rank)) {
      return "soldiers";
    }

    return "unknown";
  };

  // =========================================================
  // مصادر كل الأشخاص الخارجين
  // =========================================================

  const outsideSources = [
    {
      type: "vacation",
      label: "إجازة",
      data: vacations,
    },
    {
      type: "sickLeave",
      label: "إجازة مرضية",
      data: sickLeaves,
    },
    {
      type: "hospital",
      label: "المستشفى",
      data: hospitals,
    },
    {
      type: "mission",
      label: "مأمورية",
      data: missions,
    },
    {
      type: "band",
      label: "الفرقة",
      data: bands,
    },
    {
      type: "outCenter",
      label: "خارج التمركز",
      data: outCenters,
    },
    {
      type: "outCountry",
      label: "خارج البلاد",
      data: outCountries,
    },
    {
      type: "absence",
      label: "غياب",
      data: absences,
    },
    {
      type: "prison",
      label: "سجن",
      data: prisons,
    },
  ];

  // =========================================================
  // إنشاء Map للأشخاص الخارجين
  //
  // مهم:
  // ID هو المرجع الأساسي وليس الاسم
  // =========================================================

  const outsidePeopleMap = new Map();

  outsideSources.forEach(({ type, label, data }) => {
    if (!Array.isArray(data)) return;

    data.forEach((item) => {
      if (
        item?.personId === undefined ||
        item?.personId === null ||
        item?.personId === ""
      ) {
        return;
      }

      const personId = Number(item.personId);

      if (Number.isNaN(personId)) {
        return;
      }

      if (!outsidePeopleMap.has(personId)) {
        const originalPerson = listNames.find(
          (person) => Number(person.id) === personId,
        );

        outsidePeopleMap.set(personId, {
          ...(originalPerson || {}),
          id: personId,
          name: item.name || originalPerson?.name || "",
          rank: item.rank || originalPerson?.rank || "",
          statuses: [],
        });
      }

      outsidePeopleMap.get(personId).statuses.push({
        type,
        label,
        ...item,
      });
    });
  });

  const outsidePeople = Array.from(outsidePeopleMap.values());

  // =========================================================
  // IDs الأشخاص الخارجين
  // =========================================================

  const outsideIds = new Set(outsidePeople.map((person) => Number(person.id)));

  // =========================================================
  // الأشخاص الموجودون فعليًا
  //
  // أي شخص ليس له ID في الخارج = موجود
  // =========================================================

  const insidePeople = listNames
    .filter((person) => !outsideIds.has(Number(person.id)))
    .map((person) => ({
      ...person,
      statuses: [],
    }));

  // =========================================================
  // القوة الكلية الفعلية
  // =========================================================

  const actualTotalCount = listNames.length;

  // =========================================================
  // الخارج الفعلي
  // =========================================================

  const actualOutsideCount = outsidePeople.length;

  // =========================================================
  // الموجود الفعلي
  // =========================================================

  const actualInsideCount = insidePeople.length;

  // =========================================================
  // الأشخاص الذين لديهم أكثر من حالة
  // =========================================================

  const peopleWithMultipleStatuses = outsidePeople.filter(
    (person) => person.statuses.length > 1,
  );

  const duplicateStatusErrors = peopleWithMultipleStatuses.map((person) => ({
    name: person.name,
    rank: person.rank,
    statuses: person.statuses.map((status) => status.label),
  }));

  // =========================================================
  // القوة المكتوبة حسب الفئة
  // =========================================================

  const getRegisteredCategory = (data) => {
    const force = Number(data?.["القوة"]) || 0;
    const outside = Number(data?.["الخارج"]) || 0;

    return {
      total: force,
      inside: Math.max(force - outside, 0),
      outside,
    };
  };

  const registeredCategoryCounts = {
    officers: getRegisteredCategory(tmamOfficers),
    ncos: getRegisteredCategory(tmamNCOs),
    soldiers: getRegisteredCategory(tmamSoldiers),
  };

  // =========================================================
  // القوة الكلية المكتوبة
  // =========================================================

  const registeredInsideCount =
    registeredCategoryCounts.officers.inside +
    registeredCategoryCounts.ncos.inside +
    registeredCategoryCounts.soldiers.inside;

  const registeredOutsideCount =
    registeredCategoryCounts.officers.outside +
    registeredCategoryCounts.ncos.outside +
    registeredCategoryCounts.soldiers.outside;

  const registeredTotalCount = registeredInsideCount + registeredOutsideCount;

  // =========================================================
  // القوة الفعلية حسب الفئة
  // =========================================================

  const actualCategoryCounts = {
    officers: {
      total: 0,
      inside: 0,
      outside: 0,
    },

    ncos: {
      total: 0,
      inside: 0,
      outside: 0,
    },

    soldiers: {
      total: 0,
      inside: 0,
      outside: 0,
    },
  };

  listNames.forEach((person) => {
    const category = getPersonCategory(person);

    if (!actualCategoryCounts[category]) {
      return;
    }

    actualCategoryCounts[category].total++;

    if (outsideIds.has(Number(person.id))) {
      actualCategoryCounts[category].outside++;
    } else {
      actualCategoryCounts[category].inside++;
    }
  });

  // =========================================================
  // أسماء الفئات
  // =========================================================

  const categoryLabels = {
    officers: "الضباط",
    ncos: "الصف ضباط",
    soldiers: "الجنود",
  };

  // =========================================================
  // فروقات الفئات
  // =========================================================

  const categoryDifferences = [];

  Object.keys(actualCategoryCounts).forEach((category) => {
    const actual = actualCategoryCounts[category];

    const registered = registeredCategoryCounts[category];

    if (
      actual.total !== registered.total ||
      actual.inside !== registered.inside ||
      actual.outside !== registered.outside
    ) {
      categoryDifferences.push({
        category,
        label: categoryLabels[category],
        actual,
        registered,
      });
    }
  });

  // =========================================================
  // الحالات الفعلية
  //
  // مهم:
  // هنا بنستخدم عدد السجلات في كل حالة.
  // =========================================================

  const actualCounts = {
    إجازة: vacations.length,
    "إجازة مرضية": sickLeaves.length,
    المستشفى: hospitals.length,
    مأمورية: missions.length,
    الفرقة: bands.length,
    "خارج التمركز": outCenters.length,
    "خارج البلاد": outCountries.length,
    غياب: absences.length,
    سجن: prisons.length,
  };

  // =========================================================
  // عدد الحالة المكتوب
  // =========================================================

  const getRegisteredCount = (key) => {
    return (
      (Number(tmamOfficers[key]) || 0) +
      (Number(tmamNCOs[key]) || 0) +
      (Number(tmamSoldiers[key]) || 0)
    );
  };

  const registeredCounts = {
    إجازة: getRegisteredCount("إجازة"),

    "إجازة مرضية": getRegisteredCount("إجازة مرضية"),

    المستشفى: getRegisteredCount("المستشفى"),

    مأمورية: getRegisteredCount("مأمورية"),

    الفرقة: getRegisteredCount("الفرقة"),

    "خارج التمركز": getRegisteredCount("خارج التمركز"),

    "خارج البلاد": getRegisteredCount("خارج البلاد"),

    غياب: getRegisteredCount("غياب"),

    سجن: getRegisteredCount("سجن"),
  };

  // =========================================================
  // فروقات الحالات
  // =========================================================

  const countDifferences = Object.keys(actualCounts)
    .filter((type) => actualCounts[type] !== registeredCounts[type])
    .map((type) => ({
      type,
      actual: actualCounts[type],
      registered: registeredCounts[type],
      difference: actualCounts[type] - registeredCounts[type],
    }));

  // =========================================================
  // صحة التمام
  // =========================================================

  const isTmamValid =
    actualTotalCount === registeredTotalCount &&
    actualInsideCount === registeredInsideCount &&
    actualOutsideCount === registeredOutsideCount &&
    categoryDifferences.length === 0 &&
    countDifferences.length === 0 &&
    duplicateStatusErrors.length === 0;

  // =========================================================
  // حفظ التمام
  // =========================================================

  const handleSavePeople = () => {
    if (isSaving) return;

    setIsSaving(true);

    try {
      // -------------------------------------------------------
      // 1 - القوة الكلية
      // -------------------------------------------------------

      if (actualTotalCount !== registeredTotalCount) {
        toast.error(
          `لا يمكن الحفظ: القوة الفعلية ${actualTotalCount} بينما القوة المكتوبة ${registeredTotalCount}`,
          {
            duration: 6000,
          },
        );

        return;
      }

      // -------------------------------------------------------
      // 2 - الموجود
      // -------------------------------------------------------

      if (actualInsideCount !== registeredInsideCount) {
        toast.error(
          `لا يمكن الحفظ: الموجود الفعلي ${actualInsideCount} بينما المكتوب ${registeredInsideCount}`,
          {
            duration: 6000,
          },
        );

        return;
      }

      // -------------------------------------------------------
      // 3 - الخارج
      // -------------------------------------------------------

      if (actualOutsideCount !== registeredOutsideCount) {
        toast.error(
          `لا يمكن الحفظ: الخارج الفعلي ${actualOutsideCount} بينما الخارج المكتوب ${registeredOutsideCount}`,
          {
            duration: 6000,
          },
        );

        return;
      }

      // -------------------------------------------------------
      // 4 - الفئات
      // -------------------------------------------------------

      if (categoryDifferences.length > 0) {
        const difference = categoryDifferences[0];

        toast.error(
          `لا يمكن الحفظ: ${difference.label} غير مطابق — الموجود الفعلي ${difference.actual.inside} مقابل ${difference.registered.inside} مكتوب — الخارج الفعلي ${difference.actual.outside} مقابل ${difference.registered.outside} مكتوب`,
          {
            duration: 7000,
          },
        );

        return;
      }

      // -------------------------------------------------------
      // 5 - الحالات
      // -------------------------------------------------------

      if (countDifferences.length > 0) {
        const difference = countDifferences[0];

        const direction =
          difference.actual > difference.registered ? "زيادة" : "نقص";

        toast.error(
          `لا يمكن الحفظ: ${difference.type} غير مطابق — المكتوب ${difference.registered} والفعلي ${difference.actual} (${direction})`,
          {
            duration: 7000,
          },
        );

        return;
      }

      // -------------------------------------------------------
      // 6 - الشخص في أكثر من حالة
      // -------------------------------------------------------

      if (duplicateStatusErrors.length > 0) {
        const duplicate = duplicateStatusErrors[0];

        toast.error(
          `لا يمكن الحفظ: ${duplicate.name} (${duplicate.rank}) مسجل في أكثر من حالة: ${duplicate.statuses.join(" + ")}`,
          {
            duration: 7000,
          },
        );

        return;
      }

      // -------------------------------------------------------
      // 7 - الحفظ
      // -------------------------------------------------------

      const people = {
        برا: outsidePeople,
        موجود: insidePeople,
      };

      localStorage.setItem("people", JSON.stringify(people));

      toast.success(
        `تم حفظ التمام بنجاح — القوة ${actualTotalCount} — الخارج ${actualOutsideCount} — الموجود ${actualInsideCount}`,
        {
          duration: 5000,
        },
      );
    } finally {
      setIsSaving(false);
    }
  };

  // =========================================================
  // Styles
  // =========================================================

  const headerCellSx = {
    backgroundColor: "rgba(6, 182, 212, 0.15)",
    color: "#67e8f9",
    fontWeight: "900",
    fontSize: "15px",
    whiteSpace: "nowrap",
    border: "1px solid rgba(255,255,255,0.2)",
    textAlign: "center",
    py: 2,
    px: 2,
  };

  const bodyCellSx = {
    color: "#e2e8f0",
    fontWeight: "600",
    fontSize: "14px",
    whiteSpace: "nowrap",
    border: "1px solid rgba(255,255,255,0.15)",
    textAlign: "center",
    py: 2,
    px: 2,
  };

  const sectionSx = {
    backgroundColor: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  };

  // =========================================================
  // عنوان القسم
  // =========================================================

  const sectionTitle = (title, icon) => (
    <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between">
      <h2 className="text-xl sm:text-3xl font-black text-cyan-300">{title}</h2>

      {icon}
    </div>
  );

  // =========================================================
  // التاريخ
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "-";

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
      return "-";
    }

    return d.toLocaleDateString("ar-EG", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // =========================================================
  // القيمة
  // =========================================================

  const getValue = (value) => {
    if (value === 0) {
      return "0";
    }

    return value || "-";
  };

  // =========================================================
  // نسبة الخارج
  // =========================================================

  const calculatePercentage = (data) => {
    const total =
      (Number(data["الموجود"]) || 0) + (Number(data["الخارج"]) || 0);

    if (!total) {
      return "0%";
    }

    return `${Math.round(((Number(data["الخارج"]) || 0) / total) * 100)}%`;
  };

  // =========================================================
  // صف الملخص
  // =========================================================

  const renderSummaryRow = (title, data) => {
    const registered = getRegisteredCategory(data);

    return (
      <TableRow hover>
        {[
          title,
          registered.total,
          registered.inside,
          registered.outside,
          data["إجازة"],
          data["إجازة مرضية"],
          data["الفرقة"],
          data["مأمورية"],
          data["سجن"],
          data["غياب"],
          data["خارج البلاد"],
          data["خارج التمركز"],
          calculatePercentage({
            الموجود: registered.inside,
            الخارج: registered.outside,
          }),
        ].map((item, index) => (
          <TableCell key={index} sx={bodyCellSx}>
            {getValue(item)}
          </TableCell>
        ))}
      </TableRow>
    );
  };

  // =========================================================
  // Headers
  // =========================================================

  const summaryHeaders = [
    "البيان",
    "القوة",
    "موجود",
    "خارج",
    "أجازة",
    "أجازة مرضية",
    "فرقة",
    "مأمورية",
    "سجن",
    "غياب",
    "خ البلاد",
    "م تد خارجى",
    "نسبة الخوارج",
  ];

  // =========================================================
  // Render
  // =========================================================

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
              startIcon={
                <ArrowBack
                  sx={{
                    fontSize: 20,
                  }}
                />
              }
              sx={{
                color: "#e2e8f0",
                borderColor: "rgba(255,255,255,0.25)",
                bgcolor: "rgba(15,23,42,0.4)",
                borderRadius: "12px",
                px: {
                  xs: 1.5,
                  sm: 2.5,
                },
                py: 1,
                minWidth: {
                  xs: 45,
                  sm: "auto",
                },
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
              <CalendarMonth
                sx={{
                  fontSize: {
                    xs: 30,
                    sm: 42,
                  },
                  color: "#67e8f9",
                  flexShrink: 0,
                }}
              />

              <div className="text-center min-w-0">
                <h1 className="text-lg sm:text-3xl lg:text-4xl font-black leading-relaxed bg-gradient-to-l from-cyan-300 to-white bg-clip-text text-transparent">
                  التمام اليومى
                </h1>

                <p className="text-xs sm:text-base text-cyan-200/80 font-semibold mt-1 truncate">
                  {unitName || "الوحدة"}
                </p>
              </div>
            </div>

            <div className="w-11 sm:w-24 shrink-0" />
          </div>
        </div>

        {/* Buttons */}

        <ButtonsTmam />

        <div className="flex flex-col gap-6 mt-6">
          {/* =====================================================
              مراجعة التمام
          ===================================================== */}

          <div
            className={`rounded-2xl p-5 shadow-2xl border ${
              isTmamValid
                ? "bg-green-500/5 border-green-400/20"
                : "bg-red-500/5 border-red-400/20"
            }`}
          >
            <div className="text-center sm:text-right">
              <h2 className="text-xl sm:text-2xl font-black text-cyan-300">
                مراجعة التمام
              </h2>

              <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-4">
                <span className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-200 font-bold">
                  القوة المكتوبة: {registeredTotalCount}
                </span>

                <span
                  className={`px-4 py-2 rounded-xl border font-bold ${
                    actualTotalCount === registeredTotalCount
                      ? "bg-green-500/10 border-green-400/30 text-green-300"
                      : "bg-red-500/10 border-red-400/30 text-red-300"
                  }`}
                >
                  القوة الفعلية: {actualTotalCount}
                </span>

                <span
                  className={`px-4 py-2 rounded-xl border font-bold ${
                    actualInsideCount === registeredInsideCount
                      ? "bg-green-500/10 border-green-400/30 text-green-300"
                      : "bg-red-500/10 border-red-400/30 text-red-300"
                  }`}
                >
                  الموجود: {actualInsideCount} / {registeredInsideCount}
                </span>

                <span
                  className={`px-4 py-2 rounded-xl border font-bold ${
                    actualOutsideCount === registeredOutsideCount
                      ? "bg-green-500/10 border-green-400/30 text-green-300"
                      : "bg-red-500/10 border-red-400/30 text-red-300"
                  }`}
                >
                  الخارج: {actualOutsideCount} / {registeredOutsideCount}
                </span>
              </div>

              {/* الأخطاء */}

              {!isTmamValid && (
                <div className="mt-5 space-y-2">
                  {categoryDifferences.map((difference) => (
                    <div
                      key={difference.category}
                      className="text-red-300 font-bold text-sm bg-red-500/5 border border-red-400/10 rounded-xl p-3"
                    >
                      {difference.label}: الموجود الفعلي{" "}
                      {difference.actual.inside} مقابل{" "}
                      {difference.registered.inside} مكتوب — الخارج الفعلي{" "}
                      {difference.actual.outside} مقابل{" "}
                      {difference.registered.outside} مكتوب
                    </div>
                  ))}

                  {countDifferences.map((difference) => (
                    <div
                      key={difference.type}
                      className="text-red-300 font-bold text-sm bg-red-500/5 border border-red-400/10 rounded-xl p-3"
                    >
                      {difference.type}: الفعلي {difference.actual} — المكتوب{" "}
                      {difference.registered}
                    </div>
                  ))}

                  {duplicateStatusErrors.map((duplicate, index) => (
                    <div
                      key={`${duplicate.name}-${index}`}
                      className="text-red-300 font-bold text-sm bg-red-500/5 border border-red-400/10 rounded-xl p-3"
                    >
                      {duplicate.name} ({duplicate.rank}) مسجل في أكثر من حالة:{" "}
                      {duplicate.statuses.join(" + ")}
                    </div>
                  ))}
                </div>
              )}

              {isTmamValid && (
                <p className="mt-4 text-green-300 font-bold text-sm">
                  جميع بيانات التمام مطابقة ويمكن الحفظ
                </p>
              )}
            </div>

            <Button
              variant="contained"
              onClick={handleSavePeople}
              disabled={isSaving || !isTmamValid}
              startIcon={
                <Save
                  sx={{
                    fontSize: 22,
                    ml: 1,
                  }}
                />
              }
              sx={{
                direction: "rtl",
                minWidth: {
                  xs: "100%",
                  sm: 220,
                },
                py: 1.6,
                px: 4,
                mt: 5,
                borderRadius: "16px",
                fontWeight: "900",
                fontSize: "16px",
                background: isTmamValid
                  ? "linear-gradient(135deg, #06b6d4, #2563eb)"
                  : "rgba(100,116,139,0.4)",
                color: "#fff",
                "&:hover": {
                  background: isTmamValid
                    ? "linear-gradient(135deg, #0891b2, #1d4ed8)"
                    : "rgba(100,116,139,0.4)",
                },
                "&.Mui-disabled": {
                  color: "rgba(255,255,255,0.45)",
                  background: "rgba(100,116,139,0.25)",
                },
                "& .MuiButton-startIcon": {
                  marginLeft: "10px",
                  marginRight: 0,
                },
              }}
            >
              {isSaving ? "جاري الحفظ..." : "حفظ التمام"}
            </Button>
          </div>

          {/* =====================================================
              تمام الضباط
          ===================================================== */}

          {Object.keys(tmamOfficers).length > 0 && (
            <section dir="rtl" style={sectionSx}>
              {sectionTitle(
                "تمام الضباط",
                <Person
                  sx={{
                    color: "#67e8f9",
                    fontSize: {
                      xs: 25,
                      sm: 32,
                    },
                  }}
                />,
              )}

              <TableContainer
                sx={{
                  overflowX: "auto",
                }}
              >
                <Table
                  dir="rtl"
                  sx={{
                    minWidth: 1200,
                  }}
                >
                  <TableHead>
                    <TableRow>
                      {summaryHeaders.map((item, index) => (
                        <TableCell key={`${item}-${index}`} sx={headerCellSx}>
                          {item}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {renderSummaryRow("الضباط", tmamOfficers)}
                  </TableBody>
                </Table>
              </TableContainer>
            </section>
          )}

          {/* =====================================================
              تمام الصف ضباط
          ===================================================== */}

          {Object.keys(tmamNCOs).length > 0 && (
            <section dir="rtl" style={sectionSx}>
              {sectionTitle(
                "تمام الصف ضباط",
                <Groups
                  sx={{
                    color: "#67e8f9",
                    fontSize: {
                      xs: 25,
                      sm: 32,
                    },
                  }}
                />,
              )}

              <TableContainer
                sx={{
                  overflowX: "auto",
                }}
              >
                <Table
                  dir="rtl"
                  sx={{
                    minWidth: 1200,
                  }}
                >
                  <TableHead>
                    <TableRow>
                      {summaryHeaders.map((item, index) => (
                        <TableCell key={`${item}-${index}`} sx={headerCellSx}>
                          {item}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {renderSummaryRow("الصف ضباط", tmamNCOs)}
                  </TableBody>
                </Table>
              </TableContainer>
            </section>
          )}

          {/* =====================================================
              تمام الجنود
          ===================================================== */}

          {Object.keys(tmamSoldiers).length > 0 && (
            <section dir="rtl" style={sectionSx}>
              {sectionTitle(
                "تمام الجنود",
                <Groups
                  sx={{
                    color: "#67e8f9",
                    fontSize: {
                      xs: 25,
                      sm: 32,
                    },
                  }}
                />,
              )}

              <TableContainer
                sx={{
                  overflowX: "auto",
                }}
              >
                <Table
                  dir="rtl"
                  sx={{
                    minWidth: 1200,
                  }}
                >
                  <TableHead>
                    <TableRow>
                      {summaryHeaders.map((item, index) => (
                        <TableCell key={`${item}-${index}`} sx={headerCellSx}>
                          {item}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {renderSummaryRow("الجنود", tmamSoldiers)}
                  </TableBody>
                </Table>
              </TableContainer>
            </section>
          )}

          {/* =====================================================
              الإجازات
          ===================================================== */}

          {vacations.length > 0 && (
            <section dir="rtl" style={sectionSx}>
              {sectionTitle(
                "الإجازات",
                <EventAvailable
                  sx={{
                    color: "#67e8f9",
                    fontSize: {
                      xs: 25,
                      sm: 32,
                    },
                  }}
                />,
              )}

              <TableContainer
                sx={{
                  overflowX: "auto",
                }}
              >
                <Table
                  dir="rtl"
                  sx={{
                    minWidth: 800,
                  }}
                >
                  <TableHead>
                    <TableRow>
                      {[
                        "م",
                        "الرتبة / الدرجة",
                        "الإسم",
                        "نوع الأجازة",
                        "بدء الأجازة",
                        "عودة الأجازة",
                      ].map((item) => (
                        <TableCell key={item} sx={headerCellSx}>
                          {item}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {vacations.map((item, index) => (
                      <TableRow
                        hover
                        key={item.id ?? `${item.personId}-${index}`}
                      >
                        <TableCell sx={bodyCellSx}>{index + 1}</TableCell>

                        <TableCell sx={bodyCellSx}>{item.rank}</TableCell>

                        <TableCell sx={bodyCellSx}>{item.name}</TableCell>

                        <TableCell sx={bodyCellSx}>{item.type}</TableCell>

                        <TableCell sx={bodyCellSx}>
                          {formatDate(item.from)}
                        </TableCell>

                        <TableCell sx={bodyCellSx}>
                          {formatDate(item.to)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </section>
          )}

          {/* =====================================================
              إجازات مرضية
          ===================================================== */}

          {sickLeaves.length > 0 && (
            <section dir="rtl" style={sectionSx}>
              {sectionTitle(
                "إجازات مرضية",
                <LocalHospital
                  sx={{
                    color: "#67e8f9",
                    fontSize: {
                      xs: 25,
                      sm: 32,
                    },
                  }}
                />,
              )}

              <TableContainer
                sx={{
                  overflowX: "auto",
                }}
              >
                <Table
                  dir="rtl"
                  sx={{
                    minWidth: 850,
                  }}
                >
                  <TableHead>
                    <TableRow>
                      {[
                        "م",
                        "الرتبة / الدرجة",
                        "الإسم",
                        "سبب الإجازة",
                        "بدء الإجازة",
                        "عودة الإجازة",
                        "ملاحظات",
                      ].map((item) => (
                        <TableCell key={item} sx={headerCellSx}>
                          {item}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {sickLeaves.map((item, index) => (
                      <TableRow
                        hover
                        key={item.id ?? `${item.personId}-${index}`}
                      >
                        <TableCell sx={bodyCellSx}>{index + 1}</TableCell>

                        <TableCell sx={bodyCellSx}>{item.rank}</TableCell>

                        <TableCell sx={bodyCellSx}>{item.name}</TableCell>

                        <TableCell sx={bodyCellSx}>{item.reason}</TableCell>

                        <TableCell sx={bodyCellSx}>
                          {formatDate(item.from)}
                        </TableCell>

                        <TableCell sx={bodyCellSx}>
                          {formatDate(item.to)}
                        </TableCell>

                        <TableCell sx={bodyCellSx}>
                          {item.notes || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </section>
          )}

          {/* =====================================================
              المستشفى
          ===================================================== */}

          {hospitals.length > 0 && (
            <section dir="rtl" style={sectionSx}>
              {sectionTitle(
                "المستشفى",
                <LocalHospital
                  sx={{
                    color: "#67e8f9",
                    fontSize: {
                      xs: 25,
                      sm: 32,
                    },
                  }}
                />,
              )}

              <TableContainer
                sx={{
                  overflowX: "auto",
                }}
              >
                <Table
                  dir="rtl"
                  sx={{
                    minWidth: 900,
                  }}
                >
                  <TableHead>
                    <TableRow>
                      {[
                        "م",
                        "الرتبة / الدرجة",
                        "الإسم",
                        "المستشفى",
                        "التاريخ",
                        "التشخيص",
                        "ملاحظات",
                      ].map((item) => (
                        <TableCell key={item} sx={headerCellSx}>
                          {item}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {hospitals.map((item, index) => (
                      <TableRow
                        hover
                        key={item.id ?? `${item.personId}-${index}`}
                      >
                        <TableCell sx={bodyCellSx}>{index + 1}</TableCell>

                        <TableCell sx={bodyCellSx}>{item.rank}</TableCell>

                        <TableCell sx={bodyCellSx}>{item.name}</TableCell>

                        <TableCell sx={bodyCellSx}>{item.hospital}</TableCell>

                        <TableCell sx={bodyCellSx}>
                          {formatDate(item.date)}
                        </TableCell>

                        <TableCell sx={bodyCellSx}>{item.diagnosis}</TableCell>

                        <TableCell sx={bodyCellSx}>
                          {item.notes || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </section>
          )}

          {/* =====================================================
              المأموريات
          ===================================================== */}

          {missions.length > 0 && (
            <section dir="rtl" style={sectionSx}>
              {sectionTitle(
                "المأموريات",
                <Assignment
                  sx={{
                    color: "#67e8f9",
                    fontSize: {
                      xs: 25,
                      sm: 32,
                    },
                  }}
                />,
              )}

              <TableContainer
                sx={{
                  overflowX: "auto",
                }}
              >
                <Table
                  dir="rtl"
                  sx={{
                    minWidth: 1000,
                  }}
                >
                  <TableHead>
                    <TableRow>
                      {[
                        "م",
                        "الرتبة / الدرجة",
                        "الإسم",
                        "جهة المأمورية",
                        "الأمر بالمأمورية",
                        "التاريخ من",
                        "التاريخ إلى",
                      ].map((item) => (
                        <TableCell key={item} sx={headerCellSx}>
                          {item}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {missions.map((item, index) => (
                      <TableRow
                        hover
                        key={item.id ?? `${item.personId}-${index}`}
                      >
                        <TableCell sx={bodyCellSx}>{index + 1}</TableCell>

                        <TableCell sx={bodyCellSx}>{item.rank}</TableCell>

                        <TableCell sx={bodyCellSx}>{item.name}</TableCell>

                        <TableCell sx={bodyCellSx}>
                          {item.destination}
                        </TableCell>

                        <TableCell sx={bodyCellSx}>{item.order}</TableCell>

                        <TableCell sx={bodyCellSx}>
                          {formatDate(item.from)}
                        </TableCell>

                        <TableCell sx={bodyCellSx}>
                          {formatDate(item.to)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </section>
          )}

          {/* =====================================================
              الفرقة
          ===================================================== */}

          {bands.length > 0 && (
            <section dir="rtl" style={sectionSx}>
              {sectionTitle(
                "الفرقة",
                <School
                  sx={{
                    color: "#67e8f9",
                    fontSize: {
                      xs: 25,
                      sm: 32,
                    },
                  }}
                />,
              )}

              <TableContainer
                sx={{
                  overflowX: "auto",
                }}
              >
                <Table
                  dir="rtl"
                  sx={{
                    minWidth: 850,
                  }}
                >
                  <TableHead>
                    <TableRow>
                      {[
                        "م",
                        "الرتبة / الدرجة",
                        "الإسم",
                        "اسم الفرقة",
                        "مكان الفرقة",
                        "التاريخ من",
                        "التاريخ إلى",
                      ].map((item) => (
                        <TableCell key={item} sx={headerCellSx}>
                          {item}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {bands.map((item, index) => (
                      <TableRow
                        hover
                        key={item.id ?? `${item.personId}-${index}`}
                      >
                        <TableCell sx={bodyCellSx}>{index + 1}</TableCell>

                        <TableCell sx={bodyCellSx}>{item.rank}</TableCell>

                        <TableCell sx={bodyCellSx}>{item.name}</TableCell>

                        <TableCell sx={bodyCellSx}>{item.bandName}</TableCell>

                        <TableCell sx={bodyCellSx}>{item.bandPlace}</TableCell>

                        <TableCell sx={bodyCellSx}>
                          {formatDate(item.from)}
                        </TableCell>

                        <TableCell sx={bodyCellSx}>
                          {formatDate(item.to)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </section>
          )}

          {/* =====================================================
              خارج التمركز
          ===================================================== */}

          {outCenters.length > 0 && (
            <section dir="rtl" style={sectionSx}>
              {sectionTitle(
                "خارج التمركز",
                <Flight
                  sx={{
                    color: "#67e8f9",
                    fontSize: {
                      xs: 25,
                      sm: 32,
                    },
                  }}
                />,
              )}

              <TableContainer
                sx={{
                  overflowX: "auto",
                }}
              >
                <Table
                  dir="rtl"
                  sx={{
                    minWidth: 950,
                  }}
                >
                  <TableHead>
                    <TableRow>
                      {[
                        "م",
                        "الرتبة / الدرجة",
                        "الإسم",
                        "جهة التمركز",
                        "سبب الخروج",
                        "التاريخ من",
                        "التاريخ إلى",
                      ].map((item) => (
                        <TableCell key={item} sx={headerCellSx}>
                          {item}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {outCenters.map((item, index) => (
                      <TableRow
                        hover
                        key={item.id ?? `${item.personId}-${index}`}
                      >
                        <TableCell sx={bodyCellSx}>{index + 1}</TableCell>

                        <TableCell sx={bodyCellSx}>{item.rank}</TableCell>

                        <TableCell sx={bodyCellSx}>{item.name}</TableCell>

                        <TableCell sx={bodyCellSx}>
                          {item.centerPlace}
                        </TableCell>

                        <TableCell sx={bodyCellSx}>{item.reason}</TableCell>

                        <TableCell sx={bodyCellSx}>
                          {formatDate(item.from)}
                        </TableCell>

                        <TableCell sx={bodyCellSx}>
                          {formatDate(item.to)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </section>
          )}

          {/* =====================================================
              خارج البلاد
          ===================================================== */}

          {outCountries.length > 0 && (
            <section dir="rtl" style={sectionSx}>
              {sectionTitle(
                "خارج البلاد",
                <Flight
                  sx={{
                    color: "#67e8f9",
                    fontSize: {
                      xs: 25,
                      sm: 32,
                    },
                  }}
                />,
              )}

              <TableContainer
                sx={{
                  overflowX: "auto",
                }}
              >
                <Table
                  dir="rtl"
                  sx={{
                    minWidth: 950,
                  }}
                >
                  <TableHead>
                    <TableRow>
                      {[
                        "م",
                        "الرتبة / الدرجة",
                        "الإسم",
                        "الدولة",
                        "سبب السفر",
                        "التاريخ من",
                        "التاريخ إلى",
                      ].map((item) => (
                        <TableCell key={item} sx={headerCellSx}>
                          {item}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {outCountries.map((item, index) => (
                      <TableRow
                        hover
                        key={item.id ?? `${item.personId}-${index}`}
                      >
                        <TableCell sx={bodyCellSx}>{index + 1}</TableCell>

                        <TableCell sx={bodyCellSx}>{item.rank}</TableCell>

                        <TableCell sx={bodyCellSx}>{item.name}</TableCell>

                        <TableCell sx={bodyCellSx}>{item.country}</TableCell>

                        <TableCell sx={bodyCellSx}>{item.reason}</TableCell>

                        <TableCell sx={bodyCellSx}>
                          {formatDate(item.from)}
                        </TableCell>

                        <TableCell sx={bodyCellSx}>
                          {formatDate(item.to)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </section>
          )}

          {/* =====================================================
              غياب
          ===================================================== */}

          {absences.length > 0 && (
            <section dir="rtl" style={sectionSx}>
              {sectionTitle(
                "غياب",
                <PersonOff
                  sx={{
                    color: "#67e8f9",
                    fontSize: {
                      xs: 25,
                      sm: 32,
                    },
                  }}
                />,
              )}

              <TableContainer
                sx={{
                  overflowX: "auto",
                }}
              >
                <Table
                  dir="rtl"
                  sx={{
                    minWidth: 900,
                  }}
                >
                  <TableHead>
                    <TableRow>
                      {[
                        "م",
                        "الرتبة / الدرجة",
                        "الإسم",
                        "نوع الغياب",
                        "من",
                        "إلى",
                        "ملاحظات",
                      ].map((item) => (
                        <TableCell key={item} sx={headerCellSx}>
                          {item}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {absences.map((item, index) => (
                      <TableRow
                        hover
                        key={item.id ?? `${item.personId}-${index}`}
                      >
                        <TableCell sx={bodyCellSx}>{index + 1}</TableCell>

                        <TableCell sx={bodyCellSx}>{item.rank}</TableCell>

                        <TableCell sx={bodyCellSx}>{item.name}</TableCell>

                        <TableCell sx={bodyCellSx}>
                          {item.absenceType}
                        </TableCell>

                        <TableCell sx={bodyCellSx}>
                          {formatDate(item.from)}
                        </TableCell>

                        <TableCell sx={bodyCellSx}>
                          {formatDate(item.to)}
                        </TableCell>

                        <TableCell sx={bodyCellSx}>
                          {item.notes || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </section>
          )}

          {/* =====================================================
              سجن
          ===================================================== */}

          {prisons.length > 0 && (
            <section dir="rtl" style={sectionSx}>
              {sectionTitle(
                "سجن",
                <Lock
                  sx={{
                    color: "#67e8f9",
                    fontSize: {
                      xs: 25,
                      sm: 32,
                    },
                  }}
                />,
              )}

              <TableContainer
                sx={{
                  overflowX: "auto",
                }}
              >
                <Table
                  dir="rtl"
                  sx={{
                    minWidth: 900,
                  }}
                >
                  <TableHead>
                    <TableRow>
                      {[
                        "م",
                        "الرتبة / الدرجة",
                        "الإسم",
                        "نوع الحكم",
                        "من",
                        "إلى",
                        "ملاحظات",
                      ].map((item) => (
                        <TableCell key={item} sx={headerCellSx}>
                          {item}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {prisons.map((item, index) => (
                      <TableRow
                        hover
                        key={item.id ?? `${item.personId}-${index}`}
                      >
                        <TableCell sx={bodyCellSx}>{index + 1}</TableCell>

                        <TableCell sx={bodyCellSx}>{item.rank}</TableCell>

                        <TableCell sx={bodyCellSx}>{item.name}</TableCell>

                        <TableCell sx={bodyCellSx}>
                          {item.judgmentType}
                        </TableCell>

                        <TableCell sx={bodyCellSx}>
                          {formatDate(item.from)}
                        </TableCell>

                        <TableCell sx={bodyCellSx}>
                          {formatDate(item.to)}
                        </TableCell>

                        <TableCell sx={bodyCellSx}>
                          {item.notes || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tmam;
