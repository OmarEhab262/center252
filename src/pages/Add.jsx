import { Button } from "@mui/material";
import { Edit, Delete, ArrowBack } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getUnitName } from "../utils/unitName";
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
  const unitName = getUnitName();
  const [list, setList] = useState(() => {
    const saved = localStorage.getItem("listNames");
    return saved ? JSON.parse(saved) : [];
  });
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
        ...prev, // new person goes first
      ]);
      toast.success("تمت الإضافة بنجاح");
      // setTimeout(() => {
      //   window.location.reload();
      // }, 1000);
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
  useEffect(() => {
    localStorage.setItem("listNames", JSON.stringify(list));
  }, [list]);

  return (
    <div className="min-h-screen bg-linear-to-br from-cyan-900 via-slate-900 to-black text-white py-5 sm:py-10 px-3">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/10 rounded-3xl shadow-2xl p-5 sm:p-8 backdrop-blur">
          <Button
            component={Link}
            to="/"
            startIcon={
              <ArrowBack
                sx={{
                  color: "#fff",
                }}
              />
            }
            sx={{
              color: "#fff",
              bgcolor: "#334155",
              borderRadius: "10px",
              px: 2.5,
              py: 1,
              fontWeight: "bold",
              "&:hover": {
                bgcolor: "#475569",
              },
            }}
          >
            رجوع
          </Button>{" "}
          <h1
            className="
      text-2xl
      sm:text-3xl
      lg:text-5xl
      font-black
      text-center
      leading-relaxed
    "
          >
            اضــــافة اســـــماء خدمــــــــــــة {unitName}
          </h1>
        </div>

        {/* Add Person */}
        <div className="bg-white/10 rounded-3xl shadow-2xl backdrop-blur mt-8 p-5 sm:p-8">
          <div
            className="
      flex
      flex-col
      md:flex-row
      gap-4
      items-stretch
      md:items-center
    "
          >
            {" "}
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="
    flex-1
    rounded-xl
    p-3
    bg-white
    text-black
    w-full
  "
              placeholder="الاسم"
            />
            <select
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              className="
    w-full
    md:w-56
    rounded-xl
    p-3
    text-black
    bg-white
  "
            >
              <option value="">اختر الرتبة / درجة</option>

              {ranks.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <Button
              variant="contained"
              color={editId ? "warning" : "success"}
              onClick={addPerson}
              sx={{
                minWidth: { xs: "100%", md: 130 },
                height: 50,
              }}
            >
              {editId ? "تحديث" : "إضافة"}
            </Button>
          </div>
        </div>

        {/* List */}
        <div
          className="
  bg-white/10
  rounded-3xl
  shadow-2xl
  backdrop-blur
  mt-8
  p-5
  sm:p-8
  "
        >
          {list.length === 0 ? (
            <div className="text-center text-2xl py-8">لا يوجد أسماء</div>
          ) : (
            <div className="space-y-4">
              {list.map((person) => (
                <div
                  key={person.id}
                  className="
  flex
  flex-col
  sm:flex-row
  justify-between
  gap-4
  items-start
  sm:items-center
  bg-white/10
  rounded-2xl
  p-5
  hover:bg-white/20
  transition
  "
                >
                  <div>
                    <h3 className="text-2xl font-bold">{person.name}</h3>

                    <p className="text-cyan-300 text-lg mt-1">{person.rank}</p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Edit />}
                      onClick={() => editPerson(person)}
                    >
                      تعديل
                    </Button>

                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => removePerson(person.id)}
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
    </div>
  );
};

export default Add;
