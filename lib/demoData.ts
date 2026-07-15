import type { AuditLog, Profile, Term } from "@/types/database";

export const demoProfile: Profile = { id: "demo-admin", name: "Matan Suissa", role: "admin" };

export const demoUsers: Profile[] = [
  demoProfile,
  { id: "demo-editor", name: "נועה לוי", role: "editor" },
  { id: "demo-viewer", name: "יואב כהן", role: "viewer" },
  { id: "demo-viewer-2", name: "מאיה אדרי", role: "viewer" },
];

export const demoTerms: Term[] = [
  { id: "1", term: "תעשייה 4.0", definition: "המהפכה התעשייתית הרביעית, המחברת מערכות פיזיות ודיגיטליות באמצעות נתונים, אוטומציה, קישוריות וקבלת החלטות חכמה.", created_by: "demo-admin", created_at: "2026-07-01T08:00:00Z", creator: { name: "Matan Suissa" } },
  { id: "2", term: "מערכת ניהול מחסן", definition: "מערכת מידע המתכננת, מתזמנת ומבקרת קליטת סחורה, אחסון, ליקוט, אריזה ומשלוח במרכז לוגיסטי.", created_by: "demo-editor", created_at: "2026-07-02T08:00:00Z", creator: { name: "נועה לוי" } },
  { id: "3", term: "מיקור חוץ לוגיסטי", definition: "העברת פעילויות לוגיסטיקה לספק מומחה המנהל אחסון, הפצה ושירותי קצה תוך אינטגרציה למערכות הארגון.", created_by: "demo-editor", created_at: "2026-07-03T08:00:00Z", creator: { name: "נועה לוי" } },
  { id: "4", term: "ממשק אדם–מכונה", definition: "נקודת המפגש שבה עובדים מפעילים, מנטרים ומבקרים מערכות רובוטיות ואוטומטיות בסביבה תפעולית.", created_by: "demo-admin", created_at: "2026-07-04T08:00:00Z", creator: { name: "Matan Suissa" } },
  { id: "5", term: "שרשרת אספקה רב־ערוצית", definition: "ניהול מתואם של מלאי, הזמנות ואספקה בין חנויות, מסחר מקוון, מוקדים לוגיסטיים וערוצי מסירה שונים.", created_by: "demo-viewer", created_at: "2026-07-05T08:00:00Z", creator: { name: "יואב כהן" } },
  { id: "6", term: "שותפות ציבורית־פרטית", definition: "מודל ארוך טווח שבו גוף ציבורי וזכיין פרטי חולקים אחריות, סיכונים ומשאבים להקמה ולהפעלה של תשתית לוגיסטית.", created_by: "demo-admin", created_at: "2026-07-06T08:00:00Z", creator: { name: "Matan Suissa" } },
  { id: "7", term: "תוכנה כשירות", definition: "מודל אספקת תוכנה בענן המאפשר לארגון להשתמש בפלטפורמה לפי מנוי, להתעדכן במהירות ולהתרחב ללא תשתית מקומית כבדה.", created_by: "demo-editor", created_at: "2026-07-07T08:00:00Z", creator: { name: "נועה לוי" } },
  { id: "8", term: "נמל חכם", definition: "נמל המשלב חיישנים, אוטומציה, אנליטיקה ושיתוף נתונים כדי לקצר זמני שהייה, לשפר בטיחות ולייעל את זרימת המטענים.", created_by: "demo-editor", created_at: "2026-07-08T08:00:00Z", creator: { name: "נועה לוי" } },
];

export const demoLogs: AuditLog[] = [
  { id: "l1", action: "created|נמל חכם", user_id: "demo-editor", timestamp: "2026-07-08T08:00:00Z", user: { name: "נועה לוי" } },
  { id: "l2", action: "updated|תוכנה כשירות", user_id: "demo-admin", timestamp: "2026-07-09T11:30:00Z", user: { name: "Matan Suissa" } },
  { id: "l3", action: "deleted|אוטומציה קשיחה", user_id: "demo-editor", timestamp: "2026-07-10T13:15:00Z", user: { name: "נועה לוי" } },
  { id: "l4", action: "role_updated|מאיה אדרי|editor", user_id: "demo-admin", timestamp: "2026-07-11T16:00:00Z", user: { name: "Matan Suissa" } },
];
