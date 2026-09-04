const names = JSON.parse(localStorage.getItem("listNames") || "[]");

// ========================================
// ترتيب الرتب
// ========================================

const soldiersOrder = ["رقيب مجند", "عريف", "عريف مجند", "جندى", "---"];

const ncosOrder = [
  "ملازم.أ",
  "ملازم",
  "مساعد.أ",
  "مساعد",
  "رقيب.أ",
  "رقيب",
  "عريف",
  "---",
];

const officersOrder = [
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
  "---",
];

// ========================================
// دالة الترتيب حسب الرتبة
// ========================================

const sortByRank = (list, order) => {
  return [...list].sort((a, b) => {
    const indexA = order.indexOf(a.rank);
    const indexB = order.indexOf(b.rank);

    return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
  });
};

// ========================================
// الجنود
// ========================================

const soldiers = sortByRank(
  names.filter((person) => soldiersOrder.includes(person.rank)),
  soldiersOrder,
);

// ========================================
// الصف / النوبتجية
// ========================================

const ncos = sortByRank(
  names.filter((person) => ncosOrder.includes(person.rank)),
  ncosOrder,
);

// ========================================
// الضباط
// ========================================

const officers = sortByRank(
  names.filter((person) => officersOrder.includes(person.rank)),
  officersOrder,
);

export { soldiers, ncos, officers };
