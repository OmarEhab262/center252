import { useState } from "react";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

import Tables from "../components/Tables";

import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";

import CopyrightOutlinedIcon from "@mui/icons-material/CopyrightOutlined";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import PrintIcon from "@mui/icons-material/Print";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import DescriptionIcon from "@mui/icons-material/Description";

import toast from "react-hot-toast";

import ArabicNumbers from "../components/ArabicNumbers";

export default function Show() {
  // =========================
  // STATES
  // =========================

  const [pageCount, setPageCount] = useState(1);

  const [pageDialogOpen, setPageDialogOpen] = useState(false);
  const [pageInput, setPageInput] = useState("1");

  // =========================
  // PDF
  // =========================
  const handleSavePdf = () => {
    document.body.classList.add("pdf-mode");

    const cleanup = () => {
      document.body.classList.remove("pdf-mode");
      window.removeEventListener("afterprint", cleanup);
    };

    window.addEventListener("afterprint", cleanup);

    window.print();
  };

  // =========================
  // PRINT
  // =========================

  const handlePrint = () => {
    document.body.classList.add("print-mode");

    const cleanup = () => {
      document.body.classList.remove("print-mode");
      window.removeEventListener("afterprint", cleanup);
    };

    window.addEventListener("afterprint", cleanup);

    window.print();
  };

  // =========================
  // CHANGE PAGE COUNT
  // =========================

  const handlePageCount = () => {
    setPageInput(String(pageCount));
    setPageDialogOpen(true);
  };

  const handleConfirmPageCount = () => {
    const number = Number(pageInput);

    if (!Number.isInteger(number) || number <= 0) {
      toast.error("يجب إدخال رقم صحيح");
      return;
    }

    if (number !== 1 && number % 2 !== 0) {
      toast.error("عدد الصفحات يجب أن يكون 1 أو عددًا زوجيًا");
      return;
    }

    setPageCount(number);
    setPageDialogOpen(false);

    toast.success(`تم تحديد ${number} صفحة`);
  };

  // =========================
  // COPYRIGHT
  // =========================

  const Copyright = () => {
    return (
      <div className="copyright-container ">
        <div className="copyright-box ">
          <span className="copyright-short">OE</span>

          <div className="copyright-full">
            <span>Copy Right</span>
            <span className="copyright-divider">
              <CopyrightOutlinedIcon sx={{ fontSize: 14 }} />
            </span>
            <span>OMAR</span>
            <span>EHAB</span>
            <span className="copyright-year">2026</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <ArabicNumbers />

      {/* =========================
          SCREEN
      ========================= */}

      <div className="screen-content min-h-screen bg-gray-100 p-6">
        {/* =========================
            BUTTONS
        ========================= */}

        <div className="flex justify-center items-center flex-wrap gap-3 mb-6">
          {/* BACK */}

          <Button
            variant="contained"
            color="inherit"
            startIcon={<ArrowBackIcon />}
            onClick={() => window.history.back()}
            sx={{
              color: "black",
              borderRadius: "12px",
              px: 3,
              py: 1.2,
              fontWeight: "bold",
              boxShadow: 3,
            }}
          >
            رجوع
          </Button>

          {/* PDF */}

          <Button
            variant="contained"
            startIcon={<PictureAsPdfIcon />}
            onClick={handleSavePdf}
            sx={{
              borderRadius: "12px",
              px: 3,
              py: 1.2,
              fontWeight: "bold",
              background: "linear-gradient(135deg,#dc2626,#b91c1c)",
              boxShadow: 3,
            }}
          >
            PDF
          </Button>

          {/* PRINT */}

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

          {/* PAGE COUNT */}

          <Button
            variant="contained"
            startIcon={<DescriptionIcon />}
            onClick={handlePageCount}
            sx={{
              borderRadius: "12px",
              px: 3,
              py: 1.2,
              fontWeight: "bold",
              background: "linear-gradient(135deg,#16a34a,#15803d)",
              boxShadow: 3,
            }}
          >
            عدد الصفحات: {pageCount}
          </Button>
        </div>

        {/* =========================
            TABLE SHOWN ON SCREEN
        ========================= */}

        <div className="flex justify-center items-center w-[90%] m-auto mt-12">
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-300"
            style={{
              zoom: 1.5,
            }}
          >
            <Tables />

            <Copyright />
          </div>
        </div>
      </div>

      <div className="print-wrapper">
        {Array.from({ length: pageCount }).map((_, index) => (
          <div className="print-a4-page flex flex-col" key={index}>
            <div className="print-table-box">
              <Tables />
            </div>

            <Copyright />
          </div>
        ))}
      </div>

      {/* =====================================================
          PDF PRINT
          نسخة واحدة فقط
      ===================================================== */}

      <div className="pdf-wrapper">
        <div className="pdf-a4-page">
          <div className="pdf-table-box">
            <Tables />
          </div>
          <Copyright />
        </div>
      </div>
      <Dialog
        open={pageDialogOpen}
        onClose={() => setPageDialogOpen(false)}
        fullWidth
        maxWidth="xs"
        dir="rtl"
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          تحديد عدد الصفحات
        </DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            type="number"
            label="عدد الصفحات"
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleConfirmPageCount();
              }
            }}
            inputProps={{
              min: 1,
            }}
            helperText="يسمح بـ 1 أو أي عدد صحيح زوجي"
            sx={{
              mt: 1,
            }}
          />
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "center",
            gap: 1,
            pb: 2,
          }}
        >
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => setPageDialogOpen(false)}
            sx={{
              borderRadius: "10px",
              fontWeight: "bold",
              px: 3,
            }}
          >
            إلغاء
          </Button>

          <Button
            variant="contained"
            onClick={handleConfirmPageCount}
            sx={{
              borderRadius: "10px",
              fontWeight: "bold",
              px: 3,
              background: "linear-gradient(135deg,#16a34a,#15803d)",
            }}
          >
            تأكيد
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
