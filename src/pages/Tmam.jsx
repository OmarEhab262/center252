import { useState } from "react";

import {
  ArrowBack,
  CalendarMonth,
  Visibility,
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
    tmamOtherRanks = {},
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

  // ==========================================
  // كل مصادر الأشخاص الخارجين
  // ==========================================

  const outsideSources = [
    {
      type: "vacation",
      data: vacations,
    },
    {
      type: "sickLeave",
      data: sickLeaves,
    },
    {
      type: "hospital",
      data: hospitals,
    },
    {
      type: "mission",
      data: missions,
    },
    {
      type: "band",
      data: bands,
    },
    {
      type: "outCenter",
      data: outCenters,
    },
    {
      type: "outCountry",
      data: outCountries,
    },
    {
      type: "absence",
      data: absences,
    },
    {
      type: "prison",
      data: prisons,
    },
  ];

  // ==========================================
  // إنشاء الأشخاص الخارجين بدون تكرار
  // ==========================================

  const outsidePeopleMap = new Map();

  outsideSources.forEach(({ type, data }) => {
    data.forEach((item) => {
      if (!item?.personId) return;

      if (!outsidePeopleMap.has(item.personId)) {
        const originalPerson = listNames.find(
          (person) => person.id === item.personId,
        );

        outsidePeopleMap.set(item.personId, {
          ...(originalPerson || {}),
          id: item.personId,
          name: item.name || originalPerson?.name || "",
          rank: item.rank || originalPerson?.rank || "",
          statuses: [],
        });
      }

      outsidePeopleMap.get(item.personId).statuses.push({
        type,
        ...item,
      });
    });
  });

  const outsidePeople = Array.from(outsidePeopleMap.values());

  // ==========================================
  // IDs الأشخاص الخارجين
  // ==========================================

  const outsideIds = new Set(outsidePeople.map((person) => person.id));

  // ==========================================
  // الأشخاص الموجودين
  // ==========================================

  const insidePeople = listNames
    .filter((person) => !outsideIds.has(person.id))
    .map((person) => ({
      ...person,
      statuses: [],
    }));

  // ==========================================
  // العدد المكتوب في التمام
  // ==========================================

  const registeredOutsideCount =
    (Number(tmamOfficers["الخارج"]) || 0) +
    (Number(tmamOtherRanks["الخارج"]) || 0);

  // ==========================================
  // العدد الحقيقي من بيانات الأشخاص
  // ==========================================

  const actualOutsideCount = outsidePeople.length;

  // ==========================================
  // الفرق
  // ==========================================

  const outsideDifference = actualOutsideCount - registeredOutsideCount;

  // ==========================================
  // حفظ people
  // ==========================================

  const handleSavePeople = () => {
    if (isSaving) return;

    setIsSaving(true);

    try {
      // --------------------------------------
      // Check العدد
      // --------------------------------------

      if (actualOutsideCount !== registeredOutsideCount) {
        const difference = Math.abs(outsideDifference);

        if (actualOutsideCount > registeredOutsideCount) {
          toast.error(
            `لا يمكن الحفظ: عدد الخارج الفعلي ${actualOutsideCount} بينما المكتوب في التمام ${registeredOutsideCount} — يوجد ${difference} شخص زائد`,
            {
              duration: 5000,
            },
          );
        } else {
          toast.error(
            `لا يمكن الحفظ: عدد الخارج الفعلي ${actualOutsideCount} بينما المكتوب في التمام ${registeredOutsideCount} — يوجد ${difference} شخص ناقص`,
            {
              duration: 5000,
            },
          );
        }

        return;
      }

      // --------------------------------------
      // العدد مطابق
      // --------------------------------------

      const people = {
        برا: outsidePeople,
        موجود: insidePeople,
      };

      localStorage.setItem("people", JSON.stringify(people));

      toast.success(
        `تم حفظ التمام بنجاح — الخارج ${actualOutsideCount} شخص والموجود ${insidePeople.length} شخص`,
        {
          duration: 5000,
        },
      );
    } finally {
      setIsSaving(false);
    }
  };

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

  const sectionTitle = (title, icon) => (
    <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between">
      <h2 className="text-xl sm:text-3xl font-black text-cyan-300">{title}</h2>

      {icon}
    </div>
  );

  const formatDate = (date) => {
    if (!date) return "-";

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) return "-";

    return d.toLocaleDateString("ar-EG", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getValue = (value) => {
    if (value === 0) return "0";
    return value || "-";
  };

  const calculatePercentage = (data) => {
    const total = data["الموجود"] + data["الخارج"];

    if (!total) return "0%";

    return `${Math.round((data["الخارج"] / total) * 100)}%`;
  };

  const renderSummaryRow = (title, data) => {
    const total = (data["الموجود"] || 0) + (data["الخارج"] || 0);

    const unitName = localStorage.getItem("unitName");

    const tmam = JSON.parse(localStorage.getItem("tmam") || "{}");
    const listNames = JSON.parse(localStorage.getItem("listNames") || "[]");

    const {
      tmamOfficers = {},
      tmamOtherRanks = {},
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

    // كل مصادر الأشخاص الموجودين خارج الوحدة
    const outsideLists = [
      vacations,
      sickLeaves,
      hospitals,
      missions,
      bands,
      outCenters,
      outCountries,
      absences,
      prisons,
    ];

    // تجميع كل بيانات الأشخاص الخارجين حسب personId
    const outsidePeopleMap = new Map();

    outsideLists.forEach((list) => {
      list.forEach((item) => {
        if (!item?.personId) return;

        if (!outsidePeopleMap.has(item.personId)) {
          outsidePeopleMap.set(item.personId, {
            id: item.personId,
            name: item.name,
            rank: item.rank,
            statuses: [],
          });
        }

        const person = outsidePeopleMap.get(item.personId);

        person.statuses.push({
          ...item,
        });
      });
    });

    // الأشخاص الخارجون
    const outsidePeople = Array.from(outsidePeopleMap.values());

    // IDs الأشخاص الخارجين
    const outsideIds = new Set(outsidePeople.map((person) => person.id));

    // الأشخاص الموجودون
    const insidePeople = listNames
      .filter((person) => !outsideIds.has(person.id))
      .map((person) => ({
        ...person,
      }));

    // العدد الحقيقي
    const actualOutsideCount = outsidePeople.length;

    // العدد المسجل في التمام
    const registeredOutsideCount =
      (tmamOfficers["الخارج"] || 0) + (tmamOtherRanks["الخارج"] || 0);

    // العدد الكلي
    const totalPeople =
      (tmamOfficers["الموجود"] || 0) +
      (tmamOfficers["الخارج"] || 0) +
      (tmamOtherRanks["الموجود"] || 0) +
      (tmamOtherRanks["الخارج"] || 0);

    // النتيجة النهائية
    const people = {
      outSide: outsidePeople,
      inSide: insidePeople,
    };
    console.log("الناس:", people);
    console.log("برا:", outsidePeople);
    console.log("موجود:", insidePeople);

    return (
      <TableRow hover>
        {[
          title,
          total,
          data["الموجود"],
          data["الخارج"],
          data["إجازة"],
          data["إجازة مرضية"],
          data["فرقة"],
          data["مأمورية"],
          data["سجن"],
          data["غياب"],
          data["خارج البلاد"],
          data["خارج التمركز"],
          calculatePercentage(data),
        ].map((item, index) => (
          <TableCell key={index} sx={bodyCellSx}>
            {getValue(item)}
          </TableCell>
        ))}
      </TableRow>
    );
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
              <span className="hidden sm:inline">رجوع</span>
            </Button>

            <div className="flex items-center justify-center gap-3 flex-1 min-w-0">
              <CalendarMonth
                sx={{
                  fontSize: { xs: 30, sm: 42 },
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

        {/* ================= Buttons ================= */}
        <ButtonsTmam />

        <div className="flex flex-col gap-6 mt-6">
          {/* ================= تمام القادة ================= */}
          {/* <section dir="rtl" style={sectionSx}>
            {sectionTitle(
              "تمام القادة",
              <Visibility
                sx={{
                  color: "#67e8f9",
                  fontSize: { xs: 25, sm: 32 },
                }}
              />,
            )}

            <TableContainer sx={{ overflowX: "auto" }}>
              <Table sx={{ minWidth: 1100 }}>
                <TableHead>
                  <TableRow>
                    {[
                      "القائد",
                      "ر.ع",
                      "قا ك 1",
                      "ر.ع 1",
                      "قا ك 2",
                      "ر.ع 2",
                      "قا ك 3",
                      "ر.ع 3",
                    ].map((item) => (
                      <TableCell key={item} colSpan={2} sx={headerCellSx}>
                        {item}
                      </TableCell>
                    ))}
                  </TableRow>

                  <TableRow>
                    {Array.from({ length: 8 }).map((_, index) => (
                      <TableCell key={index} colSpan={2} sx={headerCellSx}>
                        التمام
                      </TableCell>
                    ))}
                  </TableRow>

                  <TableRow>
                    {Array.from({ length: 8 }).flatMap((_, index) => [
                      <TableCell key={`${index}-to`} sx={headerCellSx}>
                        إلى
                      </TableCell>,

                      <TableCell key={`${index}-from`} sx={headerCellSx}>
                        من
                      </TableCell>,
                    ])}
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow>
                    {Array.from({ length: 8 }).flatMap((_, index) => [
                      <TableCell key={`${index}-to`} sx={bodyCellSx}>
                        -
                      </TableCell>,

                      <TableCell key={`${index}-from`} sx={bodyCellSx}>
                        5/3/2026
                      </TableCell>,
                    ])}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </section> */}
          {/* ================= تمام الضباط ================= */}
          {Object.keys(tmamOfficers).length > 0 && (
            <section dir="rtl" style={sectionSx}>
              {sectionTitle(
                "تمام الضباط",
                <Person
                  sx={{
                    color: "#67e8f9",
                    fontSize: { xs: 25, sm: 32 },
                  }}
                />,
              )}

              <TableContainer sx={{ overflowX: "auto" }}>
                <Table dir="rtl" sx={{ minWidth: 1200 }}>
                  <TableHead>
                    <TableRow>
                      {[
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
                      ].map((item, index) => (
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
          {/* ================= تمام الدرجات الأخرى ================= */}
          {Object.keys(tmamOtherRanks).length > 0 && (
            <section dir="rtl" style={sectionSx}>
              {sectionTitle(
                "تمام الدرجات الأخرى",
                <Groups
                  sx={{
                    color: "#67e8f9",
                    fontSize: { xs: 25, sm: 32 },
                  }}
                />,
              )}

              <TableContainer sx={{ overflowX: "auto" }}>
                <Table dir="rtl" sx={{ minWidth: 1200 }}>
                  <TableHead>
                    <TableRow>
                      {[
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
                      ].map((item, index) => (
                        <TableCell key={`${item}-${index}`} sx={headerCellSx}>
                          {item}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {renderSummaryRow("الدرجات الأخرى", tmamOtherRanks)}
                  </TableBody>
                </Table>
              </TableContainer>
            </section>
          )}
          {/* ================= الإجازات ================= */}
          {vacations.length > 0 && (
            <section dir="rtl" style={sectionSx}>
              {sectionTitle(
                "الإجازات",
                <EventAvailable
                  sx={{
                    color: "#67e8f9",
                    fontSize: { xs: 25, sm: 32 },
                  }}
                />,
              )}

              <TableContainer sx={{ overflowX: "auto" }}>
                <Table dir="rtl" sx={{ minWidth: 800 }}>
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
                      <TableRow hover key={item.id}>
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
          {/* ================= إجازات مرضية ================= */}
          {sickLeaves.length > 0 && (
            <section dir="rtl" style={sectionSx}>
              {sectionTitle(
                "إجازات مرضية",
                <LocalHospital
                  sx={{
                    color: "#67e8f9",
                    fontSize: { xs: 25, sm: 32 },
                  }}
                />,
              )}

              <TableContainer sx={{ overflowX: "auto" }}>
                <Table dir="rtl" sx={{ minWidth: 850 }}>
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
                      <TableRow hover key={item.id}>
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
          {/* ================= المستشفى ================= */}
          {hospitals.length > 0 && (
            <section dir="rtl" style={sectionSx}>
              {sectionTitle(
                "المستشفى",
                <LocalHospital
                  sx={{
                    color: "#67e8f9",
                    fontSize: { xs: 25, sm: 32 },
                  }}
                />,
              )}

              <TableContainer sx={{ overflowX: "auto" }}>
                <Table dir="rtl" sx={{ minWidth: 900 }}>
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
                      <TableRow hover key={item.id}>
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
          {/* ================= المأموريات ================= */}
          {missions.length > 0 && (
            <section dir="rtl" style={sectionSx}>
              {sectionTitle(
                "المأموريات",
                <Assignment
                  sx={{
                    color: "#67e8f9",
                    fontSize: { xs: 25, sm: 32 },
                  }}
                />,
              )}

              <TableContainer sx={{ overflowX: "auto" }}>
                <Table dir="rtl" sx={{ minWidth: 1000 }}>
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
                      <TableRow hover key={item.id}>
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
          {/* ================= الفرقة ================= */}
          {bands.length > 0 && (
            <section dir="rtl" style={sectionSx}>
              {sectionTitle(
                "الفرقة",
                <School
                  sx={{
                    color: "#67e8f9",
                    fontSize: { xs: 25, sm: 32 },
                  }}
                />,
              )}

              <TableContainer sx={{ overflowX: "auto" }}>
                <Table dir="rtl" sx={{ minWidth: 850 }}>
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
                      <TableRow hover key={item.id}>
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
          {/* ================= خارج التمركز ================= */}
          {outCenters.length > 0 && (
            <section dir="rtl" style={sectionSx}>
              {sectionTitle(
                "خارج التمركز",
                <Flight
                  sx={{
                    color: "#67e8f9",
                    fontSize: { xs: 25, sm: 32 },
                  }}
                />,
              )}

              <TableContainer sx={{ overflowX: "auto" }}>
                <Table dir="rtl" sx={{ minWidth: 950 }}>
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
                      <TableRow hover key={item.id}>
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
          {/* ================= خارج البلاد ================= */}
          {outCountries.length > 0 && (
            <section dir="rtl" style={sectionSx}>
              {sectionTitle(
                "خارج البلاد",
                <Flight
                  sx={{
                    color: "#67e8f9",
                    fontSize: { xs: 25, sm: 32 },
                  }}
                />,
              )}

              <TableContainer sx={{ overflowX: "auto" }}>
                <Table dir="rtl" sx={{ minWidth: 950 }}>
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
                      <TableRow hover key={item.id}>
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
          {/* ================= غياب ================= */}
          {absences.length > 0 && (
            <section dir="rtl" style={sectionSx}>
              {sectionTitle(
                "غياب",
                <PersonOff
                  sx={{
                    color: "#67e8f9",
                    fontSize: { xs: 25, sm: 32 },
                  }}
                />,
              )}

              <TableContainer sx={{ overflowX: "auto" }}>
                <Table dir="rtl" sx={{ minWidth: 900 }}>
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
                      <TableRow hover key={item.id}>
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
          {/* ================= سجن ================= */}
          {prisons.length > 0 && (
            <section dir="rtl" style={sectionSx}>
              {sectionTitle(
                "سجن",
                <Lock
                  sx={{
                    color: "#67e8f9",
                    fontSize: { xs: 25, sm: 32 },
                  }}
                />,
              )}

              <TableContainer sx={{ overflowX: "auto" }}>
                <Table dir="rtl" sx={{ minWidth: 900 }}>
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
                      <TableRow hover key={item.id}>
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
          {/* ================= حفظ التمام ================= */}

          <div
            dir="rtl"
            className="
            mt-8
            bg-white/10
            rounded-3xl
            shadow-2xl
            p-5
            sm:p-6
            backdrop-blur
            border
            border-white/10
          "
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="text-center sm:text-right">
                <h2 className="text-xl sm:text-2xl font-black text-cyan-300">
                  مراجعة التمام
                </h2>

                <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-3">
                  <span className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-200 font-bold">
                    الخارج المكتوب: {registeredOutsideCount}
                  </span>

                  <span
                    className={`px-4 py-2 rounded-xl border font-bold ${
                      actualOutsideCount === registeredOutsideCount
                        ? "bg-green-500/10 border-green-400/30 text-green-300"
                        : "bg-red-500/10 border-red-400/30 text-red-300"
                    }`}
                  >
                    الخارج الفعلي: {actualOutsideCount}
                  </span>
                </div>

                {actualOutsideCount !== registeredOutsideCount && (
                  <p className="mt-3 text-red-300 font-bold text-sm">
                    يوجد اختلاف في عدد الخارج، لذلك لن يتم الحفظ.
                  </p>
                )}

                {actualOutsideCount === registeredOutsideCount && (
                  <p className="mt-3 text-green-300 font-bold text-sm">
                    العدد مطابق ويمكن حفظ التمام.
                  </p>
                )}
              </div>

              <Button
                variant="contained"
                onClick={handleSavePeople}
                disabled={
                  isSaving || actualOutsideCount !== registeredOutsideCount
                }
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

                  minWidth: { xs: "100%", sm: 220 },
                  py: 1.6,
                  px: 4,

                  borderRadius: "16px",
                  fontWeight: "900",
                  fontSize: "16px",

                  background:
                    actualOutsideCount === registeredOutsideCount
                      ? "linear-gradient(135deg, #06b6d4, #2563eb)"
                      : "rgba(100,116,139,0.4)",

                  color: "#fff",

                  "&:hover": {
                    background:
                      actualOutsideCount === registeredOutsideCount
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tmam;
