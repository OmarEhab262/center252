import { useState, useEffect, useRef } from "react";

const duplicateColors = [
  "bg-cyan-400 shadow-cyan-400/50",
  "bg-emerald-400 shadow-emerald-400/50",
  "bg-amber-400 shadow-amber-400/50",
  "bg-orange-400 shadow-orange-400/50",
  "bg-red-400 shadow-red-400/50",
  "bg-purple-400 shadow-purple-400/50",
  "bg-pink-400 shadow-pink-400/50",
  "bg-blue-400 shadow-blue-400/50",
  "bg-indigo-400 shadow-indigo-400/50",
  "bg-violet-400 shadow-violet-400/50",
  "bg-fuchsia-400 shadow-fuchsia-400/50",
  "bg-rose-400 shadow-rose-400/50",
  "bg-lime-400 shadow-lime-400/50",
  "bg-green-400 shadow-green-400/50",
  "bg-teal-400 shadow-teal-400/50",
  "bg-sky-400 shadow-sky-400/50",
  "bg-yellow-400 shadow-yellow-400/50",
  "bg-red-500 shadow-red-500/50",
  "bg-purple-500 shadow-purple-500/50",
  "bg-blue-500 shadow-blue-500/50",
];

// ========================================
// إنشاء لون ثابت لكل ID مكرر
// ========================================
const createDuplicateColorMap = (usageCount) => {
  const colorMap = {};
  let colorIndex = 0;

  Object.keys(usageCount)
    .filter((id) => usageCount[id] > 1)
    .forEach((id) => {
      colorMap[id] = duplicateColors[colorIndex % duplicateColors.length];

      colorIndex++;
    });

  return colorMap;
};

export default function CustomPersonSelect({
  names = [],
  value,
  usageCount = {},
  onChange,
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // ========================================
  // خريطة ألوان الأشخاص المكررين
  // ========================================
  const duplicateColorMap = createDuplicateColorMap(usageCount);

  // ========================================
  // إغلاق القائمة عند الضغط خارجها
  // ========================================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ========================================
  // الشخص المختار حاليًا
  // ========================================
  const selectedPerson = names.find(
    (person) => String(person.id) === String(value),
  );

  // ========================================
  // ID الشخص
  // ========================================
  const selectedId = selectedPerson ? String(selectedPerson.id) : "";

  // ========================================
  // عدد مرات استخدام الشخص
  // ========================================
  const selectedCount = selectedId ? usageCount[selectedId] || 0 : 0;

  // ========================================
  // لون الشخص إذا كان مكررًا
  // ========================================
  const selectedColor = duplicateColorMap[selectedId];

  // ========================================
  // اختيار شخص
  // ========================================
  const handleSelect = (personId) => {
    onChange(personId);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative flex-1">
      {/* =========================
          زر الاختيار الرئيسي
      ========================== */}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="
          w-full
          rounded-lg
          p-4
          text-start
          bg-slate-800
          hover:bg-slate-600
          transition-all
          duration-300
          font-bold
          border
          border-slate-500
          focus:ring-2
          focus:ring-cyan-500
          focus:outline-none
          cursor-pointer
          text-white
          flex
          items-center
          justify-between
          gap-3
        "
      >
        {/* الاسم */}

        <span className="truncate">
          {selectedPerson
            ? `${selectedPerson.name} `
            : value === "---"
              ? "---"
              : "اختر الاسم"}
        </span>

        {/* =========================
            الدائرة تظهر فقط عند التكرار
        ========================== */}

        {selectedPerson && selectedCount > 1 ? (
          <span
            className={`
              w-4
              h-4
              rounded-full
              flex-shrink-0
              shadow-lg
              ${selectedColor}
            `}
          />
        ) : (
          <span
            className={`
              text-sm
              flex-shrink-0
              transition-transform
              duration-300
              ${open ? "rotate-180" : ""}
            `}
          >
            ▼
          </span>
        )}
      </button>

      {/* =========================
          القائمة المنسدلة
      ========================== */}

      {open && (
        <div
          className="
            absolute
            z-50
            top-full
            right-0
            left-0
            mt-2
            bg-slate-800
            border
            border-slate-600
            rounded-xl
            shadow-2xl
            overflow-hidden
            max-h-72
            overflow-y-auto
          "
        >
          {/* اختيار فارغ */}

          <button
            type="button"
            onClick={() => handleSelect("")}
            className="
              w-full
              px-4
              py-3
              text-right
              text-white
              hover:bg-slate-700
              transition
            "
          >
            اختر الاسم
          </button>

          {/* =========================
              قائمة الأشخاص
          ========================== */}

          {names.map((person) => {
            const id = String(person.id);
            const count = usageCount[id] || 0;
            const color = duplicateColorMap[id];

            return (
              <button
                key={person.id}
                type="button"
                onClick={() => handleSelect(person.id)}
                className="
                  w-full
                  px-4
                  py-3
                  text-right
                  text-white
                  hover:bg-slate-700
                  transition
                  flex
                  items-center
                  justify-between
                  gap-3
                "
              >
                <span className="truncate">
                  {person.name} - {person.rank}
                </span>

                {/* =========================
                    الدائرة تظهر فقط إذا كان
                    الاسم مستخدمًا أكثر من مرة
                ========================== */}

                {count > 1 && (
                  <span
                    className={`
                      w-3
                      h-3
                      rounded-full
                      flex-shrink-0
                      shadow-lg
                      ${color}
                    `}
                  />
                )}
              </button>
            );
          })}

          {/* الخيار --- */}

          <button
            type="button"
            onClick={() => handleSelect("---")}
            className="
              w-full
              px-4
              py-3
              text-right
              text-white
              hover:bg-slate-700
              transition
              border-t
              border-slate-700
            "
          >
            ---
          </button>
        </div>
      )}
    </div>
  );
}
