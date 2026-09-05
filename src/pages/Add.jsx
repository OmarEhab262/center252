import { Button } from "@mui/material";

import { Edit, Delete, ArrowBack, KeyboardArrowUp } from "@mui/icons-material";

import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import toast from "react-hot-toast";

import { getUnitName } from "../utils/unitName";

import { getJSON, setJSON } from "../utils/storage";

const Add = () => {
  const ranks = [
    "لواء أح",
    "لواء",
    "عميد أح",
    "عميد",
    "مقدم أح",
    "مقدم",
    "رائد أح",
    "رائد",
    "نقيب",
    "ملازم.أ",
    "ملازم",
    "مساعد.أ",
    "مساعد",
    "رقيب.أ",
    "رقيب",
    "عريف",
    "رقيب مجند",
    "عريف مجند",
    "جندى",
    "---",
  ];

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, []);

  const [name, setName] = useState("");
  const [rank, setRank] = useState("");
  const [editId, setEditId] = useState(null);
  const [showTopButton, setShowTopButton] = useState(false);

  const unitName = getUnitName();

  const [list, setList] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  // تحميل القائمة من SQLite أول مرة
  useEffect(() => {
    (async () => {
      const saved = await getJSON("listNames", []);
      setList(saved);
      setLoaded(true);
    })();
  }, []);

  const addPerson = () => {
    if (!name.trim()) {
      toast.error("من فضلك اكتب الاسم");
      return;
    }

    if (!rank) {
      toast.error("من فضلك اختر الرتبة / الدرجة");
      return;
    }

    if (editId) {
      setList((prev) =>
        prev.map((person) =>
          person.id === editId
            ? {
                ...person,
                name,
                rank,
              }
            : person,
        ),
      );

      toast.success("تم تحديث البيانات بنجاح");
      setEditId(null);
    } else {
      setList((prev) => [
        {
          id: Date.now(),
          name,
          rank,
        },
        ...prev,
      ]);

      toast.success("تمت الإضافة بنجاح");
    }

    setName("");
    setRank("");
  };

  const editPerson = (person) => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    setEditId(person.id);
    setName(person.name);
    setRank(person.rank);
  };

  const removePerson = (id) => {
    setList((prev) => prev.filter((person) => person.id !== id));

    toast.success("تم الحذف");
  };

  // حفظ القائمة في SQLite بعد كل تعديل
  useEffect(() => {
    if (!loaded) return;

    setJSON("listNames", list);
  }, [list, loaded]);
  useEffect(() => {
    const handleScroll = () => {
      setShowTopButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-cyan-900 via-slate-900 to-black text-white py-5 sm:py-10 px-3">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 rounded-3xl shadow-2xl p-5 sm:p-8 backdrop-blur">
          <Button
            variant="contained"
            component={Link}
            to="/"
            startIcon={<ArrowBack sx={{ fontSize: 23 }} />}
            sx={{
              color: "#fff",
              bgcolor: "#334155",
              borderRadius: "10px",
              px: 2.5,
              py: 1,
              fontWeight: "bold",
              gap: 1,
              "&:hover": {
                bgcolor: "#475569",
              },
            }}
          >
            رجوع
          </Button>

          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black text-center leading-relaxed">
            اضــــافة اســـــماء خدمــــــــــــة {unitName}
          </h1>
        </div>

        {/* Add Person */}
        <div className="bg-white/10 rounded-3xl shadow-2xl backdrop-blur mt-8 p-5 sm:p-8">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            {/* Name */}
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 rounded-xl p-3 bg-white text-black w-full outline-none"
              placeholder="الاسم"
            />

            {/* Rank */}
            <select
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              className="w-full md:w-56 rounded-xl p-3 text-black bg-white outline-none"
            >
              <option value="">اختر الرتبة / درجة</option>

              {ranks.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {/* Add / Update */}
            <Button
              variant="contained"
              color={editId ? "warning" : "success"}
              onClick={addPerson}
              sx={{
                minWidth: {
                  xs: "100%",
                  md: 140,
                },
                height: 50,
                borderRadius: "10px",
                fontWeight: "bold",
                fontSize: "16px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                "&:hover": {
                  boxShadow: "0 6px 16px rgba(0,0,0,0.35)",
                },
              }}
            >
              {editId ? "تحديث" : "إضافة"}
            </Button>
          </div>
        </div>

        {/* List */}
        <div className="bg-white/10 rounded-3xl shadow-2xl backdrop-blur mt-8 p-5 sm:p-8">
          {list.length === 0 ? (
            <div className="text-center text-2xl py-8">لا يوجد أسماء</div>
          ) : (
            <div className="space-y-4">
              {list.map((person) => (
                <div
                  key={person.id}
                  className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center bg-white/10 rounded-2xl p-5 hover:bg-white/20 transition"
                >
                  {/* Person Info */}
                  <div>
                    <h3 className="text-2xl font-bold">{person.name}</h3>

                    <p className="text-cyan-300 text-lg mt-1">{person.rank}</p>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Edit />}
                      onClick={() => editPerson(person)}
                      sx={{
                        borderRadius: "10px",
                        px: 2.5,
                        py: 1,
                        fontWeight: "bold",
                        gap: 1,
                        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                      }}
                    >
                      تعديل
                    </Button>

                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => removePerson(person.id)}
                      sx={{
                        borderRadius: "10px",
                        px: 2.5,
                        py: 1,
                        fontWeight: "bold",
                        gap: 1,
                        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                      }}
                    >
                      حذف
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {showTopButton && (
        <Button
          variant="contained"
          onClick={scrollToTop}
          sx={{
            position: "fixed",
            bottom: 25,
            right: 25,
            minWidth: 55,
            width: 55,
            height: 55,
            borderRadius: "50%",
            backgroundColor: "#06b6d4",
            color: "#fff",
            zIndex: 9999,
            boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
            animation: "fadeInUp 0.3s ease-out",
            "&:hover": {
              backgroundColor: "#0891b2",
              transform: "translateY(-5px)",
              boxShadow: "0 10px 25px rgba(0,0,0,0.45)",
            },
            transition: "all 0.25s ease",
            "@keyframes fadeInUp": {
              from: { opacity: 0, transform: "translateY(20px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          {" "}
          <KeyboardArrowUp sx={{ fontSize: 30 }} />{" "}
        </Button>
      )}  
    </div>
  );
};

export default Add;
