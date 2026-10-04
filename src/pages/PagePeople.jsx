import { useEffect, useMemo, useState } from "react";
import ArabicNumbers from "../components/ArabicNumbers";
import { getUnitName } from "../utils/unitName";
import { Button } from "@mui/material";
import { ArrowBack, Add, Print } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
/* =========================================================
   RANKS
========================================================= */

const officerRanks = [
  "لواء",
  "لواء أح",
  "عميد",
  "عميد أح",
  "عقيد",
  "عقيد أح",
  "مقدم",
  "مقدم أح",
  "رائد",
  "رائد أح",
  "نقيب",
  "نقيب أح",
  "ملازم أول",
  "ملازم أول أح",
  "ملازم",
  "ملازم أح",
];

const ncoRanks = ["مساعد", "مساعد أول", "رقيب أول", "رقيب", "عريف"];

const soldierRanks = ["رقيب مجند", "عريف مجند", "جندى", "جندي"];

const rankOrder = [...officerRanks, ...ncoRanks, ...soldierRanks];

const unitName = getUnitName();
const commandName = localStorage.getItem("commandName") || "";

const getResult = JSON.parse(localStorage.getItem("service") || "{}");
/* =========================================================
   ARABIC NUMBERS
========================================================= */

const arabicDigits = "٠١٢٣٤٥٦٧٨٩";

function toArabicNumbers(value) {
  return String(value ?? "").replace(/\d/g, (digit) => arabicDigits[digit]);
}

function arabicToEnglishNumbers(value) {
  return String(value ?? "")
    .replace(/[٠-٩]/g, (digit) => {
      return arabicDigits.indexOf(digit);
    })
    .replace(/[^\d]/g, "");
}

/* =========================================================
   DATE
========================================================= */

function formatDate(date) {
  if (!date) return "-";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "-";
  }

  const day = String(parsed.getDate()).padStart(2, "0");
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const year = String(parsed.getFullYear());

  return `${toArabicNumbers(day)}/${toArabicNumbers(
    month,
  )}/${toArabicNumbers(year)}`;
}

/* =========================================================
   RANK HELPERS
========================================================= */

function getRankOrder(rank) {
  const normalizedRank = String(rank || "").trim();

  const exactIndex = rankOrder.indexOf(normalizedRank);

  if (exactIndex !== -1) {
    return exactIndex;
  }

  if (
    normalizedRank.includes("مجند") ||
    normalizedRank === "جندى" ||
    normalizedRank === "جندي"
  ) {
    return rankOrder.length + 100;
  }

  if (
    normalizedRank.includes("مساعد") ||
    normalizedRank.includes("رقيب") ||
    normalizedRank.includes("عريف")
  ) {
    return rankOrder.length + 50;
  }

  return rankOrder.length + 200;
}

function getPersonCategory(rank) {
  const normalizedRank = String(rank || "").trim();

  if (officerRanks.includes(normalizedRank)) {
    return "officers";
  }

  if (ncoRanks.includes(normalizedRank)) {
    return "nco";
  }

  if (soldierRanks.includes(normalizedRank)) {
    return "soldiers";
  }

  if (
    normalizedRank.includes("مجند") ||
    normalizedRank === "جندى" ||
    normalizedRank === "جندي"
  ) {
    return "soldiers";
  }

  if (
    normalizedRank.includes("مساعد") ||
    normalizedRank.includes("رقيب") ||
    normalizedRank.includes("عريف")
  ) {
    return "nco";
  }

  return "officers";
}

function sortPeople(people) {
  return [...people].sort((a, b) => {
    const rankDifference = getRankOrder(a?.rank) - getRankOrder(b?.rank);

    if (rankDifference !== 0) {
      return rankDifference;
    }

    return String(a?.name || "").localeCompare(String(b?.name || ""), "ar");
  });
}

/* =========================================================
   STATUS HELPERS
========================================================= */

function getStatusType(status) {
  return (
    status?.type || status?.statusType || status?.kind || status?.category || ""
  );
}

function getStatusFrom(status) {
  if (!status) return "-";

  return formatDate(
    status.from ||
      status.startDate ||
      status.dateFrom ||
      status.start ||
      status.date,
  );
}

function getStatusTo(status) {
  if (!status) return "-";

  return formatDate(
    status.to || status.endDate || status.dateTo || status.end || null,
  );
}

function getStatusValue(status, keys, fallback = "-") {
  for (const key of keys) {
    const value = status?.[key];

    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return value;
    }
  }

  return fallback;
}

/* =========================================================
   STATUS TITLES
========================================================= */

function getStatusTitle(type) {
  const titles = {
    mission: "المأموريات",
    hospital: "المستشفى",
    absence: "الغياب",
    sickLeave: "الإجازات المرضية الحالية",
    vacation: "الإجازات",
    band: "الفرق",
    outCenter: "خارج التمركز",
    outCountry: "خارج البلاد",
    prison: "السجن",
  };

  return titles[type] || "الخارج";
}

/* =========================================================
   STATUS COLUMNS
========================================================= */

function getStatusColumns(type) {
  const common = [
    {
      key: "number",
      label: "م",
      className: "cell-number",
    },
    {
      key: "rank",
      label: "الرتبة / الدرجة",
      className: "cell-rank",
    },
    {
      key: "name",
      label: "الإسم",
      className: "cell-name",
    },
  ];

  const columns = {
    mission: [
      ...common,
      {
        key: "missionPlace",
        label: "جهة المأمورية",
        className: "cell-wide",
      },
      {
        key: "missionOrder",
        label: "الأمر بالمأمورية",
        className: "cell-wide",
      },
      {
        key: "from",
        label: "التاريخ من",
        className: "cell-date",
      },
      {
        key: "to",
        label: "التاريخ إلى",
        className: "cell-date",
      },
    ],

    hospital: [
      ...common,
      {
        key: "hospital",
        label: "المستشفى",
        className: "cell-wide",
      },
      {
        key: "date",
        label: "التاريخ",
        className: "cell-date",
      },
      {
        key: "diagnosis",
        label: "التشخيص",
        className: "cell-wide",
      },
      {
        key: "notes",
        label: "ملاحظات",
        className: "cell-notes",
      },
    ],

    absence: [
      ...common,
      {
        key: "absenceType",
        label: "نوع الغياب",
        className: "cell-wide",
      },
      {
        key: "from",
        label: "من",
        className: "cell-date",
      },
      {
        key: "to",
        label: "إلى",
        className: "cell-date",
      },
      {
        key: "notes",
        label: "ملاحظات",
        className: "cell-notes",
      },
    ],

    sickLeave: [
      ...common,
      {
        key: "reason",
        label: "سبب الإجازة",
        className: "cell-wide",
      },
      {
        key: "from",
        label: "بدء الإجازة",
        className: "cell-date",
      },
      {
        key: "to",
        label: "عودة الإجازة",
        className: "cell-date",
      },
      {
        key: "notes",
        label: "ملاحظات",
        className: "cell-notes",
      },
    ],

    vacation: [
      ...common,
      {
        key: "reason",
        label: "سبب الإجازة",
        className: "cell-wide",
      },
      {
        key: "from",
        label: "بدء الإجازة",
        className: "cell-date",
      },
      {
        key: "to",
        label: "عودة الإجازة",
        className: "cell-date",
      },
      {
        key: "notes",
        label: "ملاحظات",
        className: "cell-notes",
      },
    ],

    band: [
      ...common,
      {
        key: "bandName",
        label: "اسم الفرقة",
        className: "cell-wide",
      },
      {
        key: "bandPlace",
        label: "مكان الفرقة",
        className: "cell-wide",
      },
      {
        key: "from",
        label: "التاريخ من",
        className: "cell-date",
      },
      {
        key: "to",
        label: "التاريخ إلى",
        className: "cell-date",
      },
    ],

    outCenter: [
      ...common,
      {
        key: "center",
        label: "جهة التمركز",
        className: "cell-wide",
      },
      {
        key: "reason",
        label: "سبب الخروج",
        className: "cell-wide",
      },
      {
        key: "from",
        label: "التاريخ من",
        className: "cell-date",
      },
      {
        key: "to",
        label: "التاريخ إلى",
        className: "cell-date",
      },
    ],

    outCountry: [
      ...common,
      {
        key: "country",
        label: "الدولة",
        className: "cell-wide",
      },
      {
        key: "reason",
        label: "سبب السفر",
        className: "cell-wide",
      },
      {
        key: "from",
        label: "من",
        className: "cell-date",
      },
      {
        key: "to",
        label: "إلى",
        className: "cell-date",
      },
    ],

    prison: [
      ...common,
      {
        key: "judgmentType",
        label: "نوع الحكم",
        className: "cell-wide",
      },
      {
        key: "from",
        label: "من",
        className: "cell-date",
      },
      {
        key: "to",
        label: "إلى",
        className: "cell-date",
      },
    ],
  };

  return columns[type] || common;
}

/* =========================================================
   STATUS FIELDS
========================================================= */

function getStatusField(status, type, key) {
  switch (type) {
    case "mission":
      if (key === "missionPlace") {
        return getStatusValue(status, [
          "missionPlace",
          "place",
          "destination",
          "location",
          "missionLocation",
          "جهة",
          "جهةالمأمورية",
          "جهة_المأمورية",
        ]);
      }

      if (key === "missionOrder") {
        return getStatusValue(status, [
          "missionOrder",
          "order",
          "command",
          "orderNumber",
          "missionCommand",
          "الأمر",
          "الأمر_بالمأمورية",
        ]);
      }

      break;

    case "hospital":
      if (key === "hospital") {
        return getStatusValue(status, [
          "hospital",
          "hospitalName",
          "hospitalPlace",
          "المستشفى",
        ]);
      }

      if (key === "date") {
        return formatDate(
          status?.date || status?.from || status?.startDate || status?.dateFrom,
        );
      }

      if (key === "diagnosis") {
        return getStatusValue(status, [
          "diagnosis",
          "diagnosisName",
          "التشخيص",
        ]);
      }

      if (key === "notes") {
        return getStatusValue(status, ["notes", "note", "remarks", "ملاحظات"]);
      }

      break;

    case "absence":
      if (key === "absenceType") {
        return getStatusValue(status, [
          "absenceType",
          "typeName",
          "reason",
          "absenceReason",
          "نوعالغياب",
          "نوع_الغياب",
        ]);
      }

      if (key === "notes") {
        return getStatusValue(status, ["notes", "note", "remarks", "ملاحظات"]);
      }

      break;

    case "sickLeave":
    case "vacation":
      if (key === "reason") {
        return getStatusValue(status, [
          "reason",
          "vacationReason",
          "leaveReason",
          "typeName",
          "نوع",
          "سبب",
          "سبب_الإجازة",
        ]);
      }

      if (key === "notes") {
        return getStatusValue(status, ["notes", "note", "remarks", "ملاحظات"]);
      }

      break;

    case "band":
      if (key === "bandName") {
        return getStatusValue(status, [
          "bandName",
          "name",
          "band",
          "فرقة",
          "اسم_الفرقة",
        ]);
      }

      if (key === "bandPlace") {
        return getStatusValue(status, [
          "bandPlace",
          "place",
          "location",
          "bandLocation",
          "مكان",
          "مكان_الفرقة",
        ]);
      }

      break;

    case "outCenter":
      if (key === "center") {
        return getStatusValue(status, [
          "center",
          "centerName",
          "destination",
          "place",
          "location",
          "جهةالتمركز",
          "جهة_التمركز",
        ]);
      }

      if (key === "reason") {
        return getStatusValue(status, [
          "reason",
          "outReason",
          "exitReason",
          "سبب",
          "سبب_الخروج",
        ]);
      }

      break;

    case "outCountry":
      if (key === "country") {
        return getStatusValue(status, ["country", "countryName", "الدولة"]);
      }

      if (key === "reason") {
        return getStatusValue(status, [
          "reason",
          "travelReason",
          "tripReason",
          "سبب",
          "سبب_السفر",
        ]);
      }

      break;

    case "prison":
      if (key === "judgmentType") {
        return getStatusValue(status, [
          "judgmentType",
          "judgment",
          "sentence",
          "typeName",
          "نوعالحكم",
          "نوع_الحكم",
        ]);
      }

      break;

    default:
      break;
  }

  return "-";
}

/* =========================================================
   CELL VALUE
========================================================= */

function getCellValue(column, person, status, number, type) {
  switch (column.key) {
    case "number":
      return toArabicNumbers(number);

    case "rank":
      return person?.rank || "-";

    case "name":
      return person?.name || "-";

    case "from":
      return getStatusFrom(status);

    case "to":
      return getStatusTo(status);

    default:
      return getStatusField(status, type, column.key);
  }
}

/* =========================================================
   UNIQUE PEOPLE
========================================================= */

function getUniquePeople(people) {
  const map = new Map();

  people.forEach((person) => {
    if (!person) return;

    const id = person.id ?? `${person.name}-${person.rank}`;

    if (!map.has(id)) {
      map.set(id, person);
    }
  });

  return [...map.values()];
}

/* =========================================================
   SUMMARY
========================================================= */

function getPeopleWithStatus(people, type) {
  const result = new Map();

  people.forEach((person) => {
    if (!Array.isArray(person?.statuses)) {
      return;
    }

    const hasStatus = person.statuses.some(
      (status) => getStatusType(status) === type,
    );

    if (!hasStatus) {
      return;
    }

    const id = person.id ?? `${person.name}-${person.rank}`;

    if (!result.has(id)) {
      result.set(id, person);
    }
  });

  return [...result.values()];
}

function getSummaryData(existingPeople, outsidePeople) {
  const existing = getUniquePeople(existingPeople);
  const outside = getUniquePeople(outsidePeople);

  const power = existing.length + outside.length;

  const count = (type) => getPeopleWithStatus(outside, type).length;

  const present = existing.length;
  const outsideCount = outside.length;

  const vacations = count("vacation");
  const sickLeaves = count("sickLeave");
  const bands = count("band");
  const missions = count("mission");
  const prisons = count("prison");
  const absences = count("absence");
  const outCountries = count("outCountry");
  const outCenters = count("outCenter");

  const outsidePercentage =
    power > 0 ? Math.round((outsideCount / power) * 100) : 0;

  return {
    power,
    present,
    outside: outsideCount,
    vacations,
    sickLeaves,
    bands,
    missions,
    prisons,
    absences,
    outCountries,
    outCenters,
    outsidePercentage,
  };
}

/* =========================================================
   SUMMARY TABLE
========================================================= */

function SummaryTable({ title, existingPeople, outsidePeople }) {
  const summary = getSummaryData(existingPeople, outsidePeople);

  const value = (number) => toArabicNumbers(number);

  return (
    <section className="summary-section">
      <div className="summary-header">
        <h2 className="summary-title">تمام {title}</h2>
      </div>

      <table className="summary-table">
        <thead>
          <tr className="summary-header-row">
            <th>البيان</th>
            <th>القوة</th>
            <th>موجود</th>
            <th>خارج</th>
            <th>أجازة</th>
            <th>أجازة مرضية</th>
            <th>فرقة</th>
            <th>مأمورية</th>
            <th>سجن</th>
            <th>غياب</th>
            <th>خ البلاد</th>
            <th>م تد خارجى</th>
            <th>نسبة الخوارج</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>{title}</td>
            <td>{value(summary.power)}</td>
            <td>{value(summary.present)}</td>
            <td>{value(summary.outside)}</td>
            <td>{value(summary.vacations)}</td>
            <td>{value(summary.sickLeaves)}</td>
            <td>{value(summary.bands)}</td>
            <td>{value(summary.missions)}</td>
            <td>{value(summary.prisons)}</td>
            <td>{value(summary.absences)}</td>
            <td>{value(summary.outCountries)}</td>
            <td>{value(summary.outCenters)}</td>
            <td>{value(summary.outsidePercentage)}%</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}

/* =========================================================
   EXISTING TABLE - 4 PEOPLE
========================================================= */

function PeopleDoubleTable({ title, people, days, onDaysChange }) {
  const rows = [];

  for (let index = 0; index < people.length; index += 4) {
    rows.push([
      people[index],
      people[index + 1],
      people[index + 2],
      people[index + 3],
    ]);
  }

  return (
    <section className="section">
      <h2 className="section-title">{title}</h2>

      <table className="people-table">
        <thead>
          <tr>
            <th>م</th>
            <th>الرتبة</th>
            <th>الاسم</th>
            <th>عدد الأيام</th>

            <th>م</th>
            <th>الرتبة</th>
            <th>الاسم</th>
            <th>عدد الأيام</th>

            <th>م</th>
            <th>الرتبة</th>
            <th>الاسم</th>
            <th>عدد الأيام</th>

            <th>م</th>
            <th>الرتبة</th>
            <th>الاسم</th>
            <th>عدد الأيام</th>
          </tr>
        </thead>

        <tbody>
          {rows.length > 0 ? (
            rows.map((row, index) => (
              <tr key={index}>
                {row.map((person, personIndex) => (
                  <PersonCells
                    key={personIndex}
                    person={person}
                    number={index * 4 + personIndex + 1}
                    days={days}
                    onDaysChange={onDaysChange}
                  />
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="16">لا يوجد</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}

/* =========================================================
   PERSON CELLS
========================================================= */

function PersonCells({ person, number, days, onDaysChange }) {
  if (!person) {
    return (
      <>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
      </>
    );
  }

  const currentDays = days[person.id] ?? 1;

  return (
    <>
      <td className="person-number-cell">{toArabicNumbers(number)}</td>

      <td className="green-cell rank-cell">{person.rank || "-"}</td>

      <td className="green-cell name-cell">{person.name || "-"}</td>

      <td className="days-cell">
        <div className="days-control">
          <input
            className="days-input"
            type="text"
            inputMode="numeric"
            value={toArabicNumbers(currentDays)}
            onChange={(event) => {
              const value = arabicToEnglishNumbers(event.target.value);

              if (value === "") {
                onDaysChange(person.id, 1);
                return;
              }

              onDaysChange(person.id, Number(value));
            }}
          />
        </div>
      </td>
    </>
  );
}

/* =========================================================
   OUTSIDE STATUS ROWS
========================================================= */

function getStatusRows(people, type) {
  const rows = [];

  people.forEach((person) => {
    if (!Array.isArray(person?.statuses)) {
      return;
    }

    person.statuses.forEach((status) => {
      if (getStatusType(status) === type) {
        rows.push({
          person,
          status,
        });
      }
    });
  });

  return rows;
}

/* =========================================================
   OUTSIDE CELLS
========================================================= */

function StatusCells({ data, number, type }) {
  const columns = getStatusColumns(type);

  if (!data) {
    return (
      <>
        {columns.map((column) => (
          <td key={column.key} className={column.className || ""}>
            -
          </td>
        ))}
      </>
    );
  }

  const { person, status } = data;

  return (
    <>
      {columns.map((column) => (
        <td key={column.key} className={column.className || ""}>
          {getCellValue(column, person, status, number, type)}
        </td>
      ))}
    </>
  );
}

/* =========================================================
   OUTSIDE TABLE
========================================================= */

function OutsideStatusTable({ title, type, people }) {
  const statusRows = getStatusRows(people, type);

  if (statusRows.length === 0) {
    return null;
  }

  const columns = getStatusColumns(type);

  const rows = [];

  for (let index = 0; index < statusRows.length; index += 2) {
    rows.push({
      right: statusRows[index],
      left: statusRows[index + 1],
    });
  }

  return (
    <section className="section">
      <h2 className="section-title">{title}</h2>

      <table className={`outside-status-table status-${type}`}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={`right-${column.key}`}
                className={column.className || ""}
              >
                {column.label}
              </th>
            ))}

            {columns.map((column) => (
              <th key={`left-${column.key}`} className={column.className || ""}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <StatusCells
                data={row.right}
                number={index * 2 + 1}
                type={type}
              />

              <StatusCells data={row.left} number={index * 2 + 2} type={type} />
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

/* =========================================================
   OUTSIDE CATEGORY
========================================================= */

function OutsideCategory({ title, people }) {
  const statusTypes = [
    "mission",
    "hospital",
    "absence",
    "sickLeave",
    "vacation",
    "band",
    "outCenter",
    "outCountry",
    "prison",
  ];

  return (
    <>
      {statusTypes.map((type) => (
        <OutsideStatusTable
          key={`${title}-${type}`}
          title={`${getStatusTitle(type)} من ${title}`}
          type={type}
          people={people}
        />
      ))}
    </>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function PagePeople() {
  const location = useLocation();

  const [serviceData, setServiceData] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("service") || "{}");
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      const savedService = JSON.parse(localStorage.getItem("service") || "{}");

      setServiceData(savedService);
    } catch {
      setServiceData({});
    }
  }, [location.key]);
  const [peopleData, setPeopleData] = useState(() => {
    try {
      const stored = localStorage.getItem("people");

      const parsed = stored ? JSON.parse(stored) : {};

      return {
        برا: Array.isArray(parsed?.برا) ? parsed.برا : [],

        موجود: Array.isArray(parsed?.موجود) ? parsed.موجود : [],
      };
    } catch {
      return {
        برا: [],
        موجود: [],
      };
    }
  });

  /* =======================================================
     DAYS
  ======================================================= */

  const [days, setDays] = useState(() => {
    const result = {};

    const allPeople = [
      ...(peopleData?.برا || []),
      ...(peopleData?.موجود || []),
    ];

    allPeople.forEach((person) => {
      result[person.id] = person.days || 1;
    });

    return result;
  });

  /* =======================================================
     REPORT
  ======================================================= */

  const report = useMemo(() => {
    const result = {
      موجود: {
        officers: [],
        nco: [],
        soldiers: [],
      },

      برا: {
        officers: [],
        nco: [],
        soldiers: [],
      },
    };

    peopleData.موجود.forEach((person) => {
      const category = getPersonCategory(person?.rank);

      result.موجود[category].push(person);
    });

    peopleData.برا.forEach((person) => {
      const category = getPersonCategory(person?.rank);

      result.برا[category].push(person);
    });

    Object.keys(result.موجود).forEach((category) => {
      result.موجود[category] = sortPeople(result.موجود[category]);
    });

    Object.keys(result.برا).forEach((category) => {
      result.برا[category] = sortPeople(result.برا[category]);
    });

    return result;
  }, [peopleData]);

  /* =======================================================
     DAYS CHANGE
  ======================================================= */

  const handleDaysChange = (personId, value) => {
    const newDays = Math.max(1, Number(value) || 1);

    setDays((previous) => ({
      ...previous,
      [personId]: newDays,
    }));

    setPeopleData((previous) => {
      const updated = {
        برا: previous.برا.map((person) =>
          person.id === personId
            ? {
                ...person,
                days: newDays,
              }
            : person,
        ),

        موجود: previous.موجود.map((person) =>
          person.id === personId
            ? {
                ...person,
                days: newDays,
              }
            : person,
        ),
      };

      localStorage.setItem("people", JSON.stringify(updated));

      return updated;
    });
  };

  const increaseAllDays = () => {
    setPeopleData((previous) => {
      const updated = {
        برا: previous.برا.map((person) => ({
          ...person,
          days: Math.max(1, Number(person.days) || 1) + 1,
        })),

        موجود: previous.موجود.map((person) => ({
          ...person,
          days: Math.max(1, Number(person.days) || 1) + 1,
        })),
      };

      setDays((previousDays) => {
        const updatedDays = { ...previousDays };

        [...updated.برا, ...updated.موجود].forEach((person) => {
          updatedDays[person.id] = person.days;
        });

        return updatedDays;
      });

      localStorage.setItem("people", JSON.stringify(updated));

      return updated;
    });
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <>
      <ArabicNumbers />

      <style>{`
        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          background: #ddd;
          color: #000;
          font-family:
            "Times New Roman",
            Tahoma,
            Arial,
            sans-serif;
        }

        /* =========================
           PRINT CONTROLS
        ========================= */

        .print-controls {
          width: 210mm;
          margin: 6px auto;
          direction: rtl;
        }

        .print-button {
          background: #000;
          color: #fff;
          border: 1px solid #000;
          padding: 7px 18px;
          font-family: inherit;
          font-size: 13px;
          font-weight: bold;
          cursor: pointer;
          border-radius: 4px;
        }

        /* =========================
           PAGE
        ========================= */

        .report-page {
          font-size: 12px;
          width: 210mm;
          min-height: 297mm;
          margin: auto;
          padding: 5mm;
          background: #fff;
          direction: rtl;
          color: #000;
          border: 2px solid #000;
          position: relative;
        }

        /* =========================
           HEADER
        ========================= */

        .report-header {
          width: 100%;
          margin-bottom: 5px;
          color: #000;
        }

        /* =========================
           SUMMARY
        ========================= */

        .summary-section {
          margin-top: 5px;
          margin-bottom: 5px;
          page-break-inside: avoid;
        }

        .summary-header {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .summary-title {
          margin: 0 0 2px;
          padding: 0;
          text-align: center;
          font-size: 13px;
          line-height: 1.1;
          font-weight: 900;
          color: #000;
        }

        .summary-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          direction: rtl;
          color: #000;
        }

        .summary-table th,
        .summary-table td {
          border: 1px solid #000;
          padding: 3px 2px;
          text-align: center;
          vertical-align: middle;
          color: #000;
          font-size: 10px;
          line-height: 1.1;
          height: 22px;
          font-weight: 800;
        }

        .summary-table th {
          font-weight: 900;
          background: #fff;
        }

        /* =========================
           GENERAL SECTION
        ========================= */

        .section {
          margin-top: 6px;
          color: #000;
          page-break-inside: avoid;
        }

        .section-title {
          margin: 0 0 2px;
          padding: 0;
          text-align: center;
          font-size: 13px;
          line-height: 1.1;
          font-weight: 900;
          color: #000;
        }

        /* =========================
           PEOPLE TABLE - 4 PEOPLE
        ========================= */

        .people-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          color: #000;
          direction: rtl;
        }

        .people-table th,
        .people-table td {
          border: 1px solid #000;
          padding: 2px;
          text-align: center;
          vertical-align: middle;
          color: #000;
          font-size: 9px;
          line-height: 1;
          height: 23px;
        }

        .people-table th {
          font-size: 9px;
          font-weight: 900;
          background: #fff;
        }

        /* رقم */

        .people-table th:nth-child(1),
        .people-table th:nth-child(5),
        .people-table th:nth-child(9),
        .people-table th:nth-child(13) {
          width: 3%;
        }

        /* الرتبة */

        .people-table th:nth-child(2),
        .people-table th:nth-child(6),
        .people-table th:nth-child(10),
        .people-table th:nth-child(14) {
          width: 9%;
        }

        /* الاسم */

        .people-table th:nth-child(3),
        .people-table th:nth-child(7),
        .people-table th:nth-child(11),
        .people-table th:nth-child(15) {
          width: 12%;
        }

        /* الأيام */

        .people-table th:nth-child(4),
        .people-table th:nth-child(8),
        .people-table th:nth-child(12),
        .people-table th:nth-child(16) {
          width: 4%;
        }

        .person-number-cell {
          font-size: 11px !important;
          font-weight: 900;
        }

        .rank-cell {
          font-size: 9px !important;
          font-weight: 900;
          white-space: nowrap;
        }

        .name-cell {
          font-size: 10px !important;
          font-weight: 900;
          white-space: nowrap;
        }

        /* =========================
           GREEN CELLS
        ========================= */

        .green-cell {
          background: #dcfce7 !important;
          color: #14532d !important;
          border-color: #166534 !important;
        }

        /* =========================
           DAYS CONTROL
        ========================= */

        .days-cell {
          background: #fff;
        }

        .days-control {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1px;
          direction: ltr;
        }

        .days-input {
          width: 32px;
          height: 20px;
          padding: 0;
          border: 1px solid #000;
          border-radius: 2px;
          text-align: center;
          font-family: inherit;
          font-size: 12px;
          font-weight: 900;
          background: #fff;
          color: #000;
          direction: rtl;
          outline: none;
        }

        .days-input:focus {
          border: 2px solid #166534;
          background: #f0fdf4;
        }

        .days-btn {
          width: 14px;
          height: 20px;
          padding: 0;
          border: 1px solid #000;
          background: #f1f1f1;
          color: #000;
          font-family: Arial, sans-serif;
          font-size: 12px;
          font-weight: 900;
          line-height: 16px;
          cursor: pointer;
          border-radius: 2px;
        }

        .days-btn:hover {
          background: #dcfce7;
          border-color: #166534;
        }

        .days-btn:active {
          transform: scale(0.92);
        }

        /* =========================
           OUTSIDE TABLE
        ========================= */

        .outside-status-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          color: #000;
          direction: rtl;
        }

        .outside-status-table th,
        .outside-status-table td {
          border: 1px solid #000;
          padding: 3px 2px;
          text-align: center;
          vertical-align: middle;
          color: #000;
          font-size: 9px;
          line-height: 1.1;
          min-height: 20px;
          overflow: hidden;
          word-break: normal;
        }

        .outside-status-table th {
          font-weight: 900;
          background: #fff;
          font-size: 9px;
        }

        /* =========================
           OUTSIDE COMMON CELLS
        ========================= */

        .cell-number {
          width: 3%;
          font-size: 11px !important;
          font-weight: 900 !important;
        }
          .print-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  direction: rtl;
  margin-bottom: 24px;
}

        .cell-rank {
          width: 10%;
          background: #dcfce7 !important;
          color: #14532d !important;
          border-color: #166534 !important;
          font-weight: 900 !important;
          font-size: 10px !important;
          white-space: nowrap;
        }

        .cell-name {
          width: 17%;
          background: #dcfce7 !important;
          color: #14532d !important;
          border-color: #166534 !important;
          font-weight: 900 !important;
          font-size: 10px !important;
          white-space: nowrap;
        }
.cell-date {
  width: 15%;
  min-width: 15%;
  background: #dcfce7 !important;
  color: #14532d !important;
  border-color: #166534 !important;
  font-weight: 900 !important;
  font-size: 10px !important;
  white-space: nowrap;
  overflow: visible !important;
  text-align: center;
  direction: ltr;
  unicode-bidi: plaintext;
}

        .cell-wide {
          width: 15%;
        }

        /* الملاحظات أكبر */

        .cell-notes {
          width: 26% !important;
          min-width: 26% !important;
          font-size: 9px !important;
          font-weight: 700 !important;
        }

        /* =========================
           STATUS SPECIFIC WIDTHS
        ========================= */

        .status-hospital .cell-notes {
          width: 28% !important;
        }

        .status-absence .cell-notes,
        .status-sickLeave .cell-notes,
        .status-vacation .cell-notes {
          width: 27% !important;
        }

        .status-mission .cell-wide {
          width: 16%;
        }

        .status-band .cell-wide {
          width: 17%;
        }

        .status-outCenter .cell-wide {
          width: 17%;
        }

        .status-outCountry .cell-wide {
          width: 17%;
        }

        .status-prison .cell-wide {
          width: 20%;
        }

        /* =========================
           NAME
        ========================= */

        .person-name {
          font-size: 10px !important;
          font-weight: 900;
          white-space: nowrap;
        }

        /* =========================
           SIGNATURE
        ========================= */

        .signature {
          width: 40%;
          margin-top: 12px;
          margin-right: auto;
          text-align: center;
          color: #000;
          page-break-inside: avoid;
          border: 2px solid #000;
          padding: 4px;
          border-radius: 5px;
        }

        .signature-title {
          font-size: 12px;
          font-weight: 900;
          margin-bottom: 12px;
          color: #000;
        }

        .signature-line {
          border-top: 1px solid #000;
          margin-bottom: 2px;
        }

        .signature-name {
          font-size: 9px;
          color: #000;
        }

        /* =========================
           PRINT
        ========================= */

        @page {
          size: A4 portrait;
          margin: 4mm;
        }

        @media print {
          html,
          body {
            background: #fff !important;
            color: #000 !important;
          }

          .print-controls {
            display: none !important;
          }

          .report-page {
            width: 100%;
            min-height: auto;
            margin: 0;
            padding: 4mm;
            border: 2px solid #000;
          }

          .days-control {
            gap: 0;
          }

          .days-btn {
            display: none !important;
          }

          .days-input {
            border: none;
            background: transparent;
            width: 32px;
            color: #000 !important;
            font-size: 13px !important;
            font-weight: 900 !important;
          }

          .summary-section,
          .section {
            page-break-inside: avoid;
          }

          .summary-table,
          .people-table,
          .outside-status-table {
            page-break-inside: avoid;
          }

          .summary-table tr,
          .people-table tr,
          .outside-status-table tr {
            page-break-inside: avoid;
          }

          .green-cell,
          .cell-rank,
          .cell-name,
          .cell-date {
            background: #dcfce7 !important;
            color: #14532d !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          * {
            color: #000 !important;
          }

          .green-cell,
          .cell-rank,
          .cell-name,
          .cell-date {
            color: #14532d !important;
          }
        }
      `}</style>

      {/* PRINT BUTTON */}

      <div className="print-controls ">
        <div className="print-actions ">
          {/* زيادة الأيام */}
          <Button
            variant="contained"
            onClick={increaseAllDays}
            startIcon={<Add />}
            sx={{
              minWidth: 170,
              minHeight: 48,
              px: 2.5,
              borderRadius: "14px",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,

              direction: "rtl",

              background: "linear-gradient(135deg, #059669, #10b981)",
              color: "#fff",

              fontSize: "15px",
              fontWeight: 900,
              textTransform: "none",

              border: "1px solid rgba(167,243,208,0.35)",

              boxShadow: "0 6px 18px rgba(16,185,129,0.22)",

              transition: "all 0.25s ease",

              "&:hover": {
                background: "linear-gradient(135deg, #047857, #059669)",
                transform: "translateY(-2px)",
                boxShadow: "0 10px 23px rgba(16,185,129,0.3)",
              },

              "& .MuiButton-startIcon": {
                margin: 0,
              },
            }}
          >
            زيادة يوم للجميع
          </Button>

          {/* الطباعة */}
          <Button
            variant="contained"
            onClick={() => window.print()}
            startIcon={<Print />}
            sx={{
              minWidth: 190,
              minHeight: 48,
              px: 2.5,
              borderRadius: "14px",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,

              direction: "rtl",

              background: "linear-gradient(135deg, #2563eb, #3b82f6)",
              color: "#fff",

              fontSize: "15px",
              fontWeight: 900,
              textTransform: "none",

              border: "1px solid rgba(191,219,254,0.35)",

              boxShadow: "0 6px 18px rgba(37,99,235,0.24)",

              transition: "all 0.25s ease",

              "&:hover": {
                background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
                transform: "translateY(-2px)",
                boxShadow: "0 10px 24px rgba(37,99,235,0.32)",
              },

              "& .MuiButton-startIcon": {
                margin: 0,
              },
            }}
          >
            طباعة / حفظ PDF
          </Button>
          {/* رجوع */}
          <Button
            variant="contained"
            onClick={() => window.history.back()}
            startIcon={<ArrowBack />}
            sx={{
              minWidth: 130,
              minHeight: 48,
              px: 2.5,
              borderRadius: "14px",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,

              direction: "ltr",

              background: "linear-gradient(135deg, #475569, #334155)",
              color: "#fff",

              fontSize: "15px",
              fontWeight: 900,
              textTransform: "none",

              border: "1px solid rgba(255,255,255,0.12)",

              boxShadow: "0 6px 16px rgba(15,23,42,0.22)",

              transition: "all 0.25s ease",

              "&:hover": {
                background: "linear-gradient(135deg, #334155, #1e293b)",
                transform: "translateY(-2px)",
                boxShadow: "0 9px 20px rgba(15,23,42,0.3)",
              },

              "& .MuiButton-startIcon": {
                margin: 0,
              },
            }}
          >
            رجوع
          </Button>
        </div>
      </div>
      <main className="report-page">
        {/* HEADER */}

        <div className="w-full p-1 text-[12px] leading-tight bg-white text-black">
          <div className="flex justify-between underline mb-2">
            <div className="flex flex-col items-start">
              <p className="font-black">{commandName}</p>

              <p className="font-black">{unitName}</p>
            </div>
          </div>

          <div className="flex justify-center items-center my-4">
            <p className="text-[20px] font-black text-center underline underline-offset-8">
              تمام اليومى {unitName} عن يوم {serviceData?.day || "---"} الموافق
              : {serviceData?.date || "---"}
            </p>
          </div>
        </div>

        {/* الضباط */}

        <SummaryTable
          title="الضباط"
          existingPeople={report.موجود.officers}
          outsidePeople={report.برا.officers}
        />

        <PeopleDoubleTable
          title="بيان الموجود من الضباط"
          people={report.موجود.officers}
          days={days}
          onDaysChange={handleDaysChange}
        />

        <OutsideCategory title="الضباط" people={report.برا.officers} />

        {/* صف الضباط */}

        <SummaryTable
          title="صف الضباط"
          existingPeople={report.موجود.nco}
          outsidePeople={report.برا.nco}
        />

        <PeopleDoubleTable
          title="بيان الموجود من صف الضباط"
          people={report.موجود.nco}
          days={days}
          onDaysChange={handleDaysChange}
        />

        <OutsideCategory title="صف الضباط" people={report.برا.nco} />

        {/* الجنود */}

        <SummaryTable
          title="الجنود"
          existingPeople={report.موجود.soldiers}
          outsidePeople={report.برا.soldiers}
        />

        <PeopleDoubleTable
          title="بيان الموجود من الجنود"
          people={report.موجود.soldiers}
          days={days}
          onDaysChange={handleDaysChange}
        />

        <OutsideCategory title="الجنود" people={report.برا.soldiers} />

        {/* SIGNATURE */}

        <div className="flex text-black flex-col w-[40%] gap-1  p-1 m-1 rounded-[5px] order-last mr-auto">
          <p className="text-[15px]">
            {serviceData?.leader?.rank || "---"} /{" "}
            {serviceData?.leader?.name || "---"}
          </p>

          <p className="text-[15px]">قائد {unitName}</p>

          <div className="flex justify-between items-center w-full">
            <div className="text-[20px]">
              توقيع <span className="text-[20px]">(</span>
            </div>
            <div className="text-[20px]">)</div>
          </div>
        </div>
      </main>
    </>
  );
}
