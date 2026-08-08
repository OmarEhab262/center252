export default function Tables() {
  const getResult = JSON.parse(localStorage.getItem("service"));
  console.log("getResult", getResult);
  return (
    <>
      <div className="w-full border-2 p-1 text-[8px] leading-tight">
        <div className="flex justify-between items-center">
          <div>
            <p className="underline-offset-8 underline mb-2 font-black">
              <span className="">{getResult?.password}</span> : كلمة سر الليل
            </p>
          </div>
          <div className="flex flex-col items-end">
            <p className=" underline mb-1 font-black">
              قيـادة الجــيش الثانى الميدانــى
            </p>
            <p className="underline mb-2 font-black">
              مركز عمليات ٢٥٢ حرب إلكترونية
            </p>
          </div>
        </div>
        <div className="flex justify-center items-center m-1">
          <p className="text-[12px] font-black">
            الخدمات الليلية لمركز عمليات ٢٥٢ حرب إلكترونية عن يوم (
            {getResult?.day}) الموافق : {getResult.date}
          </p>
        </div>
        <div className="flex justify-center items-center ">
          <table border={2} className="w-full mr-1 border-collapse text-[7px]">
            {" "}
            <thead>
              <tr>
                <th colSpan={2} className="p-1 border text-center">
                  غفرة تالتة
                </th>
                <th colSpan={2} className="p-1 border text-center">
                  غفرة ثانية
                </th>
                <th colSpan={2} className="p-1 border text-center">
                  غفرة أولى
                </th>
                <th colSpan={2} className="p-1 border text-center">
                  حكمدار
                </th>
                <th rowSpan={2} className="p-1 border text-center">
                  خدمة
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="p-1 border text-center">الاسم</th>
                <th className="p-1 border text-center">درجة</th>
                <th className="p-1 border text-center">الاسم</th>
                <th className="p-1 border text-center">درجة</th>
                <th className="p-1 border text-center">الاسم</th>
                <th className="p-1 border text-center">درجة</th>
                <th className="p-1 border text-center">الاسم</th>
                <th className="p-1 border text-center">درجة</th>
                <th className="p-1 border text-center"></th>
              </tr>
              <tr>
                <th className="p-1 border text-center">
                  {" "}
                  {getResult.gate[3].name}
                </th>
                <th className="p-1 border text-center">
                  {" "}
                  {getResult.gate[3].rank}
                </th>
                <th className="p-1 border text-center">
                  {" "}
                  {getResult.gate[2].name}
                </th>
                <th className="p-1 border text-center">
                  {" "}
                  {getResult.gate[2].rank}
                </th>
                <th className="p-1 border text-center">
                  {" "}
                  {getResult.gate[1].name}
                </th>
                <th className="p-1 border text-center">
                  {" "}
                  {getResult.gate[1].rank}
                </th>
                <th className="p-1 border text-center">
                  {" "}
                  {getResult.gate[0].name}
                </th>
                <th className="p-1 border text-center">
                  {" "}
                  {getResult.gate[0].rank}
                </th>
                <th className="p-1 border text-center">
                  بوابة
                  <br /> <span className="text-[8px]">٨ - ١٢ - ٤</span>
                </th>
              </tr>
              <tr>
                <th className="p-1 border text-center">
                  {" "}
                  {getResult.weapon[3].name}
                </th>
                <th className="p-1 border text-center">
                  {" "}
                  {getResult.weapon[3].rank}
                </th>
                <th className="p-1 border text-center">
                  {" "}
                  {getResult.weapon[2].name}
                </th>
                <th className="p-1 border text-center">
                  {" "}
                  {getResult.weapon[2].rank}
                </th>
                <th className="p-1 border text-center">
                  {" "}
                  {getResult.weapon[1].name}
                </th>
                <th className="p-1 border text-center">
                  {" "}
                  {getResult.weapon[1].rank}
                </th>
                <th className="p-1 border text-center">
                  {" "}
                  {getResult.weapon[0].name}
                </th>
                <th className="p-1 border text-center">
                  {" "}
                  {getResult.weapon[0].rank}
                </th>
                <th className="p-1 border text-center">
                  سلاح
                  <br /> <span className="text-[8px]">٦ – ١٠ - ٢</span>
                </th>
              </tr>
              <tr>
                <th colSpan={7} className="p-1 border text-center">
                  {getResult.rakeb.name}
                </th>
                <th className="p-1 border text-center">
                  {" "}
                  {getResult.rakeb.rank}
                </th>
                <th className="p-1 border text-center">رقيب نوبتجي</th>
              </tr>
            </tbody>
          </table>{" "}
        </div>

        <div className="flex justify-between">
          <div className="flex items-end flex-col w-[38%] border p-1 m-1 rounded-[5px] ">
            <div className="flex justify-between items-center w-full">
              <div>توقيع {"("}</div>
              <div>{")"}</div>
            </div>
            <p className="text-[7px]">
              {" "}
              {getResult.deputy.rank} /{getResult.deputy.name}{" "}
            </p>
            <p className="text-[7px]">ض.م مركز عمليات ٢٥٢ حرب إلك</p>
          </div>
          <div className="flex items-end flex-col w-[38%] border p-1 m-1 rounded-[5px] ">
            <div className="flex justify-between items-center w-full">
              <div>توقيع {"("}</div>
              <div>{")"}</div>
            </div>
            <p className="text-[7px]">
              {" "}
              {getResult.manger.rank} /{getResult.manger.name}{" "}
            </p>
            <p className="text-[7px]"> ض.ن مركز عمليات ٢٥٢ حرب إلك </p>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex items-end flex-col w-[38%] border p-1 m-1 rounded-[5px] ">
            <div className="flex justify-between items-center w-full">
              <div>توقيع {"("}</div>
              <div>{")"}</div>
            </div>
            <p className="text-[7px]">
              {" "}
              {getResult.assistants.rank} /{getResult.assistants.name}{" "}
            </p>
            <p className="text-[7px]">مساعد تعليم مركز عمليات ٢٥٢ حرب إلك </p>
          </div>
          <div className="flex items-end flex-col w-[38%] border p-1 m-1 rounded-[5px] ">
            <div className="flex justify-between items-center w-full">
              <div>توقيع {"("}</div>
              <div>{")"}</div>
            </div>
            <p className="text-[7px]">
              {getResult.officer.rank} / {getResult.officer.name}
            </p>
            <p className="text-[7px]">م.ض.ن مركز عمليات ٢٥٢ حرب إلك</p>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex items-end flex-col w-[38%] border p-1 m-1 rounded-[5px] ">
            <div className="flex justify-between items-center w-full">
              <div>توقيع {"("}</div>
              <div>{")"}</div>
            </div>
            <p className="text-[7px]">
              {" "}
              {getResult.leader.rank} /{getResult.leader.name}{" "}
            </p>
            <p className="text-[7px]"> قائد مركز عمليات ٢٥٢ حرب إلك</p>
          </div>
        </div>
      </div>
    </>
  );
}
