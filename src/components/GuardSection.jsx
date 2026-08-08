import CustomPersonSelect from "./CustomPersonSelect";
export default function GuardSection({ title, data, names = [], onChange }) {
  return (
    <div className="bg-white/5 rounded-2xl p-6 shadow-lg">
      <div className="flex justify-center mb-6">
        <h2 className="text-3xl font-bold">{title}</h2>
      </div>

      <div className="space-y-4">
        {data?.map((item, index) => (
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
            <p className="w-20">{item.position}</p>

            {/* Name + Rank */}
            <div className="flex-1 flex-wrap flex gap-3 items-center">
              <CustomPersonSelect
                names={names}
                value={item.id}
                onChange={(id) => {
                  const person = names.find((n) => n.id === Number(id));

                  if (!person) return;

                  const newData = [...data];

                  newData[index] = {
                    ...newData[index],
                    id: person.id,
                    name: person.name,
                    rank: person.rank,
                  };

                  onChange(newData);
                }}
              />

              {/* Rank */}
              {item.rank ? (
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
                  {item.rank || "بدون رتبة"}
                </div>
              ) : null}
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
