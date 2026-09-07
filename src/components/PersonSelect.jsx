import { useState, useEffect, useRef } from "react";

export default function PersonSelect({
  names = [],
  value,
  onChange,
  filterRanks = null,
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
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

  // Filter names according to the required ranks
  const filteredNames = (
    filterRanks
      ? names.filter((person) => filterRanks.includes(person.rank))
      : names
  )
    .slice()
    .sort((a, b) => {
      const rankA = (a.rank || "").trim();
      const rankB = (b.rank || "").trim();
      const indexA = rankOrder.indexOf(rankA);
      const indexB = rankOrder.indexOf(rankB);
      const safeA = indexA === -1 ? rankOrder.length : indexA;
      const safeB = indexB === -1 ? rankOrder.length : indexB;
      return safeA - safeB;
    });

  // سطر مؤقت للفحص - افتح الـ Console وشوف الناتج
  console.log(
    filteredNames.map((p) => ({
      name: p.name,
      rank: p.rank,
      rankLength: p.rank?.length,
      rankCharCodes: p.rank?.split("").map((c) => c.charCodeAt(0)),
      foundIndex: rankOrder.indexOf((p.rank || "").trim()),
    })),
  );
  const selectedPerson = names.find(
    (person) => String(person.id) === String(value),
  );

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

  const handleSelect = (personId) => {
    onChange(personId);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative flex-1">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="
          w-full
          rounded-lg
          p-2
          text-start
          bg-slate-700
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
        <span className="truncate">
          {selectedPerson
            ? `${selectedPerson.name} - ${selectedPerson.rank}`
            : value === "---"
              ? "---"
              : "اختر الاسم"}
        </span>

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
      </button>

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

          {filteredNames.map((person) => (
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
              "
            >
              {person.name} - {person.rank}
            </button>
          ))}

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
