import PersonSelect from "./PersonSelect";

export default function PersonSection({
  title,
  section,
  form,
  names,
  updatePerson,
}) {
  return (
    <div className="bg-white/5 rounded-2xl p-5 mt-10">
      <h2 className="text-3xl text-center font-bold mb-5">{title}</h2>

      <div className="flex gap-3 ">
        <PersonSelect
          names={names}
          value={form[section].id}
          onChange={(id) => updatePerson(section, id)}
        />

        {form[section].rank ? (
          <div className="bg-slate-800 rounded-xl px-4 py-3 w-32.5 flex justify-center items-center text-white">
            {form[section].rank}
          </div>
        ) : null}
      </div>
    </div>
  );
}
