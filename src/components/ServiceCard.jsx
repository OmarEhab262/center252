export default function ServiceCard({ getResult }) {
  return (
    <div
      className="
border-2
p-2
text-[9px]
h-full
"
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="underline font-black">كلمة سر الليل /</p>
        </div>

        <div>
          <p className="underline font-black">
            قيـــادة الجــــيش الثانى الميدانى
          </p>

          <p className="underline font-black">مركز عمليات 252 حرب إلكترونية</p>
        </div>
      </div>

      <div className="text-center m-2 font-bold">
        الخدمات الليلية لمركز عمليات 252 حرب إلكترونية
        <br />
        عن يوم ({getResult?.day}) الموافق {getResult?.date}
      </div>

      <table className="w-full border-collapse border">
        <tbody>
          <tr>
            <th className="border p-1">{getResult.gate[3].name}</th>

            <th className="border p-1">{getResult.gate[3].rank}</th>

            <th className="border p-1">بوابة</th>
          </tr>

          <tr>
            <th className="border p-1">{getResult.weapon[3].name}</th>

            <th className="border p-1">{getResult.weapon[3].rank}</th>

            <th className="border p-1">سلاح</th>
          </tr>
        </tbody>
      </table>

      <div className="mt-5 flex justify-between text-[8px]">
        <div>
          {getResult.officer.rank}/{getResult.officer.name}
          <br />
          م.ض.ن
        </div>

        <div>
          {getResult.leader.rank}/{getResult.leader.name}
          <br />
          قائد المركز
        </div>
      </div>
    </div>
  );
}
