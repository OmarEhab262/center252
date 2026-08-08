import { useState } from "react";

export default function CustomPersonSelect({ names = [], value, onChange }) {
  const [open, setOpen] = useState(false);

  const selected = names.find((person) => person.id === Number(value));

  return (
    <div className="relative flex-1">
      {/* Selected */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="
        w-full
        rounded-lg
        p-2
        text-center
        bg-slate-700
        hover:bg-slate-600
        transition-colors
        duration-300
        font-bold
        border border-slate-500
        focus:ring-2 focus:ring-cyan-500
        cursor-pointer
        text-white
        "
      >
        {selected ? selected.name : "اختر الاسم"}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
      absolute
      z-50
      top-full
      left-0
      right-0
      mt-2
      bg-white
      rounded-lg
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
          px-3
          py-2
          cursor-pointer
          text-black
          hover:bg-cyan-200
          flex
          justify-between
          "
            >
              <span>{person.name}</span>
              <span className="font-bold">{person.rank}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
