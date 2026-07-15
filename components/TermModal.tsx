"use client";

import { useEffect, useState, type FormEvent } from "react";
import { BookPlus, X } from "lucide-react";
import type { Term } from "@/types/database";

export function TermModal({ term, onClose, onSave }: { term?: Term | null; onClose: () => void; onSave: (values: { term: string; definition: string }) => Promise<void> }) {
  const [title, setTitle] = useState(term?.term ?? "");
  const [definition, setDefinition] = useState(term?.definition ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) { if (event.key === "Escape") onClose(); }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    await onSave({ term: title.trim(), definition: definition.trim() });
    setSaving(false);
  }

  return (
    <div className="modal-backdrop fixed inset-0 z-50 grid place-items-end bg-slate-950/35 p-0 backdrop-blur-sm sm:place-items-center sm:p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="modal-panel w-full rounded-t-[2rem] bg-white p-6 shadow-2xl sm:max-w-xl sm:rounded-[2rem] sm:p-8" role="dialog" aria-modal="true" aria-labelledby="term-modal-title">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-100 text-violet-600"><BookPlus size={23} /></span><div><p className="text-xs font-bold text-violet-600">מרחיבים את הידע</p><h2 id="term-modal-title" className="text-2xl font-black">{term ? "עריכת מושג" : "מושג חדש"}</h2></div></div>
          <button onClick={onClose} className="focus-ring rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-800" aria-label="סגירת החלון"><X size={21} /></button>
        </div>
        <form className="mt-7 space-y-5" onSubmit={submit}>
          <label className="block"><span className="mb-2 block text-sm font-bold">שם המושג</span><input autoFocus required maxLength={120} value={title} onChange={(event) => setTitle(event.target.value)} className="focus-ring h-13 w-full rounded-2xl border border-slate-200 px-4 outline-none transition focus:border-violet-400" placeholder="לדוגמה: תאום דיגיטלי" /></label>
          <label className="block"><span className="mb-2 block text-sm font-bold">הגדרה</span><textarea required minLength={20} maxLength={1200} rows={6} value={definition} onChange={(event) => setDefinition(event.target.value)} className="focus-ring w-full resize-none rounded-2xl border border-slate-200 p-4 leading-7 outline-none transition focus:border-violet-400" placeholder="הסבר בהיר, מדויק ושימושי למושג..." /></label>
          <div className="flex gap-3 pt-2"><button disabled={saving} className="focus-ring flex-1 rounded-2xl bg-violet-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 hover:bg-violet-700 disabled:opacity-60">{saving ? "שומר..." : term ? "שמירת שינויים" : "הוספת המושג"}</button><button type="button" onClick={onClose} className="focus-ring rounded-2xl border border-slate-200 px-6 py-3.5 font-bold text-slate-600 transition hover:bg-slate-50">ביטול</button></div>
        </form>
      </div>
    </div>
  );
}
