import { getUnitName } from "../utils/unitName";
import { ArabicKashidaText } from "./ArabicKashidaText";
import { useRef } from "react";

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

  const getResult = JSON.parse(localStorage.getItem("service")) || {};
  const commandName = localStorage.getItem("commandName");

  const serviceTypes = JSON.parse(localStorage.getItem("serviceTypes") || "[]");

  console.log("SERVICE:", getResult);
  console.log("SERVICE TYPES:", serviceTypes);

  const firstTextRef = useRef(null);

  // الخدمات الإضافية من نوع جنود
  const dynamicServices = serviceTypes.filter(
    (service) => service.type === "soldiers",
  );

  const officerServices = serviceTypes.filter(
    (service) => service.type === "officers",
  );

  const ncoServices = serviceTypes.filter((service) => service.type === "nco");

  // رسم اسم ودرجة الشخص
  const renderPerson = (person) => (
    <>
      <TableCell
        align="center"
        sx={{
          border: "1px solid #000",
          padding: "2px 4px",
          fontSize: "7px",
          lineHeight: 1.1,
          fontWeight: 600,
          whiteSpace: "nowrap",
          width: "10%",
          fontFamily: "Cairo, sans-serif",
        }}
      >
        {person?.name || "---"}
      </TableCell>

      <TableCell
        align="center"
        sx={{
          border: "1px solid #000",
          padding: "2px 4px",
          fontSize: "7px",
          lineHeight: 1.1,
          fontWeight: 600,
          whiteSpace: "nowrap",
          width: "8%",
          fontFamily: "Cairo, sans-serif",
        }}
      >
        {person?.rank || "---"}
      </TableCell>
    </>
  );

  // شكل الخلية الرئيسية للرأس
  const headerCellSx = {
    border: "1px solid #000",
    padding: "3px 4px",
    textAlign: "center",
    fontSize: "7px",
    lineHeight: 1.1,
    fontWeight: 900,
    whiteSpace: "nowrap",
    fontFamily: "Cairo, sans-serif",
    backgroundColor: "#f3f4f6",
  };

  // شكل خلايا الاسم والدرجة
  const subHeaderCellSx = {
    border: "1px solid #000",
    padding: "2px 4px",
    textAlign: "center",
    fontSize: "7px",
    lineHeight: 1.1,
    fontWeight: 900,
    whiteSpace: "nowrap",
    fontFamily: "Cairo, sans-serif",
    backgroundColor: "#fafafa",
  };

  return (
    <>
      <div className="w-full border-2 border-black p-1 text-[8px] leading-tight bg-white">
        {/* ================= Header ================= */}

        <div className="flex justify-between items-center underline mb-2">
          <div>
            <p className="-offset-8  font-black">
              <span>{getResult?.password}</span> : كلمة سر الليل
            </p>
          </div>

          <div className="flex flex-col items-end">
            <p className="mb-2 font-black">
              <ArabicKashidaText
                amount={1}
                matchWidth={true}
                targetRef={firstTextRef}
              >
                {commandName}
              </ArabicKashidaText>
            </p>

            <p className="mb-2 font-black">
              <ArabicKashidaText
                amount={1}
                matchWidth={true}
                targetRef={firstTextRef}
              >
                {unitName}
              </ArabicKashidaText>
            </p>
          </div>
        </div>

        {/* ================= Title ================= */}

        <div className="flex justify-center items-center m-1">
          <p className="text-[12px] font-black text-center">
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
              size="small"
              sx={{
                width: "100%",
                tableLayout: "fixed",
                borderCollapse: "collapse",

                "& .MuiTableCell-root": {
                  verticalAlign: "middle",
                  direction: "rtl",
                  fontFamily: "Cairo, Arial, sans-serif",
                  letterSpacing: "normal",
                  wordSpacing: "normal",
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
                          fontSize: "7px",
                          lineHeight: 1.1,
                          fontWeight: 900,
                          whiteSpace: "nowrap",
                          fontFamily: "Cairo, sans-serif",
                          backgroundColor: "#f8fafc",
                        }}
                      >
                        {service.name}
                      </TableCell>
                    </TableRow>
                  );
                })}

                {/* ================= رقيب نوبتجي ================= */}

                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                    sx={{
                      border: "1px solid #000",
                      padding: "3px 4px",
                      textAlign: "center",
                      fontSize: "7px",
                      lineHeight: 1.1,
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      fontFamily: "Cairo, sans-serif",
                    }}
                  >
                    {getResult?.rakeb?.name || "---"}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      border: "1px solid #000",
                      padding: "3px 4px",
                      textAlign: "center",
                      fontSize: "7px",
                      lineHeight: 1.1,
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      fontFamily: "Cairo, sans-serif",
                    }}
                  >
                    {getResult?.rakeb?.rank || "---"}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      border: "1px solid #000",
                      padding: "3px 4px",
                      textAlign: "center",
                      fontSize: "7px",
                      lineHeight: 1.1,
                      fontWeight: 900,
                      whiteSpace: "nowrap",
                      fontFamily: "Cairo, sans-serif",
                      backgroundColor: "#f3f4f6",
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

        <div className="flex justify-between flex-wrap">
          {/* خدمات الضباط */}

          {officerServices.map((service) => {
            const person = getResult?.services?.[service.id] || {};

            return (
              <div
                key={service.id}
                className="flex items-end flex-col w-[38%] border border-black p-1 m-1 rounded-[5px]"
              >
                <div className="flex justify-between items-center w-full">
                  <div>(</div>
                  <div>) توقيع</div>
                </div>

                <p className="text-[7px]">
                  {person.rank || "---"} / {person.name || "---"}
                </p>

                <p className="text-[7px]">
                  {service.name} {unitName}
                </p>
              </div>
            );
          })}

          {/* خدمات صف الضباط */}

          {ncoServices.map((service) => {
            const person = getResult?.services?.[service.id] || {};

            return (
              <div
                key={service.id}
                className="flex items-end flex-col w-[38%] border border-black p-1 m-1 rounded-[5px]"
              >
                <div className="flex justify-between items-center w-full">
                  <div>(</div>
                  <div>) توقيع</div>
                </div>

                <p className="text-[7px]">
                  {person.rank || "---"} / {person.name || "---"}
                </p>

                <p className="text-[7px]">
                  {service.name} {unitName}
                </p>
              </div>
            );
          })}
        </div>

        {/* ================= قائد الوحدة ================= */}

        <div className="flex justify-between">
          <div className="flex items-end flex-col w-[38%] border border-black p-1 m-1 rounded-[5px]">
            <div className="flex justify-between items-center w-full">
              <div>(</div>
              <div>) توقيع</div>
            </div>

            <p className="text-[7px]">
              {getResult?.leader?.rank} / {getResult?.leader?.name}
            </p>

            <p className="text-[7px]">قائد {unitName}</p>
          </div>
        </div>
      </div>
    </>
  );
}
