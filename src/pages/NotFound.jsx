import { useNavigate } from "react-router-dom";
import { Home, ArrowRight, SearchOff } from "@mui/icons-material";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-cyan-950 via-slate-950 to-black px-6 text-white">
      <div className="w-full max-w-2xl text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xl shadow-2xl">
            <SearchOff
              sx={{
                fontSize: 42,
                color: "#22d3ee",
              }}
            />
          </div>
        </div>

        {/* 404 */}
        <h1 className="text-[110px] sm:text-[150px] leading-none font-black tracking-tight bg-linear-to-r from-cyan-300 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
          404
        </h1>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold mt-4">
          الصفحة غير موجودة
        </h2>

        {/* Description */}
        <p className="text-white/50 mt-3 text-base sm:text-lg">
          عذرًا، الصفحة التي تبحث عنها غير موجودة أو ربما تم نقلها.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-8">
          <button
            onClick={() => navigate("/")}
            className="
              flex items-center justify-center gap-2
              min-w-44 px-6 py-3
              rounded-xl
              bg-cyan-700
              hover:bg-cyan-600
              text-white
              font-bold
              shadow-lg shadow-cyan-900/30
              transition-all duration-200
              cursor-pointer
            "
          >
            <Home fontSize="small" />
            العودة للرئيسية
          </button>

          <button
            onClick={() => navigate(-1)}
            className="
              flex items-center justify-center gap-2
              min-w-44 px-6 py-3
              rounded-xl
              bg-white/10
              hover:bg-white/15
              border border-white/10
              text-white/80
              font-bold
              backdrop-blur
              transition-all duration-200
              cursor-pointer
            "
          >
            <ArrowRight fontSize="small" />
            الصفحة السابقة
          </button>
        </div>

        {/* Footer */}
        <div className="copyright flex justify-center mt-4 items-center">
          CopyRight
          <LocalFireDepartmentIcon fontSize="small" />
          <div className="mt-1 ml-1 ">
            OMAR EHAB <span className="font-bold"> 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
