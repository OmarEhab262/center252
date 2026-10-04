import { getUnitName } from "../utils/unitName";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

export default function Tables() {
  const unitName = getUnitName();

  const getResult = JSON.parse(localStorage.getItem("service") || "{}");

  const commandName = localStorage.getItem("commandName") || "";

  const serviceTypes = JSON.parse(localStorage.getItem("serviceTypes") || "[]");

  // =========================
  // ترتيب الرتب من الأصغر إلى الأكبر
  // =========================

  const rankOrder = [
    "---",
    "جندى",
    "عريف مجند",
    "رقيب مجند",
    "عريف",
    "رقيب",
    "رقيب.أ",
    "مساعد",
    "مساعد.أ",
    "ملازم",
    "ملازم.أ",
    "نقيب",
    "رائد",
    "رائد أح",
    "مقدم",
    "مقدم أح",
    "عميد",
    "عميد أح",
    "لواء",
    "لواء أح",
  ];

  // =========================
  // الخدمات الإضافية من نوع جنود
  // =========================

  const dynamicServices = serviceTypes.filter(
    (service) => service.type === "soldiers",
  );

  // =========================
  // خدمات الضباط وصف الضباط
  // =========================

  const services = serviceTypes.filter(
    (service) => service.type !== "soldiers",
  );

  // =========================
  // ترتيب خدمات التوقيعات حسب رتبة الشخص
  // من الأصغر إلى الأكبر
  // =========================

  const sortedServices = [...services].sort((a, b) => {
    const personA = getResult?.services?.[a.id] || {};
    const personB = getResult?.services?.[b.id] || {};

    const rankA = rankOrder.indexOf(personA.rank);
    const rankB = rankOrder.indexOf(personB.rank);

    const orderA = rankA === -1 ? 999 : rankA;
    const orderB = rankB === -1 ? 999 : rankB;

    return orderA - orderB;
  });

  // =========================
  // رسم اسم ودرجة الشخص
  // =========================

  const renderPerson = (person) => (
    <>
      <TableCell
        align="center"
        sx={{
          border: "1px solid #000",
          padding: "2px 4px",
          fontSize: "15px",
          lineHeight: 1.1,
          fontWeight: 600,
          whiteSpace: "nowrap",
          width: "10%",
          fontFamily: "Cairo, sans-serif",
          color: "#000",
          backgroundColor: "#fff",
        }}
      >
        {person?.name?.split(" ", 2).join(" ") || "---"}
      </TableCell>

      <TableCell
        align="center"
        sx={{
          border: "1px solid #000",
          padding: "2px 4px",
          fontSize: "15px",
          lineHeight: 1.1,
          fontWeight: 600,
          whiteSpace: "nowrap",
          width: "8%",
          fontFamily: "Cairo, sans-serif",
          color: "#000",
          backgroundColor: "#fff",
        }}
      >
        {person?.rank || "---"}
      </TableCell>
    </>
  );

  // =========================
  // Header Cell
  // =========================

  const headerCellSx = {
    border: "1px solid #000",
    padding: "3px 4px",
    textAlign: "center",
    fontSize: "15px",
    lineHeight: 1.1,
    fontWeight: 900,
    whiteSpace: "nowrap",
    fontFamily: "Cairo, sans-serif",
    backgroundColor: "#f3f4f6",
    color: "#000",
  };

  // =========================
  // Sub Header Cell
  // =========================

  const subHeaderCellSx = {
    border: "1px solid #000",
    padding: "2px 4px",
    textAlign: "center",
    fontSize: "15px",
    lineHeight: 1.1,
    fontWeight: 900,
    whiteSpace: "nowrap",
    fontFamily: "Cairo, sans-serif",
    backgroundColor: "#fafafa",
    color: "#000",
  };

  return (
    <>
      <div className="w-full border-black border-2 p-1 text-[15px] leading-tight bg-white text-black">
        {/* ================= Header ================= */}

        <div className="flex justify-between underline underline-offset-4 mb-2">
          <div>
            <p className="font-black">
              <span>{getResult?.password}</span> : كلمة سر الليل
            </p>
          </div>

          <div className="flex flex-col items-end">
            <p className="mb-2 font-black">{commandName}</p>
            <p className="mb-2 font-black">{unitName}</p>
          </div>
        </div>

        {/* ================= Title ================= */}

        <div className="flex justify-center items-center my-4">
          <p className="text-[20px] font-black text-center underline underline-offset-8">
            الخدمات الليلية {unitName} عن يوم {getResult?.day} الموافق :{" "}
            {getResult?.date}
          </p>
        </div>

        {/* ================= Main Table ================= */}

        <div className="flex justify-center items-center mt-2">
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              width: "100%",
              overflow: "hidden",
              borderRadius: "3px",
              boxShadow: "none",
              border: "1px solid #000",
              backgroundColor: "#fff",
            }}
          >
            <Table
              sx={{
                backgroundColor: "#fff",
                color: "#000",

                "& .MuiTableCell-root": {
                  color: "#000",
                  backgroundColor: "#fff",
                  border: "1px solid #000",
                },
              }}
            >
              {/* ================= TABLE HEAD ================= */}

              <TableHead>
                {/* الصف الأول */}

                <TableRow>
                  <TableCell colSpan={2} sx={headerCellSx}>
                    غفرة تالتة
                  </TableCell>

                  <TableCell colSpan={2} sx={headerCellSx}>
                    غفرة ثانية
                  </TableCell>

                  <TableCell colSpan={2} sx={headerCellSx}>
                    غفرة أولى
                  </TableCell>

                  <TableCell colSpan={2} sx={headerCellSx}>
                    حكمدار
                  </TableCell>

                  <TableCell
                    rowSpan={2}
                    sx={{
                      ...headerCellSx,
                      width: "10%",
                    }}
                  >
                    خدمة
                  </TableCell>
                </TableRow>

                {/* الصف الثاني */}

                <TableRow>
                  <TableCell sx={subHeaderCellSx}>الاسم</TableCell>
                  <TableCell sx={subHeaderCellSx}>درجة</TableCell>

                  <TableCell sx={subHeaderCellSx}>الاسم</TableCell>
                  <TableCell sx={subHeaderCellSx}>درجة</TableCell>

                  <TableCell sx={subHeaderCellSx}>الاسم</TableCell>
                  <TableCell sx={subHeaderCellSx}>درجة</TableCell>

                  <TableCell sx={subHeaderCellSx}>الاسم</TableCell>
                  <TableCell sx={subHeaderCellSx}>درجة</TableCell>
                </TableRow>
              </TableHead>

              {/* ================= TABLE BODY ================= */}

              <TableBody>
                {/* ================= الخدمات الإضافية ================= */}

                {dynamicServices.map((service) => {
                  const data = getResult?.services?.[service.id] || {};

                  return (
                    <TableRow key={service.id}>
                      {/* غفرة تالتة */}
                      {renderPerson(data?.[3])}

                      {/* غفرة ثانية */}
                      {renderPerson(data?.[2])}

                      {/* غفرة أولى */}
                      {renderPerson(data?.[1])}

                      {/* حكمدار */}
                      {renderPerson(data?.[0])}

                      {/* اسم الخدمة */}

                      <TableCell
                        component="th"
                        scope="row"
                        align="center"
                        sx={{
                          border: "1px solid #000",
                          padding: "3px 4px",
                          textAlign: "center",
                          fontSize: "15px",
                          lineHeight: 1.1,
                          fontWeight: 900,
                          whiteSpace: "nowrap",
                          fontFamily: "Cairo, sans-serif",
                          backgroundColor: "#f8fafc",
                          color: "#000",
                        }}
                      >
                        {service.name}
                      </TableCell>
                    </TableRow>
                  );
                })}

                {/* ================= تنظيم وادارة ================= */}

                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                    sx={{
                      border: "1px solid #000",
                      padding: "3px 4px",
                      fontSize: "15px",
                      lineHeight: 1.1,
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      fontFamily: "Cairo, sans-serif",
                      color: "#000",
                    }}
                  >
                    {getResult?.tanzem?.name || "---"}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      border: "1px solid #000",
                      padding: "3px 4px",
                      fontSize: "15px",
                      lineHeight: 1.1,
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      fontFamily: "Cairo, sans-serif",
                      color: "#000",
                    }}
                  >
                    {getResult?.tanzem?.rank || "---"}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      border: "1px solid #000",
                      padding: "3px 4px",
                      fontSize: "15px",
                      lineHeight: 1.1,
                      fontWeight: 900,
                      whiteSpace: "nowrap",
                      fontFamily: "Cairo, sans-serif",
                      backgroundColor: "#f3f4f6",
                      color: "#000",
                    }}
                  >
                    تنظيم وادارة
                  </TableCell>
                </TableRow>

                {/* ================= منوب عمليات ================= */}

                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                    sx={{
                      border: "1px solid #000",
                      padding: "3px 4px",
                      fontSize: "15px",
                      lineHeight: 1.1,
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      fontFamily: "Cairo, sans-serif",
                      color: "#000",
                    }}
                  >
                    {getResult?.manob?.name || "---"}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      border: "1px solid #000",
                      padding: "3px 4px",
                      fontSize: "15px",
                      lineHeight: 1.1,
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      fontFamily: "Cairo, sans-serif",
                      color: "#000",
                    }}
                  >
                    {getResult?.manob?.rank || "---"}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      border: "1px solid #000",
                      padding: "3px 4px",
                      fontSize: "15px",
                      lineHeight: 1.1,
                      fontWeight: 900,
                      whiteSpace: "nowrap",
                      fontFamily: "Cairo, sans-serif",
                      backgroundColor: "#f3f4f6",
                      color: "#000",
                    }}
                  >
                    منوب عمليات
                  </TableCell>
                </TableRow>

                {/* ================= الكانتين ================= */}

                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                    sx={{
                      border: "1px solid #000",
                      padding: "3px 4px",
                      fontSize: "15px",
                      lineHeight: 1.1,
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      fontFamily: "Cairo, sans-serif",
                      color: "#000",
                    }}
                  >
                    {getResult?.kanten?.name || "---"}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      border: "1px solid #000",
                      padding: "3px 4px",
                      fontSize: "15px",
                      lineHeight: 1.1,
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      fontFamily: "Cairo, sans-serif",
                      color: "#000",
                    }}
                  >
                    {getResult?.kanten?.rank || "---"}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      border: "1px solid #000",
                      padding: "3px 4px",
                      fontSize: "15px",
                      lineHeight: 1.1,
                      fontWeight: 900,
                      whiteSpace: "nowrap",
                      fontFamily: "Cairo, sans-serif",
                      backgroundColor: "#f3f4f6",
                      color: "#000",
                    }}
                  >
                    الكانتين
                  </TableCell>
                </TableRow>

                {/* ================= سائق ================= */}

                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                    sx={{
                      border: "1px solid #000",
                      padding: "3px 4px",
                      fontSize: "15px",
                      lineHeight: 1.1,
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      fontFamily: "Cairo, sans-serif",
                      color: "#000",
                    }}
                  >
                    {getResult?.driver?.name || "---"}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      border: "1px solid #000",
                      padding: "3px 4px",
                      fontSize: "15px",
                      lineHeight: 1.1,
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      fontFamily: "Cairo, sans-serif",
                      color: "#000",
                    }}
                  >
                    {getResult?.driver?.rank || "---"}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      border: "1px solid #000",
                      padding: "3px 4px",
                      fontSize: "15px",
                      lineHeight: 1.1,
                      fontWeight: 900,
                      whiteSpace: "nowrap",
                      fontFamily: "Cairo, sans-serif",
                      backgroundColor: "#f3f4f6",
                      color: "#000",
                    }}
                  >
                    سائق
                  </TableCell>
                </TableRow>

                {/* ================= رقيب نوبتجي ================= */}

                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                    sx={{
                      border: "1px solid #000",
                      padding: "3px 4px",
                      fontSize: "15px",
                      lineHeight: 1.1,
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      fontFamily: "Cairo, sans-serif",
                      color: "#000",
                    }}
                  >
                    {getResult?.rakeb?.name || "---"}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      border: "1px solid #000",
                      padding: "3px 4px",
                      fontSize: "15px",
                      lineHeight: 1.1,
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      fontFamily: "Cairo, sans-serif",
                      color: "#000",
                    }}
                  >
                    {getResult?.rakeb?.rank || "---"}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      border: "1px solid #000",
                      padding: "3px 4px",
                      fontSize: "15px",
                      lineHeight: 1.1,
                      fontWeight: 900,
                      whiteSpace: "nowrap",
                      fontFamily: "Cairo, sans-serif",
                      backgroundColor: "#f3f4f6",
                      color: "#000",
                    }}
                  >
                    رقيب نوبتجي
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {/* ================= التوقيعات ================= */}

        <div
          dir="rtl"
          className="flex flex-row justify-between flex-wrap gap-3 my-5"
        >
          {/* ================= خدمات ضباط و صف الضباط ================= */}
          {sortedServices.map((service) => {
            const person = getResult?.services?.[service.id] || {};

            return (
              <div
                key={service.id}
                className="flex text-black items-start flex-col gap-1 w-[40%] border-black border-2 p-1 m-1 rounded-[5px]"
              >
                <p className="text-[15px]">
                  {person.rank || "---"} / {person.name || "---"}
                </p>

                <p className="text-[15px]">
                  {service.name} {unitName}
                </p>

                <div className="flex justify-between items-center w-full">
                  <div> توقيع ( </div>
                  <div>)</div>
                </div>
              </div>
            );
          })}
          {/* ================= قائد الوحدة ================= */}
          <div className="flex text-black flex-col w-[40%] gap-1 border-black border-2 p-1 m-1 rounded-[5px] order-last mr-auto">
            <p className="text-[15px]">
              {getResult?.leader?.rank || "---"} /{" "}
              {getResult?.leader?.name || "---"}
            </p>

            <p className="text-[15px]">قائد {unitName}</p>

            <div className="flex justify-between items-center w-full">
              <div> توقيع ( </div>
              <div>)</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
