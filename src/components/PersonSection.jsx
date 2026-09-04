import { useEffect, useRef, useState } from "react";

function PersonSelect({ names = [], value, onChange, filterRanks = null }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Filter names by rank
  const filteredNames = filterRanks
    ? names.filter((person) => filterRanks.includes(person.rank))
    : names;

  // Selected person
  const selectedPerson = names.find(
    (person) => String(person.id) === String(value),
  );

  // Close when clicking outside
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
      {/* Select button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="
          w-full
          rounded-lg
          p-3
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
        <span className="truncate">
          {selectedPerson
            ? `${selectedPerson.name} `
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

      {/* Dropdown */}
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
          {/* Clear */}
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

          {/* People */}
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

          {/* Empty option */}
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

// ============================================================
// Person Section
// ============================================================

export default function PersonSection({
  title,
  section,
  form,
  names,
  updatePerson,
  filterRanks = null,
}) {
  const person = form?.[section] || {};

  return (
    <div className="bg-white/5 rounded-2xl p-5 mt-10">
      <h2 className="text-3xl text-center font-bold mb-5">{title}</h2>

      <div className="flex gap-3 items-center">
        <PersonSelect
          names={names}
          value={person.id || ""}
          filterRanks={filterRanks}
          onChange={(id) => updatePerson(section, id)}
        />

        {person.rank && (
          <div
            className="
              bg-slate-800
              rounded-xl
              px-4
              py-3
              min-w-32
              flex
              justify-center
              items-center
              text-white
              font-bold
              flex-shrink-0
            "
          >
            {person.rank}
          </div>
        )}
      </div>
    </div>
  );
}
