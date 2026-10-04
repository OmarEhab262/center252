import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PersonSelect from "../components/PersonSelect";
import PersonSection from "../components/PersonSection";
import Nav from "../components/Nav";
import { formatArabicDate, formatArabicDay } from "../utils/date";
import { getJSON, setJSON, getItem } from "../utils/storage";
import SoldierServices from "../components/SoldierServices";

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
  "لواء أح",
  "لواء",
  "عميد أح",
  "عميد",
  "عقيد أح",
  "عقيد",
  "مقدم أح",
  "مقدم",
  "رائد أح",
  "رائد",
  "نقيب",
  "ملازم.أ",
  "ملازم",
];

const ncoRankOrder = ["مساعد.أ", "مساعد", "رقيب.أ", "رقيب", "عريف"];
const bothRankOrder = [
  "مساعد.أ",
  "مساعد",
  "رقيب.أ",
  "رقيب",
  "عريف",
  "رقيب مجند",
  "عريف مجند",
  "جندى",
];

const defaultPerson = { name: "", id: "", rank: "" };

const rankEmojiMap = {
  ملازم: "⭐",
  "ملازم.أ": "⭐⭐",
  نقيب: "⭐⭐⭐",

  // ---------------- رائد / مقدم (النسر) ----------------
  رائد: "🦅",
  "رائد أح": "🦅",
  مقدم: "⭐🦅",
  "مقدم أح": "⭐🦅",

  // ---------------- رتب عليا (السيف) ----------------
  عقيد: "⭐⭐🦅",
  "عقيد أح": "⭐⭐🦅",
  عميد: "⭐⭐⭐🦅",
  "عميد أح": "⭐⭐⭐🦅",
  لواء: "⚔️🦅",
  "لواء أح": "⚔️🦅",
};

const getRankEmoji = (rank) => rankEmojiMap[rank] || "⭐";

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

const arabicMonths = {
  يناير: 0,
  فبراير: 1,
  مارس: 2,
  أبريل: 3,
  مايو: 4,
  يونيو: 5,
  يوليو: 6,
  أغسطس: 7,
  سبتمبر: 8,
  أكتوبر: 9,
  نوفمبر: 10,
  ديسمبر: 11,
};

const parseArabicDate = (dateString) => {
  if (!dateString) return null;

  const englishDate = String(dateString).replace(/[٠-٩]/g, (digit) =>
    "٠١٢٣٤٥٦٧٨٩".indexOf(digit),
  );

  const parts = englishDate.trim().split(/\s+/);

  if (parts.length !== 3) return null;

  const day = Number(parts[0]);
  const month = arabicMonths[parts[1]];
  const year = Number(parts[2]);

  if (Number.isNaN(day) || month === undefined || Number.isNaN(year)) {
    return null;
  }

  return new Date(year, month, day);
};

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
  const [selectedDate, setSelectedDate] = useState(null);

  // ==========================================================
  // Services
  // ==========================================================
  const [serviceTypes, setServiceTypes] = useState([]);

  // ==========================================================
  // Form
  // ==========================================================
  const datee = JSON.parse(localStorage.getItem("service"));
  console.log("date", datee?.date);
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
        }));

        // تحويل التاريخ العربي المحفوظ إلى Date
        if (savedForm.date) {
          const parsedDate = parseArabicDate(savedForm.date);

          if (parsedDate) {
            setSelectedDate(parsedDate);
          }
        }
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
    setServiceTypes((prevServices) => {
      const soldierServiceIndexes = prevServices
        .map((service, index) => (service.type === "soldiers" ? index : -1))
        .filter((index) => index !== -1);

      if (soldierServiceIndexes.length < 2) {
        return prevServices;
      }

      const updatedServices = [...prevServices];

      soldierServiceIndexes.forEach((currentIndex, i) => {
        const nextIndex =
          soldierServiceIndexes[(i + 1) % soldierServiceIndexes.length];

        const currentService = prevServices[currentIndex];
        const nextService = prevServices[nextIndex];

        const nextData = Array.isArray(nextService.data)
          ? nextService.data
          : createGuardData();

        if (nextData.length < 4) {
          return;
        }

        updatedServices[currentIndex] = {
          ...currentService,
          data: [
            // حكمدار من الخدمة التالية
            {
              ...nextData[0],
              position: "حكمدار",
            },

            // ثانية → أولى
            {
              ...nextData[2],
              position: "أولى",
            },

            // ثالثة → ثانية
            {
              ...nextData[3],
              position: "ثانية",
            },

            // أولى → ثالثة
            {
              ...nextData[1],
              position: "ثالثة",
            },
          ],
        };
      });

      setJSON("serviceTypes", updatedServices);

      setForm((prevForm) => {
        const newServices = {
          ...(prevForm.services || {}),
        };

        updatedServices.forEach((service) => {
          if (service.type !== "soldiers") return;

          newServices[service.id] = service.data;
        });

        return {
          ...prevForm,
          services: newServices,
        };
      });

      return updatedServices;
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
  const soldierRankOrder = ["رقيب مجند", "عريف مجند", "جندى"];

  const guardRankOrder = [
    "مساعد.أ",
    "مساعد",
    "رقيب.أ",
    "رقيب",
    "عريف",
    "رقيب مجند",
    "عريف مجند",
    "جندى",
  ];

  const bothNames = names.filter((person) =>
    bothRankOrder.includes(String(person?.rank || "").trim()),
  );

  const officerRankOrder = [
    "لواء أح",
    "لواء",
    "عميد أح",
    "عميد",
    "عقيد أح",
    "عقيد",
    "مقدم أح",
    "مقدم",
    "رائد أح",
    "رائد",
    "نقيب",
    "ملازم.أ",
    "ملازم",
  ];

  const officerNames = names.filter((person) =>
    officerRankOrder.includes(String(person.rank).trim()),
  );

  const soldierNames = names.filter((person) =>
    soldierRankOrder.includes(String(person.rank).trim()),
  );

  const guardNames = names.filter((person) => {
    const rank = String(person?.rank || "").trim();

    return guardRankOrder.includes(rank);
  });

  //   const handleLogout = async () => {
  //     await removeItem("auth");
  // <Navigate to="/login" />
  //   };

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
              services.length % 2 === 1 && index === services.length - 1;

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

  if (!loaded) return null;

  return (
    <div className="min-h-screen bg-linear-to-br from-cyan-900 via-slate-900 to-black text-white py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white/10 rounded-3xl shadow-2xl p-8 backdrop-blur">
          {/* Title */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="text-3xl sm:text-4xl">🎖️</span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl leading-tight font-black bg-gradient-to-l from-cyan-300 via-white to-cyan-300 bg-clip-text text-transparent">
                خدمة {unitName}
              </h1>
              <span className="text-3xl sm:text-4xl">🎖️</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="h-[2px] w-16 bg-gradient-to-l from-transparent to-cyan-400" />
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <div className="h-[2px] w-16 bg-gradient-to-r from-transparent to-cyan-400" />
            </div>
          </div>

          {/* Date */}
          <div className="flex justify-center items-center">
            <div className=" w-full flex flex-col sm:flex-row gap-4 items-stretch justify-center bg-white/5 border border-white/10 rounded-2xl p-4 shadow-lg">
              <div className="flex-1 flex flex-col justify-center bg-slate-800/60 border border-slate-600/50 rounded-xl p-4 text-center">
                <span className="text-lg sm:text-xl font-bold">
                  {selectedDate ? (
                    <>
                      {formatArabicDay(selectedDate)} -{" "}
                      {formatArabicDate(selectedDate)}
                    </>
                  ) : (
                    "لم يتم تحديد التاريخ"
                  )}
                </span>
              </div>

              <div className="flex items-center justify-center">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => {
                    if (!date) return;

                    setSelectedDate(date);

                    const newDate = formatArabicDate(date);
                    const newDay = formatArabicDay(date);

                    setForm((prev) => ({
                      ...prev,
                      date: newDate,
                      day: newDay,
                    }));
                  }}
                  customInput={
                    <button
                      type="button"
                      className="cursor-pointer w-full sm:w-auto h-full bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 transition-colors px-6 py-3 rounded-xl text-white text-lg font-bold shadow-lg flex items-center justify-center gap-2"
                    >
                      <span>📅</span>
                      <span>اختيار التاريخ</span>
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
                    {/* الشارة اليمين - عادية */}
                    <span className="text-2xl">
                      {getRankEmoji(form.leader?.rank)}
                    </span>
                    <label className="text-2xl font-black text-cyan-300">
                      قائد {unitName}
                    </label>
                    {/* الشارة الشمال - معكوسة أفقيًا */}
                    <span
                      className="text-2xl inline-block"
                      style={{ transform: "scaleX(-1)" }}
                    >
                      {getRankEmoji(form.leader?.rank)}
                    </span>
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
              <label className="block text-2xl font-bold mb-3 text-center text-cyan-300">
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
          <h2 className="text-2xl font-bold text-center mt-10">خدمات اخرى</h2>
          <div
            className="   grid
          grid-cols-1
          md:grid-cols-2
          gap-6
          w-full"
          >
            {/* تنظيم وادارة */}
            <div className="flex justify-center mt-8">
              <div className="w-full bg-white/5 rounded-2xl p-6 shadow-lg border border-white/10">
                <div className="flex items-center justify-end gap-3 mb-4">
                  <label className="text-2xl font-black text-cyan-300">
                    تنظيم وادارة{" "}
                  </label>
                </div>
                <PersonSection
                  // title="تنظيم وادارة"
                  section="tanzem"
                  form={form}
                  names={soldierNames}
                  updatePerson={updatePerson}
                />
              </div>
            </div>
            {/* منوب عمليات */}
            <div className="flex justify-center mt-8">
              <div className="w-full bg-white/5 rounded-2xl p-6 shadow-lg border border-white/10">
                <div className="flex items-center justify-end gap-3 mb-4">
                  <label className="text-2xl font-black text-cyan-300">
                    منوب عمليات
                  </label>
                </div>
                <PersonSection
                  // title="منوب عمليات"
                  section="manob"
                  form={form}
                  names={soldierNames}
                  updatePerson={updatePerson}
                />
              </div>
            </div>

            {/* الكانتين */}
            <div className="flex justify-center mt-8">
              <div className="w-full bg-white/5 rounded-2xl p-6 shadow-lg border border-white/10">
                <div className="flex items-center justify-end gap-3 mb-4">
                  <label className="text-2xl font-black text-cyan-300">
                    الكانتين
                  </label>
                </div>
                <PersonSection
                  // title="الكانتين"
                  section="kanten"
                  form={form}
                  names={soldierNames}
                  updatePerson={updatePerson}
                />
              </div>
            </div>
            {/* سائق */}
            <div className="flex justify-center mt-8">
              <div className="w-full bg-white/5 rounded-2xl p-6 shadow-lg border border-white/10">
                <div className="flex items-center justify-end gap-3 mb-4">
                  <label className="text-2xl font-black text-cyan-300">
                    سائق{" "}
                  </label>
                </div>
                <PersonSection
                  // title="سائق"
                  section="driver"
                  form={form}
                  names={bothNames}
                  updatePerson={updatePerson}
                />
              </div>
            </div>
          </div>

          {/* رقيب نوبتجى */}
          <div className="flex justify-center mt-8">
            <div className="w-full bg-white/5 rounded-2xl p-6 shadow-lg border border-white/10">
              <div className="flex items-center justify-end gap-3 mb-4">
                <label className="text-2xl font-black text-cyan-300">
                  رقيب نوبتجى{" "}
                </label>
              </div>
              <PersonSection
                title="رقيب نوبتجى"
                section="rakeb"
                form={form}
                names={bothNames}
                updatePerson={updatePerson}
              />
            </div>
          </div>
          {/* Soldiers services */}
          <SoldierServices
            services={dynamicServices}
            soldierNames={soldierNames}
            guardNames={guardNames}
            usageCount={usageCount}
            updateDynamicService={updateDynamicService}
            changeKedma={changeKedma}
          />
        </div>
      </div>
    </div>
  );
}
