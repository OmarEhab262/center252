import { useEffect, useState } from "react";

import { NavLink, useNavigate } from "react-router-dom";

import {
  Home,
  Visibility,
  PersonAddAlt,
  Settings,
  Logout,
  Login,
  CalendarMonth,
  Menu,
  Close,
} from "@mui/icons-material";

import { getItem, getJSON, removeItem } from "../utils/storage";

export default function Nav() {
  const navigate = useNavigate();

  const [unitName, setUnitName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const unit = await getItem("unitName");

      // IMPORTANT: auth is stored as JSON
      const auth = await getJSON("auth", null);

      setUnitName(unit || "");
      setIsLoggedIn(!!auth);
      setIsAdmin(auth?.role === "admin");
    };

    loadData();
  }, []);

  const handleLogout = async () => {
    await removeItem("auth");

    setIsLoggedIn(false);
    setIsAdmin(false);
    setMenuOpen(false);

    navigate("/login", { replace: true });
  };

  const handleNavClick = () => {
    setMenuOpen(false);
  };

  const linkClass = ({ isActive }) => `
    flex items-center justify-center gap-2
    px-4 py-2.5
    rounded-xl
    font-bold
    text-sm sm:text-base
    whitespace-nowrap
    transition-all duration-200
    ${
      isActive
        ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
        : "text-slate-200 hover:bg-white/10 hover:text-cyan-300"
    }
  `;

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/90 backdrop-blur-xl border-b border-white/10 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* ================= Desktop Header ================= */}
        <div className="hidden lg:flex items-center justify-between gap-4">
          {/* Logo / Unit Name */}
          <NavLink
            to="/"
            onClick={handleNavClick}
            className="flex items-center gap-3 group min-w-0 shrink-0"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform shrink-0">
              <span className="text-xl">⭐</span>
            </div>

            <h1 className="text-lg xl:text-xl font-black text-white truncate">
              {unitName || "الوحدة"}
            </h1>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="flex items-center justify-end gap-2">
            <NavLink to="/" end className={linkClass}>
              <Home sx={{ fontSize: 21 }} />
              <span>الرئيسية</span>
            </NavLink>

            <NavLink to="/show" className={linkClass}>
              <Visibility sx={{ fontSize: 21 }} />
              <span>الخدمة</span>
            </NavLink>

            <NavLink to="/tmam" className={linkClass}>
              <CalendarMonth sx={{ fontSize: 21 }} />
              <span>تمام اليومى</span>
            </NavLink>

            {isAdmin && (
              <>
                <NavLink to="/add" className={linkClass}>
                  <PersonAddAlt sx={{ fontSize: 21 }} />
                  <span>إضافة أسماء</span>
                </NavLink>

                <NavLink to="/control" className={linkClass}>
                  <Settings sx={{ fontSize: 21 }} />
                  <span>التحكم</span>
                </NavLink>
              </>
            )}

            {isAdmin ? (
              <button
                onClick={handleLogout}
                className="
                flex items-center justify-center gap-2
                px-4 py-2.5
                rounded-xl
                font-bold
                text-sm
                whitespace-nowrap
                text-red-300
                border border-red-500/20
                hover:bg-red-500/10
                hover:text-red-200
                transition-all duration-200
                cursor-pointer
              "
              >
                <Logout sx={{ fontSize: 21 }} />
                <span>خروج</span>
              </button>
            ) : (
              <NavLink to="/login" className={linkClass}>
                <Login sx={{ fontSize: 21 }} />
                <span>دخول</span>
              </NavLink>
            )}
          </nav>
        </div>

        {/* ================= Mobile Header ================= */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between gap-4">
            {/* Logo / Unit Name */}
            <NavLink
              to="/"
              onClick={handleNavClick}
              className="flex items-center gap-3 group min-w-0"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform shrink-0">
                <span className="text-xl">⭐</span>
              </div>

              <h1 className="text-lg sm:text-xl font-black text-white truncate">
                {unitName || "الوحدة"}
              </h1>
            </NavLink>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="
              w-11 h-11
              rounded-xl
              flex items-center justify-center
              text-slate-200
              bg-white/5
              border border-white/10
              hover:bg-white/10
              hover:text-cyan-300
              transition-all duration-200
              cursor-pointer
              shrink-0
            "
              aria-label="فتح القائمة"
            >
              {menuOpen ? (
                <Close sx={{ fontSize: 25 }} />
              ) : (
                <Menu sx={{ fontSize: 25 }} />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          <div
            className={`
            overflow-hidden
            transition-all duration-300
            ${
              menuOpen
                ? "max-h-[500px] opacity-100 mt-4"
                : "max-h-0 opacity-0 mt-0"
            }
          `}
          >
            <nav className="flex flex-col gap-2 pt-1">
              <NavLink
                to="/"
                end
                className={linkClass}
                onClick={handleNavClick}
              >
                <Home sx={{ fontSize: 21 }} />
                <span>الرئيسية</span>
              </NavLink>

              <NavLink
                to="/show"
                className={linkClass}
                onClick={handleNavClick}
              >
                <Visibility sx={{ fontSize: 21 }} />
                <span>الخدمة</span>
              </NavLink>

              <NavLink
                to="/tmam"
                className={linkClass}
                onClick={handleNavClick}
              >
                <CalendarMonth sx={{ fontSize: 21 }} />
                <span>تمام اليومى</span>
              </NavLink>

              {isAdmin && (
                <>
                  <NavLink
                    to="/add"
                    className={linkClass}
                    onClick={handleNavClick}
                  >
                    <PersonAddAlt sx={{ fontSize: 21 }} />
                    <span>إضافة أسماء</span>
                  </NavLink>

                  <NavLink
                    to="/control"
                    className={linkClass}
                    onClick={handleNavClick}
                  >
                    <Settings sx={{ fontSize: 21 }} />
                    <span>التحكم</span>
                  </NavLink>
                </>
              )}

              {isAdmin ? (
                <button
                  onClick={handleLogout}
                  className="
                  flex items-center justify-center gap-2
                  px-4 py-2.5
                  rounded-xl
                  font-bold
                  text-sm
                  whitespace-nowrap
                  text-red-300
                  border border-red-500/20
                  hover:bg-red-500/10
                  hover:text-red-200
                  transition-all duration-200
                  cursor-pointer
                  w-full
                "
                >
                  <Logout sx={{ fontSize: 21 }} />
                  <span>خروج</span>
                </button>
              ) : (
                <NavLink
                  to="/login"
                  className={linkClass}
                  onClick={handleNavClick}
                >
                  <Login sx={{ fontSize: 21 }} />
                  <span>دخول</span>
                </NavLink>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
