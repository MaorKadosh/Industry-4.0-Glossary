export const lastLectureStorageKey = "glossary-last-lecture-id";

export const lectures = [
  { id: "lecture-01", label: "הרצאה 1: שגיב שרביט - מבוא למהפכה הדיגיטלית" },
  { id: "lecture-02", label: "הרצאה 2: סמנכ\"ל חברה מובילה - אוטומציה במרכזים לוגיסטיים" },
  { id: "lecture-03", label: "הרצאה 3: ראש מנהלת המרה\"ס - ניהול שינוי במגה-פרויקט" },
  { id: "lecture-04", label: "הרצאה 4: חברת לוגיסטיקה - מיקור חוץ אסטרטגי (PL3)" },
  { id: "lecture-05", label: "הרצאה 5: יזם טכנולוגי - דיגיטציה של הובלה יבשתית" },
  { id: "lecture-06", label: "הרצאה 6: שגיב שרביט - שרשרת אספקה ורכש במלחמה" },
  { id: "lecture-07", label: "הרצאה 7: שגיב שרביט - רכש במגזר הציבורי" },
  { id: "lecture-08", label: "הרצאה 8: מנכ\"ל חברת לוגיסטיקה - מודל PPP וזכיינות" },
  { id: "lecture-09", label: "הרצאה 9: סמנכ\"ל שרשרת אספקה - קמעונאות רב-ערוצית" },
  { id: "lecture-10", label: "הרצאה 10: מנכ\"ל מרלו\"ג אוטומטי - תפעול וליקוט רובוטי" },
  { id: "lecture-11", label: "הרצאה 11: הנהלת נמלי ישראל - לוגיסטיקה ימית ונמלים חכמים" },
  { id: "lecture-12", label: "הרצאה 12: ראש תחום חוזים - שיטות רכש מתקדמות" },
] as const;

export type LectureId = (typeof lectures)[number]["id"];

export function isLectureId(value: string): value is LectureId {
  return lectures.some((lecture) => lecture.id === value);
}

export function getLectureLabel(lectureId: string | null | undefined): string {
  return lectures.find((lecture) => lecture.id === lectureId)?.label ?? "טרם שויכה להרצאה";
}
