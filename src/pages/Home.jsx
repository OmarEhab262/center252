import { useEffect, useState } from "react";
import { Button } from "@mui/material";
// import AssistantList from "../components/AssistantList";
import GuardSection from "../components/GuardSection";
import Save from "@mui/icons-material/Save";
import Visibility from "@mui/icons-material/Visibility";
import PersonAddAlt from "@mui/icons-material/PersonAddAlt";
import RestartAlt from "@mui/icons-material/RestartAlt";
import CompareArrows from "@mui/icons-material/CompareArrows";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PersonSection from "../components/PersonSection";
import { formatArabicDate, formatArabicDay } from "../utils/date";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const defaultData = {
  date: "",
  day: "",
  password: "",
  officer: {
    name: "",
    id: "",
    rank: "",
  },
  manger: {
    name: "",
    id: "",
    rank: "",
  },
  leader: {
    name: "",
    id: "",
    rank: "",
  },

  deputy: {
    name: "",
    id: "",
    rank: "",
  },
  rakeb: {
    name: "",
    id: "",
    rank: "",
  },

  assistants: {
    name: "",
    id: "",
    rank: "",
  },

  weapon: [
    {
      position: "حكمدار",
      id: "",
      name: "",
      rank: "",
    },
    {
      position: "أولى",
      id: "",
      name: "",
      rank: "",
    },
    {
      position: "ثانية",
      id: "",
      name: "",
      rank: "",
    },
    {
      position: "ثالثة",
      id: "",
      name: "",
      rank: "",
    },
  ],

  gate: [
    {
      position: "حكمدار",
      id: "",
      name: "",
      rank: "",
    },
    {
      position: "أولى",
      id: "",
      name: "",
      rank: "",
    },
    {
      position: "ثانية",
      id: "",
      name: "",
      rank: "",
    },
    {
      position: "ثالثة",
      id: "",
      name: "",
      rank: "",
    },
  ],

  sergeant: {
    name: "",
    rank: "",
  },
};

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem("service");
    const todayDate = formatArabicDate(new Date());
    const todayDay = formatArabicDay(new Date());

    if (!saved) {
      return {
        ...defaultData,
        date: todayDate,
        day: todayDay,
      };
    }

    const data = JSON.parse(saved);

    return {
      ...defaultData,
      ...data,
      date: data.date || todayDate,
      day: data.day || todayDay,
    };
  });

  const [names, setNames] = useState(() => {
    return JSON.parse(localStorage.getItem("listNames") || "[]");
  });

  useEffect(() => {
    const loadNames = () => {
      setNames(JSON.parse(localStorage.getItem("listNames") || "[]"));
    };

    loadNames();

    window.addEventListener("focus", loadNames);

    return () => {
      window.removeEventListener("focus", loadNames);
    };
  }, []);

  const updatePerson = (section, id) => {
    const person = names.find((item) => item.id === Number(id));

    if (!person) return;

    setForm((prev) => ({
      ...prev,
      [section]: {
        id: person.id,
        name: person.name,
        rank: person.rank,
      },
    }));
  };

  const changeKedma = () => {
    setForm((prev) => {
      const rotate = (arr) => {
        const old = [...arr];

        return [
          old[0], // حكمدار ثابت

          {
            ...old[3],
            position: "أولى",
          },

          {
            ...old[1],
            position: "ثانية",
          },

          {
            ...old[2],
            position: "ثالثة",
          },
        ];
      };

      return {
        ...prev,

        gate: rotate(prev.weapon),
        weapon: rotate(prev.gate),
      };
    });
  };

  useEffect(() => {
    localStorage.setItem("service", JSON.stringify(form));
  }, [form]);

  const personsSections = [
    {
      key: "leader",
      title: "قائد مركز عمليات ٢٥٢ حرب إلكترونية",
      className: "mt-10",
    },
    {
      key: "manger",
      title: "ضابط نوبتجى",
    },
    {
      key: "deputy",
      title: "ضابط منوب",
    },
    {
      key: "officer",
      title: "مساعد ضابط نوبتجى",
    },
    {
      key: "assistants",
      title: "مساعد تعليم",
    },
    {
      key: "rakeb",
      title: "رقيب نوبتجى",
    },
  ];
  return (
    <div className="min-h-screen bg-linear-to-br from-cyan-900 via-slate-900 to-black text-white py-10">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/10 rounded-3xl shadow-2xl p-8 backdrop-blur">
          <h1 className="text-5xl leading-tight font-black text-center mb-10">
            خدمــــــــــــة مركز عمليات ٢٥٢ حرب إلكترونية
          </h1>

          {/* Date */}

          <div className="flex justify-center items-center">
            <div className="md:w-[50%] w-full flex flex-wrap gap-5 items-center justify-center">
              <div
                className="
                w-[90%]
      bg-white/10
      rounded-xl
      p-3
      text-center
      text-xl
      font-bold
  
    "
              >
                {formatArabicDay(selectedDate)} -{" "}
                {formatArabicDate(selectedDate)}
              </div>
              <div className="flex items-center justify-center md:w-[40%] w-full ">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => {
                    setSelectedDate(date);

                    setForm({
                      ...form,
                      date: formatArabicDate(date),
                      day: formatArabicDay(date),
                    });
                  }}
                  customInput={
                    <button
                      className="
                      cursor-pointer
        bg-cyan-600
        hover:bg-cyan-700
        px-5
        py-3
        rounded-xl
        text-white
        text-xl
        font-bold
        shadow-lg
      "
                    >
                      📅 اختيار التاريخ
                    </button>
                  }
                />
              </div>
            </div>
          </div>
          {/* Password */}
          <div className="flex justify-center mt-10">
            <div className="w-full bg-white/5 rounded-2xl p-6 shadow-lg">
              <label className="block text-xl font-bold mb-3 text-center">
                كلمة سر الليل
              </label>
              <input
                type="text"
                value={form.password}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                className="
        w-full
        rounded-xl
        p-3
        text-end
bg-slate-800
text-white
        text-xl
        font-bold
        placeholder:text-white/50
        focus:outline-none
        focus:ring-2
        focus:ring-cyan-500
      "
                placeholder="اكتب كلمة السر"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10 mt-10">
            {personsSections.map((item) => (
              <PersonSection
                key={item.key}
                title={item.title}
                section={item.key}
                form={form}
                names={names}
                updatePerson={updatePerson}
              />
            ))}
          </div>

          {/* Weapon + Gate */}

          <div className="flex flex-wrap items-center justify-between center gap-8 mt-12">
            <div className="md:w-[48%] w-full ">
              <GuardSection
                title="سلاح"
                data={form.weapon}
                names={names}
                onChange={(weapon) =>
                  setForm((prev) => ({
                    ...prev,
                    weapon,
                  }))
                }
              />
            </div>

            <div className="md:w-[48%] w-full ">
              <GuardSection
                title="بوابة"
                data={form.gate}
                names={names}
                onChange={(gate) =>
                  setForm((prev) => ({
                    ...prev,
                    gate,
                  }))
                }
              />
            </div>
          </div>

          {/* Save */}
          <div className="flex justify-center mt-10">
            <div className="flex flex-wrap justify-center items-center gap-3 bg-white/10 backdrop-blur border border-white/10 shadow-2xl rounded-2xl px-6 py-4">
              <Button
                variant="contained"
                startIcon={<Save sx={{ color: "#ffffff", fontSize: 26 }} />}
                onClick={() => {
                  localStorage.setItem("service", JSON.stringify(form));
                  toast.success("تم الحفظ");
                }}
                sx={{
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: "bold",
                  px: 3,
                  py: 1.2,
                  fontSize: "16px",
                  bgcolor: "#16a34a",
                  "&:hover": { bgcolor: "#15803d" },
                  boxShadow: "0 4px 14px rgba(22,163,74,0.5)",
                }}
              >
                حفظ
              </Button>

              <Button
                variant="contained"
                component={Link}
                to="/show"
                startIcon={
                  <Visibility sx={{ color: "#ffffff", fontSize: 26 }} />
                }
                sx={{
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: "bold",
                  px: 3,
                  py: 1.2,
                  fontSize: "16px",
                  bgcolor: "#0284c7",
                  "&:hover": { bgcolor: "#0369a1" },
                  boxShadow: "0 4px 14px rgba(2,132,199,0.5)",
                }}
              >
                الخدمة
              </Button>

              <Button
                variant="contained"
                component={Link}
                to="/add"
                startIcon={
                  <PersonAddAlt sx={{ color: "#ffffff", fontSize: 26 }} />
                }
                sx={{
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: "bold",
                  px: 3,
                  py: 1.2,
                  fontSize: "16px",
                  bgcolor: "#0e7490",
                  "&:hover": { bgcolor: "#155e75" },
                  boxShadow: "0 4px 14px rgba(14,116,144,0.5)",
                }}
              >
                اضافة اسماء
              </Button>

              <Button
                variant="contained"
                startIcon={
                  <RestartAlt sx={{ color: "#ffffff", fontSize: 26 }} />
                }
                onClick={() => {
                  if (!window.confirm("هل تريد حذف جميع البيانات؟")) return;
                  localStorage.removeItem("service");
                  setForm(defaultData);
                  toast.success("تم إعادة التعيين");
                }}
                sx={{
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: "bold",
                  px: 3,
                  py: 1.2,
                  fontSize: "16px",
                  bgcolor: "#dc2626",
                  "&:hover": { bgcolor: "#b91c1c" },
                  boxShadow: "0 4px 14px rgba(220,38,38,0.5)",
                }}
              >
                إعادة تعيين
              </Button>

              <Button
                variant="contained"
                onClick={changeKedma}
                startIcon={
                  <CompareArrows sx={{ color: "#ffffff", fontSize: 26 }} />
                }
                sx={{
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: "bold",
                  px: 3,
                  py: 1.2,
                  fontSize: "16px",
                  bgcolor: "#0891b2",
                  "&:hover": { bgcolor: "#0e7490" },
                  boxShadow: "0 4px 14px rgba(8,145,178,0.5)",
                }}
              >
                تبديل الخدمة
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
