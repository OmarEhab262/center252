import { useEffect, useRef, useState } from "react";

// الحروف التي لا تتصل بما بعدها
const NON_CONNECTING_LETTERS = [
  "ا",
  "أ",
  "إ",
  "آ",
  "د",
  "ذ",
  "ر",
  "ز",
  "و",
  "ة",
  "ء",
];

/**
 * إضافة الكشيدة
 */
const applyKashida = (text, count = 1) => {
  if (!text) return "";

  const tatweel = "ـ".repeat(count);
  const words = text.split(" ");

  const processedWords = words.map((word) => {
    if (word.includes("الله")) return word;

    let newWord = "";

    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      const nextChar = word[i + 1];

      newWord += char;

      if (
        !NON_CONNECTING_LETTERS.includes(char) &&
        nextChar &&
        /[\u0621-\u064A]/.test(nextChar)
      ) {
        newWord += tatweel;
      }
    }

    return newWord;
  });

  return processedWords.join(" ");
};

/**
 * ArabicKashidaText
 *
 * matchWidth:
 * إذا كانت true، يتم ضبط عرض النص تلقائيًا
 * بناءً على targetRef.
 */
export const ArabicKashidaText = ({
  children,
  amount = 1,
  style,
  className,
  matchWidth = false,
  targetRef = null,
}) => {
  const textRef = useRef(null);

  const [kashidaAmount, setKashidaAmount] = useState(amount);

  const text = String(children || "");

  useEffect(() => {
    if (!matchWidth || !targetRef?.current || !textRef.current) {
      return;
    }

    const targetWidth = targetRef.current.getBoundingClientRect().width;

    if (!targetWidth) return;

    let currentAmount = amount;

    // نبدأ من amount ونزيد تدريجيًا
    for (let i = 0; i < 100; i++) {
      const testText = applyKashida(text, currentAmount);

      textRef.current.textContent = testText;

      const currentWidth = textRef.current.getBoundingClientRect().width;

      if (currentWidth >= targetWidth) {
        break;
      }

      currentAmount++;
    }

    setKashidaAmount(currentAmount);

    // إعادة النص الحقيقي
    textRef.current.textContent = applyKashida(text, currentAmount);
  }, [text, amount, matchWidth, targetRef]);

  const kashidaText = applyKashida(text, kashidaAmount);

  return (
    <span
      ref={textRef}
      dir="rtl"
      style={{
        display: "inline-block",
        fontFamily: "Cairo, sans-serif",
        whiteSpace: "nowrap",
        ...style,
      }}
      className={className}
    >
      {kashidaText}
    </span>
  );
};
