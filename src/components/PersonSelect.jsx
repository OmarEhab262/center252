import { useState } from "react";

export default function PersonSelect({ names = [], value, onChange }) {
  const [open, setOpen] = useState(false);

  const selected = names.find((person) => person.id === Number(value));

  return (
    <div className="flex-1 relative ">
      {/* Selected Name */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="
        w-full
        rounded-xl
        p-3
        text-white
        bg-slate-800
        hover:bg-slate-700
        shadow-lg
        duration-300
           border border-slate-500
        focus:ring-2 focus:ring-cyan-500
        font-bold
        cursor-pointer
        text-center
        "
      >
        {selected ? selected.name : "اختر الاسم"}
      </button>

      {/* Options */}
      {open && (
        <div
          className="
          absolute
          z-50
          top-full
          right-0
          left-0
          mt-2
          bg-white
          rounded-xl
          shadow-xl
          max-h-60
          overflow-y-auto
          "
        >
          {names.map((person) => (
            <div
              key={person.id}
              onClick={() => {
                onChange(person.id);
                setOpen(false);
              }}
              className="
              px-4
              py-3
              cursor-pointer
              text-black
              hover:bg-cyan-100
              flex
              justify-between
              items-center
              "
            >
              {/* Name */}
              <span>{person.name}</span>

              {/* Rank */}
              <span
                className="
                font-bold
                text-slate-700
                "
              >
                {person.rank}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
