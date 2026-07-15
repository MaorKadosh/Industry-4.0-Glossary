"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

const shareMessage = `היי 👋

הגדרתי לך גישה למילון המושגים של קורס תעשייה 4.0 🏭

בהתאם להרשאה, ניתן לצפות, להוסיף ולערוך מונחים מההרצאות ✍️

🔗 לכניסה למערכת: https://industry-4-0-glossary.vercel.app/

לכל שאלה או עדכון הרשאות, מוזמנים לפנות אליי (מתן סויסה) 💬
בהצלחה! 🚀`;

export function ShareAppButton() {
  const [copied, setCopied] = useState(false);

  async function copyMessage() {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareMessage);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
      return;
    }

    window.prompt("העתיקו את ההודעה ושלחו אותה למשתמשים:", shareMessage);
  }

  async function shareApp() {
    if (!navigator.share) {
      await copyMessage();
      return;
    }

    try {
      await navigator.share({ text: shareMessage });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      await copyMessage();
    }
  }

  return (
    <button onClick={shareApp} className="focus-ring grid h-10 w-10 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-violet-600" aria-label={copied ? "הודעת השיתוף הועתקה" : "שיתוף האפליקציה"} title={copied ? "ההודעה הועתקה" : "שיתוף האפליקציה"}>
      {copied ? <Check size={19} /> : <Share2 size={19} />}
    </button>
  );
}
