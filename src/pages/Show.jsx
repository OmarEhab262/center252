import { useRef, useState } from "react";
import { Button } from "@mui/material";
import Tables from "../components/Tables";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PrintIcon from "@mui/icons-material/Print";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import toast from "react-hot-toast";

export default function Show() {
  // The table displayed on the screen
  const captureRef = useRef(null);

  // The 4-table A4 layout used for PDF
  const pdfRef = useRef(null);

  const [generating, setGenerating] = useState(false);

  // =========================
  // PRINT
  // =========================
  const handlePrint = () => {
    if (window.electronAPI) {
      window.electronAPI.print();
    } else {
      window.print();
    }
  };

  // =========================
  // SAVE PDF
  // =========================
  const handleSavePdf = async () => {
    if (!pdfRef.current) {
      toast.error("لم يتم العثور على محتوى PDF");
      return;
    }

    setGenerating(true);

    try {
      await toast.promise(
        (async () => {
          const element = pdfRef.current;

          // Make sure fonts are loaded
          if (document.fonts?.ready) {
            await document.fonts.ready;
          }

          // Give browser time to render
          await new Promise((resolve) => {
            requestAnimationFrame(() => {
              requestAnimationFrame(resolve);
            });
          });

          // Capture the 4-table A4 layout
          const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
            logging: false,
          });

          const imgData = canvas.toDataURL("image/png");

          // A4 landscape
          const pdf = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4",
          });

          const pageWidth = 297;
          const pageHeight = 210;

          // 5mm margin
          const margin = 5;

          const availableWidth = pageWidth - margin * 2;
          const availableHeight = pageHeight - margin * 2;

          // Keep the A4 aspect ratio
          const imageRatio = canvas.width / canvas.height;

          let imgWidth = availableWidth;
          let imgHeight = imgWidth / imageRatio;

          if (imgHeight > availableHeight) {
            imgHeight = availableHeight;
            imgWidth = imgHeight * imageRatio;
          }

          // Center image
          const x = (pageWidth - imgWidth) / 2;
          const y = (pageHeight - imgHeight) / 2;

          pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);

          // File name
          const today = new Date();

          const day = String(today.getDate()).padStart(2, "0");
          const month = String(today.getMonth() + 1).padStart(2, "0");
          const year = today.getFullYear();

          const fileName = `خدمة ${day}-${month}-${year}.pdf`;

          pdf.save(fileName);
        })(),
        {
          loading: "جارٍ إنشاء PDF...",
          success: "تم حفظ PDF بنجاح",
          error: "حدث خطأ أثناء إنشاء PDF",
        },
      );
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      {/* =========================
        NORMAL SCREEN
    ========================= */}
      <div className="screen-content min-h-screen bg-gray-100 p-6">
        {/* Buttons */}
        <div className="flex justify-center items-center gap-3 mb-6">
          <Button
            variant="contained"
            color="inherit"
            startIcon={<ArrowBackIcon />}
            onClick={() => window.history.back()}
            sx={{
              borderRadius: "12px",
              px: 3,
              py: 1.2,
              fontWeight: "bold",
              boxShadow: 3,
            }}
          >
            رجوع
          </Button>

          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            sx={{
              borderRadius: "12px",
              px: 3,
              py: 1.2,
              fontWeight: "bold",
              background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
              boxShadow: 3,
            }}
          >
            طباعة
          </Button>

          <Button
            variant="contained"
            color="error"
            startIcon={<PictureAsPdfIcon />}
            onClick={handleSavePdf}
            disabled={generating}
            sx={{
              borderRadius: "12px",
              px: 3,
              py: 1.2,
              fontWeight: "bold",
              background: "linear-gradient(135deg,#ef4444,#b91c1c)",
              boxShadow: 3,
            }}
          >
            {generating ? "جارٍ الحفظ..." : "حفظ PDF"}
          </Button>
        </div>

        {/* One table shown on screen */}
        <div className="flex justify-center items-center">
          <div
            ref={captureRef}
            className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-300"
            style={{
              zoom: 1.5,
            }}
          >
            <div className="w-225">
              <Tables />
            </div>

            <div className="copyright flex justify-center mt-4 items-center">
              CopyRight
              <LocalFireDepartmentIcon fontSize="small" />
              <div className="mt-1 ml-1">OMAR EHAB 2026</div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================
        PDF CAPTURE
    ========================= */}
      <div className="pdf-capture-wrapper">
        <div ref={pdfRef} className="pdf-a4-page">
          <div className="pdf-table-box">
            <Tables />
          </div>

          <div className="pdf-table-box">
            <Tables />
          </div>

          <div className="pdf-table-box">
            <Tables />
          </div>

          <div className="pdf-table-box">
            <Tables />
          </div>

          <div className="pdf-copyright">
            CopyRight
            <LocalFireDepartmentIcon fontSize="small" />
            <span>OMAR EHAB 2026</span>
          </div>
        </div>
      </div>

      {/* =========================
        PRINT
    ========================= */}
      <div className="print-a4-page">
        <div className="print-table-box">
          <Tables />
        </div>

        <div className="print-table-box">
          <Tables />
        </div>

        <div className="print-table-box">
          <Tables />
        </div>

        <div className="print-table-box">
          <Tables />
        </div>

        <div className="print-copyright">
          CopyRight
          <LocalFireDepartmentIcon fontSize="small" />
          <span>OMAR EHAB 2026</span>
        </div>
      </div>
    </>
  );
}
