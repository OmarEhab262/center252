import CustomPersonSelect from "./CustomPersonSelect";

const duplicateColors = [
  "bg-red-500 shadow-red-500/50",
  "bg-cyan-400 shadow-cyan-400/50",
  "bg-purple-500 shadow-purple-500/50",
  "bg-lime-400 shadow-lime-400/50",
  "bg-orange-500 shadow-orange-500/50",
  "bg-blue-600 shadow-blue-600/50",
  "bg-yellow-400 shadow-yellow-400/50",
  "bg-fuchsia-500 shadow-fuchsia-500/50",
  "bg-green-500 shadow-green-500/50",
  "bg-pink-500 shadow-pink-500/50",
  "bg-indigo-500 shadow-indigo-500/50",
  "bg-amber-500 shadow-amber-500/50",
  "bg-teal-500 shadow-teal-500/50",
  "bg-rose-500 shadow-rose-500/50",
  "bg-violet-500 shadow-violet-500/50",
  "bg-emerald-500 shadow-emerald-500/50",
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
