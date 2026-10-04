import { useState } from "react";

import {
  Person,
  Groups,
  BeachAccess,
  LocalHospital,
  DirectionsCar,
  School,
  LocationOn,
  Flight,
  PersonOff,
  Gavel,
  FactCheck,
  AssignmentTurnedIn,
  ExpandMore,
} from "@mui/icons-material";

import { Button, Collapse, Icon } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

const buttonSx = {
  minHeight: 52,
  width: "100%",
  borderRadius: "12px",
  justifyContent: "space-between",
  gap: 1,
  px: 2,
  color: "#e2e8f0",
  background:
    "linear-gradient(135deg, rgba(6,182,212,0.16), rgba(37,99,235,0.16))",
  border: "1px solid rgba(103,232,249,0.12)",
  fontWeight: "bold",
  fontSize: "15px",
  textTransform: "none",
  boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
  transition: "all 0.2s ease",

  "&:hover": {
    background:
      "linear-gradient(135deg, rgba(6,182,212,0.28), rgba(37,99,235,0.28))",
    borderColor: "rgba(103,232,249,0.35)",
    color: "#fff",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 20px rgba(6,182,212,0.12)",
  },
};

const iconSx = {
  color: "#67e8f9",
  fontSize: 24,
  flexShrink: 0,
};

const menuItems = [
  {
    label: "تمام الضباط",
    path: "/tmam/pageOffs",
    icon: Person,
  },
  {
    label: "تمام الدرجات الأخرى",
    path: "/tmam/pageOtherRanks",
    icon: Groups,
  },
  {
    label: "الإجازات",
    path: "/tmam/pageVacations",
    icon: BeachAccess,
  },
  {
    label: "إجازات مرضية",
    path: "/tmam/pageSickLeaves",
    icon: LocalHospital,
  },
  {
    label: "المستشفى",
    path: "/tmam/pageHospitals",
    icon: LocalHospital,
  },
  {
    label: "المأموريات",
    path: "/tmam/pageMissions",
    icon: DirectionsCar,
  },
  {
    label: "الفرقة",
    path: "/tmam/pageBands",
    icon: School,
  },
  {
    label: "خارج التمركز",
    path: "/tmam/pageOutCenter",
    icon: LocationOn,
  },
  {
    label: "خارج البلاد",
    path: "/tmam/pageOutCountry",
    icon: Flight,
  },
  {
    label: "غياب",
    path: "/tmam/pageAbsence",
    icon: PersonOff,
  },
  {
    label: "سجن",
    path: "/tmam/pagePrison",
    icon: Gavel,
  },
  // {
  //   label: "مراجعة التمام",
  //   path: "/tmam",
  //   icon: FactCheck,
  // },
];

const ButtonsTmam = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const selectedItem = menuItems.find(
    (item) => item.path === location.pathname,
  );

  const title = selectedItem?.label || "التمام";

  const SelectedIcon = selectedItem?.icon || FactCheck;

  return (
    <div className="mt-6">
      <Button
        component={Link}
        to="/people"
        dir="rtl"
        sx={{
          width: "40%",
          minHeight: 56,
          mx: "auto",
          mb: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1.5,

          borderRadius: "16px",

          color: "#ffffff",
          background: "linear-gradient(135deg, #7c3aed, #9333ea)",

          border: "1px solid rgba(216, 180, 254, 0.4)",

          fontWeight: 900,
          fontSize: "16px",
          textTransform: "none",

          boxShadow: "0 7px 22px rgba(124, 58, 237, 0.28)",

          transition: "all 0.25s ease",

          "&:hover": {
            background: "linear-gradient(135deg, #6d28d9, #7e22ce)",
            transform: "translateY(-3px)",
            boxShadow: "0 12px 28px rgba(124, 58, 237, 0.38)",
            borderColor: "rgba(233, 213, 255, 0.65)",
          },

          "&:active": {
            transform: "translateY(-1px)",
          },
        }}
      >
        <AssignmentTurnedIn
          sx={{
            fontSize: 26,
            color: "#f3e8ff",
          }}
        />

        <span>مراجعة التمام</span>
      </Button>
      {/* Main Button */}
      <Button
        onClick={() => setOpen((prev) => !prev)}
        sx={{
          ...buttonSx,
          minHeight: 58,
          background:
            "linear-gradient(135deg, rgba(6,182,212,0.25), rgba(37,99,235,0.25))",
          borderColor: "rgba(103,232,249,0.25)",
          fontSize: "17px",
          boxShadow: "0 6px 20px rgba(6,182,212,0.12)",
        }}
      >
        <span>{title}</span>

        <div className="flex items-center gap-2">
          <SelectedIcon sx={iconSx} />

          <ExpandMore
            sx={{
              ...iconSx,
              transition: "transform 0.3s ease",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </div>
      </Button>

      {/* Menu */}
      <Collapse in={open} timeout={350}>
        <div className="bg-white/10 rounded-3xl shadow-2xl backdrop-blur border border-white/10 mt-3 p-4 sm:p-5">
          <div
            dir="rtl"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
          >
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  sx={buttonSx}
                >
                  <span>{item.label}</span>
                  <Icon sx={iconSx} />
                </Button>
              );
            })}
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default ButtonsTmam;
