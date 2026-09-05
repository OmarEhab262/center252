import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import CompareArrows from "@mui/icons-material/CompareArrows";
import PersonAddAlt from "@mui/icons-material/PersonAddAlt";
import Visibility from "@mui/icons-material/Visibility";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import GuardSection from "../components/GuardSection";
import PersonSelect from "../components/PersonSelect";
import PersonSection from "../components/PersonSection";
import { formatArabicDate, formatArabicDay } from "../utils/date";
import { getJSON, setJSON, getItem, removeItem } from "../utils/storage";

// ============================================================
// Constants
// ============================================================
const createGuardData = () => [
  { position: "حكمدار", id: "", name: "---", rank: "---" },
  { position: "أولى", id: "", name: "---", rank: "---" },
  { position: "ثانية", id: "", name: "---", rank: "---" },
  { position: "ثالثة", id: "", name: "---", rank: "---" },
];

const officerRankOrder = [
  "مقدم أح",
  "مقدم",
  "رائد أح",
  "رائد",
  "نقيب",
  "ملازم.أ",
  "ملازم",
];

const ncoRankOrder = ["مساعد.أ", "مساعد", "رقيب.أ", "رقيب", "عريف"];
const soldierRankOrder = ["رقيب مجند", "عريف مجند", "جندى"];

const defaultPerson = { name: "", id: "", rank: "" };

// ملحوظة: تم حذف قسم "السلاح" (weapon) بالكامل من نموذج البيانات
// بناءً على طلبك. لو فيه أماكن تانية بتشير له (زي components/Tables.jsx
// اللي مكنش موجود في الكود اللي بعتّه) لازم تتعدل هي كمان يدويًا.
const defaultData = {
  date: "",
  day: "",
  password: "",
  officer: { ...defaultPerson },
  manger: { ...defaultPerson },
  leader: { ...defaultPerson },
  deputy: { ...defaultPerson },
  rakeb: { ...defaultPerson },
  assistants: { ...defaultPerson },
  gate: createGuardData(),
  sergeant: { name: "", rank: "" },
  services: {},
};

const duplicateColors = [
  "bg-cyan-400 shadow-cyan-400/50",
  "bg-emerald-400 shadow-emerald-400/50",
  "bg-amber-400 shadow-amber-400/50",
  "bg-orange-400 shadow-orange-400/50",
  "bg-red-400 shadow-red-400/50",
  "bg-purple-400 shadow-purple-400/50",
  "bg-pink-400 shadow-pink-400/50",
  "bg-blue-400 shadow-blue-400/50",
  "bg-indigo-400 shadow-indigo-400/50",
  "bg-violet-400 shadow-violet-400/50",
  "bg-fuchsia-400 shadow-fuchsia-400/50",
  "bg-rose-400 shadow-rose-400/50",
  "bg-lime-400 shadow-lime-400/50",
  "bg-green-400 shadow-green-400/50",
  "bg-teal-400 shadow-teal-400/50",
  "bg-sky-400 shadow-sky-400/50",
];

// ============================================================
// Helpers
// ============================================================
const normalizeServices = (services) => {
  if (!Array.isArray(services)) return [];
  return services.map((service) => {
    if (service.type === "soldiers" && !Array.isArray(service.data)) {
      return { ...service, data: createGuardData() };
    }
    return service;
  });
};

// ============================================================
// Home
// ============================================================
export default function Home() {
  const [unitName, setUnitName] = useState("");
  const [loaded, setLoaded] = useState(false);

  // ==========================================================
  // Date
  // ==========================================================
  const [selectedDate, setSelectedDate] = useState(new Date());

  // ==========================================================
  // Services
  // ==========================================================
  const [serviceTypes, setServiceTypes] = useState([]);

  // ==========================================================
  // Form
  // ==========================================================
  const [form, setForm] = useState(() => {
    const today = new Date();
    return {
      ...defaultData,
      date: formatArabicDate(today),
      day: formatArabicDay(today),
    };
  });

  // ==========================================================
  // Names
  // ==========================================================
  const [names, setNames] = useState([]);

  // ==========================================================
  // Admin
  // ==========================================================
  const [isAdmin, setIsAdmin] = useState(false);

  // ==========================================================
  // تحميل كل البيانات من SQLite أول مرة
  // ==========================================================
  useEffect(() => {
    (async () => {
      const savedServices = await getJSON("serviceTypes", []);
      const normalizedServices = normalizeServices(savedServices);
      setServiceTypes(normalizedServices);
      await setJSON("serviceTypes", normalizedServices);

      const savedForm = await getJSON("service", null);
      if (savedForm) {
        setForm((prev) => ({
          ...defaultData,
          ...savedForm,
          date: savedForm.date || prev.date,
          day: savedForm.day || prev.day,
          services: savedForm.services || {},
          gate: Array.isArray(savedForm.gate)
            ? savedForm.gate
            : createGuardData(),
        }));
      }

      setNames(await getJSON("listNames", []));
      setUnitName((await getItem("unitName")) || "");

      const auth = await getJSON("auth", null);
      setIsAdmin(!!auth && auth.name !== "زائر");

      setLoaded(true);
    })();
  }, []);

  // إعادة تحميل الخدمات والأسماء عند رجوع النافذة للـ focus
  useEffect(() => {
    const loadServices = async () => {
      const saved = await getJSON("serviceTypes", []);
      const normalized = normalizeServices(saved);
      setServiceTypes(normalized);
      await setJSON("serviceTypes", normalized);
    };
    const loadNames = async () => {
      setNames(await getJSON("listNames", []));
    };
    const onFocus = () => {
      loadServices();
      loadNames();
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  // ==========================================================
  // Save form (بعد التحميل الأول فقط عشان منمسحش البيانات القديمة)
  // ==========================================================
  useEffect(() => {
    if (!loaded) return;
    setJSON("service", form);
  }, [form, loaded]);

  // ==========================================================
  // Update basic person
  // ==========================================================
  const updatePerson = (section, id) => {
    if (!id || id === "---") {
      const emptyPerson = {
        id: id === "---" ? "---" : "",
        name: id === "---" ? "---" : "",
        rank: id === "---" ? "---" : "",
      };
      setForm((prev) => ({ ...prev, [section]: emptyPerson }));
      return;
    }
    const person = names.find((item) => String(item.id) === String(id));
    if (!person) return;
    setForm((prev) => ({
      ...prev,
      [section]: { id: person.id, name: person.name, rank: person.rank },
    }));
  };

  // ==========================================================
  // Update officer / NCO dynamic service
  // ==========================================================
  const updateDynamicPerson = (serviceId, id) => {
    if (!id || id === "---") {
      const emptyPerson = {
        id: id === "---" ? "---" : "",
        name: id === "---" ? "---" : "",
        rank: id === "---" ? "---" : "",
      };
      setForm((prev) => ({
        ...prev,
        services: { ...(prev.services || {}), [serviceId]: emptyPerson },
      }));
      return;
    }
    const person = names.find((item) => String(item.id) === String(id));
    if (!person) return;
    setForm((prev) => ({
      ...prev,
      services: {
        ...(prev.services || {}),
        [serviceId]: { id: person.id, name: person.name, rank: person.rank },
      },
    }));
  };

  // ==========================================================
  // Change service
  //
  // حكمدار ثابت
  // ثالثة -> أولى
  // أولى  -> ثانية
  // ثانية -> ثالثة
  // ==========================================================
  const changeKedma = () => {
    const rotateData = (data) => {
      if (!Array.isArray(data) || data.length < 4) return data;
      return [
        { ...data[0], position: "حكمدار" },
        { ...data[2], position: "أولى" },
        { ...data[3], position: "ثانية" },
        { ...data[1], position: "ثالثة" },
      ];
    };

    setServiceTypes((prevServices) => {
      const soldiersServices = prevServices.filter(
        (service) => service.type === "soldiers",
      );
      if (soldiersServices.length === 0) return prevServices;

      const rotatedServices = [
        soldiersServices[soldiersServices.length - 1],
        ...soldiersServices.slice(0, -1),
      ].map((service) => ({ ...service, data: rotateData(service.data) }));

      const newServiceTypes = [...prevServices];
      let index = 0;
      newServiceTypes.forEach((service, i) => {
        if (service.type === "soldiers") {
          newServiceTypes[i] = rotatedServices[index];
          index++;
        }
      });

      setForm((prevForm) => {
        const newFormServices = { ...(prevForm.services || {}) };
        soldiersServices.forEach((oldService, oldIndex) => {
          const newIndex = (oldIndex + 1) % soldiersServices.length;
          const newService = soldiersServices[newIndex];
          newFormServices[newService.id] = rotateData(
            prevForm.services?.[oldService.id],
          );
        });
        return { ...prevForm, services: newFormServices };
      });

      setJSON("serviceTypes", newServiceTypes);
      return newServiceTypes;
    });
  };

  // ==========================================================
  // Update soldiers service
  // ==========================================================
  const updateDynamicService = (serviceId, data) => {
    const normalizedData = Array.isArray(data) ? data : createGuardData();
    setServiceTypes((prevServices) => {
      const updatedServices = prevServices.map((service) =>
        service.id === serviceId
          ? { ...service, data: normalizedData }
          : service,
      );
      setJSON("serviceTypes", updatedServices);
      return updatedServices;
    });
    setForm((prev) => ({
      ...prev,
      services: { ...(prev.services || {}), [serviceId]: normalizedData },
    }));
  };

  // ==========================================================
  // Calculate duplicate people
  // ==========================================================
  const usageCount = {};
  serviceTypes
    .filter((service) => service.type === "soldiers")
    .forEach((service) => {
      if (!Array.isArray(service.data)) return;
      service.data.forEach((person) => {
        if (!person?.id || person.id === "---") return;
        const id = String(person.id);
        usageCount[id] = (usageCount[id] || 0) + 1;
      });
    });

  const duplicateColorMap = {};
  Object.keys(usageCount)
    .filter((id) => usageCount[id] > 1)
    .forEach((id, index) => {
      duplicateColorMap[id] = duplicateColors[index % duplicateColors.length];
    });

  const dynamicServices = serviceTypes.filter(
    (service) => service.type === "soldiers",
  );
  const officerServices = serviceTypes.filter(
    (service) => service.type === "officers",
  );
  const ncoServices = serviceTypes.filter((service) => service.type === "nco");

  const officerNames = names.filter((person) =>
    officerRankOrder.includes(person.rank),
  );
  const soldierNames = names.filter((person) =>
    soldierRankOrder.includes(person.rank),
  );

  const handleLogout = async () => {
    await removeItem("auth");
    window.location.href = "/login";
  };

  const renderPersonServices = (services, title) => {
    if (services.length === 0) return null;

    return (
      <div className="mt-10 w-full">
        <h2 className="text-2xl font-bold text-center mb-6">{title}</h2>

        <div
          className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-6
          w-full
        "
        >
          {services.map((service, index) => {
            const person = form.services?.[service.id] || {};

            const allowedRanks =
              service.type === "officers"
                ? officerRankOrder
                : service.type === "nco"
                  ? ncoRankOrder
                  : [];

            const filteredNames = names
              .filter((person) => allowedRanks.includes(person.rank))
              .sort(
                (a, b) =>
                  allowedRanks.indexOf(a.rank) - allowedRanks.indexOf(b.rank),
              );

            const isLastOddItem =
              services.length > 2 &&
              services.length % 2 === 1 &&
              index === services.length - 1;

            return (
              <div
                key={service.id}
                className={`
                bg-white/5
                rounded-2xl
                p-6
                shadow-lg
                border
                border-white/10
                ${isLastOddItem ? "md:col-span-2" : ""}
              `}
              >
                <h3 className="text-2xl font-black text-cyan-300 my-3 text-end">
                  {service.name}
                </h3>

                <div className="flex gap-3 flex-wrap-reverse justify-center items-center p-5 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl">
                  <div className="flex-1 ">
                    <PersonSelect
                      names={filteredNames}
                      value={person.id || ""}
                      onChange={(id) => updateDynamicPerson(service.id, id)}
                    />
                  </div>

                  {person.rank && (
                    <div className="bg-slate-700 px-4 py-2 rounded-lg min-w-28 text-center font-bold text-white flex-shrink-0">
                      {person.rank}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const buttonSx = {
    borderRadius: "10px",
    textTransform: "none",
    fontWeight: "bold",
    px: 2,
    py: 1.2,
    fontSize: "16px",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    minWidth: "150px",
  };

  if (!loaded) return null;

  return (
    <div className="min-h-screen bg-linear-to-br from-cyan-900 via-slate-900 to-black text-white py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white/10 rounded-3xl shadow-2xl p-8 backdrop-blur">
          <h1 className="text-5xl leading-tight font-black text-center mb-10">
            خدمــــــــــــة {unitName}
          </h1>
          {/* Date */}
          <div className="flex justify-center items-center">
            <div className="md:w-[50%] w-full flex flex-wrap gap-5 items-center justify-center">
              <div className="w-[90%] bg-white/10 rounded-xl p-3 text-center text-xl font-bold">
                {formatArabicDay(selectedDate)} -{" "}
                {formatArabicDate(selectedDate)}
              </div>
              <div className="flex items-center justify-center md:w-[40%] w-full">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => {
                    if (!date) return;
                    setSelectedDate(date);
                    setForm((prev) => ({
                      ...prev,
                      date: formatArabicDate(date),
                      day: formatArabicDay(date),
                    }));
                  }}
                  customInput={
                    <button
                      type="button"
                      className="cursor-pointer bg-cyan-600 hover:bg-cyan-700 px-5 py-3 rounded-xl text-white text-xl font-bold shadow-lg"
                    >
                      📅 اختيار التاريخ
                    </button>
                  }
                />
              </div>
            </div>
          </div>
          {/* قائد الوحدة */}
          <div className="flex justify-center mt-8">
            <div className="w-full bg-white/5 rounded-2xl p-6 shadow-lg border border-white/10">
              <PersonSection
                title={
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="text-2xl">⭐</span>
                    <label className="text-2xl font-black text-cyan-300">
                      قائد {unitName}
                    </label>
                    <span className="text-2xl">⭐</span>
                  </div>
                }
                section="leader"
                form={form}
                names={officerNames}
                updatePerson={updatePerson}
              />
            </div>
          </div>
          {/* Password */}
          <div className="flex justify-center mt-10">
            <div className="w-full bg-white/5 rounded-2xl p-6 shadow-lg border border-cyan-500/20">
              <label className="block text-xl font-bold mb-3 text-center text-cyan-300">
                كلمة سر الليل
              </label>
              <input
                type="text"
                value={form.password || ""}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, password: e.target.value }))
                }
                className="w-full rounded-xl p-3 text-end bg-slate-800 text-white text-xl font-bold placeholder:text-white/50 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                placeholder="اكتب كلمة السر"
              />
            </div>
          </div>
          {renderPersonServices(officerServices, "خدمات الضباط")}
          {renderPersonServices(ncoServices, "خدمات صف الضباط")}
          {/* رقيب نوبتجي */}
          <div className="flex justify-center mt-8">
            <div className="w-full bg-white/5 rounded-2xl p-6 shadow-lg border border-white/10">
              <div className="flex items-center justify-end gap-3 mb-4">
                <label className="text-2xl font-black text-cyan-300">
                  رقيب نوبتجى
                </label>
              </div>
              <PersonSection
                title="رقيب نوبتجي"
                section="rakeb"
                form={form}
                names={soldierNames}
                updatePerson={updatePerson}
              />
            </div>
          </div>
          {/* Soldiers services */}
          <div
            className={`
    grid
    grid-cols-1
    md:grid-cols-2
    gap-8
    mt-12
    w-full
  `}
          >
            {dynamicServices.map((service, index) => {
              const serviceData = Array.isArray(service.data)
                ? service.data
                : createGuardData();

              const isLastOddItem =
                dynamicServices.length > 2 &&
                dynamicServices.length % 2 === 1 &&
                index === dynamicServices.length - 1;

              return (
                <div
                  key={service.id}
                  className={`w-full ${isLastOddItem ? "md:col-span-2" : ""}`}
                >
                  <GuardSection
                    title={service.name}
                    data={serviceData}
                    names={soldierNames}
                    usageCount={usageCount}
                    duplicateColorMap={duplicateColorMap}
                    onChange={(data) => updateDynamicService(service.id, data)}
                  />
                </div>
              );
            })}
          </div>
          {/* Buttons */}
          <div className="flex justify-center mt-10">
            <div className="flex flex-wrap justify-center items-center gap-3 bg-slate-900/95 backdrop-blur border border-slate-700 shadow-xl rounded-2xl px-6 py-4">
              <Button
                variant="contained"
                onClick={changeKedma}
                sx={{
                  ...buttonSx,
                  bgcolor: "#475569",
                  "&:hover": { bgcolor: "#566579" },
                }}
              >
                <span>تبديل الخدمة</span>
                <CompareArrows sx={{ color: "#fff", fontSize: 25 }} />
              </Button>

              <Button
                variant="contained"
                component={Link}
                to="/show"
                sx={{
                  ...buttonSx,
                  bgcolor: "#1e3a5f",
                  "&:hover": { bgcolor: "#264b73" },
                }}
              >
                <span>الخدمة</span>
                <Visibility sx={{ color: "#fff", fontSize: 25 }} />
              </Button>

              {isAdmin && (
                <>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/add"
                    sx={{
                      ...buttonSx,
                      bgcolor: "#285943",
                      "&:hover": { bgcolor: "#326b50" },
                    }}
                  >
                    <span>إضافة أسماء</span>
                    <PersonAddAlt sx={{ color: "#fff", fontSize: 25 }} />
                  </Button>

                  <Button
                    variant="contained"
                    component={Link}
                    to="/control"
                    sx={{
                      ...buttonSx,
                      bgcolor: "#334155",
                      "&:hover": { bgcolor: "#475569" },
                    }}
                  >
                    <span>التحكم</span>
                    <Settings sx={{ color: "#fff", fontSize: 25 }} />
                  </Button>
                </>
              )}

              {isAdmin ? (
                <Button
                  variant="contained"
                  onClick={handleLogout}
                  sx={{
                    ...buttonSx,
                    bgcolor: "#7f1d1d",
                    "&:hover": { bgcolor: "#991b1b" },
                  }}
                >
                  <span>تسجيل الخروج</span>
                  <Logout sx={{ color: "#fff", fontSize: 25 }} />
                </Button>
              ) : (
                <Button
                  variant="contained"
                  component={Link}
                  to="/login"
                  sx={{
                    ...buttonSx,
                    bgcolor: "#166534",
                    "&:hover": { bgcolor: "#15803d" },
                  }}
                >
                  <span>تسجيل الدخول</span>
                  <LoginIcon sx={{ color: "#fff", fontSize: 25 }} />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
