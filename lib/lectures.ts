export const lastLectureStorageKey = "glossary-last-lecture-id";

export const lectures = [
  { id: "lecture-01", label: "הרצאה 1: שגיב שרביט - מבוא למהפכה הדיגיטלית", tone: "border-violet-200 bg-violet-50 text-violet-700" },
  { id: "lecture-02", label: "הרצאה 2: סמנכ\"ל חברה מובילה - אוטומציה במרכזים לוגיסטיים", tone: "border-cyan-200 bg-cyan-50 text-cyan-700" },
  { id: "lecture-03", label: "הרצאה 3: ראש מנהלת המרה\"ס - ניהול שינוי במגה-פרויקט", tone: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  { id: "lecture-04", label: "הרצאה 4: חברת לוגיסטיקה - מיקור חוץ אסטרטגי (PL3)", tone: "border-amber-200 bg-amber-50 text-amber-700" },
  { id: "lecture-05", label: "הרצאה 5: יזם טכנולוגי - דיגיטציה של הובלה יבשתית", tone: "border-rose-200 bg-rose-50 text-rose-700" },
  { id: "lecture-06", label: "הרצאה 6: שגיב שרביט - שרשרת אספקה ורכש במלחמה", tone: "border-indigo-200 bg-indigo-50 text-indigo-700" },
  { id: "lecture-07", label: "הרצאה 7: שגיב שרביט - רכש במגזר הציבורי", tone: "border-teal-200 bg-teal-50 text-teal-700" },
  { id: "lecture-08", label: "הרצאה 8: מנכ\"ל חברת לוגיסטיקה - מודל PPP וזכיינות", tone: "border-orange-200 bg-orange-50 text-orange-700" },
  { id: "lecture-09", label: "הרצאה 9: סמנכ\"ל שרשרת אספקה - קמעונאות רב-ערוצית", tone: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700" },
  { id: "lecture-10", label: "הרצאה 10: מנכ\"ל מרלו\"ג אוטומטי - תפעול וליקוט רובוטי", tone: "border-sky-200 bg-sky-50 text-sky-700" },
  { id: "lecture-11", label: "הרצאה 11: הנהלת נמלי ישראל - לוגיסטיקה ימית ונמלים חכמים", tone: "border-lime-200 bg-lime-50 text-lime-700" },
  { id: "lecture-12", label: "הרצאה 12: ראש תחום חוזים - שיטות רכש מתקדמות", tone: "border-pink-200 bg-pink-50 text-pink-700" },
] as const;

export type LectureId = (typeof lectures)[number]["id"];

export function isLectureId(value: string): value is LectureId {
  return lectures.some((lecture) => lecture.id === value);
}

export function getLectureLabel(lectureId: string | null | undefined): string {
  return lectures.find((lecture) => lecture.id === lectureId)?.label ?? "טרם שויכה להרצאה";
}

export function getLectureTone(lectureId: string | null | undefined): string {
  return lectures.find((lecture) => lecture.id === lectureId)?.tone ?? "border-slate-200 bg-slate-50 text-slate-600";
}
