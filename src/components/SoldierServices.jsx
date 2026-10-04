import { useMemo, useState } from "react";

const duplicateColors = [
  "border-red-500",
  "border-cyan-400",
  "border-purple-500",
  "border-lime-400",
  "border-orange-500",
  "border-blue-600",
  "border-yellow-400",
  "border-fuchsia-500",
  "border-green-500",
  "border-pink-500",
  "border-indigo-500",
  "border-amber-500",
  "border-teal-500",
  "border-rose-500",
  "border-violet-500",
  "border-emerald-500",
];

const rankOrder = [
  "مساعد.أ",
  "مساعد",
  "رقيب.أ",
  "رقيب",
  "عريف",
  "رقيب مجند",
  "عريف مجند",
  "جندى",
];

const ncoRanks = ["مساعد.أ", "مساعد", "رقيب.أ", "رقيب", "عريف"];

const soldierRanks = ["رقيب مجند", "عريف مجند", "جندى"];

const createDefaultGuardData = () => [
  {
    position: "حكمدار",
    id: "",
    name: "---",
    rank: "---",
  },
  {
    position: "أولى",
    id: "",
    name: "---",
    rank: "---",
  },
  {
    position: "ثانية",
    id: "",
    name: "---",
    rank: "---",
  },
  {
    position: "ثالثة",
    id: "",
    name: "---",
    rank: "---",
  },
];

/* ============================================================
   Custom Select
============================================================ */

function PersonSelect({
  value,
  people,
  placeholder = "اختر الاسم",
  selectedColor,
  isDuplicate,
  onChange,
}) {
  const [open, setOpen] = useState(false);

  const selectedPerson = people.find(
    (person) => String(person.id) === String(value),
  );

  const sortedPeople = useMemo(() => {
    return [...people].sort((a, b) => {
      const rankA = String(a.rank || "").trim();
      const rankB = String(b.rank || "").trim();

      const indexA = rankOrder.indexOf(rankA);
      const indexB = rankOrder.indexOf(rankB);

      const safeIndexA = indexA === -1 ? rankOrder.length : indexA;

      const safeIndexB = indexB === -1 ? rankOrder.length : indexB;

      if (safeIndexA !== safeIndexB) {
        return safeIndexA - safeIndexB;
      }

      return String(a.name || "").localeCompare(String(b.name || ""), "ar");
    });
  }, [people]);

  const handleSelect = (personId) => {
    onChange(personId);
    setOpen(false);
  };

  return (
    <div className="relative w-full">
      {/* ================= Selected Field ================= */}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`
          min-h-[52px]
          w-full
          cursor-pointer
          rounded-lg
          border-2
          bg-slate-800
          px-4
          py-3
          text-right
          font-bold
          text-white
          outline-none
          transition-all
          duration-200
          ${
            isDuplicate ? selectedColor || "border-red-500" : "border-slate-500"
          }
          ${open ? "ring-2 ring-cyan-400/20" : ""}
        `}
      >
        <div className="flex items-center justify-between gap-3">
          <span
            className={`
              truncate
              ${selectedPerson ? "text-white" : "text-slate-400"}
            `}
          >
            {selectedPerson
              ? selectedPerson.name
              : value === "---"
                ? "---"
                : placeholder}
          </span>

          <span
            className={`
              shrink-0
              text-xs
              text-slate-400
              transition-transform
              duration-200
              ${open ? "rotate-180" : ""}
            `}
          >
            ▼
          </span>
        </div>
      </button>

      {/* ================= Dropdown ================= */}

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          <div
            className="
              absolute
              right-0
              z-50
              mt-2
              max-h-72
              w-full
              overflow-y-auto
              rounded-xl
              border
              border-slate-600
              bg-slate-900
              p-2
              shadow-2xl
            "
          >
            {/* ================= Placeholder ================= */}

            <button
              type="button"
              onClick={() => handleSelect("")}
              className={`
                mb-1
                w-full
                rounded-lg
                px-4
                py-3
                text-right
                font-bold
                transition-colors
                ${
                  !selectedPerson && value !== "---"
                    ? "bg-cyan-500/20 text-cyan-300"
                    : "text-slate-400 hover:bg-slate-800"
                }
              `}
            >
              {placeholder}
            </button>

            {/* ================= People ================= */}

            {sortedPeople.map((person) => {
              const isSelected = String(person.id) === String(value);

              return (
                <button
                  type="button"
                  key={person.id}
                  onClick={() => handleSelect(person.id)}
                  className={`
                    mb-1
                    flex
                    w-full
                    items-center
                    justify-between
                    gap-3
                    rounded-lg
                    px-4
                    py-3
                    text-right
                    transition-all
                    duration-150
                    ${isSelected ? "bg-cyan-500/20" : "hover:bg-slate-800"}
                  `}
                >
                  {/* Name */}

                  <span
                    className={`
                      min-w-0
                      flex-1
                      truncate
                      font-bold
                      ${isSelected ? "text-cyan-300" : "text-white"}
                    `}
                  >
                    {person.name}
                  </span>

                  {/* Rank */}

                  <span
                    className="
                      shrink-0
                      rounded-md
                      bg-slate-700
                      px-3
                      py-1
                      text-xs
                      font-bold
                      text-cyan-200
                    "
                  >
                    {person.rank || "---"}
                  </span>
                </button>
              );
            })}

            {/* ================= Empty ================= */}

            {sortedPeople.length === 0 && (
              <div className="px-4 py-5 text-center text-sm font-bold text-slate-400">
                لا يوجد أفراد
              </div>
            )}

            {/* ================= --- ================= */}

            <button
              type="button"
              onClick={() => handleSelect("---")}
              className={`
                mt-1
                w-full
                rounded-lg
                px-4
                py-3
                text-right
                font-bold
                transition-colors
                ${
                  value === "---"
                    ? "bg-cyan-500/20 text-cyan-300"
                    : "text-white hover:bg-slate-800"
                }
              `}
            >
              ---
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ============================================================
   Soldier Services
============================================================ */

export default function SoldierServices({
  services = [],
  soldierNames = [],
  guardNames = [],
  usageCount = {},
  updateDynamicService,
  changeKedma,
}) {
  /* ============================================================
     الأشخاص المسموح بهم في الحكمدار
     صف ضباط + عساكر
  ============================================================ */

  const guardPeople = useMemo(() => {
    const allPeople = [...guardNames, ...soldierNames];

    const uniquePeople = new Map();

    allPeople.forEach((person) => {
      if (!person?.id) return;

      const rank = String(person.rank || "").trim();

      if (ncoRanks.includes(rank) || soldierRanks.includes(rank)) {
        uniquePeople.set(String(person.id), person);
      }
    });

    return [...uniquePeople.values()];
  }, [guardNames, soldierNames]);

  /* ============================================================
     العساكر فقط
  ============================================================ */

  const soldiersOnly = useMemo(() => {
    return soldierNames.filter((person) =>
      soldierRanks.includes(String(person.rank || "").trim()),
    );
  }, [soldierNames]);

  /* ============================================================
     ألوان التكرار
  ============================================================ */

  const duplicateColorMap = useMemo(() => {
    const map = {};
    let colorIndex = 0;

    Object.keys(usageCount)
      .filter((id) => usageCount[id] > 1)
      .forEach((id) => {
        map[id] = duplicateColors[colorIndex % duplicateColors.length];

        colorIndex++;
      });

    return map;
  }, [usageCount]);

  /* ============================================================
     تغيير الشخص
  ============================================================ */

  const handlePersonChange = (serviceId, index, value, data) => {
    const newData = [...data];

    /* ================= اختيار --- ================= */

    if (value === "---") {
      newData[index] = {
        ...newData[index],
        id: "---",
        name: "---",
        rank: "---",
      };

      updateDynamicService(serviceId, newData);
      return;
    }

    /* ================= إلغاء الاختيار ================= */

    if (value === "") {
      newData[index] = {
        ...newData[index],
        id: "",
        name: "---",
        rank: "---",
      };

      updateDynamicService(serviceId, newData);
      return;
    }

    /* ================= الأشخاص المتاحين ================= */

    const availablePeople = index === 0 ? guardPeople : soldiersOnly;

    const person = availablePeople.find(
      (item) => String(item.id) === String(value),
    );

    if (!person) return;

    newData[index] = {
      ...newData[index],
      id: person.id,
      name: person.name,
      rank: person.rank,
    };

    updateDynamicService(serviceId, newData);
  };

  return (
    <div className="mt-10 w-full">
      {/* ================= Main Title ================= */}

      <h2 className="mb-6 text-center text-2xl font-bold">خدمات الجنود</h2>

      {/* ================= Change Service Button ================= */}

      <div className="mb-6 flex justify-center">
        <button
          type="button"
          onClick={changeKedma}
          className="
            rounded-xl
            bg-cyan-600
            px-6
            py-3
            font-bold
            text-white
            shadow-lg
            transition
            hover:bg-cyan-500
            active:scale-95
          "
        >
          تبديل الخدمة
        </button>
      </div>

      {/* ================= Services ================= */}

      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
        {services.map((service, serviceIndex) => {
          const data =
            Array.isArray(service.data) && service.data.length === 4
              ? service.data
              : createDefaultGuardData();

          const isLastOddItem =
            services.length % 2 === 1 && serviceIndex === services.length - 1;

          return (
            <div
              key={service.id}
              className={`
                rounded-2xl
                border
                border-white/10
                bg-white/5
                p-5
                shadow-lg
                ${isLastOddItem ? "md:col-span-2" : ""}
              `}
            >
              {/* ================= Service Title ================= */}

              <h3 className="mb-5 text-end text-2xl font-black text-cyan-300">
                {service.name}
              </h3>

              {/* ================= Positions ================= */}

              <div className="space-y-4">
                {data.map((item, index) => {
                  const selectedId =
                    item.id && item.id !== "---" ? String(item.id) : "";

                  const selectedCount = selectedId
                    ? usageCount[selectedId] || 0
                    : 0;

                  const selectedColor = duplicateColorMap[selectedId];

                  /* ================= الأشخاص المتاحين ================= */

                  const availablePeople =
                    index === 0 ? guardPeople : soldiersOnly;

                  return (
                    <div
                      key={`${service.id}-${index}`}
                      className="
                        rounded-xl
                        bg-slate-800
                        p-4
                      "
                    >
                      <div
                        className="
                          flex
                          flex-wrap
                          items-center
                          gap-3
                        "
                      >
                        {/* ================= Position ================= */}

                        <div className="w-20 shrink-0 text-center">
                          <p className="font-bold text-white">
                            {item.position}
                          </p>
                        </div>

                        {/* ================= Custom Select ================= */}

                        <div className="min-w-0 flex-1">
                          <PersonSelect
                            value={item.id === "---" ? "---" : item.id || ""}
                            people={availablePeople}
                            selectedColor={selectedColor}
                            isDuplicate={selectedCount > 1}
                            onChange={(value) =>
                              handlePersonChange(service.id, index, value, data)
                            }
                          />
                        </div>

                        {/* ================= Rank ================= */}

                        <div className="min-w-28 shrink-0">
                          <div className="rounded-lg bg-slate-700 px-3 py-3 text-center">
                            <p className="mt-1 truncate text-sm font-bold text-white">
                              {item.rank || "---"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
