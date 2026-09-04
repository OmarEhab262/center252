import CustomPersonSelect from "./CustomPersonSelect";

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
];

export default function GuardSection({
  title,
  data = [],
  names = [],
  usageCount = {},
  onChange,
}) {
  // ==========================================
  // إنشاء لون لكل اسم مكرر
  // ==========================================

  const duplicateColorMap = {};

  let colorIndex = 0;

  Object.keys(usageCount)
    .filter((id) => usageCount[id] > 1)
    .forEach((id) => {
      duplicateColorMap[id] =
        duplicateColors[colorIndex % duplicateColors.length];

      colorIndex++;
    });

  // ==========================================
  // تغيير الشخص
  // ==========================================

  const handlePersonChange = (index, value) => {
    const newData = [...data];

    // اختيار ---
    if (value === "---") {
      newData[index] = {
        ...newData[index],
        id: "---",
        name: "---",
        rank: "---",
      };

      onChange(newData);
      return;
    }

    // إلغاء الاختيار
    if (!value) {
      newData[index] = {
        ...newData[index],
        id: "",
        name: "---",
        rank: "---",
      };

      onChange(newData);
      return;
    }

    // اختيار شخص
    const person = names.find((item) => String(item.id) === String(value));

    if (!person) return;

    newData[index] = {
      ...newData[index],
      id: person.id,
      name: person.name,
      rank: person.rank,
    };

    onChange(newData);
  };

  return (
    <div className="bg-white/5 rounded-2xl p-6 shadow-lg">
      {/* العنوان */}
      <div className="flex justify-center mb-6">
        <h2 className="text-3xl font-bold">{title}</h2>
      </div>

      <div className="space-y-4">
        {data.map((item, index) => (
          <div
            key={index}
            className="
              bg-slate-800
              rounded-xl
              p-4
              flex
              gap-3
              items-center
            "
          >
            {/* المركز */}
            <p className="w-20 text-center font-bold">{item.position}</p>

            <div className="flex-1 flex-wrap flex gap-3 items-center">
              <CustomPersonSelect
                names={names}
                value={item.id}
                usageCount={usageCount}
                duplicateColorMap={duplicateColorMap}
                onChange={(value) => handlePersonChange(index, value)}
              />

              {/* الرتبة */}
              {item.rank && (
                <div
                  className="
                    hidden
                    sm:block
                    bg-slate-700
                    px-3
                    py-2
                    rounded-lg
                    min-w-28
                    text-center
                    font-bold
                  "
                >
                  {item.rank}
                </div>
              )}
            </div>
          </div>
        ))}

        {data.length === 0 && (
          <div className="text-center text-gray-300 py-6">لا يوجد أفراد</div>
        )}
      </div>
    </div>
  );
}
